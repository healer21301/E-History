/* ============================================================
   E-HISTORY — PHASE 10 PROGRESS / LEARNING JOURNEY
   ============================================================
   QUICK MAP
   1. Learning milestones
   2. Storage helpers
   3. Overall statistics
   4. Detailed lesson records
   5. Continue-learning recommendation
   6. Synchronization
   ============================================================ */


/* ==================== 1. LEARNING MILESTONES ==================== */

const PROGRESS_ACTIVITY_KEYS = [
    'l1a1', 'l1a2', 'l1a3',
    'l2a1', 'l2a2', 'l2a3',
    'l3a1', 'l3a2', 'l3a3'
];


/* ==================== 2. STORAGE HELPERS ==================== */

function progressDone(key) {
    return localStorage.getItem(key) === 'true';
}

function progressScore(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : Number(value);
}

function progressLanguage() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function progressLessonComplete(lessonNumber) {
    return [1, 2, 3].every((activityNumber) =>
        progressDone(
            `ehistory-l${lessonNumber}-a${activityNumber}-completed`
        )
    );
}

function progressLessonPercent(lessonNumber) {
    const completed = [1, 2, 3].filter((activityNumber) =>
        progressDone(
            `ehistory-l${lessonNumber}-a${activityNumber}-completed`
        )
    ).length;

    return Math.round((completed / 3) * 100);
}


/* ==================== 3. OVERALL STATISTICS ==================== */

function renderProgressSummary() {
    const lessonsCompleted = [1, 2, 3].filter(progressLessonComplete).length;

    const activitiesCompleted = PROGRESS_ACTIVITY_KEYS.filter((key) =>
        progressDone(`ehistory-${key.replace(/l(\d)a(\d)/, 'l$1-a$2')}-completed`)
    ).length;

    const assessmentsCompleted = [1, 2].filter((number) =>
        progressDone(`ehistory-assessment-${number}-completed`)
    ).length;

    const examCompleted = progressDone('ehistory-exam-completed');

    /*
       Overall milestones:
       3 lessons + 9 mini activities + 2 assessments + 1 exam = 15
    */
    const completedMilestones =
        lessonsCompleted +
        activitiesCompleted +
        assessmentsCompleted +
        (examCompleted ? 1 : 0);

    const totalMilestones = 15;
    const overallPercent = Math.round(
        (completedMilestones / totalMilestones) * 100
    );

    document.getElementById('overallProgressValue').textContent =
        `${overallPercent}%`;

    document.getElementById('overallProgressFill').style.width =
        `${overallPercent}%`;

    document.getElementById('overallMilestoneText').textContent =
        `${completedMilestones} / ${totalMilestones}`;

    document.getElementById('progressLessons').textContent =
        `${lessonsCompleted} / 3`;

    document.getElementById('progressActivities').textContent =
        `${activitiesCompleted} / 9`;

    document.getElementById('progressAssessments').textContent =
        `${assessmentsCompleted} / 2`;

    const examScore = progressScore('ehistory-exam-score');

    document.getElementById('progressExam').textContent =
        examCompleted && examScore !== null
            ? `${examScore} / 60`
            : '—';
}


/* ==================== 4. DETAILED LESSON RECORDS ==================== */

function setProgressRecord(recordKey, completed, scoreText, locked = false) {
    const record = document.querySelector(`[data-record="${recordKey}"]`);

    if (!record) {
        return;
    }

    record.classList.toggle('completed', completed);
    record.classList.toggle('locked', locked);

    const strong = record.querySelector('strong');

    if (strong) {
        strong.textContent = scoreText;
    }
}

function renderDetailedProgress() {
    [1, 2, 3].forEach((lessonNumber) => {
        const percent = progressLessonPercent(lessonNumber);

        const percentElement = document.querySelector(
            `[data-lesson-percent="${lessonNumber}"]`
        );

        const fillElement = document.querySelector(
            `[data-lesson-fill="${lessonNumber}"]`
        );

        if (percentElement) {
            percentElement.textContent = `${percent}%`;
        }

        if (fillElement) {
            fillElement.style.width = `${percent}%`;
        }

        [1, 2, 3].forEach((activityNumber) => {
            const key = `l${lessonNumber}a${activityNumber}`;
            const storageKey = `l${lessonNumber}-a${activityNumber}`;
            const completed = progressDone(`ehistory-${storageKey}-completed`);
            const best = progressScore(`ehistory-${storageKey}-best`);

            const previousRequired =
                activityNumber === 1 ||
                progressDone(
                    `ehistory-l${lessonNumber}-a${activityNumber - 1}-completed`
                );

            const lessonAccess =
                lessonNumber === 1 ||
                (lessonNumber === 2 &&
                    progressDone('ehistory-assessment-1-completed')) ||
                (lessonNumber === 3 &&
                    progressDone('ehistory-assessment-2-completed'));

            const unlocked = lessonAccess && previousRequired;

            setProgressRecord(
                key,
                completed,
                completed && best !== null ? `✓ ${best}` : unlocked ? (progressLanguage() === 'FIL' ? 'MAGAGAMIT' : 'AVAILABLE') : '🔒',
                !unlocked
            );
        });
    });

    // Summative Assessment 1
    const assessment1Done = progressDone('ehistory-assessment-1-completed');
    const assessment1Unlocked = progressLessonComplete(1);
    const assessment1Best = progressScore('ehistory-assessment-1-best');

    setProgressRecord(
        'assessment1',
        assessment1Done,
        assessment1Done && assessment1Best !== null
            ? `✓ ${assessment1Best} / 30`
            : assessment1Unlocked
              ? (progressLanguage() === 'FIL' ? 'MAGAGAMIT' : 'AVAILABLE')
              : '🔒',
        !assessment1Unlocked
    );

    // Summative Assessment 2
    const assessment2Done = progressDone('ehistory-assessment-2-completed');
    const assessment2Unlocked = progressLessonComplete(2);
    const assessment2Best = progressScore('ehistory-assessment-2-best');

    setProgressRecord(
        'assessment2',
        assessment2Done,
        assessment2Done && assessment2Best !== null
            ? `✓ ${assessment2Best} / 30`
            : assessment2Unlocked
              ? (progressLanguage() === 'FIL' ? 'MAGAGAMIT' : 'AVAILABLE')
              : '🔒',
        !assessment2Unlocked
    );

    // Term examination
    const examDone = progressDone('ehistory-exam-completed');
    const examUnlocked =
        assessment1Done &&
        assessment2Done &&
        progressLessonComplete(3);

    const examBest = progressScore('ehistory-exam-best');

    setProgressRecord(
        'exam',
        examDone,
        examDone && examBest !== null
            ? `✓ ${examBest} / 60`
            : examUnlocked
              ? (progressLanguage() === 'FIL' ? 'MAGAGAMIT' : 'AVAILABLE')
              : '🔒',
        !examUnlocked
    );
}


/* ==================== 5. CONTINUE-LEARNING RECOMMENDATION ==================== */

function renderContinueJourney() {
    const language = progressLanguage();
    const title = document.getElementById('continueJourneyTitle');
    const description = document.getElementById('continueJourneyDescription');
    const link = document.getElementById('continueJourneyLink');

    const steps = [
        ['l1a1', 'lesson-1-activity-1.html', 'Aralin 1 · Mini Gawain 1', 'Lesson 1 · Mini Activity 1'],
        ['l1a2', 'lesson-1-activity-2.html', 'Aralin 1 · Mini Gawain 2', 'Lesson 1 · Mini Activity 2'],
        ['l1a3', 'lesson-1-activity-3.html', 'Aralin 1 · Mini Gawain 3', 'Lesson 1 · Mini Activity 3'],
        ['assessment1', 'assessment-1.html', 'Lagumang Pagtataya 1', 'Summative Assessment 1'],
        ['l2a1', 'lesson-2-activity-1.html', 'Aralin 2 · Mini Gawain 1', 'Lesson 2 · Mini Activity 1'],
        ['l2a2', 'lesson-2-activity-2.html', 'Aralin 2 · Mini Gawain 2', 'Lesson 2 · Mini Activity 2'],
        ['l2a3', 'lesson-2-activity-3.html', 'Aralin 2 · Mini Gawain 3', 'Lesson 2 · Mini Activity 3'],
        ['assessment2', 'assessment-2.html', 'Lagumang Pagtataya 2', 'Summative Assessment 2'],
        ['l3a1', 'lesson-3-activity-1.html', 'Aralin 3 · Mini Gawain 1', 'Lesson 3 · Mini Activity 1'],
        ['l3a2', 'lesson-3-activity-2.html', 'Aralin 3 · Mini Gawain 2', 'Lesson 3 · Mini Activity 2'],
        ['l3a3', 'lesson-3-activity-3.html', 'Aralin 3 · Mini Gawain 3', 'Lesson 3 · Mini Activity 3'],
        ['exam', 'exam.html', 'Unang Markahang Pagsusulit', 'First Quarter Examination']
    ];

    function isStepComplete(stepKey) {
        if (/^l[1-3]a[1-3]$/.test(stepKey)) {
            const storageKey = stepKey.replace(/l(\d)a(\d)/, 'l$1-a$2');
            return progressDone(`ehistory-${storageKey}-completed`);
        }

        if (stepKey === 'assessment1') {
            return progressDone('ehistory-assessment-1-completed');
        }

        if (stepKey === 'assessment2') {
            return progressDone('ehistory-assessment-2-completed');
        }

        return progressDone('ehistory-exam-completed');
    }

    const next = steps.find((step) => !isStepComplete(step[0]));

    if (!next) {
        title.textContent =
            language === 'FIL'
                ? 'Kumpleto na ang Yunit 1!'
                : 'Unit 1 is complete!';

        description.textContent =
            language === 'FIL'
                ? 'Natapos mo na ang lahat ng kasalukuyang kinakailangan sa pagkatuto.'
                : 'You have completed all current learning requirements.';

        link.href = 'progress.html';
        link.querySelector('span').textContent =
            language === 'FIL' ? 'Tingnan ang Record' : 'View Record';
        return;
    }

    title.textContent = language === 'FIL' ? next[2] : next[3];

    description.textContent =
        language === 'FIL'
            ? 'Ito ang susunod na bahagi ng iyong paglalakbay sa pagkatuto.'
            : 'This is the next step in your learning journey.';

    link.href = next[1];
    link.querySelector('span').textContent =
        language === 'FIL' ? 'Magpatuloy' : 'Continue';
}


/* ==================== 6. SYNCHRONIZATION ==================== */

function renderProgressPage() {
    renderProgressSummary();
    renderDetailedProgress();
    renderContinueJourney();
}

window.addEventListener('ehistory:languagechange', renderProgressPage);
window.addEventListener('ehistory:progresschange', renderProgressPage);
window.addEventListener('storage', renderProgressPage);

renderProgressPage();
