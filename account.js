/* ============================================================
   E-HISTORY — PHASE 12 FIREBASE ACCOUNT SYSTEM
   ============================================================
   PURPOSE
   - Student registration through Firebase Authentication
   - Student / Teacher login through Firebase Authentication
   - Role-aware protected account pages
   - Firestore-backed user profiles
   - Student progress display using Firebase-synchronized values

   SECURITY MODEL
   - Public registration creates STUDENT accounts only.
   - TEACHER accounts must be provisioned by an administrator.
   - Firestore Rules prevent a student from changing their role.

   QUICK MAP
   1. Firebase bridge helpers
   2. Messages and routing
   3. Registration
   4. Login
   5. Password reset
   6. Protected account pages
   7. Student dashboard
   8. Teacher account
   9. Logout
   10. Initialization / language refresh
   ============================================================ */


/* ==================== 1. FIREBASE BRIDGE HELPERS ==================== */

function accountLanguage() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

async function getFirebaseBridge(timeoutMs = 5000) {
    if (window.eHistoryFirebase) {
        return window.eHistoryFirebase;
    }

    return new Promise((resolve) => {
        let settled = false;

        const finish = (value) => {
            if (settled) {
                return;
            }

            settled = true;
            resolve(value);
        };

        window.addEventListener(
            'ehistory:firebase-ready',
            () => finish(window.eHistoryFirebase || null),
            { once: true }
        );

        setTimeout(() => finish(window.eHistoryFirebase || null), timeoutMs);
    });
}

async function getReadyFirebase() {
    const firebase = await getFirebaseBridge();

    if (!firebase?.configured) {
        showAuthMessage(
            accountLanguage() === 'FIL'
                ? 'Hindi pa naka-configure ang Firebase. Ilagay muna ang web app configuration sa firebase-config.js.'
                : 'Firebase is not configured yet. Add your web app configuration to firebase-config.js.'
        );

        return null;
    }

    await firebase.whenAuthReady();
    return firebase;
}


/* ==================== 2. MESSAGES AND ROUTING ==================== */

function showAuthMessage(message, type = 'error') {
    const messageBox = document.getElementById('authMessage');

    if (!messageBox) {
        return;
    }

    messageBox.textContent = message;
    messageBox.className = `auth-message show ${type}`;
}

function clearAuthMessage() {
    const messageBox = document.getElementById('authMessage');

    if (!messageBox) {
        return;
    }

    messageBox.textContent = '';
    messageBox.className = 'auth-message';
}

function routeProfile(profile) {
    if (!profile || !['student', 'teacher'].includes(profile.role)) {
        location.replace('login.html');
        return;
    }

    location.href =
        profile.role === 'teacher'
            ? 'teacher-dashboard.html'
            : 'student-account.html';
}

function friendlyFirebaseError(error) {
    const language = accountLanguage();
    const code = error?.code || error?.message || '';

    const messages = {
        'auth/email-already-in-use': {
            FIL: 'May account nang gumagamit ng email na ito.',
            EN: 'An account already uses this email.'
        },
        'auth/invalid-email': {
            FIL: 'Hindi valid ang email address.',
            EN: 'The email address is not valid.'
        },
        'auth/missing-email': {
            FIL: 'Ilagay ang email address na ginamit sa iyong E-HISTORY account.',
            EN: 'Enter the email address used for your E-HISTORY account.'
        },
        'auth/network-request-failed': {
            FIL: 'Hindi maipadala ang request. Suriin ang internet connection at subukan muli.',
            EN: 'The request could not be sent. Check your internet connection and try again.'
        },
        'auth/weak-password': {
            FIL: 'Gumamit ng mas matibay na password na may hindi bababa sa 6 na character.',
            EN: 'Use a stronger password with at least 6 characters.'
        },
        'auth/invalid-credential': {
            FIL: 'Mali ang email o password.',
            EN: 'Incorrect email or password.'
        },
        'auth/user-disabled': {
            FIL: 'Naka-disable ang account na ito.',
            EN: 'This account has been disabled.'
        },
        'auth/too-many-requests': {
            FIL: 'Masyadong maraming login attempts. Subukan muli mamaya.',
            EN: 'Too many login attempts. Try again later.'
        },
        FIREBASE_NOT_CONFIGURED: {
            FIL: 'Hindi pa naka-configure ang Firebase.',
            EN: 'Firebase is not configured yet.'
        },
        PROFILE_NOT_FOUND: {
            FIL: 'May Firebase Auth account ngunit walang E-HISTORY user profile. Tingnan ang Firebase setup guide.',
            EN: 'The Firebase Auth account exists, but its E-HISTORY user profile is missing. Check the Firebase setup guide.'
        },
        FIRESTORE_TIMEOUT: {
            FIL: 'Nagawa ang Firebase Authentication request ngunit hindi sumagot ang Cloud Firestore sa loob ng 12 segundo. I-check ang Firestore Rules, internet/network, at browser Console.',
            EN: 'Firebase Authentication responded, but Cloud Firestore did not respond within 12 seconds. Check Firestore Rules, your network, and the browser Console.'
        },
        'permission-denied': {
            FIL: 'Tinanggihan ng Firestore Rules ang pag-save ng profile. I-publish ang tamang firestore.rules bago muling subukan.',
            EN: 'Firestore Rules denied the profile write. Publish the correct firestore.rules before trying again.'
        },
        unavailable: {
            FIL: 'Hindi maabot ang Cloud Firestore ngayon. Suriin ang internet connection o network/firewall at subukan muli.',
            EN: 'Cloud Firestore is currently unreachable. Check your internet connection or network/firewall and try again.'
        },
        'deadline-exceeded': {
            FIL: 'Masyadong matagal ang koneksiyon sa Cloud Firestore. Subukan muli o gumamit ng ibang network.',
            EN: 'The Cloud Firestore request took too long. Try again or use another network.'
        }
    };

    const friendly =
        messages[code]?.[language] ||
        (language === 'FIL'
            ? 'May hindi inaasahang error. Pakisubukan muli.'
            : 'An unexpected error occurred. Please try again.');

    // Include the Firebase error code during development so setup problems
    // are much easier to diagnose.
    return code ? `${friendly} [${code}]` : friendly;
}


/* ==================== 3. STUDENT REGISTRATION ==================== */

const registerForm = document.getElementById('registerForm');

registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAuthMessage();

    const language = accountLanguage();
    const name = document.getElementById('registerName').value.trim();
    const gradeSection = document
        .getElementById('registerGradeSection')
        .value.trim();
    const email = document
        .getElementById('registerEmail')
        .value.trim()
        .toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById(
        'registerConfirmPassword'
    ).value;

    if (name.length < 2 || name.length > 80) {
        showAuthMessage(
            language === 'FIL'
                ? 'Maglagay ng wastong pangalan na may 2 hanggang 80 character.'
                : 'Enter a valid name with 2 to 80 characters.'
        );
        return;
    }

    if (gradeSection.length < 1 || gradeSection.length > 80) {
        showAuthMessage(
            language === 'FIL'
                ? 'Maglagay ng wastong baitang at seksyon.'
                : 'Enter a valid grade and section.'
        );
        return;
    }

    if (email.length > 254) {
        showAuthMessage(
            language === 'FIL'
                ? 'Masyadong mahaba ang email address.'
                : 'The email address is too long.'
        );
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage(
            language === 'FIL'
                ? 'Hindi magkapareho ang dalawang password.'
                : 'The two passwords do not match.'
        );
        return;
    }

    if (password.length < 6) {
        showAuthMessage(
            language === 'FIL'
                ? 'Gumamit ng password na may hindi bababa sa 6 na character.'
                : 'Use a password with at least 6 characters.'
        );
        return;
    }

    const firebase = await getReadyFirebase();

    if (!firebase) {
        return;
    }

    const submitButton = registerForm.querySelector('[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent =
        language === 'FIL' ? 'Gumagawa ng Account…' : 'Creating Account…';

    try {
        const { profile } = await firebase.registerStudent({
            name,
            email,
            password,
            gradeSection
        });

        showAuthMessage(
            language === 'FIL'
                ? 'Matagumpay na nagawa ang iyong E-HISTORY account.'
                : 'Your E-HISTORY account was created successfully.',
            'success'
        );

        setTimeout(() => routeProfile(profile), 350);
    } catch (error) {
        console.error(error);
        showAuthMessage(friendlyFirebaseError(error));
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});


/* ==================== 4. LOGIN ==================== */

const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAuthMessage();

    const email = document
        .getElementById('loginEmail')
        .value.trim()
        .toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const firebase = await getReadyFirebase();

    if (!firebase) {
        return;
    }

    const submitButton = loginForm.querySelector('[type="submit"]');
    submitButton.disabled = true;

    try {
        const { profile } = await firebase.login(email, password);

        showAuthMessage(
            accountLanguage() === 'FIL'
                ? 'Matagumpay ang pag-login.'
                : 'Login successful.',
            'success'
        );

        setTimeout(() => routeProfile(profile), 250);
    } catch (error) {
        console.error(error);
        showAuthMessage(friendlyFirebaseError(error));
    } finally {
        submitButton.disabled = false;
    }
});


/* ==================== 5. PASSWORD RESET ==================== */

const forgotPasswordLink = document.getElementById('forgotPasswordLink');

forgotPasswordLink?.addEventListener('click', () => {
    const loginEmail = document.getElementById('loginEmail')?.value
        .trim()
        .toLowerCase();

    if (loginEmail) {
        sessionStorage.setItem('ehistory-reset-email-draft', loginEmail);
    }
});

const forgotPasswordForm = document.getElementById('forgotPasswordForm');

forgotPasswordForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearAuthMessage();

    const language = accountLanguage();
    const emailInput = document.getElementById('resetEmail');
    const email = emailInput.value.trim().toLowerCase();

    if (!email) {
        showAuthMessage(
            language === 'FIL'
                ? 'Ilagay ang email address na ginamit sa iyong E-HISTORY account.'
                : 'Enter the email address used for your E-HISTORY account.'
        );
        return;
    }

    const firebase = await getReadyFirebase();

    if (!firebase) {
        return;
    }

    const submitButton = forgotPasswordForm.querySelector('[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent =
        language === 'FIL' ? 'Ipinapadala…' : 'Sending…';

    try {
        await firebase.resetPassword(email);

        /*
           Use a privacy-safe confirmation. Firebase projects may enable
           email-enumeration protection, and the page should not reveal
           whether a particular email is registered.
        */
        showAuthMessage(
            language === 'FIL'
                ? 'Kung may E-HISTORY account na naka-register sa email na ito, ipinadala na ang password reset link. Tingnan ang Inbox at Spam/Junk folder.'
                : 'If an E-HISTORY account is registered with this email, a password reset link has been sent. Check your Inbox and Spam/Junk folder.',
            'success'
        );

        sessionStorage.removeItem('ehistory-reset-email-draft');
    } catch (error) {
        console.error(error);

        // Do not disclose whether an email exists in Firebase Authentication.
        if (error?.code === 'auth/user-not-found') {
            showAuthMessage(
                language === 'FIL'
                    ? 'Kung may E-HISTORY account na naka-register sa email na ito, ipinadala na ang password reset link. Tingnan ang Inbox at Spam/Junk folder.'
                    : 'If an E-HISTORY account is registered with this email, a password reset link has been sent. Check your Inbox and Spam/Junk folder.',
                'success'
            );
        } else {
            showAuthMessage(friendlyFirebaseError(error));
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

function initializePasswordResetForm() {
    if (document.body.dataset.page !== 'forgotPassword') {
        return;
    }

    const emailInput = document.getElementById('resetEmail');
    const savedEmail = sessionStorage.getItem('ehistory-reset-email-draft');

    if (emailInput && savedEmail) {
        emailInput.value = savedEmail;
        emailInput.focus();
    }
}


/* ==================== 6. PROTECTED ACCOUNT PAGES ==================== */

async function protectAccountPage(expectedRole) {
    const firebase = await getReadyFirebase();

    if (!firebase) {
        return null;
    }

    const state = await firebase.requireRole(expectedRole);

    if (state.allowed) {
        return state.profile;
    }

    if (state.reason === 'SIGNED_OUT') {
        location.replace('login.html');
        return null;
    }

    routeProfile(state.profile);
    return null;
}


/* ==================== 7. STUDENT DASHBOARD ==================== */

function accountDone(key) {
    return localStorage.getItem(key) === 'true';
}

function accountScore(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : Number(value);
}

function lessonComplete(number) {
    return [1, 2, 3].every((activityNumber) =>
        accountDone(`ehistory-l${number}-a${activityNumber}-completed`)
    );
}

async function renderStudentAccount() {
    if (document.body.dataset.page !== 'studentAccount') {
        return;
    }

    const user = await protectAccountPage('student');

    if (!user) {
        return;
    }

    const initials = user.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    document.getElementById('studentAvatar').textContent = initials || 'S';
    document.getElementById('studentName').textContent = user.name;
    document.getElementById('studentEmail').textContent = user.email;
    document.getElementById('studentGradeSection').textContent =
        user.gradeSection || '—';
    document.getElementById('studentLanguage').textContent = accountLanguage();

    const lessons = [1, 2, 3].filter(lessonComplete).length;

    const activities = [
        'l1-a1', 'l1-a2', 'l1-a3',
        'l2-a1', 'l2-a2', 'l2-a3',
        'l3-a1', 'l3-a2', 'l3-a3'
    ].filter((key) => accountDone(`ehistory-${key}-completed`)).length;

    const assessments = [1, 2].filter((number) =>
        accountDone(`ehistory-assessment-${number}-completed`)
    ).length;

    const examScore = accountScore('ehistory-exam-score');
    const assessment1Best = accountScore('ehistory-assessment-1-best');
    const assessment2Best = accountScore('ehistory-assessment-2-best');
    const examBest = accountScore('ehistory-exam-best');
    const examAttempts = accountScore('ehistory-exam-attempts') || 0;

    document.getElementById('studentLessonCount').textContent =
        `${lessons} / 3`;

    document.getElementById('studentActivityCount').textContent =
        `${activities} / 9`;

    document.getElementById('studentAssessmentCount').textContent =
        `${assessments} / 2`;

    document.getElementById('studentExamScore').textContent =
        examScore === null ? '—' : `${examScore} / 60`;

    document.getElementById('studentAssessment1Best').textContent =
        assessment1Best === null ? '—' : `${assessment1Best} / 30`;

    document.getElementById('studentAssessment2Best').textContent =
        assessment2Best === null ? '—' : `${assessment2Best} / 30`;

    document.getElementById('studentExamBest').textContent =
        examBest === null ? '—' : `${examBest} / 60`;

    document.getElementById('studentExamAttempts').textContent =
        String(examAttempts);
}


/* ==================== 8. TEACHER ACCOUNT ==================== */

async function renderTeacherAccount() {
    if (document.body.dataset.page !== 'teacherAccount') {
        return;
    }

    const user = await protectAccountPage('teacher');

    if (!user) {
        return;
    }

    const initials = user.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    document.getElementById('teacherAvatar').textContent = initials || 'T';
    document.getElementById('teacherName').textContent = user.name;
    document.getElementById('teacherEmail').textContent = user.email;
    document.getElementById('teacherLanguage').textContent = accountLanguage();
}


/* ==================== 9. LOGOUT ==================== */

document.querySelectorAll('[data-account-logout]').forEach((button) => {
    button.addEventListener('click', async () => {
        const firebase = await getReadyFirebase();

        if (firebase) {
            await firebase.logout();
        }

        location.href = 'login.html';
    });
});


/* ==================== 10. INITIALIZATION / LANGUAGE REFRESH ==================== */

async function initializeAccountPage() {
    const firebase = await getFirebaseBridge();

    if (!firebase?.configured) {
        if (document.body.dataset.page === 'login' ||
            document.body.dataset.page === 'register' ||
            document.body.dataset.page === 'forgotPassword') {
            showAuthMessage(
                accountLanguage() === 'FIL'
                    ? 'Kailangang i-set up ang Firebase: ilagay ang iyong Firebase web configuration sa firebase-config.js.'
                    : 'Firebase setup required: add your Firebase web configuration to firebase-config.js.'
            );
        }
        return;
    }

    await firebase.whenAuthReady();

    const state = await firebase.getAuthState();

    // Signed-in users do not need to remain on login/register pages.
    if (
        (document.body.dataset.page === 'login' ||
            document.body.dataset.page === 'register' ||
            document.body.dataset.page === 'forgotPassword') &&
        state.user &&
        state.profile
    ) {
        routeProfile(state.profile);
        return;
    }

    initializePasswordResetForm();
    await renderStudentAccount();
    await renderTeacherAccount();
}

window.addEventListener('ehistory:languagechange', () => {
    if (document.body.dataset.page === 'studentAccount') {
        document.getElementById('studentLanguage').textContent = accountLanguage();
    }

    if (document.body.dataset.page === 'teacherAccount') {
        document.getElementById('teacherLanguage').textContent = accountLanguage();
    }
});

window.addEventListener('ehistory:authchange', () => {
    renderStudentAccount();
    renderTeacherAccount();
});

initializeAccountPage();
