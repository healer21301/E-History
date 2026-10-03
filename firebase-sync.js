/* ============================================================
   E-HISTORY — PHASE 12 FIREBASE INTEGRATION
   ACCOUNT-SAFE PROGRESS SYNCHRONIZATION
   ============================================================
   PURPOSE
   - Firebase Authentication (Email / Password)
   - Cloud Firestore user profiles
   - Cloud Firestore learning progress
   - Cross-device language / theme preferences
   - STRICT separation of progress between accounts

   IMPORTANT FIXES IN THIS VERSION
   1. A newly registered account always starts with BLANK progress.
   2. Signing in to another account clears the previous browser cache.
   3. Login downloads that user's cloud progress instead of merging
      unrelated browser progress into the account.
   4. Only the SAME already-active account may merge its local cache
      with its own Firestore record after a page refresh.
   5. Old activity keys such as ehistory-l1a1-score are migrated to
      the canonical format ehistory-l1-a1-score.

   QUICK MAP
   1. Firebase imports and initialization
   2. Progress-key format and migration
   3. Local progress helpers
   4. User-profile helpers
   5. Firestore progress helpers
   6. Authentication API
   7. Preference synchronization
   8. Auth-state initialization
   9. Global bridge
   ============================================================ */

import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';

import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    deleteUser,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

import {
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    setDoc
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js';


/* ==================== 1. FIREBASE INITIALIZATION ==================== */

const configured = isFirebaseConfigured();

let app = null;
let auth = null;
let db = null;
let currentProfile = null;
let firstAuthStateResolved = false;
let resolveAuthReady;
let authOperation = null;

const authReadyPromise = new Promise((resolve) => {
    resolveAuthReady = resolve;
});

const FIRESTORE_TIMEOUT_MS = 12000;

function withTimeout(
    promise,
    timeoutMs = FIRESTORE_TIMEOUT_MS,
    code = 'FIRESTORE_TIMEOUT'
) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(code)), timeoutMs);
        })
    ]);
}

function isFirestoreConnectivityError(error) {
    return [
        'FIRESTORE_TIMEOUT',
        'unavailable',
        'deadline-exceeded'
    ].includes(error?.code || error?.message || '');
}

if (configured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Keep a signed-in account active across refreshes on this device.
    await setPersistence(auth, browserLocalPersistence);
}


/* ==================== 2. PROGRESS KEY FORMAT / MIGRATION ==================== */

/*
   CANONICAL activity keys used everywhere from this version onward:

   ehistory-l1-a1-completed
   ehistory-l1-a1-score
   ehistory-l1-a1-best

   Older builds sometimes used:

   ehistory-l1a1-completed

   The legacy format is migrated once and then removed.
*/
const CANONICAL_PROGRESS_KEY_PATTERN =
    /^ehistory-(?:l[1-3]-a[1-3]-(?:completed|score|best)|assessment-[1-2]-(?:completed|score|best)|exam-(?:completed|score|best|attempts))$/;

const LEGACY_ACTIVITY_KEY_PATTERN =
    /^ehistory-l([1-3])a([1-3])-(completed|score|best)$/;

const ACTIVE_UID_KEY = 'ehistory-active-uid';
const PROGRESS_FORMAT_VERSION_KEY = 'ehistory-progress-format-version';
const PROGRESS_FORMAT_VERSION = '2';

// Browser-only values that belong to one signed-in learner and must never
// leak into the next account on a shared device.
const ACCOUNT_SCOPED_TRANSIENT_KEYS = [
    'ehistory-exam-draft'
];

function canonicalProgressKey(key) {
    if (CANONICAL_PROGRESS_KEY_PATTERN.test(key)) {
        return key;
    }

    const match = key.match(LEGACY_ACTIVITY_KEY_PATTERN);

    if (!match) {
        return null;
    }

    return `ehistory-l${match[1]}-a${match[2]}-${match[3]}`;
}

function isProgressKey(key) {
    return Boolean(canonicalProgressKey(key));
}

function mergeSingleProgressValue(key, currentValue, incomingValue) {
    if (key.endsWith('-completed')) {
        return currentValue === 'true' || incomingValue === 'true'
            ? 'true'
            : 'false';
    }

    const currentNumber = Number(currentValue);
    const incomingNumber = Number(incomingValue);

    const currentIsNumber =
        currentValue !== null &&
        currentValue !== undefined &&
        Number.isFinite(currentNumber);

    const incomingIsNumber =
        incomingValue !== null &&
        incomingValue !== undefined &&
        Number.isFinite(incomingNumber);

    if (currentIsNumber || incomingIsNumber) {
        return String(
            Math.max(
                currentIsNumber ? currentNumber : 0,
                incomingIsNumber ? incomingNumber : 0
            )
        );
    }

    return incomingValue ?? currentValue ?? '';
}

function migrateLegacyLocalProgressKeys() {
    const legacyKeys = [];

    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);

        if (key && LEGACY_ACTIVITY_KEY_PATTERN.test(key)) {
            legacyKeys.push(key);
        }
    }

    legacyKeys.forEach((legacyKey) => {
        const canonicalKey = canonicalProgressKey(legacyKey);
        const legacyValue = localStorage.getItem(legacyKey);

        if (!canonicalKey || legacyValue === null) {
            return;
        }

        const existingValue = localStorage.getItem(canonicalKey);

        localStorage.setItem(
            canonicalKey,
            mergeSingleProgressValue(
                canonicalKey,
                existingValue,
                legacyValue
            )
        );

        localStorage.removeItem(legacyKey);
    });

    localStorage.setItem(PROGRESS_FORMAT_VERSION_KEY, PROGRESS_FORMAT_VERSION);
}


/* ==================== 3. LOCAL PROGRESS HELPERS ==================== */

function readLocalProgressValues() {
    migrateLegacyLocalProgressKeys();

    const values = {};

    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);

        if (!key || !CANONICAL_PROGRESS_KEY_PATTERN.test(key)) {
            continue;
        }

        values[key] = localStorage.getItem(key);
    }

    return values;
}

function applyProgressValuesToLocal(values = {}) {
    Object.entries(values).forEach(([rawKey, value]) => {
        const key = canonicalProgressKey(rawKey);

        if (!key || value === null || value === undefined) {
            return;
        }

        localStorage.setItem(key, String(value));
    });
}

function clearLocalProgressValues() {
    const keysToRemove = [];

    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);

        if (key && isProgressKey(key)) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
}

function clearAccountScopedTransientValues() {
    ACCOUNT_SCOPED_TRANSIENT_KEYS.forEach((key) => {
        localStorage.removeItem(key);
    });
}

function clearAccountScopedLocalValues() {
    clearLocalProgressValues();
    clearAccountScopedTransientValues();
}

function normalizeCloudProgressValues(values = {}) {
    const normalized = {};

    Object.entries(values).forEach(([rawKey, rawValue]) => {
        const key = canonicalProgressKey(rawKey);

        if (!key) {
            return;
        }

        normalized[key] = mergeSingleProgressValue(
            key,
            normalized[key],
            String(rawValue)
        );
    });

    return normalized;
}

function mergeProgressValues(localValues = {}, cloudValues = {}) {
    const local = normalizeCloudProgressValues(localValues);
    const cloud = normalizeCloudProgressValues(cloudValues);
    const merged = {};
    const keys = new Set([
        ...Object.keys(local),
        ...Object.keys(cloud)
    ]);

    keys.forEach((key) => {
        merged[key] = mergeSingleProgressValue(
            key,
            local[key],
            cloud[key]
        );
    });

    return merged;
}

function notifyProgressChanged() {
    window.dispatchEvent(new Event('ehistory:progresschange'));
}


/* ==================== 4. USER PROFILE HELPERS ==================== */

async function getUserProfile(uid) {
    if (!configured || !uid) {
        return null;
    }

    const snapshot = await withTimeout(getDoc(doc(db, 'users', uid)));

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data();

    // Reject malformed / tampered profiles instead of treating any unknown
    // role as a Student account.
    if (!data || !['student', 'teacher'].includes(data.role)) {
        return null;
    }

    return { uid, ...data };
}

async function saveUserPreferences(uid, preferences = {}) {
    if (!configured || !uid) {
        return;
    }

    await withTimeout(
        setDoc(
            doc(db, 'users', uid),
            {
                preferences,
                updatedAt: serverTimestamp()
            },
            { merge: true }
        )
    );

    if (currentProfile) {
        currentProfile = {
            ...currentProfile,
            preferences: {
                ...(currentProfile.preferences || {}),
                ...preferences
            }
        };
    }
}

function applyCloudPreferences(profile) {
    const preferences = profile?.preferences || {};

    if (preferences.language === 'FIL' || preferences.language === 'EN') {
        localStorage.setItem('ehistory-language', preferences.language);
    }

    if (preferences.theme === 'light' || preferences.theme === 'dark') {
        localStorage.setItem('ehistory-theme', preferences.theme);
    }

    window.applyLanguage?.();
    window.applyTheme?.();
}


/* ==================== 5. FIRESTORE PROGRESS HELPERS ==================== */

async function readCloudProgress(uid) {
    if (!configured || !uid) {
        return {};
    }

    const snapshot = await withTimeout(getDoc(doc(db, 'progress', uid)));

    if (!snapshot.exists()) {
        return {};
    }

    return normalizeCloudProgressValues(snapshot.data().values || {});
}

async function replaceCloudProgress(uid, values = {}) {
    if (!configured || !uid) {
        return;
    }

    const normalizedValues = normalizeCloudProgressValues(values);

    await withTimeout(
        setDoc(doc(db, 'progress', uid), {
            uid,
            values: normalizedValues,
            version: 2,
            updatedAt: serverTimestamp()
        })
    );
}

async function writeCloudProgress(uid, values = {}) {
    // Progress is stored as one authoritative values map.
    // Replacing the document avoids stale keys surviving forever.
    await replaceCloudProgress(uid, values);
}

async function loadCloudProgressIntoLocal(uid) {
    const cloudValues = await readCloudProgress(uid);

    clearLocalProgressValues();
    applyProgressValuesToLocal(cloudValues);
    notifyProgressChanged();

    return cloudValues;
}

async function mergeSameAccountLocalAndCloud(uid) {
    const localValues = readLocalProgressValues();
    const cloudValues = await readCloudProgress(uid);
    const mergedValues = mergeProgressValues(localValues, cloudValues);

    clearLocalProgressValues();
    applyProgressValuesToLocal(mergedValues);
    await writeCloudProgress(uid, mergedValues);
    notifyProgressChanged();

    return mergedValues;
}

async function initializeBlankProgress(uid) {
    clearLocalProgressValues();
    await replaceCloudProgress(uid, {});
    notifyProgressChanged();
}

async function syncProgressToCloud() {
    const user = auth?.currentUser;

    if (!configured || !user) {
        return;
    }

    // Never upload another account's browser cache. Both the local owner
    // marker and the loaded Firestore profile must match Firebase Auth.
    if (
        localStorage.getItem(ACTIVE_UID_KEY) !== user.uid ||
        currentProfile?.uid !== user.uid
    ) {
        return;
    }

    await writeCloudProgress(user.uid, readLocalProgressValues());
}

let progressSyncTimer = null;

function queueProgressSync() {
    clearTimeout(progressSyncTimer);

    progressSyncTimer = setTimeout(() => {
        syncProgressToCloud().catch((error) => {
            console.error('E-HISTORY Firebase progress sync failed:', error);
        });
    }, 250);
}


/* ==================== 6. AUTHENTICATION API ==================== */

async function registerStudent({ name, email, password, gradeSection }) {
    if (!configured) {
        throw new Error('FIREBASE_NOT_CONFIGURED');
    }

    authOperation = 'register';
    let user = null;

    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        user = credential.user;

        // Refresh the token before the first Firestore operation.
        await user.getIdToken(true);

        // CRITICAL ACCOUNT-ISOLATION RULE:
        // A brand-new account NEVER inherits progress already stored in
        // this browser from an older test/student/guest session.
        clearAccountScopedLocalValues();
        localStorage.removeItem(ACTIVE_UID_KEY);

        const profile = {
            name,
            email: user.email,
            role: 'student',
            gradeSection: gradeSection || '',
            preferences: {
                language: localStorage.getItem('ehistory-language') || 'FIL',
                theme: localStorage.getItem('ehistory-theme') || 'light'
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await withTimeout(setDoc(doc(db, 'users', user.uid), profile));
        await initializeBlankProgress(user.uid);

        currentProfile = {
            uid: user.uid,
            ...profile
        };

        localStorage.setItem(ACTIVE_UID_KEY, user.uid);

        return {
            user,
            profile: currentProfile
        };
    } catch (error) {
        if (user) {
            try {
                await deleteUser(user);
            } catch (cleanupError) {
                console.warn(
                    'E-HISTORY could not remove incomplete Auth user:',
                    cleanupError
                );

                try {
                    await signOut(auth);
                } catch (_) {
                    // Ignore secondary cleanup failures.
                }
            }
        }

        currentProfile = null;
        clearAccountScopedLocalValues();
        localStorage.removeItem(ACTIVE_UID_KEY);

        throw error;
    } finally {
        authOperation = null;
    }
}

async function resetPassword(email) {
    if (!configured) {
        throw new Error('FIREBASE_NOT_CONFIGURED');
    }

    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
        const error = new Error('auth/missing-email');
        error.code = 'auth/missing-email';
        throw error;
    }

    /*
       Firebase sends the secure password-reset email and hosts the
       password-change action page. No Firestore write is required.
    */
    await sendPasswordResetEmail(auth, normalizedEmail);
}

async function login(email, password) {
    if (!configured) {
        throw new Error('FIREBASE_NOT_CONFIGURED');
    }

    authOperation = 'login';

    try {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const profile = await getUserProfile(credential.user.uid);

        if (!profile) {
            await signOut(auth);
            throw new Error('PROFILE_NOT_FOUND');
        }

        // Never merge anonymous / previous-account browser progress or an
        // unfinished exam draft into a newly signed-in account.
        // Firestore is authoritative on login.
        clearAccountScopedLocalValues();

        currentProfile = profile;
        applyCloudPreferences(profile);

        await loadCloudProgressIntoLocal(credential.user.uid);
        localStorage.setItem(ACTIVE_UID_KEY, credential.user.uid);

        return {
            user: credential.user,
            profile
        };
    } finally {
        authOperation = null;
    }
}

async function logout() {
    if (!configured) {
        return;
    }

    try {
        await syncProgressToCloud();
    } catch (error) {
        console.warn('E-HISTORY final progress sync failed during logout:', error);
    }

    await signOut(auth);

    currentProfile = null;
    clearAccountScopedLocalValues();
    localStorage.removeItem(ACTIVE_UID_KEY);
    notifyProgressChanged();
}

async function getAuthState() {
    await authReadyPromise;

    return {
        user: auth?.currentUser || null,
        profile: currentProfile
    };
}

async function requireRole(expectedRole) {
    const state = await getAuthState();

    if (!state.user) {
        return {
            allowed: false,
            reason: 'SIGNED_OUT',
            ...state
        };
    }

    if (!state.profile || state.profile.uid !== state.user.uid) {
        return {
            allowed: false,
            reason: 'PROFILE_NOT_FOUND',
            ...state
        };
    }

    if (state.profile.role !== expectedRole) {
        return {
            allowed: false,
            reason: 'WRONG_ROLE',
            ...state
        };
    }

    return {
        allowed: true,
        reason: null,
        ...state
    };
}

async function resetMyProgress() {
    const user = auth?.currentUser;

    if (!user) {
        throw new Error('SIGNED_OUT');
    }

    clearAccountScopedLocalValues();
    await replaceCloudProgress(user.uid, {});
    notifyProgressChanged();
}


/* ==================== 7. PREFERENCE SYNCHRONIZATION ==================== */

window.addEventListener('ehistory:languagechange', () => {
    const user = auth?.currentUser;

    if (!user) {
        return;
    }

    saveUserPreferences(user.uid, {
        language: localStorage.getItem('ehistory-language') || 'FIL',
        theme: localStorage.getItem('ehistory-theme') || 'light'
    }).catch(console.error);
});

window.addEventListener('ehistory:themechange', () => {
    const user = auth?.currentUser;

    if (!user) {
        return;
    }

    saveUserPreferences(user.uid, {
        language: localStorage.getItem('ehistory-language') || 'FIL',
        theme: localStorage.getItem('ehistory-theme') || 'light'
    }).catch(console.error);
});

window.addEventListener('ehistory:progresschange', queueProgressSync);


/* ==================== 8. AUTH-STATE INITIALIZATION ==================== */

if (configured) {
    onAuthStateChanged(auth, async (user) => {
        try {
            /*
               registerStudent() and login() perform their own controlled
               progress initialization. Do not run background merge logic
               while either operation is still in progress.
            */
            if (authOperation) {
                return;
            }

            if (user) {
                const previousUid = localStorage.getItem(ACTIVE_UID_KEY);

                currentProfile = await getUserProfile(user.uid);

                if (!currentProfile) {
                    clearAccountScopedLocalValues();
                    localStorage.removeItem(ACTIVE_UID_KEY);
                    return;
                }

                applyCloudPreferences(currentProfile);

                if (previousUid === user.uid) {
                    // Same account after a refresh: local cache belongs to this
                    // user, so merge it safely with this user's cloud record.
                    await mergeSameAccountLocalAndCloud(user.uid);
                } else {
                    // Different / unknown account: discard browser progress and
                    // download only that user's cloud record.
                    await loadCloudProgressIntoLocal(user.uid);
                }

                localStorage.setItem(ACTIVE_UID_KEY, user.uid);
            } else {
                currentProfile = null;

                if (localStorage.getItem(ACTIVE_UID_KEY)) {
                    clearAccountScopedLocalValues();
                    localStorage.removeItem(ACTIVE_UID_KEY);
                    notifyProgressChanged();
                } else {
                    clearAccountScopedTransientValues();
                }
            }
        } catch (error) {
            console.error('E-HISTORY Firebase initialization failed:', error);
        } finally {
            if (!firstAuthStateResolved) {
                firstAuthStateResolved = true;
                resolveAuthReady();
            }

            window.dispatchEvent(
                new CustomEvent('ehistory:authchange', {
                    detail: {
                        user: auth?.currentUser || null,
                        profile: currentProfile
                    }
                })
            );
        }
    });
} else {
    firstAuthStateResolved = true;
    resolveAuthReady();
}


/* ==================== 9. INITIAL LOCAL FORMAT MIGRATION ==================== */

migrateLegacyLocalProgressKeys();


/* ==================== 10. GLOBAL FIREBASE BRIDGE ==================== */

window.eHistoryFirebase = {
    configured,
    app,
    auth,
    db,
    whenAuthReady: () => authReadyPromise,
    getAuthState,
    getUserProfile,
    registerStudent,
    login,
    resetPassword,
    logout,
    requireRole,
    syncProgressToCloud,
    mergeLocalAndCloudProgress: mergeSameAccountLocalAndCloud,
    saveUserPreferences,
    resetMyProgress,
    isFirestoreConnectivityError
};

window.dispatchEvent(
    new CustomEvent('ehistory:firebase-ready', {
        detail: {
            configured
        }
    })
);
