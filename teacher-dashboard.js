/* ============================================================
   E-HISTORY — PHASE 13 TEACHER DASHBOARD
   LIVE FIREBASE / FIRESTORE STUDENT MONITORING
   ============================================================
   QUICK MAP
   1. Firestore imports and constants
   2. DOM references / local state
   3. Language helpers
   4. Firebase bridge / teacher access control
   5. Progress calculation helpers
   6. Firestore student loading
   7. Class summary rendering
   8. Student list / filters
   9. Student detail modal
   10. Refresh / language listeners
   11. Initialization
   ============================================================ */

/* ==================== 1. FIRESTORE IMPORTS / CONSTANTS ==================== */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore-lite.js';

const TOTAL_MILESTONES = 15;
const ACTIVITY_MAX_SCORE = 6;
const ASSESSMENT_MAX_SCORE = 30;
const EXAM_MAX_SCORE = 60;


/* ==================== 2. DOM REFERENCES / LOCAL STATE ==================== */

const teacherLoadingState = document.getElementById('teacherLoadingState');
const teacherErrorState = document.getElementById('teacherErrorState');
const teacherDashboardContent = document.getElementById('teacherDashboardContent');
const teacherErrorTitle = document.getElementById('teacherErrorTitle');
const teacherErrorText = document.getElementById('teacherErrorText');

const teacherDashboardName = document.getElementById('teacherDashboardName');
const teacherDashboardEmail = document.getElementById('teacherDashboardEmail');

const teacherTotalStudents = document.getElementById('teacherTotalStudents');
const teacherAverageProgress = document.getElementById('teacherAverageProgress');
const teacherExamCompleted = document.getElementById('teacherExamCompleted');
const teacherFullyCompleted = document.getElementById('teacherFullyCompleted');

const teacherStudentSearch = document.getElementById('teacherStudentSearch');
const teacherStatusFilter = document.getElementById('teacherStatusFilter');
const teacherSortFilter = document.getElementById('teacherSortFilter');
const teacherRefreshButton = document.getElementById('teacherRefreshButton');
const teacherVisibleCount = document.getElementById('teacherVisibleCount');
const teacherStudentList = document.getElementById('teacherStudentList');
const teacherEmptyState = document.getElementById('teacherEmptyState');

const studentDetailModal = document.getElementById('studentDetailModal');
const studentDetailAvatar = document.getElementById('studentDetailAvatar');
const studentDetailName = document.getElementById('studentDetailName');
const studentDetailMeta = document.getElementById('studentDetailMeta');
const studentDetailPercent = document.getElementById('studentDetailPercent');
const studentDetailProgressFill = document.getElementById('studentDetailProgressFill');
const studentDetailGrid = document.getElementById('studentDetailGrid');

let firebaseBridge = null;
let teacherProfile = null;
let allStudentRecords = [];
let selectedStudentUid = null;


/* ==================== 3. LANGUAGE HELPERS ==================== */

function dashboardLanguage() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function text(fil, en) {
    return dashboardLanguage() === 'EN' ? en : fil;
}

function applyDynamicPlaceholders() {
    document.querySelectorAll('[data-placeholder-fil]').forEach((element) => {
        element.placeholder = dashboardLanguage() === 'EN'
            ? element.dataset.placeholderEn
            : element.dataset.placeholderFil;
    });
}

function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || 'S';
}

function safeText(value, fallback = '—') {
    const normalized = String(value ?? '').trim();
    return normalized || fallback;
}


/* ==================== 4. FIREBASE BRIDGE / ACCESS CONTROL ==================== */

async function getFirebaseBridge(timeoutMs = 7000) {
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

async function protectTeacherDashboard() {
    firebaseBridge = await getFirebaseBridge();

    if (!firebaseBridge?.configured) {
        throw new Error('FIREBASE_NOT_CONFIGURED');
    }

    await firebaseBridge.whenAuthReady();

    const access = await firebaseBridge.requireRole('teacher');

    if (!access.allowed) {
        if (access.reason === 'SIGNED_OUT') {
            location.replace('login.html');
            return false;
        }

        if (access.reason === 'WRONG_ROLE') {
            location.replace('student-account.html');
            return false;
        }

        location.replace('login.html');
        return false;
    }

    teacherProfile = access.profile;

    teacherDashboardName.textContent = safeText(teacherProfile.name, 'Teacher');
    teacherDashboardEmail.textContent = safeText(teacherProfile.email);

    return true;
}


/* ==================== 5. PROGRESS CALCULATION HELPERS ==================== */

function valueMap(record) {
    return record?.values && typeof record.values === 'object'
        ? record.values
        : {};
}

function progressDone(values, key) {
    return String(values[key] ?? '') === 'true';
}

function progressNumber(values, key) {
    const raw = values[key];

    if (raw === null || raw === undefined || raw === '') {
        return null;
    }

    const number = Number(raw);
    return Number.isFinite(number) ? number : null;
}

function lessonCompleted(values, lessonNumber) {
    return [1, 2, 3].every((activityNumber) =>
        progressDone(
            values,
            `ehistory-l${lessonNumber}-a${activityNumber}-completed`
        )
    );
}

function lessonCompletedCount(values) {
    return [1, 2, 3].filter((lessonNumber) =>
        lessonCompleted(values, lessonNumber)
    ).length;
}

function activityCompletedCount(values) {
    let total = 0;

    for (let lessonNumber = 1; lessonNumber <= 3; lessonNumber += 1) {
        for (let activityNumber = 1; activityNumber <= 3; activityNumber += 1) {
            if (
                progressDone(
                    values,
                    `ehistory-l${lessonNumber}-a${activityNumber}-completed`
                )
            ) {
                total += 1;
            }
        }
    }

    return total;
}

function assessmentCompletedCount(values) {
    return [1, 2].filter((assessmentNumber) =>
        progressDone(
            values,
            `ehistory-assessment-${assessmentNumber}-completed`
        )
    ).length;
}

function studentProgressSummary(progressRecord = {}) {
    const values = valueMap(progressRecord);
    const lessons = lessonCompletedCount(values);
    const activities = activityCompletedCount(values);
    const assessments = assessmentCompletedCount(values);
    const examCompleted = progressDone(values, 'ehistory-exam-completed');

    const completedMilestones =
        lessons +
        activities +
        assessments +
        (examCompleted ? 1 : 0);

    const percent = Math.round(
        (completedMilestones / TOTAL_MILESTONES) * 100
    );

    const status = completedMilestones === 0
        ? 'not-started'
        : completedMilestones >= TOTAL_MILESTONES
            ? 'completed'
            : 'in-progress';

    return {
        values,
        lessons,
        activities,
        assessments,
        examCompleted,
        completedMilestones,
        percent,
        status,
        examBest: progressNumber(values, 'ehistory-exam-best'),
        examScore: progressNumber(values, 'ehistory-exam-score'),
        examAttempts: progressNumber(values, 'ehistory-exam-attempts') || 0
    };
}

function scoreText(score, maxScore) {
    return score === null || score === undefined
        ? '—'
        : `${score} / ${maxScore}`;
}

function activityBest(values, lessonNumber, activityNumber) {
    return progressNumber(
        values,
        `ehistory-l${lessonNumber}-a${activityNumber}-best`
    );
}

function assessmentBest(values, assessmentNumber) {
    return progressNumber(
        values,
        `ehistory-assessment-${assessmentNumber}-best`
    );
}


/* ==================== 6. FIRESTORE STUDENT LOADING ==================== */

async function loadStudentRecords() {
    if (!firebaseBridge?.db) {
        throw new Error('FIRESTORE_NOT_READY');
    }

    const db = firebaseBridge.db;

    // Query only Student profile documents.
    const studentQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
    );

    const studentSnapshot = await getDocs(studentQuery);

    const studentProfiles = studentSnapshot.docs.map((snapshot) => ({
        uid: snapshot.id,
        ...snapshot.data()
    }));

    const records = await Promise.all(
        studentProfiles.map(async (profile) => {
            const progressSnapshot = await getDoc(
                doc(db, 'progress', profile.uid)
            );

            const progress = progressSnapshot.exists()
                ? progressSnapshot.data()
                : { uid: profile.uid, values: {} };

            return {
                uid: profile.uid,
                profile,
                progress,
                summary: studentProgressSummary(progress)
            };
        })
    );

    records.sort((a, b) =>
        safeText(a.profile.name, '').localeCompare(
            safeText(b.profile.name, ''),
            undefined,
            { sensitivity: 'base' }
        )
    );

    allStudentRecords = records;
}


/* ==================== 7. CLASS SUMMARY RENDERING ==================== */

function renderClassSummary() {
    const total = allStudentRecords.length;

    const average = total === 0
        ? 0
        : Math.round(
            allStudentRecords.reduce(
                (sum, record) => sum + record.summary.percent,
                0
            ) / total
        );

    const examCompleted = allStudentRecords.filter(
        (record) => record.summary.examCompleted
    ).length;

    const fullyCompleted = allStudentRecords.filter(
        (record) => record.summary.status === 'completed'
    ).length;

    teacherTotalStudents.textContent = String(total);
    teacherAverageProgress.textContent = `${average}%`;
    teacherExamCompleted.textContent = String(examCompleted);
    teacherFullyCompleted.textContent = String(fullyCompleted);
}


/* ==================== 8. STUDENT LIST / FILTERS ==================== */

function statusLabel(status) {
    const labels = {
        'not-started': {
            FIL: 'HINDI PA NAGSISIMULA',
            EN: 'NOT STARTED'
        },
        'in-progress': {
            FIL: 'KASALUKUYANG GINAGAWA',
            EN: 'IN PROGRESS'
        },
        completed: {
            FIL: 'NATAPOS',
            EN: 'COMPLETED'
        }
    };

    return labels[status]?.[dashboardLanguage()] || status;
}

function filteredStudents() {
    const search = teacherStudentSearch.value.trim().toLowerCase();
    const statusFilter = teacherStatusFilter.value;
    const sort = teacherSortFilter.value;

    const records = allStudentRecords.filter((record) => {
        const profile = record.profile;

        const haystack = [
            profile.name,
            profile.email,
            profile.gradeSection
        ]
            .map((value) => String(value ?? '').toLowerCase())
            .join(' ');

        const matchesSearch = !search || haystack.includes(search);
        const matchesStatus =
            statusFilter === 'all' || record.summary.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    records.sort((a, b) => {
        if (sort === 'progress-desc') {
            return b.summary.percent - a.summary.percent;
        }

        if (sort === 'progress-asc') {
            return a.summary.percent - b.summary.percent;
        }

        return safeText(a.profile.name, '').localeCompare(
            safeText(b.profile.name, ''),
            undefined,
            { sensitivity: 'base' }
        );
    });

    return records;
}

function createStudentRow(record) {
    const profile = record.profile;
    const summary = record.summary;

    const row = document.createElement('article');
    row.className = 'teacher-student-row';
    row.dataset.studentUid = record.uid;

    row.innerHTML = `
        <div class="teacher-student-main">
            <div class="teacher-student-avatar">${initials(profile.name)}</div>
            <div>
                <strong>${escapeHtml(safeText(profile.name, text('Walang Pangalan', 'No Name')))}</strong>
                <small>${escapeHtml(safeText(profile.email))}</small>
            </div>
        </div>

        <div class="teacher-student-cell">
            <span>${text('BAITANG / SEKSYON', 'GRADE / SECTION')}</span>
            <strong>${escapeHtml(safeText(profile.gradeSection))}</strong>
        </div>

        <div class="teacher-student-cell">
            <span>${text('PROGRESO', 'PROGRESS')}</span>
            <strong>${summary.percent}%</strong>
            <div class="teacher-mini-progress">
                <div style="width: ${summary.percent}%"></div>
            </div>
        </div>

        <div class="teacher-student-cell">
            <span>${text('ARALIN', 'LESSONS')}</span>
            <strong>${summary.lessons} / 3</strong>
        </div>

        <div class="teacher-student-cell">
            <span>${text('KALAGAYAN', 'STATUS')}</span>
            <strong>
                <span class="teacher-status-pill ${summary.status}">
                    ${statusLabel(summary.status)}
                </span>
            </strong>
        </div>

        <button
            class="teacher-view-button"
            type="button"
            data-view-student="${record.uid}"
            aria-label="${text('Tingnan ang tala ng mag-aaral', 'View student record')}"
        >→</button>
    `;

    return row;
}

function renderStudentList() {
    const records = filteredStudents();

    teacherStudentList.innerHTML = '';
    teacherVisibleCount.textContent = `${records.length} / ${allStudentRecords.length}`;
    teacherEmptyState.hidden = records.length !== 0;

    records.forEach((record) => {
        teacherStudentList.appendChild(createStudentRow(record));
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


/* ==================== 9. STUDENT DETAIL MODAL ==================== */

function recordLine(label, value) {
    return `
        <div class="teacher-detail-record">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
        </div>
    `;
}

function activityRecordLines(values, lessonNumber) {
    return [1, 2, 3]
        .map((activityNumber) => {
            const completed = progressDone(
                values,
                `ehistory-l${lessonNumber}-a${activityNumber}-completed`
            );

            const best = activityBest(values, lessonNumber, activityNumber);

            return recordLine(
                `${text('Mini Gawain', 'Mini Activity')} ${activityNumber}`,
                completed
                    ? `✓ ${scoreText(best, ACTIVITY_MAX_SCORE)}`
                    : '—'
            );
        })
        .join('');
}

function openStudentDetail(uid) {
    const record = allStudentRecords.find((item) => item.uid === uid);

    if (!record) {
        return;
    }

    selectedStudentUid = uid;

    const profile = record.profile;
    const summary = record.summary;
    const values = summary.values;

    studentDetailAvatar.textContent = initials(profile.name);
    studentDetailName.textContent = safeText(profile.name, text('Mag-aaral', 'Student'));
    studentDetailMeta.textContent = [
        safeText(profile.gradeSection, ''),
        safeText(profile.email, '')
    ].filter(Boolean).join(' · ') || '—';

    studentDetailPercent.textContent = `${summary.percent}%`;
    studentDetailProgressFill.style.width = `${summary.percent}%`;

    studentDetailGrid.innerHTML = `
        <article class="teacher-detail-card">
            <span>${text('ARALIN 1', 'LESSON 1')}</span>
            <h3>${text('Kamalayang Pangkasaysayan', 'Historical Consciousness')}</h3>
            <div class="teacher-detail-records">
                ${activityRecordLines(values, 1)}
                ${recordLine(
                    text('Lagumang Pagtataya 1', 'Summative Assessment 1'),
                    progressDone(values, 'ehistory-assessment-1-completed')
                        ? `✓ ${scoreText(assessmentBest(values, 1), ASSESSMENT_MAX_SCORE)}`
                        : '—'
                )}
            </div>
        </article>

        <article class="teacher-detail-card">
            <span>${text('ARALIN 2', 'LESSON 2')}</span>
            <h3>${text('Heograpiya at Kultura', 'Geography and Culture')}</h3>
            <div class="teacher-detail-records">
                ${activityRecordLines(values, 2)}
                ${recordLine(
                    text('Lagumang Pagtataya 2', 'Summative Assessment 2'),
                    progressDone(values, 'ehistory-assessment-2-completed')
                        ? `✓ ${scoreText(assessmentBest(values, 2), ASSESSMENT_MAX_SCORE)}`
                        : '—'
                )}
            </div>
        </article>

        <article class="teacher-detail-card">
            <span>${text('ARALIN 3', 'LESSON 3')}</span>
            <h3>${text('Paniniwala at Pananampalataya', 'Beliefs and Faith')}</h3>
            <div class="teacher-detail-records">
                ${activityRecordLines(values, 3)}
                ${recordLine(
                    text('Pagkumpleto ng Aralin', 'Lesson Completion'),
                    lessonCompleted(values, 3) ? '✓' : '—'
                )}
            </div>
        </article>

        <article class="teacher-detail-card">
            <span>${text('PAGSUSULIT', 'EXAMINATION')}</span>
            <h3>${text('Unang Markahang Pagsusulit', 'First Quarter Examination')}</h3>
            <div class="teacher-detail-records">
                ${recordLine(
                    text('Kalagayan', 'Status'),
                    summary.examCompleted
                        ? text('Natapos', 'Completed')
                        : text('Hindi pa natapos', 'Not completed')
                )}
                ${recordLine(
                    text('Pinakamataas na Marka', 'Best Score'),
                    scoreText(summary.examBest, EXAM_MAX_SCORE)
                )}
                ${recordLine(
                    text('Pinakahuling Marka', 'Latest Score'),
                    scoreText(summary.examScore, EXAM_MAX_SCORE)
                )}
                ${recordLine(
                    text('Mga Pagsubok', 'Attempts'),
                    String(summary.examAttempts)
                )}
            </div>
        </article>
    `;

    studentDetailModal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeStudentDetail() {
    selectedStudentUid = null;
    studentDetailModal.hidden = true;
    document.body.style.overflow = '';
}


/* ==================== 10. REFRESH / LANGUAGE LISTENERS ==================== */

function showLoading() {
    teacherLoadingState.hidden = false;
    teacherErrorState.hidden = true;
    teacherDashboardContent.hidden = true;
}

function showDashboard() {
    teacherLoadingState.hidden = true;
    teacherErrorState.hidden = true;
    teacherDashboardContent.hidden = false;
}

function showError(error) {
    console.error('E-HISTORY Teacher Dashboard error:', error);

    teacherLoadingState.hidden = true;
    teacherDashboardContent.hidden = true;
    teacherErrorState.hidden = false;

    teacherErrorTitle.textContent = text(
        'Hindi ma-load ang live student records.',
        'Unable to load live student records.'
    );

    const code = error?.code || error?.message || 'UNKNOWN_ERROR';

    teacherErrorText.textContent = text(
        `Suriin ang Firestore Rules at Teacher role. Error: ${code}`,
        `Check the Firestore Rules and Teacher role. Error: ${code}`
    );
}

async function refreshDashboard() {
    showLoading();

    try {
        await loadStudentRecords();
        renderClassSummary();
        renderStudentList();
        showDashboard();
    } catch (error) {
        showError(error);
    }
}

teacherStudentSearch?.addEventListener('input', renderStudentList);
teacherStatusFilter?.addEventListener('change', renderStudentList);
teacherSortFilter?.addEventListener('change', renderStudentList);

teacherRefreshButton?.addEventListener('click', async () => {
    teacherRefreshButton.disabled = true;

    try {
        await refreshDashboard();
    } finally {
        teacherRefreshButton.disabled = false;
    }
});

document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-view-student]');

    if (viewButton) {
        openStudentDetail(viewButton.dataset.viewStudent);
        return;
    }

    if (event.target.closest('[data-close-student-modal]')) {
        closeStudentDetail();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !studentDetailModal.hidden) {
        closeStudentDetail();
    }
});

window.addEventListener('ehistory:languagechange', () => {
    applyDynamicPlaceholders();
    renderStudentList();

    if (selectedStudentUid) {
        openStudentDetail(selectedStudentUid);
    }
});


/* ==================== 11. INITIALIZATION ==================== */

async function initializeTeacherDashboard() {
    applyDynamicPlaceholders();
    showLoading();

    try {
        const allowed = await protectTeacherDashboard();

        if (!allowed) {
            return;
        }

        await refreshDashboard();
    } catch (error) {
        showError(error);
    }
}

initializeTeacherDashboard();
