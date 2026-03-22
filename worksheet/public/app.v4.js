console.log('IMEDIA GENIUS APP V4 LOADED — role-based access');

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile, sendEmailVerification, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp,
  collection, getDocs, query, orderBy
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-functions.js';
import { firebaseConfig } from './firebase-config.js';

// ─── Bootstrap ─────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = 'jconnolly@garibaldischool.co.uk';
const REGION      = 'europe-west2';

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const fns  = getFunctions(app, REGION);

const callSeedWorksheetBank        = httpsCallable(fns, 'seedWorksheetBank');
const callMarkWorksheetSubmission  = httpsCallable(fns, 'markWorksheetSubmission');
const callAdminListUsers           = httpsCallable(fns, 'adminListUsers');
const callAdminSetUserRole         = httpsCallable(fns, 'adminSetUserRole');
const callAdminGetSettings         = httpsCallable(fns, 'adminGetSettings');
const callAdminUpdateSettings      = httpsCallable(fns, 'adminUpdateSettings');
const callGetRegistrationSettings  = httpsCallable(fns, 'getRegistrationSettings');
const callValidateClassCode        = httpsCallable(fns, 'validateClassCode');
const callTeacherCreateClass       = httpsCallable(fns, 'teacherCreateClass');
const callTeacherGetDashboard      = httpsCallable(fns, 'teacherGetDashboard');
const callTeacherCreateAssignment  = httpsCallable(fns, 'teacherCreateAssignment');
const callTeacherDeleteAssignment  = httpsCallable(fns, 'teacherDeleteAssignment');
const callTeacherDeleteClass       = httpsCallable(fns, 'teacherDeleteClass');
const callStudentGetAssignments    = httpsCallable(fns, 'studentGetAssignments');
const callStudentUpdateClass       = httpsCallable(fns, 'studentUpdateClass');
const callStudentUpdateCamnatPin  = httpsCallable(fns, 'studentUpdateCamnatPin');
const callAdminDeleteUser         = httpsCallable(fns, 'adminDeleteUser');
const callCreateEngagementLaunchToken = httpsCallable(fns, 'createEngagementLaunchToken');
const callStudentGetEngagementSummary = httpsCallable(fns, 'studentGetEngagementSummary');
const callStudentGetBadges = httpsCallable(fns, 'studentGetBadges');
const callTeacherGetEngagementDashboard = httpsCallable(fns, 'teacherGetEngagementDashboard');
const callTeacherGetBadgeDashboard = httpsCallable(fns, 'teacherGetBadgeDashboard');
const callAdminUpdateUserName     = httpsCallable(fns, 'adminUpdateUserName');
const callStudentUpdateLastOpened  = httpsCallable(fns, 'studentUpdateLastOpened');

let registerRole = 'student';
const PENDING_TEACHER_ROLE = 'teacher_pending';

// ─── State ─────────────────────────────────────────────────────────────────────

const state = {
  currentUser:        null,
  currentUserProfile: null,
  strands:            [],
  filteredStrands:    [],
  progress:           null,
  activeStrandId:     null,
  route:              'home',
  teacherRows:        [],
  markingResults:     [],
  teacherAssignments: [],
  classOptions:       [],
  assignedTasks:      [],
  allowedDomains:     [],  // cached from Firestore for registration validation
  adminUsers:         [],
  teacherClasses:     [],
  teacherSelectedClassId: 'all',
  teacherSelectedRagClassId: 'all',
  engagementSelectedClassId: 'all',
  teacherSearchTerm:  '',
  teacherSortMode:    'name-asc',
  studentClassEditMode: false,
  studentCamnatPinEditMode: false,
  pendingRegistration: false,
  pendingRegistrationUid: '',
  registerInFlight: false,
  badges: null,
  teacherBadgeDashboard: null,
  teacherBadgeSearchTerm: '',
  teacherBadgeSortMode: 'badges-desc',
  teacherBadgeShowAll: false
};

// ─── DOM refs ──────────────────────────────────────────────────────────────────

const els = {
  alert:                   document.getElementById('alert'),
  homeView:                document.getElementById('homeView'),
  worksheetView:           document.getElementById('worksheetView'),
  teacherView:             document.getElementById('teacherView'),
  engagementView:          document.getElementById('engagementView'),
  adminView:               document.getElementById('adminView'),
  strandGrid:              document.getElementById('strandGrid'),
  worksheetContainer:      document.getElementById('worksheetContainer'),
  teacherStudents:         document.getElementById('teacherStudents'),
  teacherStrandBreakdown:  document.getElementById('teacherStrandBreakdown'),
  teacherClassList:        document.getElementById('teacherClassList'),
  teacherClassFilter:      document.getElementById('teacherClassFilter'),
  teacherClassSort:        document.getElementById('teacherClassSort'),
  teacherStudentSearch:    document.getElementById('teacherStudentSearch'),
  teacherCreateClassName:  document.getElementById('teacherCreateClassName'),
  btnTeacherCreateClass:   document.getElementById('btnTeacherCreateClass'),
  teacherAssignments:      document.getElementById('teacherAssignments'),
  studentAssignments:      document.getElementById('studentAssignments'),
  loggedInNavLinks:        document.getElementById('loggedInNavLinks'),
  btnSignIn:               document.getElementById('btnSignIn'),
  btnSignOut:              document.getElementById('btnSignOut'),
  btnEmailLogin:           document.getElementById('btnEmailLogin'),
  btnRegister:             document.getElementById('btnRegister'),
  btnRefreshTeacher:       document.getElementById('btnRefreshTeacher'),
  email:                   document.getElementById('email'),
  password:                document.getElementById('password'),
  displayName:             document.getElementById('displayName'),
  classCode:               document.getElementById('classCode'),
  searchStrands:           document.getElementById('searchStrands'),
  metricTotalStrands:      document.getElementById('metricTotalStrands'),
  metricCompleted:         document.getElementById('metricCompleted'),
  metricAverage:           document.getElementById('metricAverage'),
  teacherStudentCount:     document.getElementById('teacherStudentCount'),
  teacherSubmissionCount:  document.getElementById('teacherSubmissionCount'),
  teacherAverageScore:     document.getElementById('teacherAverageScore'),
  teacherCompletionRate:   document.getElementById('teacherCompletionRate'),
  studentClassPanel:       document.getElementById('studentClassPanel'),
  studentClassName:        document.getElementById('studentClassName'),
  studentClassCodeDisplay: document.getElementById('studentClassCodeDisplay'),
  studentTeacherName:      document.getElementById('studentTeacherName'),
  studentClassEditWrap:    document.getElementById('studentClassEditWrap'),
  studentClassCodeInput:   document.getElementById('studentClassCodeInput'),
  btnEditStudentClass:     document.getElementById('btnEditStudentClass'),
  btnSaveStudentClass:     document.getElementById('btnSaveStudentClass'),
  btnCancelStudentClass:   document.getElementById('btnCancelStudentClass'),
  studentCamnatPinPanel:   document.getElementById('studentCamnatPinPanel'),
  studentCamnatPinDisplay: document.getElementById('studentCamnatPinDisplay'),
  studentCamnatPinStatus:  document.getElementById('studentCamnatPinStatus'),
  studentCamnatPinEditWrap:document.getElementById('studentCamnatPinEditWrap'),
  studentCamnatPinInput:   document.getElementById('studentCamnatPinInput'),
  btnEditStudentCamnatPin: document.getElementById('btnEditStudentCamnatPin'),
  btnSaveStudentCamnatPin: document.getElementById('btnSaveStudentCamnatPin'),
  btnClearStudentCamnatPin:document.getElementById('btnClearStudentCamnatPin'),
  btnCancelStudentCamnatPin: document.getElementById('btnCancelStudentCamnatPin'),
  teacherRagSheet:         document.getElementById('teacherRagSheet'),
  teacherRagSummary:       document.getElementById('teacherRagSummary'),
  teacherRagClassFilter:   document.getElementById('teacherRagClassFilter'),
  teacherAssignClass:      document.getElementById('teacherAssignClass'),
  teacherAssignStrand:     document.getElementById('teacherAssignStrand'),
  teacherAssignDeadline:   document.getElementById('teacherAssignDeadline'),
  btnTeacherAssignTask:    document.getElementById('btnTeacherAssignTask'),
  // Admin DOM refs
  adminUserList:           document.getElementById('adminUserList'),
  adminUserSearch:         document.getElementById('adminUserSearch'),
  adminDomainList:         document.getElementById('adminDomainList'),
  adminNewDomain:          document.getElementById('adminNewDomain'),
  btnAdminAddDomain:       document.getElementById('btnAdminAddDomain'),
  btnAdminSeedWorksheets:  document.getElementById('btnAdminSeedWorksheets'),
  btnRefreshAdmin:         document.getElementById('btnRefreshAdmin'),
  adminUserCount:          document.getElementById('adminUserCount'),
  adminTeacherCount:       document.getElementById('adminTeacherCount'),
  adminStudentCount:       document.getElementById('adminStudentCount'),
  adminApprovalBanner:     document.getElementById('adminApprovalBanner'),
  adminPendingCountBadge:  document.getElementById('adminPendingCountBadge'),
  adminPendingApprovals:   document.getElementById('adminPendingApprovals'),
  loggedOutHero:           document.getElementById('loggedOutHero'),
  loggedInHero:            document.getElementById('loggedInHero'),
  progressSummary:         document.getElementById('progressSummary'),
  onboardingNudge:         document.getElementById('onboardingNudge'),
  previewGrid:             document.getElementById('previewGrid'),
  lastSeededNote:          document.getElementById('lastSeededNote'),
  domainWarning:           document.getElementById('domainWarning'),
  sidebarAssignedNav:      document.getElementById('sidebarAssignedNav'),
  sidebarAssignedLinks:    document.getElementById('sidebarAssignedLinks'),
  studentEngagementBoard:  document.getElementById('studentEngagementBoard'),
  studentEngagementRank:   document.getElementById('studentEngagementRank'),
  studentEngagementSummary:document.getElementById('studentEngagementSummary'),
  studentEngagementRecent: document.getElementById('studentEngagementRecent'),
  studentEngagementLeaderboard: document.getElementById('studentEngagementLeaderboard'),
  studentEngagementClassLeaderboard: document.getElementById('studentEngagementClassLeaderboard'),
  studentEngagementClassRank: document.getElementById('studentEngagementClassRank'),
  studentBadgesCard:       document.getElementById('studentBadgesCard'),
  studentBadges:           document.getElementById('studentBadges'),
  teacherBadgeMeta:        document.getElementById('teacherBadgeMeta'),
  teacherBadgeSummary:     document.getElementById('teacherBadgeSummary'),
  teacherBadgeLeaderboard: document.getElementById('teacherBadgeLeaderboard'),
  teacherBadgeClasses:     document.getElementById('teacherBadgeClasses'),
  teacherBadgeStudents:    document.getElementById('teacherBadgeStudents'),
  teacherBadgeFollowUp:    document.getElementById('teacherBadgeFollowUp'),
  teacherBadgeStudentSearch: document.getElementById('teacherBadgeStudentSearch'),
  teacherBadgeStudentSort: document.getElementById('teacherBadgeStudentSort'),
  teacherBadgeStudentSummary: document.getElementById('teacherBadgeStudentSummary'),
  btnTeacherBadgeToggleAll: document.getElementById('btnTeacherBadgeToggleAll'),
  teacherEngagementBoard:  document.getElementById('teacherEngagementBoard'),
  teacherEngagementMeta:   document.getElementById('teacherEngagementMeta'),
  teacherEngagementSummary:document.getElementById('teacherEngagementSummary'),
  teacherEngagementRecent: document.getElementById('teacherEngagementRecent'),
  teacherEngagementLeaderboard: document.getElementById('teacherEngagementLeaderboard'),
  teacherEngagementTopPages: document.getElementById('teacherEngagementTopPages'),
  teacherEngagementClasses: document.getElementById('teacherEngagementClasses'),
  teacherEngagementFollowUp: document.getElementById('teacherEngagementFollowUp'),
  teacherEngagementParticipation: document.getElementById('teacherEngagementParticipation'),
  teacherEngagementPageWatch: document.getElementById('teacherEngagementPageWatch'),
  engagementClassFilter:    document.getElementById('engagementClassFilter'),
  btnRefreshEngagement:     document.getElementById('btnRefreshEngagement'),
  btnOpenEngagementDashboard: document.getElementById('btnOpenEngagementDashboard'),
  studentTrackingNotice:    document.getElementById('studentTrackingNotice'),
  studentTrackingNoticeHideFuture: document.getElementById('studentTrackingNoticeHideFuture'),
  btnStudentTrackingNoticeClose: document.getElementById('btnStudentTrackingNoticeClose'),
  btnStudentTrackingNoticeR093: document.getElementById('btnStudentTrackingNoticeR093'),
  // Task notifications
  taskNotifications:    document.getElementById('taskNotifications'),
  navTaskBadge:         document.getElementById('navTaskBadge'),
};

const STUDENT_TRACKING_NOTICE_KEY = 'imediagenius_hide_tracking_notice_v1';

// ─── Utilities ─────────────────────────────────────────────────────────────────

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function normaliseText(value = '') {
  return String(value).toLowerCase()
    .replace(/&/g, ' and ').replace(/[^a-z0-9%\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function showAlert(message, level = 'good') {
  els.alert.innerHTML = `<div class="alert ${level}">${escapeHtml(message)}</div>`;
  window.clearTimeout(showAlert._t);
  showAlert._t = window.setTimeout(() => { els.alert.innerHTML = ''; }, 5000);
}

function setRegisterButtonBusy(isBusy) {
  if (!els.btnRegister) return;
  if (!els.btnRegister.dataset.defaultLabel) {
    els.btnRegister.dataset.defaultLabel = (els.btnRegister.textContent || 'Create account').trim();
  }
  els.btnRegister.disabled = !!isBusy;
  els.btnRegister.setAttribute('aria-disabled', isBusy ? 'true' : 'false');
  els.btnRegister.textContent = isBusy ? 'Creating account…' : els.btnRegister.dataset.defaultLabel;
}



function hideStudentTrackingNotice(savePreference = false) {
  if (savePreference && els.studentTrackingNoticeHideFuture?.checked) {
    try { localStorage.setItem(STUDENT_TRACKING_NOTICE_KEY, '1'); } catch (_) {}
  }
  if (els.studentTrackingNoticeHideFuture) els.studentTrackingNoticeHideFuture.checked = false;
  if (els.studentTrackingNotice) {
    els.studentTrackingNotice.classList.add('hidden');
    els.studentTrackingNotice.style.display = 'none';
  }
}

function showStudentTrackingNotice() {
  if (!els.studentTrackingNotice || !state.currentUser || !isStudent()) return;
  try {
    if (localStorage.getItem(STUDENT_TRACKING_NOTICE_KEY) === '1') return;
  } catch (_) {}
  if (els.studentTrackingNoticeHideFuture) els.studentTrackingNoticeHideFuture.checked = false;
  els.studentTrackingNotice.classList.remove('hidden');
  els.studentTrackingNotice.style.display = 'flex';
}

function maybeShowStudentTrackingNotice() {
  if (!state.currentUser || !isStudent()) {
    hideStudentTrackingNotice(false);
    return;
  }
  window.setTimeout(() => {
    if (state.currentUser && isStudent()) showStudentTrackingNotice();
  }, 350);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDeadline(deadline = '') {
  if (!deadline) return 'No deadline';
  const d = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(d.getTime())) return deadline;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function deadlineTone(deadline = '') {
  const due = String(deadline || '').slice(0, 10);
  if (!due) return 'badge';
  const today = todayIsoDate();
  if (due < today) return 'badge danger';
  if (due === today) return 'badge warn';
  return 'badge good';
}


function formatDateTime(value) {
  if (!value) return '—';
  const d = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function minutesFromSeconds(value) {
  const secs = Math.max(0, Number(value || 0));
  return Math.max(0, Math.round(secs / 60));
}

function formatRecentActivityLabel(item = {}) {
  const payload = item.payload || {};
  if (item.eventType === 'page_view') return `Visited ${item.pageTitle || item.pagePath || 'page'}`;
  if (item.eventType === 'content_interaction') {
    const kind = payload.interactionCategory === 'video_link' ? 'Clicked video link'
      : payload.interactionCategory === 'audio_link' ? 'Clicked podcast/audio link'
      : payload.interactionCategory === 'game_interaction' ? 'Opened game or activity'
      : payload.interactionCategory === 'assessment_interaction' ? 'Attempted quiz or assessment'
      : 'Interacted with page content';
    return `${kind}${item.pageTitle ? ` · ${item.pageTitle}` : ''}`;
  }
  if (item.eventType === 'page_heartbeat') return `Spent time on ${item.pageTitle || item.pagePath || 'page'}`;
  if (item.eventType === 'page_exit') return `Left ${item.pageTitle || item.pagePath || 'page'}`;
  return `${String(item.eventType || 'activity').replaceAll('_', ' ')}${item.pageTitle ? ` · ${item.pageTitle}` : ''}`;
}


function isAssignedToStudent(strandId) {
  if (!isStudent()) return true;
  return state.assignedTasks.some((task) => task.strandId === strandId);
}

const role = () => state.currentUserProfile?.role || null;
const isAdmin   = () => role() === 'admin';
const isTeacher = () => role() === 'teacher';
const isStudent = () => role() === 'student';
const isPendingTeacher = () => role() === PENDING_TEACHER_ROLE;

// ─── Role-based nav visibility ─────────────────────────────────────────────────

function updateNavVisibility() {
  const r = role();

  // Each nav button has data-roles="admin,teacher" etc.
  document.querySelectorAll('.nav-btn[data-roles]').forEach((btn) => {
    const allowed = btn.dataset.roles.split(',');
    const visible = r && allowed.includes(r);
    btn.style.display = visible ? '' : 'none';
  });

  // Auth section only shown when signed out
  const authPanel = document.getElementById('authPanel');
  if (authPanel) authPanel.style.display = state.currentUser ? 'none' : '';

  // Sidebar assigned nav — student only when logged in
  if (els.sidebarAssignedNav) {
    els.sidebarAssignedNav.style.display = (r === 'student') ? '' : 'none';
  }

  // Search only shown to students
  const searchBlock = document.getElementById('searchBlock');
  if (searchBlock) searchBlock.style.display = (r === 'student') ? '' : 'none';

  // Logged-in sidebar links for all signed-in users
  if (els.loggedInNavLinks) {
    els.loggedInNavLinks.classList.toggle('hidden', !state.currentUser);
  }

  // Role badge in header
  renderRoleBadge();
}

function renderRoleBadge() {
  const badge = document.getElementById('roleBadge');
  if (!badge) return;
  if (!state.currentUser) { badge.innerHTML = ''; return; }
  const r = role() || 'student';
  const colours = { admin: 'badge-admin', teacher: 'badge-teacher', student: 'badge-student' };
  badge.innerHTML = `<span class="role-badge ${colours[r]}">${r.charAt(0).toUpperCase() + r.slice(1)}</span>`;
}

// ─── Route ─────────────────────────────────────────────────────────────────────

const ROUTE_TITLES = {
  home:      'Student Home | iMedia Genius',
  worksheet: 'Worksheet | iMedia Genius',
  teacher:   'Teacher Dashboard | iMedia Genius',
  engagement:'Engagement Dashboard | iMedia Genius',
  admin:     'Admin Panel | iMedia Genius',
};

function setRoute(newRoute) {
  state.route = newRoute;
  document.title = ROUTE_TITLES[newRoute] || 'iMedia Genius Worksheets';
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-route="${newRoute}"]`)?.classList.add('active');
  if (newRoute === 'home')      els.homeView?.classList.add('active');
  if (newRoute === 'worksheet') els.worksheetView?.classList.add('active');
  if (newRoute === 'teacher')   els.teacherView?.classList.add('active');
  if (newRoute === 'engagement') els.engagementView?.classList.add('active');
  if (newRoute === 'admin')     els.adminView?.classList.add('active');
}

// ─── Auth redirect helpers ─────────────────────────────────────────────────────

function renderAuthRequired(title = 'Sign in required', msg = 'Please sign in.') {
  return `<div class="card" style="padding:28px;">
    <p class="eyebrow">Secure access</p>
    <h2>${escapeHtml(title)}</h2>
    <p class="subtle">${escapeHtml(msg)}</p>
    <div class="stack-inline" style="margin-top:14px;">
      <button id="btnJumpToLogin" class="btn primary" type="button">Go to sign in</button>
    </div>
  </div>`;
}

function renderAccessDenied(requiredRole) {
  return `<div class="card" style="padding:28px;">
    <p class="eyebrow">Access denied</p>
    <h2>This area requires ${escapeHtml(requiredRole)} access</h2>
    <p class="subtle">Your account does not have permission to view this page. 
       Contact your administrator if you believe this is an error.</p>
  </div>`;
}

function wireJumpToLogin() {
  document.getElementById('btnJumpToLogin')?.addEventListener('click', () => {
    document.getElementById('authPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ─── Student metrics ───────────────────────────────────────────────────────────

function updateStudentMetrics() {
  const rows = Object.values(state.progress?.strands || {});
  const completed = rows.filter((r) => r.completed).length;
  const started   = rows.filter((r) => r.startedAt && !r.completed).length;
  const total     = state.strands.length || 35;
  const average = rows.length
    ? Math.round(rows.reduce((s, r) => s + (r.score || 0), 0) / rows.length) : 0;
  els.metricCompleted.textContent = String(completed);
  els.metricAverage.textContent = `${average}%`;

  if (els.progressSummary) {
    const pct = total ? Math.round((completed / total) * 100) : 0;
    const startedPct = total ? Math.round(((completed + started) / total) * 100) : 0;
    if (completed === 0 && started === 0) {
      els.progressSummary.innerHTML = '';
      return;
    }
    els.progressSummary.innerHTML = `
      <div class="progress-bar-row">
        <div class="progress-bar-track">
          <div class="progress-bar-fill progress-bar-started" style="width:${startedPct}%"></div>
          <div class="progress-bar-fill progress-bar-done" style="width:${pct}%"></div>
        </div>
        <span class="small subtle">${completed} of ${total} completed${started ? ` · ${started} in progress` : ''}</span>
      </div>`;
  }
}

// ─── Strands ───────────────────────────────────────────────────────────────────

async function loadStrands() {
  let rows = [];
  if (state.currentUser) {
    try {
      const snap = await getDocs(query(collection(db, 'tasks'), orderBy('topicNumber', 'asc')));
      rows = snap.docs.map((d) => d.data());
    } catch { /* fallback below */ }
  }
  if (!rows.length) {
    const res = await fetch('./data/strands.public.json');
    rows = await res.json();
  }
  state.strands = rows;
  state.filteredStrands = isStudent() ? rows.filter((s) => isAssignedToStudent(s.id)) : [...rows];
  els.metricTotalStrands.textContent = String(rows.length || 35);
}

function updateStudentBadgesVisibility() {
  const show = !!state.currentUser && isStudent();
  if (els.studentBadgesCard) els.studentBadgesCard.style.display = show ? '' : 'none';
}

function renderPreviewGrid() {
  if (!els.previewGrid) return;
  const preview = state.strands.slice(0, 6);
  if (!preview.length) { els.previewGrid.innerHTML = ''; return; }
  els.previewGrid.innerHTML = preview.map((strand) => `
    <article class="preview-strand-card">
      <div class="preview-lock">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
      </div>
      <div class="preview-content">
        <span class="badge">${escapeHtml(strand.code)}</span>
        <h3>${escapeHtml(strand.title)}</h3>
        <p class="subtle">${escapeHtml(strand.summary)}</p>
      </div>
    </article>`).join('');
}

function renderStrands() {
  if (!state.currentUser) {
    updateStudentBadgesVisibility();
    // Show logged-out landing, hide logged-in hero
    els.loggedOutHero?.classList.remove('hidden');
    els.loggedInHero?.classList.add('hidden');
    renderPreviewGrid();
    els.strandGrid.innerHTML = '';
    return;
  }
  // Show logged-in hero, hide logged-out
  updateStudentBadgesVisibility();
  els.loggedOutHero?.classList.add('hidden');
  els.loggedInHero?.classList.remove('hidden');

  if (!isStudent() && !isAdmin()) {
    els.strandGrid.innerHTML = renderAccessDenied('student'); return;
  }

  if (isStudent()) {
    els.strandGrid.innerHTML = '';
    return;
  }

  const visibleStrands = state.filteredStrands;
  const rows = visibleStrands.map((strand) => {
    const prog  = state.progress?.strands?.[strand.id];
    const score = prog?.score || 0;
    const label = prog?.completed ? 'Completed' : prog?.startedAt ? 'In progress' : 'Not started';
    const cls   = prog?.completed ? 'good' : prog?.startedAt ? 'warn' : '';
    return `<article class="strand-card card">
      <div class="badge-row">
        <span class="badge">${escapeHtml(strand.code)}</span>
        <span class="badge ${cls}">${label}</span>
      </div>
      <div>
        <h3>${escapeHtml(strand.title)}</h3>
        <p class="subtle">${escapeHtml(strand.summary)}</p>
      </div>
      <div class="chip-row">
        ${(strand.tags || []).slice(0, 3).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div>
        <div class="small subtle">Score</div>
        <div class="progressbar"><span style="width:${score}%"></span></div>
        <div class="small subtle" style="margin-top:6px;">${score}% · ${(strand.questions || []).length} questions</div>
      </div>
      <button class="btn primary" data-open-strand="${escapeHtml(strand.id)}">Open worksheet</button>
    </article>`;
  }).join('');

  const emptyMessage = 'No strands matched your search.';
  els.strandGrid.innerHTML = rows || `<div class="card" style="padding:18px;">${escapeHtml(emptyMessage)}</div>`;
  document.querySelectorAll('[data-open-strand]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeStrandId = btn.dataset.openStrand;
      setRoute('worksheet');
      renderWorksheet();
    });
  });
}

// ─── Worksheet ─────────────────────────────────────────────────────────────────

function renderQuestionInput(question, existing) {
  if (question.type === 'mcq') {
    return (question.options || []).map((opt) =>
      `<label class="option"><input type="radio" name="${question.id}" value="${escapeHtml(opt)}" ${existing === opt ? 'checked' : ''} /><span>${escapeHtml(opt)}</span></label>`
    ).join('');
  }
  if (question.type === 'multi_select') {
    const vals = Array.isArray(existing) ? existing : [];
    return (question.options || []).map((opt) =>
      `<label class="option"><input type="checkbox" name="${question.id}" value="${escapeHtml(opt)}" ${vals.includes(opt) ? 'checked' : ''} /><span>${escapeHtml(opt)}</span></label>`
    ).join('');
  }
  return `<textarea name="${question.id}" placeholder="Type your answer here...">${escapeHtml(existing || '')}</textarea>`;
}

function renderWorksheet() {
  if (!state.currentUser) {
    els.worksheetContainer.innerHTML = renderAuthRequired('Worksheet locked', 'Students must sign in to open worksheets.');
    wireJumpToLogin(); return;
  }
  if (!isStudent() && !isAdmin()) {
    els.worksheetContainer.innerHTML = renderAccessDenied('student'); return;
  }

  const strand = state.strands.find((s) => s.id === state.activeStrandId) || state.strands[0];
  if (!strand) {
    els.worksheetContainer.innerHTML = '<div class="card" style="padding:18px;">No worksheet available yet.</div>';
    return;
  }
  state.activeStrandId = strand.id;
  const saved   = state.progress?.strands?.[strand.id];
  const answers = saved?.answers || {};
  const result  = saved?.lastResult || null;
  const assignedTask = (state.assignedTasks || []).find((task) => task.strandId === strand.id) || null;
  if (isStudent() && !assignedTask) {
    els.worksheetContainer.innerHTML = `
      <div class="card" style="padding:24px;">
        <h3>This worksheet is not currently assigned</h3>
        <p class="subtle">Students can only open worksheets that have been assigned by their teacher.</p>
      </div>`;
    return;
  }

  // Track that the student has opened this worksheet (updates lastOpenedAt + ensures startedAt)
  if (isStudent() && state.activeStrandId) {
    callStudentUpdateLastOpened({ strandId: strand.id }).catch(() => {/* non-critical */});
    // Optimistically update local progress so inProgress badge shows immediately
    if (state.progress && strand.id) {
      const sp = state.progress.strands || {};
      if (!sp[strand.id]?.startedAt) {
        state.progress = {
          ...state.progress,
          strands: {
            ...sp,
            [strand.id]: {
              ...(sp[strand.id] || {}),
              strandId: strand.id,
              startedAt: sp[strand.id]?.startedAt || new Date().toISOString(),
              lastOpenedAt: new Date().toISOString()
            }
          }
        };
        // Refresh sidebar and notifications without a full reload
        renderSidebarAssignedLinks();
        renderTaskNotifications();
        updateNavTaskBadge();
      }
    }
  }

  els.worksheetContainer.innerHTML = `
    <div class="worksheet-shell">
      <section class="worksheet-header card">
        <div class="split-head">
          <div>
            <p class="eyebrow">${escapeHtml(strand.code)}</p>
            <h2>${escapeHtml(strand.title)}</h2>
            <p class="subtle">Source: <a href="${escapeHtml(strand.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(strand.sourceUrl)}</a></p>
            ${assignedTask ? `<p class="small subtle" style="margin-top:8px;">Assigned for ${escapeHtml(assignedTask.className || assignedTask.classCode || '')} · Deadline ${escapeHtml(formatDeadline(assignedTask.deadline))}</p>` : ''}
            <p>${escapeHtml(strand.summary)}</p>
          </div>
          <div class="metric-card"><span>Latest score</span><strong>${saved?.score || 0}%</strong></div>
        </div>
      </section>
      <section class="worksheet-body card">
        <h3>Read first</h3>
        ${(strand.reading || []).map((b) => `
          <div class="reading-block">
            <h4>${escapeHtml(b.heading)}</h4>
            <p>${escapeHtml(b.body)}</p>
            ${b.bullets?.length ? `<ul>${b.bullets.map((bl) => `<li>${escapeHtml(bl)}</li>`).join('')}</ul>` : ''}
          </div>`).join('')}
      </section>
      <form id="worksheetForm" class="worksheet-body card">
        <h3>Complete the worksheet</h3>
        <p class="small subtle">Marking runs server-side — answer keys are never exposed in the browser.</p>
        ${(strand.questions || []).map((q, i) => `
          <div class="question-block">
            <div class="badge-row">
              <span class="badge">Q${i + 1}</span>
              <span class="badge">${q.marks} mark${q.marks === 1 ? '' : 's'}</span>
              <span class="badge">${escapeHtml(q.type)}</span>
            </div>
            <div><strong>${escapeHtml(q.prompt)}</strong></div>
            <div class="small subtle">${escapeHtml(q.hint || '')}</div>
            <div>${renderQuestionInput(q, answers[q.id])}</div>
          </div>`).join('')}
        <div class="stack-inline">
          <button type="submit" class="btn primary">Mark worksheet</button>
          <button id="btnSaveDraft" type="button" class="btn">Save draft</button>
        </div>
      </form>
      ${result ? `
        <section class="worksheet-body card">
          <h3>Latest feedback</h3>
          <div class="hero-metrics">
            <div class="metric-card"><span>Marks</span><strong>${result.totalAwarded}/${result.totalMarks}</strong></div>
            <div class="metric-card"><span>Score</span><strong>${result.percentage}%</strong></div>
            <div class="metric-card"><span>Weak areas</span><strong>${result.weakAreas?.length || 0}</strong></div>
          </div>
          ${result.results.map((row) => `
            <div class="question-block" style="margin-top:10px;">
              <div class="badge-row">
                <span class="badge ${row.awarded === row.maxMarks ? 'good' : 'warn'}">${row.awarded}/${row.maxMarks}</span>
                <span class="badge">Confidence ${Math.round((row.confidence || 0) * 100)}%</span>
              </div>
              <div><strong>${escapeHtml(row.prompt)}</strong></div>
              <div class="small subtle">Your answer: ${escapeHtml(Array.isArray(row.answer) ? row.answer.join(', ') : row.answer || '—')}</div>
              <div>${escapeHtml(row.feedback)}</div>
            </div>`).join('')}
        </section>` : ''}
    </div>`;

  document.getElementById('worksheetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const ans = readFormAnswers(strand);
      const res = await callMarkWorksheetSubmission({ strandId: strand.id, answers: ans, submit: true });
      await loadProgress(); await loadStudentAssignments(); renderStrands(); renderWorksheet(); renderSidebarAssignedLinks();
      showAlert(`Worksheet marked. Score: ${res.data.result.percentage}%`, 'good');
    } catch (err) { showAlert(err.message || 'Unable to mark worksheet.', 'error'); }
  });

  document.getElementById('btnSaveDraft')?.addEventListener('click', async () => {
    try {
      const ans = readFormAnswers(strand);
      await callMarkWorksheetSubmission({ strandId: strand.id, answers: ans, submit: false });
      await loadProgress(); await loadStudentAssignments(); renderStrands(); renderWorksheet();
      showAlert('Draft saved.', 'good');
    } catch (err) { showAlert(err.message || 'Unable to save draft.', 'error'); }
  });
}

function readFormAnswers(strand) {
  const answers = {};
  for (const q of strand.questions) {
    if (q.type === 'mcq') {
      answers[q.id] = document.querySelector(`input[name="${q.id}"]:checked`)?.value || '';
    } else if (q.type === 'multi_select') {
      answers[q.id] = [...document.querySelectorAll(`input[name="${q.id}"]:checked`)].map((n) => n.value);
    } else {
      answers[q.id] = document.querySelector(`[name="${q.id}"]`)?.value || '';
    }
  }
  return answers;
}

// ─── Teacher dashboard ─────────────────────────────────────────────────────────

async function loadTeacherDashboard() {
  if (!state.currentUser || (!isTeacher() && !isAdmin())) {
    els.teacherStudents.innerHTML = renderAccessDenied('teacher');
    els.teacherStrandBreakdown.innerHTML = '';
    if (els.teacherAssignments) els.teacherAssignments.innerHTML = '';
    if (els.teacherClassList) els.teacherClassList.innerHTML = '';
    ['teacherStudentCount','teacherSubmissionCount','teacherAverageScore','teacherCompletionRate']
      .forEach((k) => { if (els[k]) els[k].textContent = '—'; });
    state.teacherBadgeDashboard = null;
    renderTeacherBadgeDashboard();
    return;
  }

  const res = await callTeacherGetDashboard({});
  await loadTeacherBadgeDashboard();
  const progressRows = res.data.progressRows || [];
  const submissionRows = res.data.submissionRows || [];
  const students = res.data.students || [];
  const progressMap = new Map(progressRows.map((row) => [row.userId, row]));
  state.teacherRows = students.map((student) => ({ ...student, strands: (progressMap.get(student.uid) || {}).strands || {} }));
  state.markingResults = submissionRows;
  state.teacherAssignments = res.data.assignments || [];
  state.classOptions = res.data.classOptions || [];
  state.teacherClasses = res.data.teacherClasses || res.data.classOptions || [];

  if (els.teacherAssignClass) {
    const opts = state.classOptions.map((row) => `<option value="${escapeHtml(row.classCode)}" data-name="${escapeHtml(row.className || row.classCode)}">${escapeHtml(row.className || row.classCode)} (${row.count})</option>`).join('');
    els.teacherAssignClass.innerHTML = opts ? `<option value="">Choose class</option>${opts}` : '<option value="">No classes found</option>';
  }
  if (els.teacherClassFilter) {
    const opts = state.classOptions.map((row) => `<option value="${escapeHtml(row.classCode)}">${escapeHtml(row.className || row.classCode)} (${row.count})</option>`).join('');
    els.teacherClassFilter.innerHTML = `<option value="all">All classes</option>${opts}`;
    els.teacherClassFilter.value = state.teacherSelectedClassId || 'all';
  }
  if (els.teacherRagClassFilter) {
    const opts = state.classOptions.map((row) => `<option value="${escapeHtml(row.classCode)}">${escapeHtml(row.className || row.classCode)} (${row.count})</option>`).join('');
    els.teacherRagClassFilter.innerHTML = `<option value="all">All classes</option>${opts}`;
    els.teacherRagClassFilter.value = state.teacherSelectedRagClassId || state.teacherSelectedClassId || 'all';
  }
  if (els.teacherAssignStrand) {
    els.teacherAssignStrand.innerHTML = state.strands.map((strand) => `<option value="${escapeHtml(strand.id)}">${escapeHtml(strand.code)} · ${escapeHtml(strand.title)}</option>`).join('');
  }

  const filteredStudents = getTeacherDashboardStudents();
  const teacherSearchActive = !!normaliseText(state.teacherSearchTerm || '');
  const visibleStudents = teacherSearchActive ? filteredStudents : filteredStudents.slice(0, 5);
  const teacherStudentIntro = filteredStudents.length
    ? `<div class="small subtle" style="margin-bottom:12px;">${teacherSearchActive ? `Showing ${visibleStudents.length} student${visibleStudents.length === 1 ? '' : 's'} matching your search.` : `Showing the first ${visibleStudents.length} student${visibleStudents.length === 1 ? '' : 's'}. Use the search box to find a specific student.`}</div>`
    : '';
  els.teacherStudents.innerHTML = teacherStudentIntro + (visibleStudents.map((student) => {
    const sr = Object.values(student.strands || {});
    const completed = sr.filter((s) => s.completed).length;
    const average = sr.length ? Math.round(sr.reduce((sum, item) => sum + (item.score || 0), 0) / sr.length) : 0;
    return `<div class="teacher-row">
      <strong>${escapeHtml(student.displayName || student.email || student.uid)}</strong>
      <div class="small subtle">${escapeHtml(student.email || '')}</div>
      <div class="small subtle">${escapeHtml(student.className || student.classCode || 'No class')}</div>
      <div class="badge-row" style="margin-top:8px;">
        <span class="badge">Completed ${completed}</span>
        <span class="badge">Average ${average}%</span>
      </div>
    </div>`;
  }).join('')) || '<p class="subtle">No students linked to your classes yet.</p>';

  const strandSummary = {};
  for (const row of filteredStudents) {
    for (const s of Object.values(row.strands || {})) {
      if (!strandSummary[s.strandId]) strandSummary[s.strandId] = { title: s.title, attempts: 0, completed: 0, totalScore: 0 };
      strandSummary[s.strandId].attempts += 1;
      strandSummary[s.strandId].totalScore += s.score || 0;
      if (s.completed) strandSummary[s.strandId].completed += 1;
    }
  }
  els.teacherStrandBreakdown.innerHTML = Object.values(strandSummary)
    .sort((a, b) => b.attempts - a.attempts || a.title.localeCompare(b.title))
    .map((row) => {
      const avg = row.attempts ? Math.round(row.totalScore / row.attempts) : 0;
      return `<div class="teacher-row"><strong>${escapeHtml(row.title)}</strong><div class="badge-row" style="margin-top:8px;"><span class="badge">Attempts ${row.attempts}</span><span class="badge">Completed ${row.completed}</span><span class="badge">Average ${avg}%</span></div></div>`;
    }).join('') || '<p class="subtle">No strand data yet.</p>';

  if (els.teacherAssignments) {
    const classFilter = state.teacherSelectedClassId || 'all';
    const assignmentRows = classFilter === 'all' ? state.teacherAssignments : state.teacherAssignments.filter((assignment) => (assignment.classCode || '') === classFilter);
    els.teacherAssignments.innerHTML = assignmentRows.map((assignment) => `<article class="assignment-card"><div><div class="badge-row"><span class="badge">${escapeHtml(assignment.className || assignment.classCode || '')}</span><span class="badge">${escapeHtml(assignment.strandCode || '')}</span><span class="${deadlineTone(assignment.deadline)}">Due ${escapeHtml(formatDeadline(assignment.deadline))}</span><span class="badge ${assignment.pendingCount ? 'warn' : 'good'}">${assignment.completedCount}/${assignment.targetCount} complete</span></div><strong style="display:block; margin-top:8px;">${escapeHtml(assignment.strandTitle || assignment.strandId)}</strong><div class="small subtle">${assignment.pendingCount} not completed · ${(assignment.studentStatus || []).filter((s) => s.inProgress).length} in progress · ${assignment.completedCount} done</div><div class="assignment-students">${(assignment.studentStatus || []).map((student) => `<span class="chip ${student.completed ? 'chip-good' : (student.inProgress ? 'chip-progress' : 'chip-warn')}">${escapeHtml(student.displayName)}${student.completed ? ` · ${student.score ?? 0}%` : student.inProgress ? ' · in progress' : ' · not started'}</span>`).join('') || '<span class="small subtle">No students matched this class yet.</span>'}</div></div><div><button class="btn btn-delete-assignment" data-assignment-id="${escapeHtml(assignment.id)}">Remove</button></div></article>`).join('') || '<p class="subtle">No class tasks assigned yet.</p>';
    document.querySelectorAll('.btn-delete-assignment').forEach((btn) => btn.addEventListener('click', async () => {
      try {
        btn.disabled = true;
        await callTeacherDeleteAssignment({ assignmentId: btn.dataset.assignmentId });
        await loadTeacherDashboard();
        showAlert('Assignment removed.', 'good');
      } catch (err) {
        showAlert(err.message || 'Unable to remove assignment.', 'error');
      } finally {
        btn.disabled = false;
      }
    }));
  }

  renderTeacherClassList(state.teacherClasses);
  const ragClassFilter = state.teacherSelectedRagClassId || 'all';
  const ragStudents = ragClassFilter === 'all' ? filteredStudents : filteredStudents.filter((row) => (row.classCode || '') === ragClassFilter);
  renderTeacherRagSheet(ragStudents.map((row) => ({ userId: row.uid, strands: row.strands || {} })), ragStudents);

  const selectedClass = state.teacherSelectedClassId || 'all';
  const filteredSubmissionRows = selectedClass === 'all' ? submissionRows : submissionRows.filter((row) => {
    const student = state.teacherRows.find((item) => item.uid === row.userId);
    return (student?.classCode || '') === selectedClass;
  });
  const filteredAssignments = selectedClass === 'all' ? state.teacherAssignments : state.teacherAssignments.filter((row) => (row.classCode || '') === selectedClass);

  els.teacherStudentCount.textContent = String(filteredStudents.length);
  els.teacherSubmissionCount.textContent = String(filteredSubmissionRows.length);
  const avgScore = filteredSubmissionRows.length ? Math.round(filteredSubmissionRows.reduce((sum, row) => sum + (row.result?.percentage || 0), 0) / filteredSubmissionRows.length) : 0;
  els.teacherAverageScore.textContent = `${avgScore}%`;
  const totalAssignedTargets = filteredAssignments.reduce((sum, row) => sum + (row.targetCount || 0), 0);
  const totalAssignedCompleted = filteredAssignments.reduce((sum, row) => sum + (row.completedCount || 0), 0);
  els.teacherCompletionRate.textContent = totalAssignedTargets ? `${Math.round((totalAssignedCompleted / totalAssignedTargets) * 100)}%` : '0%';
}


function getRagBand(score) {
  const value = Number(score || 0);
  if (value >= 70) return { key: 'green', label: 'Green', className: 'good' };
  if (value >= 40) return { key: 'amber', label: 'Amber', className: 'warn' };
  return { key: 'red', label: 'Red', className: 'danger' };
}

function buildTeacherRagData(progressRows = [], students = []) {
  const strandOrder = (state.strands || []).map((s) => ({ id: s.id, code: s.code || s.id, title: s.title || s.id }));
  const studentRows = students.map((student) => {
    const row = progressRows.find((item) => item.userId === student.uid) || { strands: {} };
    const strands = row.strands || {};
    const completedScores = Object.values(strands).filter((item) => item && item.completed).map((item) => Number(item.score || 0));
    const overall = completedScores.length ? Math.round(completedScores.reduce((sum, value) => sum + value, 0) / completedScores.length) : 0;
    const overallBand = getRagBand(overall);
    const strandStates = strandOrder.map((strand) => {
      const item = strands[strand.id] || null;
      if (!item || !item.completed) {
        return { ...strand, score: null, display: '—', className: 'muted', label: 'No attempt yet' };
      }
      const band = getRagBand(item.score || 0);
      return { ...strand, score: Number(item.score || 0), display: `${Number(item.score || 0)}%`, className: band.className, label: band.label };
    });
    return {
      displayName: student.displayName || student.email || student.uid,
      email: student.email || '',
      className: student.className || student.classCode || 'No class',
      overall,
      overallBand,
      completed: completedScores.length,
      strandStates
    };
  });
  const summary = { red: 0, amber: 0, green: 0 };
  studentRows.forEach((row) => { summary[row.overallBand.key] += 1; });
  return { strandOrder, studentRows, summary };
}

function renderTeacherRagSheet(progressRows = [], students = []) {
  if (!els.teacherRagSheet) return;
  const { strandOrder, studentRows, summary } = buildTeacherRagData(progressRows, students);

  if (els.teacherRagSummary) {
    els.teacherRagSummary.innerHTML = `
      <span class="badge danger">Red ${summary.red}</span>
      <span class="badge warn">Amber ${summary.amber}</span>
      <span class="badge good">Green ${summary.green}</span>`;
  }

  if (!studentRows.length) {
    els.teacherRagSheet.innerHTML = '<p class="subtle" style="margin-top:14px;">No student data available yet.</p>';
    return;
  }

  const header = ['Student', 'Class', 'Overall', 'Done'].concat(strandOrder.map((s) => escapeHtml(s.code || s.id)));
  const rowsHtml = studentRows.map((row) => `
    <tr>
      <td class="rag-student-cell">
        <strong>${escapeHtml(row.displayName)}</strong>
        <div class="small subtle">${escapeHtml(row.email)}</div>
      </td>
      <td>${escapeHtml(row.className)}</td>
      <td><span class="badge ${row.overallBand.className}">${row.overall}%</span></td>
      <td>${row.completed}/${strandOrder.length}</td>
      ${row.strandStates.map((item) => `<td><span class="rag-pill ${item.className}" title="${escapeHtml((item.title || item.id) + ': ' + item.label + (item.score !== null ? ' (' + item.score + '%)' : ''))}">${escapeHtml(item.display)}</span></td>`).join('')}
    </tr>`).join('');

  els.teacherRagSheet.innerHTML = `
    <div class="rag-table-wrap">
      <table class="rag-table">
        <thead><tr>${header.map((label) => `<th>${label}</th>`).join('')}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
}


function formatCamnatPin(value = '') {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 6);
  if (digits.length !== 6) return '';
  return digits;
}

function renderStudentClassPanel() {
  if (!els.studentClassPanel) return;
  if (!state.currentUser || !isStudent()) {
    els.studentClassPanel.style.display = 'none';
    if (els.studentCamnatPinPanel) els.studentCamnatPinPanel.style.display = 'none';
    return;
  }
  const profile = state.currentUserProfile || {};
  els.studentClassPanel.style.display = '';
  if (els.studentClassName) els.studentClassName.textContent = profile.className || 'Not linked';
  if (els.studentClassCodeDisplay) els.studentClassCodeDisplay.textContent = profile.classCode || '—';
  if (els.studentTeacherName) els.studentTeacherName.textContent = profile.teacherName || profile.teacherId || '—';
  if (els.studentClassEditWrap) els.studentClassEditWrap.style.display = state.studentClassEditMode ? 'flex' : 'none';
  if (els.btnEditStudentClass) els.btnEditStudentClass.style.display = state.studentClassEditMode ? 'none' : '';
  if (state.studentClassEditMode && els.studentClassCodeInput && !els.studentClassCodeInput.value) {
    els.studentClassCodeInput.value = profile.classCode || '';
  }

  if (els.studentCamnatPinPanel) els.studentCamnatPinPanel.style.display = '';
  const savedPin = formatCamnatPin(profile.camnatPin || '');
  if (els.studentCamnatPinDisplay) els.studentCamnatPinDisplay.textContent = savedPin || 'Not saved';
  if (els.studentCamnatPinStatus) els.studentCamnatPinStatus.textContent = savedPin ? 'Ready to check marks' : 'Add your 6-digit PIN';
  if (els.studentCamnatPinEditWrap) els.studentCamnatPinEditWrap.style.display = state.studentCamnatPinEditMode ? 'flex' : 'none';
  if (els.btnEditStudentCamnatPin) els.btnEditStudentCamnatPin.style.display = state.studentCamnatPinEditMode ? 'none' : '';
  if (state.studentCamnatPinEditMode && els.studentCamnatPinInput && !els.studentCamnatPinInput.value) {
    els.studentCamnatPinInput.value = String(profile.camnatPin || '').replace(/\D/g, '').slice(0, 6);
  }
}

function getTeacherDashboardStudents() {
  const selectedClass = state.teacherSelectedClassId || 'all';
  const term = normaliseText(state.teacherSearchTerm || '');
  let rows = [...(state.teacherRows || [])];
  if (selectedClass !== 'all') rows = rows.filter((student) => (student.classCode || '') === selectedClass);
  if (term) rows = rows.filter((student) => normaliseText(`${student.displayName || ''} ${student.email || ''} ${student.className || ''} ${student.classCode || ''}`).includes(term));
  const getAvg = (student) => {
    const strands = Object.values(student.strands || {});
    if (!strands.length) return 0;
    return Math.round(strands.reduce((sum, row) => sum + Number(row.score || 0), 0) / strands.length);
  };
  const getCompleted = (student) => Object.values(student.strands || {}).filter((row) => row.completed).length;
  rows.sort((a, b) => {
    if (state.teacherSortMode === 'name-desc') return String(b.displayName || b.email || '').localeCompare(String(a.displayName || a.email || ''));
    if (state.teacherSortMode === 'score-desc') return getAvg(b) - getAvg(a);
    if (state.teacherSortMode === 'score-asc') return getAvg(a) - getAvg(b);
    if (state.teacherSortMode === 'completed-desc') return getCompleted(b) - getCompleted(a);
    return String(a.displayName || a.email || '').localeCompare(String(b.displayName || b.email || ''));
  });
  return rows;
}

function renderTeacherClassList(classes = []) {
  if (!els.teacherClassList) return;
  if (!classes.length) {
    els.teacherClassList.innerHTML = '<p class="subtle">No classes yet. Create your first class above.</p>';
    return;
  }
  els.teacherClassList.innerHTML = `<div class="teacher-class-list">${classes.map((row) => {
    const className = row.className || row.classCode || 'Unnamed class';
    const classCode = row.classCode || '—';
    const teacherName = row.teacherName || row.teacherEmail || row.ownerName || row.ownerEmail || '';
    const metaParts = [`Code: ${escapeHtml(classCode)}`];
    if (teacherName) metaParts.push(escapeHtml(teacherName));
    return `<article class="teacher-class-card">
      <div class="teacher-class-card__main">
        <strong class="teacher-class-card__title">${escapeHtml(className)}</strong>
        <div class="teacher-class-card__meta">${metaParts.join(' · ')}</div>
      </div>
      <div class="teacher-class-card__side">
        <span class="badge">${row.count || 0} student${row.count === 1 ? '' : 's'}</span>
        <button class="btn btn-danger btn-delete-class" data-class-id="${escapeHtml(row.classId || '')}" data-class-code="${escapeHtml(classCode)}" data-class-name="${escapeHtml(className)}">Delete</button>
      </div>
    </article>`;
  }).join('')}</div>`;

  document.querySelectorAll('.btn-delete-class').forEach((btn) => btn.addEventListener('click', async () => {
    const classId = btn.dataset.classId || '';
    const classCode = btn.dataset.classCode || '';
    const className = btn.dataset.className || classCode || 'this class';
    if (!window.confirm(`Delete ${className}? This will remove the class, unassign its students, and remove its assigned tasks.`)) return;
    try {
      btn.disabled = true;
      btn.textContent = 'Deleting…';
      await callTeacherDeleteClass({ classId, classCode });
      if (state.teacherSelectedClassId === classCode) state.teacherSelectedClassId = 'all';
      if (state.teacherSelectedRagClassId === classCode) state.teacherSelectedRagClassId = 'all';
      await loadTeacherDashboard();
      showAlert('Class deleted.', 'good');
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Delete';
      showAlert(err.message || 'Unable to delete class.', 'error');
    }
  }));
}

function renderAdminApprovalNotifications(users = []) {
  if (!els.adminApprovalBanner || !els.adminPendingApprovals || !els.adminPendingCountBadge) return;
  const pending = (users || []).filter((u) => u.role === PENDING_TEACHER_ROLE);
  els.adminApprovalBanner.style.display = pending.length ? '' : 'none';
  els.adminPendingCountBadge.textContent = `${pending.length} pending`;
  if (!pending.length) { els.adminPendingApprovals.innerHTML = ''; return; }
  els.adminPendingApprovals.innerHTML = pending.map((u) => `
    <div class="admin-user-row">
      <div class="admin-user-info">
        <strong>${escapeHtml(u.displayName || u.email || 'Teacher')}</strong>
        <span class="small subtle">${escapeHtml(u.email || '')}</span>
      </div>
      <div class="admin-user-actions">
        <button class="btn primary btn-approve-teacher" data-uid="${escapeHtml(u.uid)}">Approve teacher</button>
      </div>
    </div>`).join('');
  document.querySelectorAll('.btn-approve-teacher').forEach((btn) => btn.addEventListener('click', async () => {
    try {
      btn.disabled = true;
      await callAdminSetUserRole({ targetUid: btn.dataset.uid, role: 'teacher' });
      showAlert('Teacher approved.', 'good');
      await loadAdminPanel();
    } catch (err) {
      showAlert(err.message || 'Could not approve teacher.', 'error');
      btn.disabled = false;
    }
  }));
}
// ─── Admin panel ───────────────────────────────────────────────────────────────

async function loadAdminPanel() {
  if (!state.currentUser || !isAdmin()) {
    if (els.adminUserList) els.adminUserList.innerHTML = renderAccessDenied('admin');
    return;
  }

  try {
    const [usersRes, settingsRes] = await Promise.all([
      callAdminListUsers({}),
      callAdminGetSettings({})
    ]);

    state.adminUsers = usersRes.data.users || [];
    renderAdminUsers(state.adminUsers);
    renderAdminApprovalNotifications(state.adminUsers);
    renderAdminDomains(settingsRes.data.allowedDomains || []);
  } catch (err) {
    showAlert('Failed to load admin data: ' + err.message, 'error');
  }
}

function renderAdminUsers(users) {
  if (!els.adminUserList) return;

  const query = (els.adminUserSearch?.value || '').trim().toLowerCase();
  const filteredUsers = !query ? users : users.filter((u) => {
    const haystack = `${u.displayName || ''} ${u.email || ''} ${u.role || ''}`.toLowerCase();
    return haystack.includes(query);
  });

  const counts = { admin: 0, teacher: 0, student: 0, teacher_pending: 0 };
  users.forEach((u) => { if (counts[u.role] !== undefined) counts[u.role]++; });
  if (els.adminUserCount) els.adminUserCount.textContent = String(users.length);
  if (els.adminTeacherCount) els.adminTeacherCount.textContent = String((counts.teacher || 0) + (counts.teacher_pending || 0));
  if (els.adminStudentCount) els.adminStudentCount.textContent = String(counts.student || 0);
  renderAdminApprovalNotifications(users);

  els.adminUserList.innerHTML = filteredUsers.map((u) => `
    <div class="admin-user-row" data-uid="${escapeHtml(u.uid)}">
      <div class="admin-user-info" style="min-width:280px;">
        <label class="small subtle" for="admin-name-${escapeHtml(u.uid)}">Name</label>
        <input id="admin-name-${escapeHtml(u.uid)}" class="input admin-name-input" data-uid="${escapeHtml(u.uid)}" type="text" value="${escapeHtml(u.displayName || '')}" placeholder="Enter user name" style="margin-top:6px;">
        <span class="small subtle" style="display:block;margin-top:6px;">${escapeHtml(u.email)}${u.role === PENDING_TEACHER_ROLE ? ' · awaiting approval' : ''}</span>
      </div>
      <div class="admin-user-actions">
        <select class="input admin-role-select" data-uid="${escapeHtml(u.uid)}" data-current="${escapeHtml(u.role)}" style="width:auto;padding:6px 10px;">
          <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
          <option value="teacher_pending" ${u.role === 'teacher_pending' ? 'selected' : ''}>Teacher pending approval</option>
          <option value="teacher" ${u.role === 'teacher' ? 'selected' : ''}>Teacher approved</option>
          <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
        <button class="btn btn-save-name" data-uid="${escapeHtml(u.uid)}" data-current-name="${escapeHtml(u.displayName || '')}" style="padding:6px 14px;">Save name</button>
        <button class="btn btn-save-role" data-uid="${escapeHtml(u.uid)}" style="padding:6px 14px;">Save role</button>
        <button class="btn btn-danger btn-delete-user" data-uid="${escapeHtml(u.uid)}" data-name="${escapeHtml(u.displayName || u.email || 'this user')}" style="padding:6px 14px;">Delete</button>
      </div>
    </div>`).join('') || '<p class="subtle">No users found.</p>';

  document.querySelectorAll('.btn-save-name').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const uid = btn.dataset.uid;
      const input = document.querySelector(`.admin-name-input[data-uid="${uid}"]`);
      const displayName = input?.value?.trim() || '';
      const currentName = btn.dataset.currentName || '';
      if (!uid) return;
      if (!displayName) {
        showAlert('Please enter a name before saving.', 'warn');
        input?.focus();
        return;
      }
      if (displayName === currentName) {
        showAlert('That name is already saved.', 'good');
        return;
      }
      try {
        btn.disabled = true; btn.textContent = 'Saving…';
        await callAdminUpdateUserName({ targetUid: uid, displayName });
        btn.dataset.currentName = displayName;
        if (input) input.value = displayName;
        const user = state.adminUsers.find((row) => row.uid === uid);
        if (user) user.displayName = displayName;
        btn.textContent = 'Saved ✓';
        showAlert('User name updated.', 'good');
        renderAdminUsers(state.adminUsers);
      } catch (err) {
        showAlert(err.message || 'Failed to update user name.', 'error');
        btn.textContent = 'Save name';
      } finally {
        btn.disabled = false;
        setTimeout(() => { btn.textContent = 'Save name'; }, 2500);
      }
    });
  });

  document.querySelectorAll('.btn-save-role').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const uid = btn.dataset.uid;
      const select = document.querySelector(`.admin-role-select[data-uid="${uid}"]`);
      const role = select?.value;
      if (!role) return;
      try {
        btn.disabled = true; btn.textContent = 'Saving…';
        await callAdminSetUserRole({ targetUid: uid, role });
        btn.textContent = 'Saved ✓';
        showAlert(`Role updated to "${role}".`, 'good');
        select.dataset.current = role;
      } catch (err) {
        showAlert(err.message || 'Failed to update role.', 'error');
        btn.textContent = 'Save';
      } finally {
        btn.disabled = false;
        setTimeout(() => { btn.textContent = 'Save'; }, 2500);
      }
    });
  });

  document.querySelectorAll('.btn-delete-user').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const uid = btn.dataset.uid;
      const label = btn.dataset.name || 'this user';
      if (!uid) return;
      if (!window.confirm(`Delete ${label}? This will remove their login, profile and saved worksheet data.`)) return;
      try {
        btn.disabled = true; btn.textContent = 'Deleting…';
        await callAdminDeleteUser({ targetUid: uid });
        showAlert('User deleted.', 'good');
        await loadAdminPanel();
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Delete';
        showAlert(err.message || 'Failed to delete user.', 'error');
      }
    });
  });
}

function renderAdminDomains(domains) {
  if (!els.adminDomainList) return;
  // Show/hide warning when list is empty
  if (els.domainWarning) els.domainWarning.classList.toggle('hidden', domains.length > 0);
  if (!domains.length) {
    els.adminDomainList.innerHTML = '';
    return;
  }
  els.adminDomainList.innerHTML = domains.map((d) => `
    <div class="domain-row">
      <span class="chip">@${escapeHtml(d)}</span>
      <button class="btn btn-remove-domain" data-domain="${escapeHtml(d)}" style="padding:4px 12px;font-size:.8rem;">Remove</button>
    </div>`).join('');

  document.querySelectorAll('.btn-remove-domain').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const domainToRemove = btn.dataset.domain;
      const currentDomains = getCurrentDomainList();
      const updated = currentDomains.filter((d) => d !== domainToRemove);
      await saveDomains(updated);
    });
  });
}

function getCurrentDomainList() {
  return [...document.querySelectorAll('.btn-remove-domain')].map((b) => b.dataset.domain);
}

async function saveDomains(domains) {
  try {
    const res = await callAdminUpdateSettings({ allowedDomains: domains });
    state.allowedDomains = res.data.allowedDomains;
    renderAdminDomains(res.data.allowedDomains);
    showAlert('Domain allowlist updated.', 'good');
  } catch (err) {
    showAlert(err.message || 'Failed to update domains.', 'error');
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

async function validateEmailDomain(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) throw new Error('Invalid email address.');

  // Fetch fresh settings from server (always trusted)
  try {
    const res = await callGetRegistrationSettings({});
    const allowed = res.data.allowedDomains || [];
    if (allowed.length > 0 && !allowed.includes(domain)) {
      throw new Error(`Registration is restricted to: ${allowed.map((d) => '@' + d).join(', ')}`);
    }
  } catch (err) {
    if (err.message.includes('restricted')) throw err; // rethrow domain error
    // If settings fetch fails, allow registration to proceed (fail open)
    console.warn('Could not fetch registration settings:', err.message);
  }
}

async function ensureUserProfile(user, overrides = {}) {
  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Bootstrap: if this is the designated admin email, grant admin role immediately
    const isDesignatedAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const payload = {
      uid:         user.uid,
      email:       user.email || '',
      displayName: user.displayName || els.displayName?.value || user.email?.split('@')[0] || 'Student',
      role:        isDesignatedAdmin ? 'admin' : (overrides.role || 'student'),
      approvalStatus: isDesignatedAdmin ? 'approved' : (((overrides.role || 'student') === PENDING_TEACHER_ROLE) ? 'pending' : 'approved'),
      classId:     overrides.classId || '',
      classCode:   overrides.classCode || '',
      className:   overrides.className || '',
      teacherId:   overrides.teacherId || '',
      teacherName: overrides.teacherName || '',
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp()
    };
    await setDoc(ref, payload);
    state.currentUserProfile = payload;

    // Seed default allowed domain on first admin sign-in
    if (isDesignatedAdmin) {
      try {
        const settingsRef = doc(db, 'settings', 'registration');
        const settingsSnap = await getDoc(settingsRef);
        if (!settingsSnap.exists()) {
          await setDoc(settingsRef, {
            allowedDomains: ['garibaldischool.co.uk'],
            updatedAt:      serverTimestamp(),
            updatedBy:      user.uid
          });
        }
      } catch (e) { console.warn('Could not seed default domain settings:', e); }
    }
    return;
  }

  const existing = snap.data() || {};
  const merged = {
    ...existing,
    uid: user.uid,
    email: user.email || existing.email || '',
    displayName: user.displayName || existing.displayName || els.displayName?.value || user.email?.split('@')[0] || 'Student'
  };

  if (Object.prototype.hasOwnProperty.call(overrides, 'role')) merged.role = overrides.role;
  if (Object.prototype.hasOwnProperty.call(overrides, 'classId')) merged.classId = overrides.classId || '';
  if (Object.prototype.hasOwnProperty.call(overrides, 'classCode')) merged.classCode = overrides.classCode || '';
  if (Object.prototype.hasOwnProperty.call(overrides, 'className')) merged.className = overrides.className || '';
  if (Object.prototype.hasOwnProperty.call(overrides, 'teacherId')) merged.teacherId = overrides.teacherId || '';
  if (Object.prototype.hasOwnProperty.call(overrides, 'teacherName')) merged.teacherName = overrides.teacherName || '';
  if (merged.role === PENDING_TEACHER_ROLE) merged.approvalStatus = 'pending';
  else if (!merged.approvalStatus) merged.approvalStatus = 'approved';

  const hasOverrides = Object.keys(overrides || {}).length > 0;
  const shouldWrite = hasOverrides
    || merged.displayName !== existing.displayName
    || merged.email !== existing.email;

  if (shouldWrite) {
    await setDoc(ref, { ...merged, updatedAt: serverTimestamp() }, { merge: true });
  }

  state.currentUserProfile = merged;
}

async function loginEmail() {
  const email = els.email.value.trim();
  const credential = await signInWithEmailAndPassword(auth, email, els.password.value);
  const profile = (await getDoc(doc(db, 'users', credential.user.uid))).data() || {};
  const r = profile?.role || 'student';

  if (!credential.user.emailVerified) {
    await signOut(auth);
    const verifyMsg = r === PENDING_TEACHER_ROLE
      ? 'Please verify your email first. After that, an admin will need to approve your teacher account before you can log in.'
      : 'Please verify your email before logging in. Check your inbox for a verification link.';
    showAlert(verifyMsg, 'warn');
    document.getElementById('verifyResendBlock')?.classList.remove('hidden');
    window._pendingVerifyEmail = email;
    window._pendingVerifyPassword = els.password.value;
    return;
  }

  if (r === PENDING_TEACHER_ROLE) {
    await signOut(auth);
    document.getElementById('verifyResendBlock')?.classList.add('hidden');
    showAlert('Your teacher account has been verified and is now waiting for admin approval. Please ask an admin to approve your teacher access.', 'warn');
    return;
  }

  document.getElementById('verifyResendBlock')?.classList.add('hidden');
  showAlert('Logged in successfully.', 'good');
}

async function registerEmail() {
  if (state.registerInFlight) return;
  state.registerInFlight = true;
  setRegisterButtonBusy(true);

  try {
    const email = els.email.value.trim();
    const displayNameVal = document.getElementById('displayName')?.value.trim();
    const classCodeVal = (els.classCode?.value || '').trim().toUpperCase();
    if (!displayNameVal) throw new Error('Please enter a display name.');
    if (registerRole === 'student' && !classCodeVal) throw new Error('Please enter your class code.');

    await validateEmailDomain(email);

    const profileRole = registerRole === 'teacher' ? PENDING_TEACHER_ROLE : 'student';
    let classPayload = {};
    if (registerRole === 'student') {
      const validated = await callValidateClassCode({ classCode: classCodeVal });
      classPayload = {
        classId: validated.data.classId || '',
        classCode: validated.data.classCode || classCodeVal,
        className: validated.data.className || classCodeVal,
        teacherId: validated.data.teacherId || '',
        teacherName: validated.data.teacherName || ''
      };
    }

    state.pendingRegistration = true;
    let credential = null;
    try {
      credential = await createUserWithEmailAndPassword(auth, email, els.password.value);
      state.pendingRegistrationUid = credential.user.uid;

      // Set display name
      await updateProfile(credential.user, { displayName: displayNameVal });

      // Create or merge Firestore profile
      await ensureUserProfile(credential.user, {
        role: profileRole,
        ...classPayload
      });

      // Send verification email
      await sendEmailVerification(credential.user);
    } finally {
      state.pendingRegistration = false;
      state.pendingRegistrationUid = '';
    }

    if (credential?.user) {
      // Sign out immediately — must verify email first
      await signOut(auth);
    }

    const registerMsg = registerRole === 'teacher'
      ? `Teacher account created. A verification email has been sent to ${email}. Once you verify your email, an admin will need to approve your teacher account before you can log in.`
      : `Student account created. A verification email has been sent to ${email}. Please verify before logging in.`;
    showAlert(registerMsg, 'good');
  } finally {
    state.registerInFlight = false;
    setRegisterButtonBusy(false);
  }
}

// ─── Progress ──────────────────────────────────────────────────────────────────

async function loadProgress() {
  if (!state.currentUser) { state.progress = null; updateStudentMetrics(); return; }
  const snap = await getDoc(doc(db, 'progress', state.currentUser.uid));
  state.progress = snap.exists()
    ? snap.data()
    : { userId: state.currentUser.uid, strands: {}, updatedAt: null };
  updateStudentMetrics();
}

// ─── Task notification helpers ─────────────────────────────────────────────────

/**
 * Derive the notification priority category for a single assignment.
 * Priority: overdue > due_today > due_soon > in_progress
 * Completed tasks are excluded.
 */
function getTaskUrgency(task) {
  if (task.completed) return null;
  const ds = task.deadlineStatus || 'upcoming';
  if (ds === 'overdue')   return 'overdue';
  if (ds === 'due_today') return 'due_today';
  if (ds === 'due_soon')  return 'due_soon';
  if (task.inProgress)    return 'in_progress';
  return null;
}

function countUrgentTasks(tasks) {
  return (tasks || []).filter((t) => {
    const u = getTaskUrgency(t);
    return u === 'overdue' || u === 'due_today' || u === 'due_soon';
  }).length;
}

function updateNavTaskBadge() {
  if (!els.navTaskBadge) return;
  const count = countUrgentTasks(state.assignedTasks);
  if (count > 0) {
    els.navTaskBadge.textContent = count;
    els.navTaskBadge.style.display = '';
  } else {
    els.navTaskBadge.style.display = 'none';
  }
}

function renderTaskNotifications() {
  if (!els.taskNotifications) return;
  if (!state.currentUser || !isStudent()) {
    els.taskNotifications.style.display = 'none';
    return;
  }

  const tasks = (state.assignedTasks || []);

  // Group by urgency in priority order
  const groups = [
    {
      key: 'overdue',
      items: tasks.filter((t) => getTaskUrgency(t) === 'overdue'),
      label: 'Overdue',
      badgeClass: 'danger',
      message: 'This worksheet has passed its deadline. Complete it as soon as possible.',
    },
    {
      key: 'due_today',
      items: tasks.filter((t) => getTaskUrgency(t) === 'due_today'),
      label: 'Due today',
      badgeClass: 'warn',
      message: 'This worksheet is due today.',
    },
    {
      key: 'due_soon',
      items: tasks.filter((t) => getTaskUrgency(t) === 'due_soon'),
      label: 'Due soon',
      badgeClass: 'warn',
      message: 'This worksheet is due soon.',
    },
    {
      key: 'in_progress',
      items: tasks.filter((t) => getTaskUrgency(t) === 'in_progress'),
      label: 'In progress',
      badgeClass: '',
      message: 'You have started this worksheet but not finished it.',
    },
  ].filter((g) => g.items.length > 0);

  if (!groups.length) {
    els.taskNotifications.style.display = 'none';
    return;
  }

  els.taskNotifications.style.display = '';

  const cards = groups.flatMap((group) =>
    group.items.map((task) => {
      const strand = state.strands.find((s) => s.id === task.strandId);
      return `
        <article class="task-notif-card task-notif-${group.key}">
          <div class="task-notif-body">
            <div class="badge-row" style="margin-bottom:6px;">
              <span class="badge${group.badgeClass ? ' ' + group.badgeClass : ''}">${escapeHtml(group.label)}</span>
              ${task.deadline ? `<span class="badge">Due ${escapeHtml(formatDeadline(task.deadline))}</span>` : ''}
              <span class="badge">${escapeHtml(task.strandCode || strand?.code || '')}</span>
            </div>
            <strong class="task-notif-title">${escapeHtml(task.strandTitle || strand?.title || task.strandId)}</strong>
            <p class="task-notif-msg">${escapeHtml(group.message)}</p>
          </div>
          <div>
            <button class="btn${group.key === 'overdue' ? ' primary' : ''} btn-task-notif-open" data-strand-id="${escapeHtml(task.strandId)}">
              Open worksheet
            </button>
          </div>
        </article>`;
    })
  ).join('');

  els.taskNotifications.innerHTML = `
    <div class="task-notif-header">
      <h3 class="task-notif-heading">Tasks needing attention</h3>
      <span class="badge${countUrgentTasks(tasks) > 0 ? ' warn' : ''}">${countUrgentTasks(tasks)} urgent</span>
    </div>
    <div class="task-notif-list">${cards}</div>`;

  // Wire open buttons
  els.taskNotifications.querySelectorAll('.btn-task-notif-open').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeStrandId = btn.dataset.strandId;
      setRoute('worksheet');
      renderWorksheet();
    });
  });

  updateNavTaskBadge();
}

async function loadStudentAssignments() {
  if (!state.currentUser || !isStudent()) {
    state.assignedTasks = [];
    renderAssignedTasks();
    return;
  }
  try {
    const res = await callStudentGetAssignments({});
    state.assignedTasks = res.data.assignments || [];
  } catch (err) {
    console.warn('Failed to load assignments', err);
    state.assignedTasks = [];
  }
  renderAssignedTasks();
  renderTaskNotifications();
  updateNavTaskBadge();
  renderSidebarAssignedLinks();
  renderStudentClassPanel();
}



function renderAssignedTasks() {
  if (!els.studentAssignments) return;
  if (!state.currentUser || !isStudent()) {
    els.studentAssignments.innerHTML = '';
    return;
  }

  const tasks = [...(state.assignedTasks || [])].sort((a, b) => String(a.deadline || '').localeCompare(String(b.deadline || '')) || String(a.strandCode || '').localeCompare(String(b.strandCode || '')));

  if (!tasks.length) {
    els.studentAssignments.innerHTML = '<div class="card"><p class="subtle">No assigned worksheets available right now.</p></div>';
    return;
  }

  els.studentAssignments.innerHTML = tasks.map((task) => {
    const strand = state.strands.find((s) => s.id === task.strandId);
    const progress = state.progress?.strands?.[task.strandId] || null;
    const completed = !!progress?.completed;
    const score = Number.isFinite(progress?.score) ? progress.score : null;
    const openLabel = completed ? 'Review worksheet' : 'Open worksheet';
    return `<article class="assignment-card">
      <div>
        <div class="badge-row">
          <span class="badge">${escapeHtml(task.strandCode || strand?.code || '')}</span>
          <span class="${deadlineTone(task.deadline)}">Due ${escapeHtml(formatDeadline(task.deadline))}</span>
          <span class="badge ${completed ? 'good' : 'warn'}">${completed ? `Completed${score !== null ? ` · ${escapeHtml(String(score))}%` : ''}` : 'To do'}</span>
        </div>
        <strong style="display:block; margin-top:8px;">${escapeHtml(task.strandTitle || strand?.title || task.strandId)}</strong>
        <div class="small subtle">${escapeHtml(task.className || state.currentUserProfile?.className || '')}</div>
      </div>
      <div><button class="btn btn-student-open-task" data-strand-id="${escapeHtml(task.strandId)}">${openLabel}</button></div>
    </article>`;
  }).join('');

  document.querySelectorAll('.btn-student-open-task').forEach((btn) => btn.addEventListener('click', () => {
    state.activeStrandId = btn.dataset.strandId;
    setRoute('worksheet');
    renderWorksheet();
  }));
}

// ─── Sidebar worksheet links ──────────────────────────────────────────────────

function renderSidebarAssignedLinks() {
  if (!els.sidebarAssignedLinks) return;

  if (!state.currentUser || !isStudent()) {
    els.sidebarAssignedLinks.innerHTML = '';
    return;
  }

  const tasks = [...(state.assignedTasks || [])].sort(
    (a, b) => String(a.deadline || '').localeCompare(String(b.deadline || '')) ||
              String(a.strandCode || '').localeCompare(String(b.strandCode || ''))
  );

  if (!tasks.length) {
    els.sidebarAssignedLinks.innerHTML = `
      <p class="small subtle" style="padding:4px 12px 8px;">No worksheets assigned yet.</p>`;
    return;
  }

  els.sidebarAssignedLinks.innerHTML = tasks.map((task) => {
    const progress = state.progress?.strands?.[task.strandId] || null;
    const completed = !!progress?.completed;
    const inProgress = !completed && !!progress?.startedAt;
    const statusClass = completed ? 'good' : inProgress ? 'warn' : '';
    const isCurrent = state.activeStrandId === task.strandId && state.route === 'worksheet';
    return `<button
      class="nav-btn sidebar-ws-link${isCurrent ? ' active' : ''}"
      data-strand-id="${escapeHtml(task.strandId)}"
      title="${escapeHtml(task.strandTitle || task.strandId)}">
      <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <span class="sidebar-ws-text">
        <span class="sidebar-ws-code">${escapeHtml(task.strandCode || '')}</span>
        <span class="sidebar-ws-title">${escapeHtml(task.strandTitle || task.strandId)}</span>
      </span>
      ${statusClass ? `<span class="badge ${statusClass}" style="margin-left:auto;flex-shrink:0;">${completed ? '✓' : '…'}</span>` : ''}
    </button>`;
  }).join('');

  // Wire clicks
  els.sidebarAssignedLinks.querySelectorAll('.sidebar-ws-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeStrandId = btn.dataset.strandId;
      setRoute('worksheet');
      renderWorksheet();
      renderSidebarAssignedLinks(); // refresh active state
    });
  });
}

// ─── Filter strands ────────────────────────────────────────────────────────────

function filterStrands(term) {
  const q = normaliseText(term);
  const base = isStudent() ? state.strands.filter((s) => isAssignedToStudent(s.id)) : state.strands;
  state.filteredStrands = q
    ? base.filter((s) => normaliseText(`${s.code} ${s.title} ${s.summary} ${(s.tags || []).join(' ')}`).includes(q))
    : [...base];
  renderStrands();
}


// ─── Engagement tracking ──────────────────────────────────────────────────────

async function openTrackedExternalLink(href, sourceLabel = 'Useful link') {
  const rawHref = String(href || '').trim();
  if (!rawHref) return;

  let popup = null;
  let navigated = false;
  let fallbackTimer = null;

  const navigatePopup = (targetUrl) => {
    const safeUrl = String(targetUrl || '').trim() || rawHref;
    if (navigated) return;
    navigated = true;
    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    try {
      if (popup && !popup.closed) {
        popup.location.replace(safeUrl);
        try { popup.opener = null; } catch (_) {}
        popup.focus?.();
        return;
      }
    } catch (_) {}
    window.open(safeUrl, '_blank');
  };

  try {
    popup = window.open('', '_blank');
    try {
      if (popup && popup.document) {
        popup.document.write('<!doctype html><title>Opening iMedia Genius…</title><body style="font-family:Arial,sans-serif;padding:24px">Opening iMedia Genius…</body>');
        popup.document.close();
      }
    } catch (_) {}
  } catch (_) {
    popup = null;
  }

  fallbackTimer = window.setTimeout(() => {
    console.warn('Tracked launch timed out, falling back to direct open');
    navigatePopup(rawHref);
  }, 1800);

  if (!state.currentUser || !isStudent() || !rawHref.includes('imediagenius.co.uk')) {
    navigatePopup(rawHref);
    return;
  }

  try {
    const res = await callCreateEngagementLaunchToken({
      targetUrl: rawHref,
      sourceLabel,
      sourcePage: state.route || 'home'
    });
    const launchUrl = String(res?.data?.launchUrl || '').trim();
    if (!launchUrl) throw new Error('No launch URL returned');
    navigatePopup(launchUrl);
  } catch (err) {
    console.warn('Tracked launch failed', err);
    navigatePopup(rawHref);
  }
}

function wireTrackedUsefulLinks() {
  document.querySelectorAll('a.nav-link-external[data-track-handoff="true"]').forEach((link) => {
    if (link.dataset.trackedBound === 'true') return;
    link.dataset.trackedBound = 'true';
    link.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const href = link.getAttribute('href') || '';
      const label = link.textContent.replace(/\s+/g, ' ').trim();
      await openTrackedExternalLink(href, label);
    });
  });
}

async function loadStudentBadges() {
  if (!state.currentUser || !isStudent()) {
    state.badges = null;
    renderStudentBadges();
    return;
  }
  try {
    const res = await callStudentGetBadges({});
    state.badges = res?.data || { badgeCount: 0, totalPoints: 0, earned: [], nextTargets: [] };
  } catch (err) {
    console.warn('Failed to load student badges', err);
    state.badges = { badgeCount: 0, totalPoints: 0, earned: [], nextTargets: [] };
  }
  renderStudentBadges();
}

function renderStudentBadges() {
  updateStudentBadgesVisibility();
  const wrap = els.studentBadges;
  if (!wrap) return;
  if (!state.currentUser || !isStudent()) {
    wrap.innerHTML = '';
    return;
  }
  const data = state.badges || { badgeCount: 0, totalPoints: 0, earned: [], nextTargets: [] };
  const earned = Array.isArray(data.earned) ? data.earned : [];
  const nextTargets = Array.isArray(data.nextTargets) ? data.nextTargets : [];

  const nextHtml = nextTargets.length
    ? `<div class="badge-next-list"><h4 style="margin:12px 0 8px;font-size:1rem;">Next targets</h4>${nextTargets.map((item) => `<div class="small subtle"><strong>${escapeHtml(item.title || 'Badge')}</strong> — ${escapeHtml(item.progress || '')}</div>`).join('')}</div>`
    : '';

  if (!earned.length) {
    wrap.innerHTML = `
      <div class="badge-summary-grid">
        <div class="metric-card"><span>Badges earned</span><strong>0</strong></div>
        <div class="metric-card"><span>Points</span><strong>0</strong></div>
      </div>
      <p class="small subtle" style="margin-top:12px;">No badges earned yet. Complete a worksheet or revise on iMedia Genius to unlock your first one.</p>
      ${nextHtml}
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="badge-summary-grid">
      <div class="metric-card"><span>Badges earned</span><strong>${escapeHtml(String(data.badgeCount || earned.length))}</strong></div>
      <div class="metric-card"><span>Points</span><strong>${escapeHtml(String(data.totalPoints || 0))}</strong></div>
    </div>
    <div class="student-badge-grid">
      ${earned.map((badge) => `
        <article class="student-badge-card">
          <div class="student-badge-icon">🏅</div>
          <div>
            <strong>${escapeHtml(badge.title || 'Badge')}</strong>
            <div class="small subtle">${escapeHtml(badge.description || '')}</div>
          </div>
        </article>
      `).join('')}
    </div>
    ${nextHtml}
  `;
}

async function loadStudentEngagement() {
  if (!state.currentUser || !isStudent()) {
    state.studentEngagement = null;
    renderStudentEngagement();
    return;
  }
  try {
    const res = await callStudentGetEngagementSummary({});
    state.studentEngagement = res?.data || null;
  } catch (err) {
    console.warn('Failed to load student engagement', err);
    state.studentEngagement = { summary: {}, recent: [], leaderboard: [], classLeaderboard: [], rankLabel: '', classRankLabel: 'Unavailable' };
  }
  renderStudentEngagement();
}

function renderStudentEngagement() {
  const board = els.studentEngagementBoard;
  if (!board) return;
  if (!state.currentUser || !isStudent()) {
    board.style.display = 'none';
    return;
  }
  board.style.display = '';
  const data = state.studentEngagement || {};
  const summary = data.summary || {};
  const metrics = [
    ['Minutes active', String(summary.minutesActive || 0)],
    ['Pages visited', String(summary.pagesVisited || 0)],
    ['Resource clicks', String(summary.resourceClicks || 0)],
    ['Video clicks', String(summary.videoClicks || 0)],
    ['Podcast clicks', String(summary.podcastClicks || 0)],
    ['Quiz attempts', String(summary.quizAttempts || 0)],
    ['Games completed', String(summary.gameCompletions || 0)],
    ['Best game score', `${String(summary.gameBestPercentage || 0)}%`]
  ];
  if (els.studentEngagementSummary) {
    els.studentEngagementSummary.innerHTML = metrics.map(([label, value]) => `<div class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  }
  if (els.studentEngagementRank) {
    els.studentEngagementRank.textContent = data.rankLabel || 'Class-only leaderboard';
  }
  if (els.studentEngagementClassRank) {
    els.studentEngagementClassRank.textContent = data.classRankLabel || 'No class rank yet';
  }
  if (els.studentEngagementRecent) {
    const recent = data.recent || [];
    els.studentEngagementRecent.innerHTML = recent.length
      ? recent.map((item) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong style="display:block;">${escapeHtml(formatRecentActivityLabel(item))}</strong><div class="small subtle">${escapeHtml(formatDateTime(item.createdAt))}</div></div></div>`).join('')
      : '<p class="subtle">No tracked iMedia Genius activity yet. Launch a useful link from this dashboard to start tracking.</p>';
  }
  if (els.studentEngagementLeaderboard) {
    const rows = data.leaderboard || [];
    els.studentEngagementLeaderboard.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${index + 1}. ${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(String(row.score || 0))} points · ${escapeHtml(String(row.minutesActive || 0))} mins</div></div></div>`).join('')
      : '<p class="subtle">No wider leaderboard is shown outside your class.</p>'; 
  }
  if (els.studentEngagementClassLeaderboard) {
    const rows = data.classLeaderboard || [];
    els.studentEngagementClassLeaderboard.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${index + 1}. ${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(String(row.score || 0))} points · ${escapeHtml(String(row.resourceClicks || 0))} resource clicks · games ${escapeHtml(String(row.gameCompletions || 0))} · best ${escapeHtml(String(row.gameBestPercentage || 0))}%</div></div></div>`).join('')
      : '<p class="subtle">No class activity board yet.</p>';
  }
}

async function loadTeacherBadgeDashboard() {
  if (!state.currentUser || (!isTeacher() && !isAdmin())) {
    state.teacherBadgeDashboard = null;
    renderTeacherBadgeDashboard();
    return;
  }
  try {
    const res = await callTeacherGetBadgeDashboard({ classId: state.teacherSelectedClassId || 'all' });
    state.teacherBadgeDashboard = res?.data || null;
  } catch (err) {
    console.warn('Failed to load teacher badges', err);
    state.teacherBadgeDashboard = { summary: {}, leaderboard: [], classInsights: [], studentRows: [], followUp: [], metaBadges: ['Unavailable'] };
  }
  renderTeacherBadgeDashboard();
}

function compareTeacherBadgeRows(a, b, mode) {
  const nameA = String(a?.displayName || '').toLowerCase();
  const nameB = String(b?.displayName || '').toLowerCase();
  const badgesA = Number(a?.badgeCount || 0);
  const badgesB = Number(b?.badgeCount || 0);
  const pointsA = Number(a?.totalPoints || 0);
  const pointsB = Number(b?.totalPoints || 0);
  if (mode === 'points-desc') return pointsB - pointsA || badgesB - badgesA || nameA.localeCompare(nameB);
  if (mode === 'badges-asc') return badgesA - badgesB || pointsA - pointsB || nameA.localeCompare(nameB);
  if (mode === 'name-asc') return nameA.localeCompare(nameB);
  return badgesB - badgesA || pointsB - pointsA || nameA.localeCompare(nameB);
}

function getFilteredTeacherBadgeRows(data) {
  const search = String(state.teacherBadgeSearchTerm || '').trim().toLowerCase();
  const sortMode = state.teacherBadgeSortMode || 'badges-desc';
  let rows = Array.isArray(data?.studentRows) ? [...data.studentRows] : [];

  if (search) {
    rows = rows.filter((row) => {
      const haystack = [row?.displayName, row?.email, row?.className, row?.classCode, row?.latestBadgeTitle]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  rows.sort((a, b) => compareTeacherBadgeRows(a, b, sortMode));

  const totalMatches = rows.length;
  const visibleRows = state.teacherBadgeShowAll || search ? rows : rows.slice(0, 5);
  return { rows, visibleRows, totalMatches, searchActive: !!search };
}

function renderTeacherBadgeDashboard() {
  const data = state.teacherBadgeDashboard || {};
  if (els.teacherBadgeMeta) {
    els.teacherBadgeMeta.innerHTML = (data.metaBadges || []).map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join('');
  }
  if (els.teacherBadgeSummary) {
    const summary = data.summary || {};
    const metrics = [
      ['Students', String(summary.trackedStudents || 0)],
      ['With badges', String(summary.studentsWithBadges || 0)],
      ['Badges awarded', String(summary.totalBadges || 0)],
      ['Total points', String(summary.totalPoints || 0)],
      ['Avg badges', String(summary.avgBadges || 0)]
    ];
    els.teacherBadgeSummary.innerHTML = metrics.map(([label, value]) => `<div class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  }
  if (els.teacherBadgeLeaderboard) {
    const rows = data.leaderboard || [];
    els.teacherBadgeLeaderboard.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${escapeHtml(String(index + 1))}. ${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(String(row.badgeCount || 0))} badges · ${escapeHtml(String(row.totalPoints || 0))} points</div><div class="small subtle">Latest: ${escapeHtml(row.latestBadgeTitle || 'No badge yet')}</div></div></div>`).join('')
      : '<p class="subtle">No badges earned yet.</p>';
  }
  if (els.teacherBadgeClasses) {
    const rows = data.classInsights || [];
    els.teacherBadgeClasses.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${escapeHtml(String(index + 1))}. ${escapeHtml(row.className || row.classCode || 'Class')}</strong><div class="small subtle">${escapeHtml(String(row.students || 0))} students · ${escapeHtml(String(row.totalBadges || 0))} badges · ${escapeHtml(String(row.totalPoints || 0))} points · avg ${escapeHtml(String(row.avgBadges || 0))}</div></div></div>`).join('')
      : '<p class="subtle">No class badge totals yet.</p>';
  }
  if (els.teacherBadgeFollowUp) {
    const rows = data.followUp || [];
    els.teacherBadgeFollowUp.innerHTML = rows.length
      ? rows.map((row) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(String(row.badgeCount || 0))} badges · ${escapeHtml(String(row.totalPoints || 0))} points</div></div></div>`).join('')
      : '<p class="subtle">No follow-up flags right now.</p>';
  }
  const filteredBadgeRows = getFilteredTeacherBadgeRows(data);
  if (els.teacherBadgeStudentSummary) {
    let summaryText = '';
    if (!filteredBadgeRows.totalMatches) summaryText = filteredBadgeRows.searchActive ? 'No students match your badge search.' : 'No student badge data yet.';
    else if (filteredBadgeRows.searchActive) summaryText = `Showing ${filteredBadgeRows.visibleRows.length} student${filteredBadgeRows.visibleRows.length === 1 ? '' : 's'} matching "${escapeHtml(String(state.teacherBadgeSearchTerm || '').trim())}".`;
    else if (state.teacherBadgeShowAll) summaryText = `Showing all ${filteredBadgeRows.totalMatches} students.`;
    else summaryText = `Showing top ${Math.min(5, filteredBadgeRows.totalMatches)} students by badge count.`;
    els.teacherBadgeStudentSummary.innerHTML = `<p class="small subtle" style="margin:0 0 12px;">${summaryText}</p>`;
  }
  if (els.btnTeacherBadgeToggleAll) {
    const shouldShowToggle = !filteredBadgeRows.searchActive && filteredBadgeRows.totalMatches > 5;
    els.btnTeacherBadgeToggleAll.hidden = !shouldShowToggle;
    els.btnTeacherBadgeToggleAll.textContent = state.teacherBadgeShowAll ? 'Show top 5' : 'Show all';
  }
  if (els.teacherBadgeStudents) {
    const rows = filteredBadgeRows.visibleRows || [];
    els.teacherBadgeStudents.innerHTML = rows.length
      ? rows.map((row, index) => `        <div class="assignment-card teacher-badge-student-card">          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">            <div>              <strong>${escapeHtml(String(index + 1))}. ${escapeHtml(row.displayName || 'Student')}</strong>              <div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(row.email || '')}</div>              <div class="small subtle" style="margin-top:4px;">Latest badge: ${escapeHtml(row.latestBadgeTitle || 'No badge yet')}</div>            </div>            <div class="badge-row">              <span class="badge">${escapeHtml(String(row.badgeCount || 0))} badges</span>              <span class="badge">${escapeHtml(String(row.totalPoints || 0))} points</span>              <span class="badge">Worksheet ${escapeHtml(String(row.worksheetBadges || 0))}</span>              <span class="badge">Engagement ${escapeHtml(String(row.engagementBadges || 0))}</span>              <span class="badge">Hybrid ${escapeHtml(String(row.hybridBadges || 0))}</span>            </div>          </div>          <div class="assignment-students" style="margin-top:10px;">${(row.badgesPreview || []).length ? row.badgesPreview.map((item) => `<span class="chip chip-good">${escapeHtml(item.title || 'Badge')}</span>`).join('') : '<span class="small subtle">No badges earned yet.</span>'}</div>        </div>`).join('')
      : '<p class="subtle">No student badge data yet.</p>';
  }
}

function formatTeacherTopPagesList(rows = []) {
  if (!Array.isArray(rows) || !rows.length) return 'No clear focus yet';
  return rows.slice(0, 3).map((row) => row.pageTitle || row.pagePath || 'Page').join(' · ');
}

async function loadTeacherEngagement() {
  if (!state.currentUser || (!isTeacher() && !isAdmin())) {
    state.teacherEngagement = null;
    renderTeacherEngagement();
    return;
  }
  try {
    const res = await callTeacherGetEngagementDashboard({ classId: state.engagementSelectedClassId || 'all' });
    state.teacherEngagement = res?.data || null;
  } catch (err) {
    console.warn('Failed to load teacher engagement', err);
    state.teacherEngagement = { summary: {}, leaderboard: [], recent: [], topPages: [], classInsights: [], followUp: [], metaBadges: ['Unavailable'] };
  }
  renderTeacherEngagement();
}

function renderTeacherEngagement() {
  const board = els.teacherEngagementBoard;
  if (!board) return;
  if (!state.currentUser || (!isTeacher() && !isAdmin())) {
    board.style.display = 'none';
    return;
  }
  board.style.display = '';
  const data = state.teacherEngagement || {};
  const summary = data.summary || {};
  if (els.engagementClassFilter) {
    const rows = data.availableClasses || [];
    const opts = rows.map((row) => `<option value="${escapeHtml(row.classCode || row.className || '')}">${escapeHtml(row.className || row.classCode || 'Class')} (${escapeHtml(String(row.count || 0))})</option>`).join('');
    els.engagementClassFilter.innerHTML = `<option value="all">All classes</option>${opts}`;
    els.engagementClassFilter.value = state.engagementSelectedClassId || data.selectedClassId || 'all';
  }
  if (els.teacherEngagementMeta) {
    els.teacherEngagementMeta.innerHTML = (data.metaBadges || []).map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join('');
  }
  if (els.teacherEngagementSummary) {
    const metrics = [
      ['Tracked students', String(summary.trackedStudents || 0)],
      ['Pages visited', String(summary.pagesVisited || 0)],
      ['Minutes active', String(summary.minutesActive || 0)],
      ['Video clicks', String(summary.videoClicks || 0)],
      ['Podcast clicks', String(summary.podcastClicks || 0)],
      ['Quiz attempts', String(summary.quizAttempts || 0)],
      ['Games launched', String(summary.gameLaunches || 0)],
      ['Games completed', String(summary.gameCompletions || 0)]
    ];
    els.teacherEngagementSummary.innerHTML = metrics.map(([label, value]) => `<div class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  }
  if (els.teacherEngagementLeaderboard) {
    const rows = data.leaderboard || [];
    els.teacherEngagementLeaderboard.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${index + 1}. ${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(String(row.score || 0))} points · ${escapeHtml(String(row.pagesVisited || 0))} pages · ${escapeHtml(String(row.minutesActive || 0))} mins · games ${escapeHtml(String(row.gameCompletions || 0))} · best ${escapeHtml(String(row.gameBestPercentage || 0))}%</div></div></div>`).join('')
      : '<p class="subtle">No tracked activity yet.</p>';
  }
  if (els.teacherEngagementTopPages) {
    const rows = data.topPages || [];
    els.teacherEngagementTopPages.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${index + 1}. ${escapeHtml(row.pageTitle || row.pagePath || 'Page')}</strong><div class="small subtle">${escapeHtml(row.pagePath || '')} · ${escapeHtml(String(row.visits || 0))} visits</div></div></div>`).join('')
      : '<p class="subtle">No page insights yet.</p>';
  }
  if (els.teacherEngagementClasses) {
    const rows = data.classInsights || [];
    els.teacherEngagementClasses.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${index + 1}. ${escapeHtml(row.className || row.classCode || 'Class')}</strong><div class="small subtle">${escapeHtml(String(row.trackedStudents || 0))} students · ${escapeHtml(String(row.minutesActive || 0))} mins · ${escapeHtml(String(row.resourceClicks || 0))} clicks · games ${escapeHtml(String(row.gameCompletions || 0))} · best ${escapeHtml(String(row.gameBestPercentage || 0))}%</div></div></div>`).join('')
      : '<p class="subtle">No class insights yet.</p>';
  }
  if (els.teacherEngagementFollowUp) {
    const rows = data.followUp || [];
    els.teacherEngagementFollowUp.innerHTML = rows.length
      ? rows.map((row) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || 'No class')} · ${escapeHtml(String(row.score || 0))} points · games ${escapeHtml(String(row.gameCompletions || 0))} · best ${escapeHtml(String(row.gameBestPercentage || 0))}% · last seen ${escapeHtml(formatDateTime(row.lastSeen))}</div></div></div>`).join('')
      : '<p class="subtle">No follow-up flags yet.</p>';
  }
  if (els.teacherEngagementParticipation) {
    const rows = data.participationRows || [];
    els.teacherEngagementParticipation.innerHTML = rows.length
      ? rows.map((row, index) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;"><div><strong>${escapeHtml(String(index + 1))}. ${escapeHtml(row.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(String(row.minutesActive || 0))} mins · ${escapeHtml(String(row.pagesVisited || 0))} pages · ${escapeHtml(String(row.resourceClicks || 0))} interactions · last seen ${escapeHtml(formatDateTime(row.lastSeen))}</div><div class="small subtle" style="margin-top:4px;">Main focus: ${escapeHtml(formatTeacherTopPagesList(row.topPages || []))}</div></div><div class="badge-row"><span class="badge">Score ${escapeHtml(String(row.score || 0))}</span><span class="badge">Videos ${escapeHtml(String(row.videoClicks || 0))}</span><span class="badge">Podcasts ${escapeHtml(String(row.podcastClicks || 0))}</span><span class="badge">Quizzes ${escapeHtml(String(row.quizAttempts || 0))}</span><span class="badge">Games ${escapeHtml(String(row.gameCompletions || 0))}</span><span class="badge">Best ${escapeHtml(String(row.gameBestPercentage || 0))}%</span></div></div></div>`).join('')
      : '<p class="subtle">No tracked student participation yet. Launch iMedia Genius from Useful links to start collecting visits.</p>';
  }
  if (els.teacherEngagementPageWatch) {
    const rows = data.pageWatch || [];
    els.teacherEngagementPageWatch.innerHTML = rows.length
      ? rows.map((row) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${escapeHtml(row.studentName || 'Student')}</strong><div class="small subtle">${escapeHtml(row.className || row.classCode || 'No class')} · ${escapeHtml(row.pageTitle || row.pagePath || 'Page')}</div><div class="small subtle">${escapeHtml(row.pagePath || '')} · ${escapeHtml(String(row.minutesActive || 0))} mins · ${escapeHtml(formatDateTime(row.lastSeen))}</div></div></div>`).join('')
      : '<p class="subtle">No tracked page visits yet.</p>';
  }
  if (els.teacherEngagementRecent) {
    const recent = data.recent || [];
    els.teacherEngagementRecent.innerHTML = recent.length
      ? recent.map((item) => `<div class="assignment-card" style="padding:12px 14px;margin-bottom:10px;"><div><strong>${escapeHtml(item.studentName || item.displayName || 'Student')}</strong><div class="small subtle">${escapeHtml(formatRecentActivityLabel(item))} · ${escapeHtml(formatDateTime(item.createdAt))}</div></div></div>`).join('')
      : '<p class="subtle">No tracked activity yet. Student visits from the useful links will appear here.</p>';
  }
}


// ─── Event wiring ──────────────────────────────────────────────────────────────

function wireEvents() {
  wireTrackedUsefulLinks();
  // Nav
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const route = btn.dataset.route;
      if (!state.currentUser) {
        setRoute(route); renderStrands(); renderWorksheet();
        showAlert('Please sign in to continue.', 'warn'); return;
      }
      setRoute(route);
      if (route === 'home')      { renderStrands(); }
      if (route === 'worksheet') { renderWorksheet(); }
      if (route === 'teacher')   { await loadTeacherDashboard(); }
      if (route === 'engagement') { await loadTeacherEngagement(); }
      if (route === 'admin')     { await loadAdminPanel(); }
    });
  });

  // Header auth buttons
  els.btnSignIn?.addEventListener('click', () => {
    document.getElementById('authPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  els.btnSignOut?.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } finally {
      window.location.reload();
    }
  });

  // Login / Register
  els.btnEmailLogin?.addEventListener('click', async (e) => {
    e.preventDefault();
    try { await loginEmail(); }
    catch (err) { showAlert(err.message || 'Unable to log in.', 'error'); }
  });
  els.btnRegister?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (state.registerInFlight) return;
    try { await registerEmail(); }
    catch (err) { showAlert(err.message || 'Unable to register.', 'error'); }
  });

  // Strand search
  els.searchStrands?.addEventListener('input', (e) => filterStrands(e.target.value));

  // Teacher refresh
  els.btnRefreshTeacher?.addEventListener('click', async () => {
    try { await loadTeacherDashboard(); showAlert('Dashboard refreshed.', 'good'); }
    catch (err) { showAlert(err.message, 'error'); }
  });

  els.btnRefreshEngagement?.addEventListener('click', async () => {
    try { await loadTeacherEngagement(); showAlert('Engagement dashboard refreshed.', 'good'); }
    catch (err) { showAlert(err.message || 'Unable to refresh engagement dashboard.', 'error'); }
  });

  els.btnOpenEngagementDashboard?.addEventListener('click', async () => {
    setRoute('engagement');
    await loadTeacherEngagement();
  });

  els.btnStudentTrackingNoticeClose?.addEventListener('click', () => {
    hideStudentTrackingNotice(true);
  });

  els.btnStudentTrackingNoticeR093?.addEventListener('click', async () => {
    const href = document.querySelector('a.nav-link-external[data-track-handoff="true"][href*="imediagenius.co.uk"]')?.getAttribute('href') || 'https://imediagenius.co.uk/';
    hideStudentTrackingNotice(true);
    await openTrackedExternalLink(href, 'R093 Exam');
  });

  els.engagementClassFilter?.addEventListener('change', async () => {
    state.engagementSelectedClassId = els.engagementClassFilter.value || 'all';
    await loadTeacherEngagement();
  });

  els.btnTeacherCreateClass?.addEventListener('click', async () => {
    const className = els.teacherCreateClassName?.value.trim();
    if (!className) { showAlert('Enter a class name first.', 'warn'); return; }
    try {
      els.btnTeacherCreateClass.disabled = true;
      const res = await callTeacherCreateClass({ className });
      if (els.teacherCreateClassName) els.teacherCreateClassName.value = '';
      await loadTeacherDashboard();
      showAlert(`Class created. Code: ${res.data.classCode}`, 'good');
    } catch (err) {
      showAlert(err.message || 'Could not create class.', 'error');
    } finally {
      els.btnTeacherCreateClass.disabled = false;
    }
  });

  els.teacherClassFilter?.addEventListener('change', () => {
    state.teacherSelectedClassId = els.teacherClassFilter.value || 'all';
    if ((state.teacherSelectedRagClassId || 'all') === 'all') {
      state.teacherSelectedRagClassId = state.teacherSelectedClassId;
    }
    loadTeacherDashboard();
  });
  els.teacherRagClassFilter?.addEventListener('change', () => {
    state.teacherSelectedRagClassId = els.teacherRagClassFilter.value || 'all';
    loadTeacherDashboard();
  });
  els.teacherClassSort?.addEventListener('change', () => {
    state.teacherSortMode = els.teacherClassSort.value || 'name-asc';
    loadTeacherDashboard();
  });
  els.teacherStudentSearch?.addEventListener('input', () => {
    state.teacherSearchTerm = els.teacherStudentSearch.value || '';
    loadTeacherDashboard();
  });

  els.btnEditStudentClass?.addEventListener('click', () => {
    state.studentClassEditMode = true;
    if (els.studentClassCodeInput) els.studentClassCodeInput.value = state.currentUserProfile?.classCode || '';
    renderStudentClassPanel();
  });
  els.btnCancelStudentClass?.addEventListener('click', () => {
    state.studentClassEditMode = false;
    if (els.studentClassCodeInput) els.studentClassCodeInput.value = '';
    renderStudentClassPanel();
  });
  els.studentCamnatPinInput?.addEventListener('input', () => {
    const digits = String(els.studentCamnatPinInput.value || '').replace(/\D/g, '').slice(0, 6);
    els.studentCamnatPinInput.value = digits;
  });
  els.btnEditStudentCamnatPin?.addEventListener('click', () => {
    state.studentCamnatPinEditMode = true;
    if (els.studentCamnatPinInput) els.studentCamnatPinInput.value = String(state.currentUserProfile?.camnatPin || '').replace(/\D/g, '').slice(0, 6);
    renderStudentClassPanel();
  });
  els.btnCancelStudentCamnatPin?.addEventListener('click', () => {
    state.studentCamnatPinEditMode = false;
    if (els.studentCamnatPinInput) els.studentCamnatPinInput.value = '';
    renderStudentClassPanel();
  });
  els.btnSaveStudentCamnatPin?.addEventListener('click', async () => {
    const nextPin = String(els.studentCamnatPinInput?.value || '').replace(/\D/g, '').slice(0, 6);
    if (!/^\d{6}$/.test(nextPin)) { showAlert('Enter a valid 6-digit CAMNAT PIN.', 'warn'); return; }
    try {
      els.btnSaveStudentCamnatPin.disabled = true;
      const res = await callStudentUpdateCamnatPin({ camnatPin: nextPin });
      state.currentUserProfile = { ...(state.currentUserProfile || {}), ...res.data };
      state.studentCamnatPinEditMode = false;
      if (els.studentCamnatPinInput) els.studentCamnatPinInput.value = '';
      renderStudentClassPanel();
      showAlert('CAMNAT PIN saved.', 'good');
    } catch (err) {
      showAlert(err.message || 'Could not save CAMNAT PIN.', 'error');
    } finally {
      els.btnSaveStudentCamnatPin.disabled = false;
    }
  });
  els.btnClearStudentCamnatPin?.addEventListener('click', async () => {
    try {
      els.btnClearStudentCamnatPin.disabled = true;
      const res = await callStudentUpdateCamnatPin({ camnatPin: '' });
      state.currentUserProfile = { ...(state.currentUserProfile || {}), ...res.data };
      state.studentCamnatPinEditMode = false;
      if (els.studentCamnatPinInput) els.studentCamnatPinInput.value = '';
      renderStudentClassPanel();
      showAlert('CAMNAT PIN cleared.', 'good');
    } catch (err) {
      showAlert(err.message || 'Could not clear CAMNAT PIN.', 'error');
    } finally {
      els.btnClearStudentCamnatPin.disabled = false;
    }
  });

  els.btnSaveStudentClass?.addEventListener('click', async () => {
    const nextCode = (els.studentClassCodeInput?.value || '').trim().toUpperCase();
    if (!nextCode) { showAlert('Enter a class code first.', 'warn'); return; }
    try {
      els.btnSaveStudentClass.disabled = true;
      const res = await callStudentUpdateClass({ classCode: nextCode });
      state.currentUserProfile = { ...(state.currentUserProfile || {}), ...res.data };
      state.studentClassEditMode = false;
      if (els.studentClassCodeInput) els.studentClassCodeInput.value = '';
      await loadStudentAssignments();
      renderStudentClassPanel();
      showAlert('Class code updated.', 'good');
    } catch (err) {
      showAlert(err.message || 'Could not update class code.', 'error');
    } finally {
      els.btnSaveStudentClass.disabled = false;
    }
  });

  els.btnTeacherAssignTask?.addEventListener('click', async () => {
    try {
      const classCode = els.teacherAssignClass?.value || '';
      const className = els.teacherAssignClass?.selectedOptions?.[0]?.dataset?.name || classCode;
      const strandId = els.teacherAssignStrand?.value || '';
      const deadline = els.teacherAssignDeadline?.value || '';
      if (!classCode || !strandId) throw new Error('Choose a class and strand first.');
      els.btnTeacherAssignTask.disabled = true;
      await callTeacherCreateAssignment({ classCode, className, strandId, deadline });
      await loadTeacherDashboard();
      showAlert('Task assigned.', 'good');
    } catch (err) {
      showAlert(err.message || 'Unable to assign task.', 'error');
    } finally {
      els.btnTeacherAssignTask.disabled = false;
    }
  });

  els.adminUserSearch?.addEventListener('input', () => {
    if (state.adminUsers) renderAdminUsers(state.adminUsers);
  });

  // Admin: refresh
  els.btnRefreshAdmin?.addEventListener('click', async () => {
    try { await loadAdminPanel(); showAlert('Admin data refreshed.', 'good'); }
    catch (err) { showAlert(err.message, 'error'); }
  });

  // Admin: seed worksheets
  els.btnAdminSeedWorksheets?.addEventListener('click', async () => {
    try {
      els.btnAdminSeedWorksheets.disabled = true;
      els.btnAdminSeedWorksheets.textContent = 'Seeding…';
      const res = await callSeedWorksheetBank({});
      await loadStrands(); renderStrands();
      const seededAt = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
      if (els.lastSeededNote) els.lastSeededNote.textContent = `Last seeded: ${seededAt}`;
      showAlert(`Seeded ${res.data.seeded} strands with server-side answer keys.`, 'good');
    } catch (err) {
      showAlert(err.message || 'Seed failed.', 'error');
    } finally {
      els.btnAdminSeedWorksheets.disabled = false;
      els.btnAdminSeedWorksheets.textContent = 'Seed worksheet bank';
    }
  });

  // Admin: add domain
  els.btnAdminAddDomain?.addEventListener('click', async () => {
    const raw = els.adminNewDomain?.value.trim().toLowerCase().replace(/^@/, '');
    if (!raw) { showAlert('Enter a domain name, e.g. garibaldischool.co.uk', 'warn'); return; }
    const current = getCurrentDomainList();
    if (current.includes(raw)) { showAlert('Domain already in the list.', 'warn'); return; }
    await saveDomains([...current, raw]);
    if (els.adminNewDomain) els.adminNewDomain.value = '';
  });

  // Toggle login / register mode in the auth panel
  document.getElementById('btnSwitchToRegister')?.addEventListener('click', () => setAuthMode('register'));
  document.getElementById('btnSwitchToLogin')?.addEventListener('click',    () => setAuthMode('login'));
  document.querySelectorAll('[data-register-role]').forEach((btn) => btn.addEventListener('click', () => setRegisterRole(btn.dataset.registerRole || 'student')));

  // Logged-out CTA buttons
  document.getElementById('btnGetStarted')?.addEventListener('click', () => {
    setAuthMode('login');
    document.getElementById('authPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('btnCreateAccount')?.addEventListener('click', () => {
    setAuthMode('register');
    document.getElementById('authPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Onboarding nudge — open first strand
  document.getElementById('btnStartFirstStrand')?.addEventListener('click', () => {
    const firstStrand = state.strands[0];
    if (firstStrand) {
      state.activeStrandId = firstStrand.id;
      setRoute('worksheet');
      renderWorksheet();
    }
  });

  // Forgot password
  document.getElementById('btnForgotPassword')?.addEventListener('click', async () => {
    const email = els.email?.value.trim();
    if (!email) {
      showAlert('Enter your email address above first.', 'warn');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showAlert('Password reset email sent to ' + email + '. Check your inbox.', 'good');
    } catch (err) {
      showAlert(err.message || 'Unable to send reset email.', 'error');
    }
  });

  // Resend verification email
  document.getElementById('btnResendVerification')?.addEventListener('click', async () => {
    const email = window._pendingVerifyEmail;
    const pass  = window._pendingVerifyPassword;
    if (!email || !pass) { showAlert('Please log in first to resend verification.', 'warn'); return; }
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(credential.user);
      await signOut(auth);
      showAlert('Verification email resent to ' + email + '. Check your inbox.', 'good');
    } catch (err) {
      showAlert(err.message || 'Could not resend verification email.', 'error');
    }
  });
}

function setRegisterRole(nextRole = 'student') {
  registerRole = nextRole === 'teacher' ? 'teacher' : 'student';
  document.querySelectorAll('[data-register-role]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.registerRole === registerRole);
  });
  const classCodeField = document.getElementById('classCodeField');
  if (classCodeField) classCodeField.style.display = registerRole === 'student' ? '' : 'none';
  const registerRoleHelp = document.getElementById('registerRoleHelp');
  if (registerRoleHelp) {
    registerRoleHelp.textContent = registerRole === 'student'
      ? 'Students join a class using a class code.'
      : 'Teachers do not need a class code.';
  }
  const teacherApprovalNote = document.getElementById('teacherApprovalNote');
  if (teacherApprovalNote) teacherApprovalNote.classList.toggle('hidden', registerRole !== 'teacher');
  const switchLabel = document.getElementById('btnSwitchToRegister');
  if (switchLabel) switchLabel.textContent = registerRole === 'teacher' ? 'New teacher? Create account' : 'New user? Create account';
  if (registerRole === 'teacher' && els.classCode) els.classCode.value = '';
}

// ─── Auth panel mode toggle (login / register) ─────────────────────────────────

function setAuthMode(mode) {
  const isRegister = mode === 'register';
  const registerExtras = document.getElementById('registerExtras');
  if (registerExtras) registerExtras.classList.toggle('hidden', !isRegister);
  // Display name — only needed for registration
  const nameField = document.getElementById('displayNameField');
  if (nameField) nameField.style.display = isRegister ? '' : 'none';
  const roleField = document.getElementById('registerRoleField');
  if (roleField) roleField.style.display = isRegister ? '' : 'none';
  const classCodeField = document.getElementById('classCodeField');
  if (classCodeField) classCodeField.style.display = isRegister && registerRole === 'student' ? '' : 'none';
  const teacherApprovalNote = document.getElementById('teacherApprovalNote');
  if (teacherApprovalNote) teacherApprovalNote.classList.toggle('hidden', !(isRegister && registerRole === 'teacher'));
  // Button visibility
  document.getElementById('btnEmailLogin')?.classList.toggle('hidden',  isRegister);
  document.getElementById('btnRegister')?.classList.toggle('hidden',   !isRegister);
  // Switch link text
  document.getElementById('btnSwitchToRegister')?.classList.toggle('hidden',  isRegister);
  document.getElementById('btnSwitchToLogin')?.classList.toggle('hidden',    !isRegister);
  // Forgot password — login mode only
  const forgotBlock = document.getElementById('forgotPasswordBlock');
  if (forgotBlock) forgotBlock.style.display = isRegister ? 'none' : '';
  // Panel heading
  const heading = document.getElementById('authPanelHeading');
  if (heading) heading.textContent = isRegister ? 'Create account' : 'Sign in';
}

// ─── Auth state ────────────────────────────────────────────────────────────────

async function handleAuthChange(user) {
  if (state.pendingRegistration && user && (!state.pendingRegistrationUid || state.pendingRegistrationUid === user.uid)) {
    return;
  }

  state.currentUser = user;
  els.btnSignOut?.classList.toggle('hidden', !user);
  els.btnSignIn?.classList.toggle('hidden',  !!user);

  if (!user) {
    state.currentUserProfile = null;
    state.progress = null;
    state.assignedTasks = [];
    state.studentClassEditMode = false;
    if (els.taskNotifications) els.taskNotifications.style.display = 'none';
    updateNavTaskBadge();
    state.studentEngagement = null;
    state.teacherEngagement = null;
    state.badges = null;
    updateStudentBadgesVisibility();
    hideStudentTrackingNotice(false);
    renderStudentEngagement();
    renderTeacherEngagement();
    document.title = 'iMedia Genius Worksheets · OCR Creative iMedia R093';
    updateStudentMetrics();
    updateNavVisibility();
    await loadStrands();
    renderStrands();      // will show loggedOutHero
    renderWorksheet();
    return;
  }

  // Load profile first so we can check role
  await ensureUserProfile(user);
  updateStudentBadgesVisibility();

  // Students must verify email before accessing the system, and new teachers must be approved
  const r = role();
  if (r === 'student' && !user.emailVerified) {
    await signOut(auth);
    showAlert('Please verify your email before logging in. Check your inbox for a verification link.', 'warn');
    document.getElementById('verifyResendBlock')?.classList.remove('hidden');
    return;
  }
  if (r === PENDING_TEACHER_ROLE) {
    await signOut(auth);
    const pendingMsg = user.emailVerified
      ? 'Your teacher account is waiting for admin approval. Please ask an admin to approve your account.'
      : 'Please verify your email first. After that, an admin will need to approve your teacher account before you can log in.';
    showAlert(pendingMsg, 'warn');
    if (!user.emailVerified) document.getElementById('verifyResendBlock')?.classList.remove('hidden');
    return;
  }

  await loadStrands();
  await loadProgress();
  await loadStudentAssignments();
  await loadStudentBadges();
  await loadStudentEngagement();
  await loadTeacherEngagement();
  updateNavVisibility();
  renderSidebarAssignedLinks();

  // Route user to their default area
  if (r === 'admin') {
    setRoute('admin');
    await loadAdminPanel();
  } else if (r === 'teacher') {
    setRoute('teacher');
    await loadTeacherDashboard();
  } else {
    setRoute('home');
    renderStrands();
    renderWorksheet();
    renderStudentClassPanel();
    maybeShowStudentTrackingNotice();
    // Onboarding nudge for students with zero completed strands
    const completedCount = Object.values(state.progress?.strands || {}).filter((s) => s.completed).length;
    const startedCount   = Object.values(state.progress?.strands || {}).filter((s) => s.startedAt).length;
    if (els.onboardingNudge) {
      els.onboardingNudge.classList.toggle('hidden', completedCount > 0 || startedCount > 0);
    }
  }
}

// ─── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  wireEvents();
  updateStudentBadgesVisibility();
  updateNavVisibility();
  setRegisterRole('student');
  setAuthMode('login'); // default to login view

  try {
    await loadStrands();
  } catch (err) {
    console.error(err);
    showAlert('Could not load strands. Using fallback.', 'warn');
    state.strands = []; state.filteredStrands = [];
  }

  renderStrands();
  state.activeStrandId = state.strands[0]?.id || null;
  renderWorksheet();

  onAuthStateChanged(auth, async (user) => {
    try { await handleAuthChange(user); }
    catch (err) { console.error(err); showAlert(err.message || 'Auth error.', 'error'); }
  });
}

init().catch((err) => {
  console.error(err);
  showAlert(err.message || 'App failed to start.', 'error');
});
