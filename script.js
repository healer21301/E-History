/* ============================================================
   E-HISTORY — GLOBAL JAVASCRIPT
   ============================================================
   QUICK MAP
   1. Global DOM references
   2. Language system (FIL ↔ EN)
   3. Theme system (Light ↔ Dark)
   4. Mobile navigation / placeholder links
   5. Progress helpers
   6. Lesson, activity, and assessment unlock rules
   7. Lesson reader progress
   8. Initialization and synchronization

   IMPORTANT:
   This file is loaded by most pages. After editing this file,
   always test BOTH the language button and the theme button.
   ============================================================ */


/* ==================== 1. GLOBAL DOM REFERENCES ==================== */

const root = document.documentElement;
const body = document.body;

const langBtn = document.getElementById('languageButton');
const themeBtn = document.getElementById('themeButton');
const menuBtn = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');


/* ==================== 1A. BRAND ICON / FAVICON ==================== */

function applyBrandIcons() {
    const faviconPath = 'assets/e-history-favicon.png';
    const appleIconPath = 'assets/apple-touch-icon.png';

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.type = 'image/png';
    favicon.href = faviconPath;

    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
    }
    appleIcon.href = appleIconPath;
}

applyBrandIcons();


/* ==================== 2. LANGUAGE SYSTEM ==================== */

function lang() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function applyLanguage() {
    const currentLanguage = lang();

    // Update the document language attribute.
    document.documentElement.lang = currentLanguage === 'FIL' ? 'fil' : 'en';

    // Translate normal text elements.
    document.querySelectorAll('[data-fil][data-en]').forEach((element) => {
        element.textContent =
            currentLanguage === 'FIL'
                ? element.dataset.fil
                : element.dataset.en;
    });

    // Translate input placeholders.
    document
        .querySelectorAll('[data-placeholder-fil][data-placeholder-en]')
        .forEach((element) => {
            element.placeholder =
                currentLanguage === 'FIL'
                    ? element.dataset.placeholderFil
                    : element.dataset.placeholderEn;
        });

    // Update the language toggle itself.
    if (langBtn) {
        langBtn.textContent = currentLanguage;
    }

    // Update the page title when translated titles are available.
    if (body?.dataset.titleFil) {
        document.title =
            currentLanguage === 'FIL'
                ? body.dataset.titleFil
                : body.dataset.titleEn;
    }

    // Notify page-specific scripts that language changed.
    window.dispatchEvent(
        new CustomEvent('ehistory:languagechange', {
            detail: { language: currentLanguage }
        })
    );
}

if (langBtn) {
    langBtn.addEventListener('click', () => {
        const nextLanguage = lang() === 'FIL' ? 'EN' : 'FIL';
        localStorage.setItem('ehistory-language', nextLanguage);
        applyLanguage();
    });
}


/* ==================== 3. THEME SYSTEM ==================== */

function applyTheme() {
    const theme = localStorage.getItem('ehistory-theme') || 'light';

    // CSS reads this data attribute: html[data-theme="dark"]
    root.dataset.theme = theme;

    if (themeBtn) {
        themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
    }
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('ehistory-theme', nextTheme);
        applyTheme();

        window.dispatchEvent(
            new CustomEvent('ehistory:themechange', {
                detail: { theme: nextTheme }
            })
        );
    });
}


/* ==================== 4. MOBILE NAVIGATION / PLACEHOLDER LINKS ==================== */

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        navLinks.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        const clickedOutsideNavigation = !navLinks.contains(event.target);
        const clickedOutsideMenuButton = !menuBtn.contains(event.target);

        if (clickedOutsideNavigation && clickedOutsideMenuButton) {
            navLinks.classList.remove('show');
        }
    });
}

// Placeholder links use href="#" until their phase is implemented.
document.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const explicitlyLocked =
            anchor.classList.contains('locked') ||
            anchor.classList.contains('locked-button');

        if (anchor.getAttribute('href') === '#' || explicitlyLocked) {
            event.preventDefault();
        }
    });
});



/* ==================== 4B. GLOBAL ROUTE WIRING ==================== */

/*
   Earlier Phase 1–7 HTML files intentionally used href="#" for pages
   that did not exist yet. Later phases now provide those pages, so this section connects the old
   navigation without requiring every earlier HTML file to be replaced.

   If you later reorganize filenames, update the route table below.
*/

const globalRoutes = {
    Pagtataya: 'assessments.html',
    Pagsusulit: 'exam.html',
    Progreso: 'progress.html',
    'Katuwang sa Pag-aaral': 'learning-assistant.html'
};

document.querySelectorAll('.nav-links a[data-fil]').forEach((link) => {
    const route = globalRoutes[link.dataset.fil];

    if (route) {
        link.href = route;
    }
});

/*
   Phase 12 Firebase account routing
   ---------------------------------
   firebase-sync.js is loaded as an ES module near the end of this file.
   The Account button waits for Firebase Authentication to resolve and then
   routes the signed-in user to the correct account page.
*/
async function waitForFirebaseBridge(timeoutMs = 4000) {
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

document.querySelectorAll('.account-button').forEach((button) => {
    button.addEventListener('click', async () => {
        const firebase = await waitForFirebaseBridge();

        if (!firebase?.configured) {
            location.href = 'login.html';
            return;
        }

        const { user, profile } = await firebase.getAuthState();

        if (!user || !profile) {
            location.href = 'login.html';
            return;
        }

        if (profile.role === 'teacher') {
            location.href = 'teacher-account.html';
            return;
        }

        if (profile.role === 'student') {
            location.href = 'student-account.html';
            return;
        }

        // Unknown / malformed roles never receive a privileged fallback.
        location.href = 'login.html';
    });
});


/* ==================== 5. PROGRESS HELPERS ==================== */

function done(storageKey) {
    return localStorage.getItem(storageKey) === 'true';
}

function canonicalActivityStorageId(activityKey) {
    const match = String(activityKey || '').match(/^l([1-3])a([1-3])$/);
    return match ? `l${match[1]}-a${match[2]}` : String(activityKey || '');
}

function lessonProgress(lessonNumber) {
    const activityCompletion = [1, 2, 3].map((activityNumber) =>
        done(`ehistory-l${lessonNumber}-a${activityNumber}-completed`)
    );

    const completedCount = activityCompletion.filter(Boolean).length;
    return Math.round((completedCount / 3) * 100);
}


/* ==================== 6. UNLOCK / PROGRESS RULES ==================== */

function refreshProgress() {
    // ----- Lesson percentage labels -----
    document.querySelectorAll('[data-lesson-progress]').forEach((element) => {
        const lessonNumber = Number(element.dataset.lessonProgress);
        element.textContent = `${lessonProgress(lessonNumber)}%`;
    });

    // ----- Activity completion icons/cards -----
    document.querySelectorAll('[data-activity-status]').forEach((element) => {
        const activityKey = canonicalActivityStorageId(
            element.dataset.activityStatus
        );
        const activityCompleted = done(`ehistory-${activityKey}-completed`);

        element.textContent = activityCompleted ? '✓' : '→';

        const card = element.closest('.lesson-activity-card');
        card?.classList.toggle('completed', activityCompleted);
    });

    // ----- Activity prerequisites inside a lesson -----
    document.querySelectorAll('[data-activity-link]').forEach((element) => {
        const activityKey = element.dataset.activityLink;
        const match = activityKey.match(/l(\d)a(\d)/);

        if (!match) {
            return;
        }

        const lessonNumber = Number(match[1]);
        const activityNumber = Number(match[2]);

        const unlocked =
            activityNumber === 1 ||
            (activityNumber === 2 &&
                done(`ehistory-l${lessonNumber}-a1-completed`)) ||
            (activityNumber === 3 &&
                done(`ehistory-l${lessonNumber}-a2-completed`));

        element.classList.toggle('locked', !unlocked);
        element.setAttribute('aria-disabled', String(!unlocked));
    });

    // ----- Assessment prerequisites -----
    document.querySelectorAll('[data-assessment-link]').forEach((element) => {
        const lessonNumber = Number(element.dataset.assessmentLink);
        const unlocked = lessonProgress(lessonNumber) === 100;

        element.classList.toggle('locked', !unlocked);
        element.setAttribute('aria-disabled', String(!unlocked));
    });

    // ----- Lesson Archive unlocking -----
    // Lesson 1: always available
    // Lesson 2: unlocked after Summative Assessment 1
    // Lesson 3: unlocked after Summative Assessment 2
    document.querySelectorAll('[data-lesson-link]').forEach((element) => {
        const lessonNumber = Number(element.dataset.lessonLink);

        const unlocked =
            lessonNumber === 1 ||
            (lessonNumber === 2 && done('ehistory-assessment-1-completed')) ||
            (lessonNumber === 3 && done('ehistory-assessment-2-completed'));

        const card = element.closest('.lesson-card');
        const badge = card?.querySelector('.lesson-status');

        if (unlocked) {
            element.classList.remove('locked-button');
            element.href = `lesson-${lessonNumber}.html`;

            const label = element.querySelector('span:first-child');
            if (label) {
                label.dataset.fil = 'Tuklasin ang Aralin';
                label.dataset.en = 'Explore Lesson';
            }

            if (badge) {
                badge.classList.remove('locked');
                badge.classList.add('available');
                badge.dataset.fil = 'MAGAGAMIT';
                badge.dataset.en = 'AVAILABLE';
                badge.textContent = lang() === 'FIL' ? 'MAGAGAMIT' : 'AVAILABLE';
            }
        } else {
            element.classList.add('locked-button');
            element.href = '#';

            if (badge) {
                badge.classList.add('locked');
                badge.classList.remove('available');
                badge.dataset.fil = 'NAKA-LOCK';
                badge.dataset.en = 'LOCKED';
                badge.textContent = lang() === 'FIL' ? 'NAKA-LOCK' : 'LOCKED';
            }
        }
    });
}


/* ==================== 7. LESSON READER PROGRESS ==================== */

const reader = document.getElementById('lessonReaderContent');
const topFill = document.getElementById('readingProgressFill');
const sideFill = document.getElementById('sidebarProgressFill');
const percent = document.getElementById('readingPercent');

const sections = [...document.querySelectorAll('.reader-section')];
const sideLinks = [...document.querySelectorAll('.reader-nav-link')];

function updateReader() {
    if (!reader) {
        return;
    }

    const totalScrollableHeight = document.documentElement.scrollHeight - innerHeight;

    const progress =
        totalScrollableHeight > 0
            ? Math.min(
                  100,
                  Math.max(0, (scrollY / totalScrollableHeight) * 100)
              )
            : 0;

    if (topFill) {
        topFill.style.width = `${progress}%`;
    }

    if (sideFill) {
        sideFill.style.width = `${progress}%`;
    }

    if (percent) {
        percent.textContent = `${Math.round(progress)}%`;
    }

    // Determine which reader section is currently active.
    let activeSectionId = sections[0]?.id;

    sections.forEach((section) => {
        if (scrollY >= section.offsetTop - 160) {
            activeSectionId = section.id;
        }
    });

    sideLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeSectionId}`;
        link.classList.toggle('active', isActive);
    });
}

if (reader) {
    addEventListener('scroll', updateReader);
    updateReader();

    sideLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            document
                .querySelector(link.getAttribute('href'))
                ?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}


/* ==================== 8. INITIALIZATION / SYNCHRONIZATION ==================== */

applyTheme();
refreshProgress();
applyLanguage();

// Keep multiple tabs/windows synchronized when localStorage changes.
window.addEventListener('storage', () => {
    applyTheme();
    applyLanguage();
    refreshProgress();
});

// Page-specific activity/assessment scripts dispatch this after completion.
window.addEventListener('ehistory:progresschange', refreshProgress);

/* ==================== 9. PHASE 12 FIREBASE LOADER ==================== */

/*
   The rest of E-HISTORY uses classic scripts for simplicity.
   Firebase's current modular Web SDK is loaded through this ES module.
   This avoids adding Firebase <script> tags to every existing HTML file.
*/
function loadFirebaseIntegration() {
    if (document.querySelector('script[data-ehistory-firebase]')) {
        return;
    }

    const moduleScript = document.createElement('script');
    moduleScript.type = 'module';
    moduleScript.src = 'firebase-sync.js';
    moduleScript.dataset.ehistoryFirebase = 'true';
    document.head.appendChild(moduleScript);
}

loadFirebaseIntegration();

/* ==================== 10. GLOBAL ROLE GUARD ==================== */

/*
   Account pages already perform their own page-specific checks. This global
   guard adds a second defensive layer for direct-URL navigation and malformed
   sessions. It does not hide public learning content.
*/
async function enforceGlobalRoleGuard() {
    const requiredRoleByPage = {
        studentAccount: 'student',
        teacherAccount: 'teacher',
        teacherDashboard: 'teacher'
    };

    const requiredRole = requiredRoleByPage[body?.dataset.page];

    if (!requiredRole) {
        return;
    }

    const firebase = await waitForFirebaseBridge(7000);

    if (!firebase?.configured) {
        location.replace('login.html');
        return;
    }

    await firebase.whenAuthReady();
    const access = await firebase.requireRole(requiredRole);

    if (access.allowed) {
        return;
    }

    if (access.reason === 'WRONG_ROLE' && access.profile?.role === 'teacher') {
        location.replace('teacher-dashboard.html');
        return;
    }

    if (access.reason === 'WRONG_ROLE' && access.profile?.role === 'student') {
        location.replace('student-account.html');
        return;
    }

    location.replace('login.html');
}

enforceGlobalRoleGuard();

