/* ============================================================
   E-HISTORY — PHASE 8 ASSESSMENT CENTER
   ============================================================
   QUICK MAP
   1. Assessment directory
   2. Storage / prerequisite helpers
   3. Status renderer
   4. Synchronization events
   ============================================================ */


/* ==================== 1. ASSESSMENT DIRECTORY ==================== */

const ASSESSMENT_HUB = [
    {
        number: 1,
        file: 'assessment-1.html',
        lesson: 1,
        total: 30
    },
    {
        number: 2,
        file: 'assessment-2.html',
        lesson: 2,
        total: 30
    }
];


/* ==================== 2. HELPERS ==================== */

function assessmentHubLanguage() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function assessmentHubDone(key) {
    return localStorage.getItem(key) === 'true';
}

function assessmentLessonComplete(lessonNumber) {
    return [1, 2, 3].every((activityNumber) =>
        assessmentHubDone(
            `ehistory-l${lessonNumber}-a${activityNumber}-completed`
        )
    );
}

function assessmentCompleted(number) {
    return assessmentHubDone(`ehistory-assessment-${number}-completed`);
}

function assessmentBest(number) {
    return Number(
        localStorage.getItem(`ehistory-assessment-${number}-best`) || 0
    );
}


/* ==================== 3. RENDERER ==================== */

function renderAssessmentCenter() {
    const language = assessmentHubLanguage();

    let completed = 0;
    let available = 0;
    let locked = 0;

    ASSESSMENT_HUB.forEach((assessment) => {
        const isCompleted = assessmentCompleted(assessment.number);
        const isUnlocked = assessmentLessonComplete(assessment.lesson);
        const best = assessmentBest(assessment.number);

        if (isCompleted) {
            completed += 1;
        } else if (isUnlocked) {
            available += 1;
        } else {
            locked += 1;
        }

        const card = document.querySelector(
            `[data-assessment-card="${assessment.number}"]`
        );
        const status = document.querySelector(
            `[data-assessment-status="${assessment.number}"]`
        );
        const bestScore = document.querySelector(
            `[data-assessment-best="${assessment.number}"]`
        );
        const action = document.querySelector(
            `[data-assessment-open="${assessment.number}"]`
        );
        const note = document.querySelector(
            `[data-assessment-note="${assessment.number}"]`
        );

        card?.classList.remove('completed', 'available', 'locked');

        if (isCompleted) {
            card?.classList.add('completed');

            if (status) {
                status.textContent = language === 'FIL' ? 'NATAPOS' : 'COMPLETED';
            }

            if (action) {
                action.href = assessment.file;
                action.style.pointerEvents = '';
                action.querySelector('span:first-child').textContent =
                    language === 'FIL'
                        ? 'Balikan ang Pagtataya'
                        : 'Review Assessment';
            }

            if (note) {
                note.textContent =
                    language === 'FIL'
                        ? 'Naitala na ang pagtatayang ito.'
                        : 'This assessment has already been recorded.';
            }
        } else if (isUnlocked) {
            card?.classList.add('available');

            if (status) {
                status.textContent = language === 'FIL' ? 'MAGAGAMIT' : 'AVAILABLE';
            }

            if (action) {
                action.href = assessment.file;
                action.style.pointerEvents = '';
                action.querySelector('span:first-child').textContent =
                    language === 'FIL'
                        ? 'Buksan ang Pagtataya'
                        : 'Open Assessment';
            }

            if (note) {
                note.textContent =
                    language === 'FIL'
                        ? 'Nakumpleto na ang tatlong mini gawain ng aralin.'
                        : 'All three mini activities for this lesson are complete.';
            }
        } else {
            card?.classList.add('locked');

            if (status) {
                status.textContent =
                    language === 'FIL' ? 'NAKA-LOCK' : 'LOCKED';
            }

            if (action) {
                action.href = '#';
                action.style.pointerEvents = 'none';
                action.querySelector('span:first-child').textContent =
                    language === 'FIL'
                        ? 'Hindi pa Magagamit'
                        : 'Not Yet Available';
            }

            if (note) {
                note.textContent =
                    language === 'FIL'
                        ? `Tapusin muna ang 3 mini gawain ng Aralin ${assessment.lesson}.`
                        : `Complete all 3 mini activities in Lesson ${assessment.lesson} first.`;
            }
        }

        if (bestScore) {
            bestScore.textContent = best > 0 ? `${best} / ${assessment.total}` : '—';
        }
    });

    const percent = Math.round((completed / ASSESSMENT_HUB.length) * 100);

    const completedMain = document.getElementById('assessmentHubCompleted');
    const progress = document.getElementById('assessmentHubProgress');
    const completedStat = document.getElementById('assessmentStatCompleted');
    const availableStat = document.getElementById('assessmentStatAvailable');
    const lockedStat = document.getElementById('assessmentStatLocked');

    if (completedMain) {
        completedMain.textContent = completed;
    }

    if (progress) {
        progress.style.width = `${percent}%`;
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
}


/* ==================== 4. SYNCHRONIZATION ==================== */

window.addEventListener('ehistory:languagechange', renderAssessmentCenter);
window.addEventListener('ehistory:progresschange', renderAssessmentCenter);
window.addEventListener('storage', renderAssessmentCenter);

renderAssessmentCenter();
