/* ============================================================
   E-HISTORY — PHASE 7 ACTIVITIES CENTER
   ============================================================
   QUICK MAP
   1. Activity directory
   2. Status / prerequisite helpers
   3. Activities Center renderer
   4. Synchronization events

   This file reads saved activity data from localStorage.
   ============================================================ */


/* ==================== 1. ACTIVITY DIRECTORY ==================== */

const HUB_ACTIVITIES = [
    { key: 'l1a1', lesson: 1, file: 'lesson-1-activity-1.html' },
    { key: 'l1a2', lesson: 1, file: 'lesson-1-activity-2.html' },
    { key: 'l1a3', lesson: 1, file: 'lesson-1-activity-3.html' },

    { key: 'l2a1', lesson: 2, file: 'lesson-2-activity-1.html' },
    { key: 'l2a2', lesson: 2, file: 'lesson-2-activity-2.html' },
    { key: 'l2a3', lesson: 2, file: 'lesson-2-activity-3.html' },

    { key: 'l3a1', lesson: 3, file: 'lesson-3-activity-1.html' },
    { key: 'l3a2', lesson: 3, file: 'lesson-3-activity-2.html' },
    { key: 'l3a3', lesson: 3, file: 'lesson-3-activity-3.html' }
];


/* ==================== 2. HUB HELPERS ==================== */

function hubLang() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function hubStorageId(key) {
    const match = key.match(/l(\d)a(\d)/);

    return match ? `l${match[1]}-a${match[2]}` : key;
}

function hubDone(key) {
    const storageId = hubStorageId(key);
    return localStorage.getItem(`ehistory-${storageId}-completed`) === 'true';
}

function hubBest(key) {
    const storageId = hubStorageId(key);

    return Number(
        localStorage.getItem(`ehistory-${storageId}-best`) ||
            localStorage.getItem(`ehistory-${storageId}-score`) ||
            0
    );
}

function hubUnlocked(key) {
    const match = key.match(/l(\d)a(\d)/);

    if (!match) {
        return false;
    }

    const lessonNumber = Number(match[1]);
    const activityNumber = Number(match[2]);

    // First activity of each lesson.
    if (activityNumber === 1) {
        if (lessonNumber === 1) {
            return true;
        }

        if (lessonNumber === 2) {
            return localStorage.getItem('ehistory-assessment-1-completed') === 'true';
        }

        if (lessonNumber === 3) {
            return localStorage.getItem('ehistory-assessment-2-completed') === 'true';
        }
    }

    // Later activities require the activity immediately before them.
    return hubDone(`l${lessonNumber}a${activityNumber - 1}`);
}

function hubState(key) {
    if (hubDone(key)) {
        return 'completed';
    }

    return hubUnlocked(key) ? 'available' : 'locked';
}

function hubText(fil, en) {
    return hubLang() === 'FIL' ? fil : en;
}


/* ==================== 3. ACTIVITIES CENTER RENDERER ==================== */

function renderActivitiesHub() {
    let completed = 0;
    let available = 0;
    let locked = 0;

    HUB_ACTIVITIES.forEach((activity) => {
        const state = hubState(activity.key);

        if (state === 'completed') {
            completed += 1;
        } else if (state === 'available') {
            available += 1;
        } else {
            locked += 1;
        }

        const card = document.querySelector(
            `[data-hub-activity="${activity.key}"]`
        );

        if (!card) {
            return;
        }

        card.classList.remove('completed', 'available', 'locked');
        card.classList.add(state);

        const badge = card.querySelector('.hub-status');
        const best = card.querySelector('.hub-best');
        const action = card.querySelector('.hub-card-action');

        // ----- Status badge -----
        if (badge) {
            badge.className = `hub-status ${state}`;
            badge.textContent =
                state === 'completed'
                    ? hubText('NATAPOS', 'COMPLETED')
                    : state === 'available'
                      ? hubText('MAGAGAMIT', 'AVAILABLE')
                      : hubText('NAKA-LOCK', 'LOCKED');
        }

        // ----- Best score -----
        if (best) {
            const score = hubBest(activity.key);

            best.textContent =
                state === 'completed'
                    ? hubText(
                          `Pinakamataas: ${score}/6`,
                          `Best: ${score}/6`
                      )
                    : hubText('Wala pang marka', 'No score yet');
        }

        // ----- Card action -----
        if (action) {
            if (state === 'locked') {
                action.removeAttribute('href');
                action.textContent = hubText(
                    'Tapusin muna ang prerequisite',
                    'Complete prerequisite first'
                );
            } else {
                action.href = activity.file;
                action.textContent =
                    state === 'completed'
                        ? hubText('Balikan ang Gawain', 'Review Activity')
                        : hubText('Simulan ang Gawain', 'Start Activity');
            }
        }
    });

    // ----- Overall activity statistics -----
    const progressPercent = Math.round(
        (completed / HUB_ACTIVITIES.length) * 100
    );

    const completedNumber = document.getElementById('activityHubCompleted');
    const progressFill = document.getElementById('activityHubProgress');
    const completedStat = document.getElementById('hubStatCompleted');
    const availableStat = document.getElementById('hubStatAvailable');
    const lockedStat = document.getElementById('hubStatLocked');

    if (completedNumber) {
        completedNumber.textContent = completed;
    }

    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }

    if (completedStat) {
        completedStat.textContent = completed;
    }

    if (availableStat) {
        availableStat.textContent = available;
    }

    if (lockedStat) {
        lockedStat.textContent = locked;
    }

    // ----- Per-lesson completion -----
    [1, 2, 3].forEach((lessonNumber) => {
        const lessonCompleted = HUB_ACTIVITIES.filter(
            (activity) =>
                activity.lesson === lessonNumber && hubDone(activity.key)
        ).length;

        const countElement = document.getElementById(
            `hubLesson${lessonNumber}Count`
        );

        if (countElement) {
            countElement.textContent = `${lessonCompleted}/3`;
        }
    });
}


/* ==================== 4. SYNCHRONIZATION EVENTS ==================== */

window.addEventListener('ehistory:languagechange', renderActivitiesHub);
window.addEventListener('ehistory:progresschange', renderActivitiesHub);
window.addEventListener('storage', renderActivitiesHub);

renderActivitiesHub();
