import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import strands from './strands.full.json' with { type: 'json' };

initializeApp();
const db = getFirestore();
const adminAuth = getAuth();
const REGION = 'europe-west2';
const VALID_ROLES = ['admin', 'teacher', 'student', 'teacher_pending'];
const CLASS_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normaliseText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9%\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanClassCode(value = '') {
  return String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
}

function makeClassCode(length = 6) {
  let out = '';
  for (let i = 0; i < length; i += 1) out += CLASS_CODE_ALPHABET[Math.floor(Math.random() * CLASS_CODE_ALPHABET.length)];
  return out;
}

async function getClassByCodeOrThrow(codeRaw) {
  const code = cleanClassCode(codeRaw);
  if (!code) throw new HttpsError('invalid-argument', 'A class code is required.');
  const snap = await db.collection('classes').where('code', '==', code).limit(1).get();
  if (snap.empty) throw new HttpsError('not-found', 'That class code was not recognised.');
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

async function requireRole(uid, ...roles) {
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in first.');
  const snap = await db.doc(`users/${uid}`).get();
  const role = snap.data()?.role;
  if (!roles.includes(role)) {
    throw new HttpsError('permission-denied', `Requires one of: ${roles.join(', ')}.`);
  }
  return role;
}


async function getUserProfile(uid) {
  if (!uid) return null;
  const snap = await db.doc(`users/${uid}`).get();
  return snap.exists ? { uid: snap.id, ...snap.data() } : null;
}

function isoDateOnly(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function deadlineStatus(deadline) {
  const today = isoDateOnly(new Date().toISOString());
  const due = isoDateOnly(deadline);
  if (!due) return 'no_deadline';
  if (due < today) return 'overdue';
  if (due === today) return 'due_today';
  // due_soon = due within the next 3 days (not today, handled above)
  const dueMs = new Date(due + 'T00:00:00').getTime();
  const todayMs = new Date(today + 'T00:00:00').getTime();
  if ((dueMs - todayMs) / 86400000 <= 3) return 'due_soon';
  return 'upcoming';
}

function buildStudentAssignmentRow(student = {}, assignment = {}, progress = {}) {
  const strandProgress = progress?.strands?.[assignment.strandId] || {};
  const completed = !!strandProgress.completed;
  const inProgress = !completed && !!(strandProgress.startedAt);
  return {
    userId: student.uid || student.userId || '',
    displayName: student.displayName || student.email || 'Student',
    email: student.email || '',
    completed,
    inProgress,
    score: strandProgress.score ?? null,
    lastOpenedAt: strandProgress.lastOpenedAt || null,
    startedAt: strandProgress.startedAt || null,
    updatedAt: strandProgress.updatedAt || null
  };
}



async function getEngagementSessionById(sessionIdRaw = '') {
  const sessionId = String(sessionIdRaw || '').trim();
  if (!sessionId) return null;
  const snap = await db.doc(`engagementSessions/${sessionId}`).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

function sanitiseGameId(value = '') {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function toDisplayGameTitle(value = '', fallback = 'Game') {
  const raw = String(value || '').trim();
  return raw ? raw.slice(0, 120) : fallback;
}
const STRAND_SOURCE_MATCHERS = (strands || []).map((strand) => {
  const sourceUrl = String(strand?.sourceUrl || '').trim();
  const pathname = sourceUrl ? (() => { try { return new URL(sourceUrl).pathname.toLowerCase(); } catch (_) { return ''; } })() : '';
  return {
    id: String(strand?.id || '').trim(),
    code: String(strand?.code || '').trim(),
    title: String(strand?.title || '').trim(),
    sourceUrl: sourceUrl.toLowerCase(),
    pathname,
    titleNorm: normaliseText(strand?.title || ''),
    codeNorm: normaliseText(strand?.code || '')
  };
}).filter((row) => row.id);

function inferStrandIdFromPagePath(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const lower = raw.toLowerCase();

  for (const row of STRAND_SOURCE_MATCHERS) {
    if (row.sourceUrl && lower.includes(row.sourceUrl)) return row.id;
    if (row.pathname && lower.includes(row.pathname)) return row.id;
    if (row.titleNorm && lower.includes(row.titleNorm.replace(/\s+/g, '-'))) return row.id;
  }

  const topicMatch = lower.match(/topic[-_/](\d{2})/);
  if (topicMatch) return `strand-${topicMatch[1]}`;
  const strandMatch = lower.match(/strand[-_/](\d{2})/);
  if (strandMatch) return `strand-${strandMatch[1]}`;

  return '';
}

const BADGE_DEFINITIONS = [
  { id: 'first_steps', title: 'First Steps', description: 'Complete your first worksheet.', category: 'worksheet', points: 10, check: (ctx) => ctx.worksheet.completedCount >= 1, progress: (ctx) => ({ current: ctx.worksheet.completedCount, target: 1, unit: 'worksheet' }) },
  { id: 'momentum_5', title: 'Momentum', description: 'Complete 5 worksheets.', category: 'worksheet', points: 20, check: (ctx) => ctx.worksheet.completedCount >= 5, progress: (ctx) => ({ current: ctx.worksheet.completedCount, target: 5, unit: 'worksheets' }) },
  { id: 'high_achiever', title: 'High Achiever', description: 'Score 80% or more on a worksheet.', category: 'worksheet', points: 15, check: (ctx) => ctx.worksheet.score80Count >= 1, progress: (ctx) => ({ current: ctx.worksheet.score80Count, target: 1, unit: 'high score' }) },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Score 100% on a worksheet.', category: 'worksheet', points: 25, check: (ctx) => ctx.worksheet.perfectCount >= 1, progress: (ctx) => ({ current: ctx.worksheet.perfectCount, target: 1, unit: 'perfect score' }) },
  { id: 'explorer_3', title: 'Explorer', description: 'Visit 3 different iMedia Genius pages.', category: 'engagement', points: 15, check: (ctx) => ctx.engagement.pagesVisited >= 3, progress: (ctx) => ({ current: ctx.engagement.pagesVisited, target: 3, unit: 'pages' }) },
  { id: 'researcher_5', title: 'Researcher', description: 'Visit 5 different iMedia Genius pages.', category: 'engagement', points: 20, check: (ctx) => ctx.engagement.pagesVisited >= 5, progress: (ctx) => ({ current: ctx.engagement.pagesVisited, target: 5, unit: 'pages' }) },
  { id: 'deep_diver', title: 'Deep Diver', description: 'Spend 20 active minutes revising.', category: 'engagement', points: 20, check: (ctx) => ctx.engagement.minutesActive >= 20, progress: (ctx) => ({ current: ctx.engagement.minutesActive, target: 20, unit: 'minutes' }) },
  { id: 'resource_hunter', title: 'Resource Hunter', description: 'Open 5 revision resources.', category: 'engagement', points: 15, check: (ctx) => ctx.engagement.resourceClicks >= 5, progress: (ctx) => ({ current: ctx.engagement.resourceClicks, target: 5, unit: 'resources' }) },
  { id: 'revision_regular', title: 'Revision Regular', description: 'Revise on 3 separate days.', category: 'engagement', points: 20, check: (ctx) => ctx.engagement.activeDays >= 3, progress: (ctx) => ({ current: ctx.engagement.activeDays, target: 3, unit: 'days' }) },
  { id: 'read_it_do_it', title: 'Read it, Do it', description: 'View strand content and complete the matching worksheet.', category: 'hybrid', points: 25, check: (ctx) => ctx.hybrid.viewedAndCompletedCount >= 1, progress: (ctx) => ({ current: ctx.hybrid.viewedAndCompletedCount, target: 1, unit: 'strand' }) },
  { id: 'task_finisher', title: 'Task Finisher', description: 'Complete all currently assigned worksheets.', category: 'hybrid', points: 25, check: (ctx) => ctx.hybrid.assignedCompleted && ctx.hybrid.assignedCount > 0, progress: (ctx) => ({ current: ctx.hybrid.completedAssignedCount, target: ctx.hybrid.assignedCount || 1, unit: 'assigned tasks' }) }
];

async function getWorksheetBadgeStats(uid) {
  const snap = await db.doc(`progress/${uid}`).get();
  const row = snap.exists ? snap.data() : { strands: {} };
  const strandRows = Object.values(row?.strands || {});
  return {
    completedCount: strandRows.filter((s) => !!s?.completed).length,
    score80Count: strandRows.filter((s) => Number(s?.score || 0) >= 80).length,
    score90Count: strandRows.filter((s) => Number(s?.score || 0) >= 90).length,
    perfectCount: strandRows.filter((s) => Number(s?.score || 0) >= 100).length,
    completedStrandIds: strandRows.filter((s) => !!s?.completed).map((s) => String(s?.strandId || '')).filter(Boolean)
  };
}

async function getEngagementRows(uid, limit = 500) {
  const snap = await db.collection('engagementEvents')
    .where('userId', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getEngagementBadgeStats(uid) {
  const rows = await getEngagementRows(uid, 500);
  const summary = summariseEvents(rows);
  const viewedStrandIds = new Set();
  for (const row of rows) {
    const strandId = inferStrandIdFromPagePath(row?.pagePath || row?.pageUrl || row?.pageTitle || '');
    if (strandId) viewedStrandIds.add(strandId);
  }
  return { ...summary, viewedStrandIds: [...viewedStrandIds] };
}

async function getHybridBadgeStats(uid) {
  const [worksheet, engagement, userSnap, assignmentsSnap] = await Promise.all([
    getWorksheetBadgeStats(uid),
    getEngagementBadgeStats(uid),
    db.doc(`users/${uid}`).get(),
    db.collection('assignedTasks').where('active', '==', true).get()
  ]);

  const user = userSnap.exists ? (userSnap.data() || {}) : {};
  const completedSet = new Set(worksheet.completedStrandIds || []);
  const viewedSet = new Set(engagement.viewedStrandIds || []);
  const classCode = cleanClassCode(user?.classCode || '');
  const assignedRows = assignmentsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((row) => cleanClassCode(row?.classCode || '') === classCode);
  const assignedStrandIds = [...new Set(assignedRows.map((row) => String(row?.strandId || '')).filter(Boolean))];
  const completedAssignedCount = assignedStrandIds.filter((id) => completedSet.has(id)).length;

  return {
    viewedAndCompletedCount: [...completedSet].filter((id) => viewedSet.has(id)).length,
    assignedCount: assignedStrandIds.length,
    completedAssignedCount,
    assignedCompleted: assignedStrandIds.length > 0 && completedAssignedCount >= assignedStrandIds.length
  };
}

async function evaluateAndAwardBadges(uid) {
  const [worksheet, engagement, hybrid] = await Promise.all([
    getWorksheetBadgeStats(uid),
    getEngagementBadgeStats(uid),
    getHybridBadgeStats(uid)
  ]);

  const ctx = { worksheet, engagement, hybrid };
  const ref = db.doc(`userBadges/${uid}`);
  const snap = await ref.get();
  const existing = snap.exists ? (snap.data() || {}) : { userId: uid, earned: {} };
  const earned = { ...(existing.earned || {}) };
  const newlyAwarded = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (earned[badge.id]) continue;
    if (!badge.check(ctx)) continue;
    earned[badge.id] = {
      badgeId: badge.id,
      title: badge.title,
      description: badge.description,
      category: badge.category,
      points: badge.points || 0,
      earnedAt: new Date().toISOString()
    };
    newlyAwarded.push({
      badgeId: badge.id,
      title: badge.title,
      description: badge.description,
      category: badge.category,
      points: badge.points || 0
    });
  }

  const allEarned = Object.values(earned);
  const totalPoints = allEarned.reduce((sum, item) => sum + Number(item?.points || 0), 0);

  await ref.set({
    userId: uid,
    badgeCount: allEarned.length,
    totalPoints,
    earned,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return { badgeCount: allEarned.length, totalPoints, newlyAwarded, earned, ctx };
}

// ─── Marking helpers ──────────────────────────────────────────────────────────

function scoreContainsAny(answer, keywords = []) {
  const text = normaliseText(answer);
  return keywords.some((keyword) => text.includes(normaliseText(keyword))) ? 1 : 0;
}

function normaliseCriteriaGroups(groups = []) {
  if (!Array.isArray(groups)) return [];
  return groups
    .map((group) => {
      if (Array.isArray(group)) return { terms: group.filter(Boolean) };
      if (group && typeof group === 'object') {
        const terms = Array.isArray(group.terms)
          ? group.terms.filter(Boolean)
          : Array.isArray(group.keywords)
            ? group.keywords.filter(Boolean)
            : [];
        return { ...group, terms };
      }
      return null;
    })
    .filter((group) => group && Array.isArray(group.terms) && group.terms.length);
}

function sanitiseQuestionForFirestore(question = {}) {
  const safe = { ...question };
  if (safe.type === 'explain' && Array.isArray(safe.criteria)) {
    safe.criteria = normaliseCriteriaGroups(safe.criteria);
  }
  return safe;
}

function scoreKeywordGroups(answer, groups = []) {
  const text = normaliseText(answer);
  const safeGroups = normaliseCriteriaGroups(groups);
  if (!safeGroups.length) return 0;
  let hits = 0;
  for (const group of safeGroups) {
    if (group.terms.some((term) => text.includes(normaliseText(term)))) hits += 1;
  }
  return hits;
}

function hasMeaningfulAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.some((item) => normaliseText(item).length > 0);
  }
  return normaliseText(answer).length > 0;
}

function markQuestion(question, answer) {
  const response = typeof answer === 'string' ? answer : Array.isArray(answer) ? answer.join(' | ') : '';
  const safeAnswer = response || '';

  if (!hasMeaningfulAnswer(answer)) {
    return {
      awarded: 0,
      maxMarks: question.marks || 1,
      confidence: 0.99,
      feedback: 'No answer given.'
    };
  }

  if (question.type === 'mcq') {
    const awarded = normaliseText(safeAnswer) === normaliseText(question.answer);
    return { awarded: awarded ? question.marks : 0, maxMarks: question.marks, confidence: awarded ? 1 : 0.5,
      feedback: awarded ? 'Correct.' : 'The selected answer was not the best match for the topic content.' };
  }
  if (question.type === 'multi_select') {
    const expected = [...question.answer].map(normaliseText).sort().join('|');
    const actual = [...(Array.isArray(answer) ? answer : [])].map(normaliseText).sort().join('|');
    const awarded = expected === actual;
    return { awarded: awarded ? question.marks : 0, maxMarks: question.marks, confidence: awarded ? 1 : 0.6,
      feedback: awarded ? 'Correct selections.' : 'One or more selections did not match the expected set.' };
  }
  if (question.type === 'short_text') {
    const hits = scoreContainsAny(safeAnswer, question.accepted || []);
    return { awarded: hits ? question.marks : 0, maxMarks: question.marks, confidence: hits ? 0.88 : 0.64,
      feedback: hits ? 'Key term identified.' : 'A key term was missing.' };
  }
  if (question.type === 'explain') {
    const criteriaGroups = normaliseCriteriaGroups(question.criteria || []);
    const hits = scoreKeywordGroups(safeAnswer, criteriaGroups);
    const awarded = Math.min(question.marks, hits);
    return { awarded, maxMarks: question.marks, confidence: Math.min(0.95, 0.55 + (hits * 0.18)),
      feedback: awarded === question.marks ? 'The response covered the main expected ideas.'
        : `Covered ${hits}/${criteriaGroups.length} key idea groups. Add more specific detail.` };
  }
  return { awarded: 0, maxMarks: question.marks || 1, confidence: 0.2, feedback: 'Question type not configured.' };
}

function markWorksheet(strand, answers = {}) {
  const results = strand.questions.map((question) => {
    const answer = answers[question.id];
    return { id: question.id, prompt: question.prompt, type: question.type, answer, ...markQuestion(question, answer) };
  });
  const totalAwarded = results.reduce((sum, row) => sum + row.awarded, 0);
  const totalMarks = results.reduce((sum, row) => sum + row.maxMarks, 0);
  const percentage = totalMarks ? Math.round((totalAwarded / totalMarks) * 100) : 0;
  const weakAreas = results.filter((row) => row.awarded < row.maxMarks).map((row) => row.prompt).slice(0, 3);
  return { results, totalAwarded, totalMarks, percentage, weakAreas };
}

function publicStrand(strand) {
  return { ...strand, questions: strand.questions.map((q) => ({
    id: q.id, type: q.type, prompt: q.prompt, hint: q.hint || '', marks: q.marks, options: q.options || null
  })) };
}

// ─── Worksheet functions ───────────────────────────────────────────────────────

export const seedWorksheetBank = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin', 'teacher');
  const batch = db.batch();
  const now = FieldValue.serverTimestamp();
  for (const strand of strands) {
    const safeQuestions = (strand.questions || []).map(sanitiseQuestionForFirestore);
    batch.set(db.doc(`tasks/${strand.id}`), { ...publicStrand(strand), updatedAt: now, seededBy: request.auth.uid }, { merge: true });
    batch.set(db.doc(`taskKeys/${strand.id}`), { strandId: strand.id, code: strand.code, title: strand.title,
      questions: safeQuestions, updatedAt: now, seededBy: request.auth.uid }, { merge: true });
  }
  await batch.commit();
  return { seeded: strands.length };
});

export const markWorksheetSubmission = onCall({ region: REGION, cors: true }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
  const { strandId, answers, submit = true } = request.data || {};
  if (!strandId) throw new HttpsError('invalid-argument', 'strandId is required.');
  if (!answers || typeof answers !== 'object') throw new HttpsError('invalid-argument', 'answers object is required.');

  const keySnap = await db.doc(`taskKeys/${strandId}`).get();
  if (!keySnap.exists) throw new HttpsError('failed-precondition', 'Worksheet answer key not seeded yet.');
  const key = keySnap.data();
  const marked = markWorksheet({ id: strandId, code: key.code, title: key.title, questions: key.questions || [] }, answers);

  const userSnap = await db.doc(`users/${request.auth.uid}`).get();
  const profile = userSnap.data() || {};
  const progressRef = db.doc(`progress/${request.auth.uid}`);
  const progressSnap = await progressRef.get();
  const existing = progressSnap.exists ? progressSnap.data() : { userId: request.auth.uid, strands: {} };
  const strandsMap = { ...(existing.strands || {}) };
  const existingStrand = strandsMap[strandId] || {};
  strandsMap[strandId] = { strandId, title: key.title, code: key.code, answers, score: marked.percentage,
    lastResult: marked, completed: !!submit, startedAt: existingStrand.startedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString() };

  await progressRef.set({ userId: request.auth.uid,
    displayName: profile.displayName || request.auth.token.name || request.auth.token.email || 'Student',
    email: request.auth.token.email || '',
    teacherId: profile.teacherId || '',
    teacherName: profile.teacherName || '',
    classId: profile.classId || '',
    classCode: profile.classCode || '',
    className: profile.className || '',
    strands: strandsMap,
    updatedAt: new Date().toISOString() }, { merge: true });

  let badgeResult = { newlyAwarded: [] };
  if (submit) {
    await db.collection('submissions').add({ userId: request.auth.uid,
      userName: profile.displayName || request.auth.token.name || request.auth.token.email || 'Student',
      classId: profile.classId || '', className: profile.className || '', teacherId: profile.teacherId || '',
      strandId, strandTitle: key.title, answers, result: marked, createdAt: new Date().toISOString() });
    await db.collection('markingResults').add({ userId: request.auth.uid, strandId, score: marked.percentage,
      totalAwarded: marked.totalAwarded, totalMarks: marked.totalMarks, weakAreas: marked.weakAreas,
      createdAt: new Date().toISOString() });
    badgeResult = await evaluateAndAwardBadges(request.auth.uid);
  }
  return { result: marked, badges: badgeResult.newlyAwarded || [] };
});


export const validateClassCode = onCall({ region: REGION, cors: true }, async (request) => {
  const classData = await getClassByCodeOrThrow(request.data?.classCode || '');
  return {
    classId: classData.id,
    className: classData.name || '',
    classCode: classData.code || '',
    teacherId: classData.teacherId || '',
    teacherName: classData.teacherName || ''
  };
});

export const teacherCreateClass = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'teacher', 'admin');
  const className = String(request.data?.className || '').trim();
  if (!className) throw new HttpsError('invalid-argument', 'className is required.');

  let code = '';
  for (let i = 0; i < 20; i += 1) {
    const candidate = makeClassCode(6);
    const exists = await db.collection('classes').where('code', '==', candidate).limit(1).get();
    if (exists.empty) { code = candidate; break; }
  }
  if (!code) throw new HttpsError('aborted', 'Could not generate a unique class code.');

  const ref = db.collection('classes').doc();
  const teacher = await getUserProfile(request.auth.uid);
  await ref.set({
    name: className,
    code,
    teacherId: request.auth.uid,
    teacherName: teacher?.displayName || teacher?.email || request.auth.token.email || 'Teacher',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return { classId: ref.id, className, classCode: code, teacherId: request.auth.uid };
});

export const studentUpdateCamnatPin = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'student', 'admin');
  const rawPin = String(request.data?.camnatPin || '').trim();
  const camnatPin = rawPin.replace(/\D/g, '').slice(0, 6);
  if (rawPin && !/^\d{6}$/.test(camnatPin)) {
    throw new HttpsError('invalid-argument', 'Enter a valid 6-digit CAMNAT PIN.');
  }

  await db.doc(`users/${request.auth.uid}`).set({
    camnatPin,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { camnatPin };
});

export const studentUpdateClass = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'student', 'admin');
  const classData = await getClassByCodeOrThrow(request.data?.classCode || '');

  const updates = {
    classId: classData.id,
    className: classData.name || '',
    classCode: classData.code || '',
    teacherId: classData.teacherId || '',
    teacherName: classData.teacherName || '',
    updatedAt: FieldValue.serverTimestamp()
  };

  await db.doc(`users/${request.auth.uid}`).set(updates, { merge: true });

  const progressRef = db.doc(`progress/${request.auth.uid}`);
  const progressSnap = await progressRef.get();
  if (progressSnap.exists) {
    await progressRef.set({
      classId: updates.classId,
      className: updates.className,
      classCode: updates.classCode,
      teacherId: updates.teacherId,
      teacherName: updates.teacherName,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  return {
    classId: updates.classId,
    className: updates.className,
    classCode: updates.classCode,
    teacherId: updates.teacherId,
    teacherName: updates.teacherName
  };
});

// ─── Teacher / Student assignments ───────────────────────────────────────────

export const teacherGetDashboard = onCall({ region: REGION, cors: true }, async (request) => {
  const callerRole = await requireRole(request.auth?.uid, 'teacher', 'admin');
  const callerProfile = await getUserProfile(request.auth.uid);

  let studentDocs;
  if (callerRole === 'admin') {
    studentDocs = await db.collection('users').where('role', '==', 'student').get();
  } else {
    studentDocs = await db.collection('users').where('teacherId', '==', request.auth.uid).get();
  }

  const students = studentDocs.docs.map((d) => ({ uid: d.id, ...d.data() }));
  const studentIds = students.map((s) => s.uid);

  const progressDocs = await Promise.all(studentIds.map((uid) => db.doc(`progress/${uid}`).get()));
  const progressRows = progressDocs.filter((d) => d.exists).map((d) => d.data());

  let submissionQuery = db.collection('submissions').orderBy('createdAt', 'desc').limit(200);
  const submissionSnap = await submissionQuery.get();
  const submissionRows = submissionSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((row) => callerRole === 'admin' || studentIds.includes(row.userId));

  let assignmentSnap;
  if (callerRole === 'admin') {
    assignmentSnap = await db.collection('assignedTasks').orderBy('createdAt', 'desc').get();
  } else {
    assignmentSnap = await db.collection('assignedTasks').where('teacherId', '==', request.auth.uid).get();
  }

  let classSnap;
  if (callerRole === 'admin') {
    classSnap = await db.collection('classes').orderBy('name').get();
  } else {
    classSnap = await db.collection('classes').where('teacherId', '==', request.auth.uid).get();
  }

  const classCounts = students.reduce((acc, student) => {
    const code = String(student.classCode || '').trim().toUpperCase();
    if (!code) return acc;
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {});

  const teacherClasses = classSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .map((row) => ({
      classId: row.id,
      classCode: String(row.code || '').trim().toUpperCase(),
      className: row.name || row.code || 'Unnamed class',
      teacherId: row.teacherId || '',
      teacherName: row.teacherName || '',
      count: classCounts[String(row.code || '').trim().toUpperCase()] || 0,
      createdAt: row.createdAt || null,
      updatedAt: row.updatedAt || null
    }))
    .sort((a, b) => String(a.className || '').localeCompare(String(b.className || '')));

  const progressMap = new Map(progressRows.map((row) => [row.userId, row]));
  const assignments = assignmentSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    .map((assignment) => {
      const matchingStudents = students.filter((student) => {
        if (callerRole === 'admin' && assignment.classCode) {
          return (student.classCode || '') === assignment.classCode;
        }
        return (student.classCode || '') === (assignment.classCode || '');
      });
      const studentStatus = matchingStudents.map((student) => buildStudentAssignmentRow(student, assignment, progressMap.get(student.uid) || {}));
      const completedCount = studentStatus.filter((row) => row.completed).length;
      return {
        ...assignment,
        deadlineStatus: deadlineStatus(assignment.deadline || ''),
        targetCount: studentStatus.length,
        completedCount,
        pendingCount: Math.max(0, studentStatus.length - completedCount),
        studentStatus
      };
    });

  const classesWithStudents = students
    .filter((student) => (student.classCode || '').trim())
    .map((student) => ({
      classCode: String(student.classCode || '').trim().toUpperCase(),
      className: student.className || student.classCode,
      count: classCounts[String(student.classCode || '').trim().toUpperCase()] || 0
    }));

  const classOptions = [...new Map(
    [...teacherClasses, ...classesWithStudents].filter((row) => row.classCode).map((row) => [row.classCode, {
      classId: row.classId || '',
      classCode: row.classCode,
      className: row.className || row.classCode,
      teacherId: row.teacherId || '',
      teacherName: row.teacherName || '',
      count: row.count || classCounts[row.classCode] || 0
    }])
  ).values()].sort((a, b) => a.className.localeCompare(b.className));

  return {
    teacher: callerProfile ? {
      uid: callerProfile.uid,
      displayName: callerProfile.displayName || callerProfile.email || 'Teacher',
      email: callerProfile.email || ''
    } : null,
    students,
    progressRows,
    submissionRows,
    assignments,
    classOptions,
    teacherClasses
  };
});

export const teacherCreateAssignment = onCall({ region: REGION, cors: true }, async (request) => {
  const callerRole = await requireRole(request.auth?.uid, 'teacher', 'admin');
  const { strandId, classCode, className = '', deadline = '' } = request.data || {};
  if (!strandId) throw new HttpsError('invalid-argument', 'strandId is required.');
  if (!classCode || !String(classCode).trim()) throw new HttpsError('invalid-argument', 'classCode is required.');

  const taskSnap = await db.doc(`tasks/${strandId}`).get();
  if (!taskSnap.exists) throw new HttpsError('failed-precondition', 'Strand must be seeded before assignment.');
  const task = taskSnap.data() || {};

  const assignmentRef = db.collection('assignedTasks').doc();
  await assignmentRef.set({
    teacherId: request.auth.uid,
    teacherRole: callerRole,
    teacherName: request.auth.token.name || request.auth.token.email || 'Teacher',
    classCode: String(classCode).trim().toUpperCase(),
    className: String(className || classCode).trim(),
    strandId,
    strandCode: task.code || '',
    strandTitle: task.title || strandId,
    deadline: isoDateOnly(deadline),
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return { success: true, id: assignmentRef.id };
});

export const teacherDeleteAssignment = onCall({ region: REGION, cors: true }, async (request) => {
  const callerRole = await requireRole(request.auth?.uid, 'teacher', 'admin');
  const { assignmentId } = request.data || {};
  if (!assignmentId) throw new HttpsError('invalid-argument', 'assignmentId is required.');
  const ref = db.doc(`assignedTasks/${assignmentId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Assignment not found.');
  const data = snap.data() || {};
  if (callerRole !== 'admin' && data.teacherId !== request.auth.uid) {
    throw new HttpsError('permission-denied', 'You can only remove your own assignments.');
  }
  await ref.delete();
  return { success: true };
});

export const teacherDeleteClass = onCall({ region: REGION, cors: true }, async (request) => {
  const callerRole = await requireRole(request.auth?.uid, 'teacher', 'admin');
  const classId = String(request.data?.classId || '').trim();
  const classCodeInput = String(request.data?.classCode || '').trim().toUpperCase();
  if (!classId && !classCodeInput) throw new HttpsError('invalid-argument', 'classId or classCode is required.');

  let classRef = null;
  let classSnap = null;

  if (classId) {
    classRef = db.doc(`classes/${classId}`);
    classSnap = await classRef.get();
  }
  if ((!classSnap || !classSnap.exists) && classCodeInput) {
    const lookup = await db.collection('classes').where('code', '==', classCodeInput).limit(1).get();
    if (!lookup.empty) {
      classSnap = lookup.docs[0];
      classRef = lookup.docs[0].ref;
    }
  }

  if (!classSnap || !classSnap.exists) throw new HttpsError('not-found', 'Class not found.');
  const classData = classSnap.data() || {};
  const classCode = String(classData.code || classCodeInput).trim().toUpperCase();

  if (callerRole !== 'admin' && classData.teacherId !== request.auth.uid) {
    throw new HttpsError('permission-denied', 'You can only delete your own classes.');
  }

  const studentSnap = await db.collection('users').where('classCode', '==', classCode).get();
  const assignmentSnap = await db.collection('assignedTasks').where('classCode', '==', classCode).get();

  const batch = db.batch();
  batch.delete(classRef);
  studentSnap.docs.forEach((docSnap) => {
    const student = docSnap.data() || {};
    if (callerRole === 'admin' || student.teacherId === request.auth.uid || classData.teacherId === request.auth.uid) {
      batch.set(docSnap.ref, {
        classId: '',
        classCode: '',
        className: '',
        teacherId: '',
        teacherName: '',
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      batch.set(db.doc(`progress/${docSnap.id}`), {
        classId: '',
        classCode: '',
        className: '',
        teacherId: '',
        teacherName: '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  });

  assignmentSnap.docs.forEach((docSnap) => {
    const assignment = docSnap.data() || {};
    if (callerRole === 'admin' || assignment.teacherId === request.auth.uid || classData.teacherId === request.auth.uid) {
      batch.delete(docSnap.ref);
    }
  });

  await batch.commit();
  return {
    success: true,
    classCode,
    removedAssignments: assignmentSnap.size,
    unlinkedStudents: studentSnap.size
  };
});

export const studentGetAssignments = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'student', 'admin', 'teacher');
  const profile = await getUserProfile(request.auth.uid);
  if (!profile) throw new HttpsError('not-found', 'Profile not found.');

  let assignments = [];
  if (profile.role === 'student') {
    const classCode = String(profile.classCode || '').trim().toUpperCase();
    if (!classCode) return { assignments: [], classCode: '', className: profile.className || '', teacherId: profile.teacherId || '' };
    const snap = await db.collection('assignedTasks').where('classCode', '==', classCode).where('active', '==', true).get();
    assignments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (profile.teacherId) {
      assignments = assignments.filter((item) => item.teacherId === profile.teacherId);
    }
  } else {
    const dash = await teacherGetDashboard.run ? [] : [];
  }

  const progressSnap = await db.doc(`progress/${request.auth.uid}`).get();
  const progress = progressSnap.exists ? progressSnap.data() : { strands: {} };

  assignments = assignments
    .sort((a, b) => String(a.deadline || '').localeCompare(String(b.deadline || '')) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')))
    .map((assignment) => {
      const strandProgress = progress?.strands?.[assignment.strandId] || {};
      const completed = !!strandProgress.completed;
      const inProgress = !completed && !!(strandProgress.startedAt);
      return {
        ...assignment,
        deadlineStatus: deadlineStatus(assignment.deadline || ''),
        completed,
        inProgress,
        score: strandProgress.score ?? null,
        startedAt: strandProgress.startedAt || null,
        lastOpenedAt: strandProgress.lastOpenedAt || null,
        updatedAt: strandProgress.updatedAt || null
      };
    });

  return {
    assignments,
    classCode: profile.classCode || '',
    className: profile.className || '',
    teacherId: profile.teacherId || ''
  };
});

// ─── Student: update lastOpenedAt when a worksheet is opened ──────────────────
export const studentUpdateLastOpened = onCall({ region: REGION, cors: true }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
  const { strandId } = request.data || {};
  if (!strandId) throw new HttpsError('invalid-argument', 'strandId is required.');

  const progressRef = db.doc('progress/' + request.auth.uid);
  const progressSnap = await progressRef.get();
  const existing = progressSnap.exists ? progressSnap.data() : { userId: request.auth.uid, strands: {} };
  const strandsMap = { ...(existing.strands || {}) };
  const existingStrand = strandsMap[strandId] || {};

  strandsMap[strandId] = {
    ...existingStrand,
    strandId,
    lastOpenedAt: new Date().toISOString(),
    // Mark in_progress only if never completed before
    startedAt: existingStrand.startedAt || new Date().toISOString()
  };

  await progressRef.set({
    userId: request.auth.uid,
    strands: strandsMap,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return { success: true };
});

// ─── Admin: User Management ────────────────────────────────────────────────────

export const adminListUsers = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin');
  const snap = await db.collection('users').orderBy('email').get();
  return { users: snap.docs.map((d) => {
    const data = d.data();
    return { uid: d.id, email: data.email || '', displayName: data.displayName || '',
      role: data.role || 'student', approvalStatus: data.approvalStatus || (data.role === 'teacher_pending' ? 'pending' : 'approved'), createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null };
  }) };
});

export const adminSetUserRole = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin');
  const { targetUid, role } = request.data || {};
  if (!targetUid || !VALID_ROLES.includes(role)) throw new HttpsError('invalid-argument', 'targetUid and valid role required.');
  if (targetUid === request.auth.uid && role !== 'admin') throw new HttpsError('failed-precondition', 'You cannot change your own admin role.');
  await db.doc(`users/${targetUid}`).update({ role, approvalStatus: role === 'teacher_pending' ? 'pending' : 'approved', updatedAt: FieldValue.serverTimestamp() });
  return { success: true };
});

export const adminUpdateUserName = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin');
  const { targetUid, displayName } = request.data || {};
  const cleanedName = String(displayName || '').trim().replace(/\s+/g, ' ');
  if (!targetUid) throw new HttpsError('invalid-argument', 'targetUid is required.');
  if (!cleanedName) throw new HttpsError('invalid-argument', 'displayName is required.');
  if (cleanedName.length > 80) throw new HttpsError('invalid-argument', 'displayName must be 80 characters or fewer.');

  await db.doc(`users/${targetUid}`).set({
    displayName: cleanedName,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  try {
    await adminAuth.updateUser(targetUid, { displayName: cleanedName });
  } catch (err) {
    console.error('Failed to update auth display name', err);
  }

  return { success: true, displayName: cleanedName };
});

export const adminDeleteUser = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin');
  const { targetUid } = request.data || {};
  if (!targetUid) throw new HttpsError('invalid-argument', 'targetUid is required.');
  if (targetUid === request.auth.uid) throw new HttpsError('failed-precondition', 'You cannot delete your own admin account.');

  const submissionSnap = await db.collection('submissions').where('userId', '==', targetUid).get();
  const markingSnap = await db.collection('markingResults').where('userId', '==', targetUid).get();

  const batch = db.batch();
  batch.delete(db.doc(`users/${targetUid}`));
  batch.delete(db.doc(`progress/${targetUid}`));
  submissionSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  markingSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  await batch.commit();

  try {
    await adminAuth.deleteUser(targetUid);
  } catch (err) {
    console.error('Failed to delete auth user', err);
  }

  return { success: true, deletedSubmissions: submissionSnap.size, deletedResults: markingSnap.size };
});

// ─── Admin: Registration Settings ─────────────────────────────────────────────

export const adminGetSettings = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin');
  const snap = await db.doc('settings/registration').get();
  return snap.exists ? snap.data() : { allowedDomains: [] };
});

export const adminUpdateSettings = onCall({ region: REGION, cors: true }, async (request) => {
  await requireRole(request.auth?.uid, 'admin');
  const { allowedDomains } = request.data || {};
  if (!Array.isArray(allowedDomains)) throw new HttpsError('invalid-argument', 'allowedDomains must be an array.');
  const cleaned = allowedDomains.map((d) => String(d).toLowerCase().replace(/^@/, '').trim()).filter(Boolean);
  await db.doc('settings/registration').set({ allowedDomains: cleaned,
    updatedAt: FieldValue.serverTimestamp(), updatedBy: request.auth.uid }, { merge: true });
  return { allowedDomains: cleaned };
});

/** Public – used during registration to validate email domain. */
export const getRegistrationSettings = onCall({ region: REGION, cors: true }, async () => {
  const snap = await db.doc('settings/registration').get();
  return { allowedDomains: snap.exists ? (snap.data().allowedDomains || []) : [] };
});


function allowCors(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }
  return false;
}

function cleanTargetUrl(raw = '') {
  const url = new URL(String(raw || '').trim());
  if (url.protocol !== 'https:') throw new HttpsError('invalid-argument', 'Only https links are allowed.');
  if (url.hostname !== 'imediagenius.co.uk') throw new HttpsError('invalid-argument', 'Target must be imediagenius.co.uk.');
  return url.toString();
}

function engagementScoreFromSummary(summary = {}) {
  return Math.round(
    (Number(summary.pagesVisited || 0) * 5) +
    (Number(summary.resourceClicks || 0) * 8) +
    (Number(summary.quizAttempts || 0) * 12) +
    (Number(summary.gameCompletions || 0) * 15) +
    Math.min(40, Number(summary.minutesActive || 0)) +
    Math.round(Number(summary.gameBestPercentage || 0) / 5)
  );
}

function getRowSearchText(row = {}) {
  return [
    row.eventType,
    row.pageTitle,
    row.pagePath,
    row.pageKind,
    row.pageUrl,
    row.payload?.interactionCategory,
    row.payload?.label,
    row.payload?.text,
    row.payload?.elementType,
    row.payload?.href,
    row.payload?.src,
    row.payload?.mediaType,
    row.payload?.category
  ].filter(Boolean).join(' ').toLowerCase();
}

function inferInteractionBucket(row = {}) {
  const text = getRowSearchText(row);
  if (text.includes('quiz') || text.includes('exam') || text.includes('assessment')) return 'quiz';
  if (text.includes('podcast') || text.includes('audio')) return 'podcast';
  if (text.includes('game')) return 'game';
  if (text.includes('video') || text.includes('youtube')) return 'video';
  if (row.eventType === 'content_interaction') return 'resource';
  return 'other';
}

function summariseEvents(rows = []) {
  const pages = new Set();
  const activeDays = new Set();
  let activeSeconds = 0;
  let resourceClicks = 0;
  let quizAttempts = 0;
  let videoClicks = 0;
  let podcastClicks = 0;
  let gameLaunches = 0;
  let gameCompletions = 0;
  let gameBestPercentage = 0;
  for (const row of rows) {
    if (row.pagePath) pages.add(row.pagePath);
    const createdIso = row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : (row.createdAt || row.recordedAt || '');
    if (createdIso) activeDays.add(String(createdIso).slice(0, 10));
    if (row.eventType === 'page_heartbeat' || row.eventType === 'page_exit') {
      activeSeconds += Number(row.payload?.activeSeconds || 0);
    }
    if (row.eventType === 'content_interaction') {
      resourceClicks += 1;
      const bucket = inferInteractionBucket(row);
      if (bucket === 'quiz') quizAttempts += 1;
      if (bucket === 'video') videoClicks += 1;
      if (bucket === 'podcast') podcastClicks += 1;
      if (bucket === 'game') gameLaunches += 1;
    }
    if (row.eventType === 'game_score_submitted') {
      gameCompletions += 1;
      gameBestPercentage = Math.max(gameBestPercentage, Number(row.payload?.percentage || 0));
      if (!row.pagePath && row.payload?.gameId) pages.add(`game:${row.payload.gameId}`);
    }
  }
  const summary = {
    pagesVisited: pages.size,
    minutesActive: Math.max(0, Math.round(activeSeconds / 60)),
    resourceClicks,
    quizAttempts,
    videoClicks,
    podcastClicks,
    gameLaunches,
    gameCompletions,
    gameBestPercentage,
    activeDays: activeDays.size
  };
  summary.score = engagementScoreFromSummary(summary);
  return summary;
}

function buildTopPages(rows = [], limit = 5) {
  const byPage = new Map();
  const seenVisits = new Set();
  for (const row of rows) {
    const title = row.pageTitle || row.pagePath || 'Untitled page';
    const path = row.pagePath || '/';
    const visitKey = `${row.sessionId || row.userId || 'anon'}|${path}`;
    if (seenVisits.has(visitKey)) continue;
    seenVisits.add(visitKey);
    const current = byPage.get(path) || { pagePath: path, pageTitle: title, visits: 0 };
    current.visits += 1;
    byPage.set(path, current);
  }
  return [...byPage.values()].sort((a,b)=>b.visits-a.visits).slice(0, limit);
}

function buildClassInsights(rows = [], limit = 5) {
  const byClass = new Map();
  for (const row of rows) {
    const key = row.classCode || row.className || 'Unassigned';
    if (!byClass.has(key)) byClass.set(key, []);
    byClass.get(key).push(row);
  }
  return [...byClass.entries()].map(([key, entries]) => {
    const s = summariseEvents(entries);
    return {
      classCode: entries[0]?.classCode || '',
      className: entries[0]?.className || key,
      trackedStudents: new Set(entries.map((r) => r.userId).filter(Boolean)).size,
      minutesActive: s.minutesActive,
      resourceClicks: s.resourceClicks,
      gameCompletions: s.gameCompletions,
      gameBestPercentage: s.gameBestPercentage,
      score: s.score
    };
  }).sort((a,b)=>b.score-a.score).slice(0, limit);
}

function buildFollowUpStudents(rows = [], limit = 5) {
  const byUser = new Map();
  for (const row of rows) {
    const uid = row.userId || '';
    if (!uid) continue;
    if (!byUser.has(uid)) byUser.set(uid, []);
    byUser.get(uid).push(row);
  }
  return [...byUser.entries()].map(([uid, entries]) => {
    const s = summariseEvents(entries);
    const latest = entries
      .map((r) => r.createdAt?.toDate ? r.createdAt.toDate() : null)
      .filter(Boolean)
      .sort((a,b)=>b-a)[0];
    return {
      userId: uid,
      displayName: entries[0]?.studentName || 'Student',
      className: entries[0]?.className || entries[0]?.classCode || 'No class',
      minutesActive: s.minutesActive,
      pagesVisited: s.pagesVisited,
      gameCompletions: s.gameCompletions,
      gameBestPercentage: s.gameBestPercentage,
      score: s.score,
      lastSeen: latest ? latest.toISOString() : ''
    };
  }).sort((a,b)=>a.score-b.score || ((a.lastSeen||'').localeCompare(b.lastSeen||''))).slice(0, limit);
}

function buildInteractionBreakdown(rows = []) {
  const breakdown = { video: 0, podcast: 0, game: 0, quiz: 0, resource: 0 };
  for (const row of rows) {
    if (row.eventType !== 'content_interaction') continue;
    const bucket = inferInteractionBucket(row);
    if (bucket === 'video') breakdown.video += 1;
    else if (bucket === 'podcast') breakdown.podcast += 1;
    else if (bucket === 'game') breakdown.game += 1;
    else if (bucket === 'quiz') breakdown.quiz += 1;
    else breakdown.resource += 1;
  }
  return breakdown;
}

function buildStudentParticipationRows(rows = [], limit = 50) {
  const byUser = new Map();
  for (const row of rows) {
    const uid = row.userId || '';
    if (!uid) continue;
    if (!byUser.has(uid)) byUser.set(uid, []);
    byUser.get(uid).push(row);
  }
  return [...byUser.entries()].map(([uid, entries]) => {
    const summary = summariseEvents(entries);
    const topPages = buildTopPages(entries, 3);
    const latest = entries
      .map((r) => r.createdAt?.toDate ? r.createdAt.toDate() : null)
      .filter(Boolean)
      .sort((a, b) => b - a)[0];
    return {
      userId: uid,
      displayName: entries[0]?.studentName || 'Student',
      classCode: entries[0]?.classCode || '',
      className: entries[0]?.className || '',
      pagesVisited: summary.pagesVisited,
      minutesActive: summary.minutesActive,
      resourceClicks: summary.resourceClicks,
      quizAttempts: summary.quizAttempts,
      videoClicks: summary.videoClicks,
      podcastClicks: summary.podcastClicks,
      gameLaunches: summary.gameLaunches,
      gameCompletions: summary.gameCompletions,
      gameBestPercentage: summary.gameBestPercentage,
      score: summary.score,
      topPages,
      lastSeen: latest ? latest.toISOString() : ''
    };
  }).sort((a, b) => b.score - a.score || b.minutesActive - a.minutesActive).slice(0, limit);
}

function buildTeacherPageWatch(rows = [], limit = 20) {
  return rows
    .filter((row) => row.eventType === 'page_view' || row.eventType === 'page_exit' || row.eventType === 'page_heartbeat')
    .map((row) => ({
      studentName: row.studentName || 'Student',
      classCode: row.classCode || '',
      className: row.className || '',
      pageTitle: row.pageTitle || '',
      pagePath: row.pagePath || '',
      minutesActive: Math.max(0, Math.round(Number(row.payload?.activeSeconds || 0) / 60)),
      lastSeen: row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : ''
    }))
    .sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''))
    .slice(0, limit);
}

export const createEngagementLaunchToken = onCall({ region: REGION, cors: true }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
  const targetUrl = cleanTargetUrl(request.data?.targetUrl || '');
  const profile = await getUserProfile(request.auth.uid);
  if (!profile) throw new HttpsError('failed-precondition', 'User profile missing.');
  const tokenRef = db.collection('engagementLaunchTokens').doc();
  const expiresAtMs = Date.now() + (1000 * 60 * 30);
  await tokenRef.set({
    tokenId: tokenRef.id,
    uid: request.auth.uid,
    email: profile.email || '',
    displayName: profile.displayName || '',
    classCode: profile.classCode || '',
    className: profile.className || '',
    teacherId: profile.teacherId || '',
    teacherName: profile.teacherName || '',
    sourceLabel: request.data?.sourceLabel || 'Useful link',
    sourcePage: request.data?.sourcePage || 'home',
    targetUrl,
    createdAt: FieldValue.serverTimestamp(),
    expiresAtMs,
    usedAt: null,
    sessionId: ''
  });
  const launchUrl = new URL(targetUrl);
  launchUrl.searchParams.set('engagement', tokenRef.id);
  return { token: tokenRef.id, launchUrl: launchUrl.toString(), expiresAtMs };
});

export const createEngagementSessionFromToken = onRequest({ region: REGION }, async (req, res) => {
  if (allowCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const token = String(req.body?.token || '').trim();
    if (!token) return res.status(400).json({ error: 'token_required' });
    const tokenRef = db.doc(`engagementLaunchTokens/${token}`);
    const tokenSnap = await tokenRef.get();
    if (!tokenSnap.exists) return res.status(404).json({ error: 'invalid_token' });
    const tokenData = tokenSnap.data() || {};
    if (Number(tokenData.expiresAtMs || 0) < Date.now()) return res.status(410).json({ error: 'token_expired' });

    let sessionId = tokenData.sessionId || '';
    if (!sessionId) {
      const sessionRef = db.collection('engagementSessions').doc();
      sessionId = sessionRef.id;
      await sessionRef.set({
        sessionId,
        uid: tokenData.uid || '',
        email: tokenData.email || '',
        studentName: tokenData.displayName || '',
        classCode: tokenData.classCode || '',
        className: tokenData.className || '',
        teacherId: tokenData.teacherId || '',
        teacherName: tokenData.teacherName || '',
        sourceLabel: tokenData.sourceLabel || '',
        createdAt: FieldValue.serverTimestamp(),
        expiresAtMs: Date.now() + (1000 * 60 * 60 * 8),
        lastSeenAt: FieldValue.serverTimestamp()
      });
      await tokenRef.set({ usedAt: FieldValue.serverTimestamp(), sessionId }, { merge: true });
    } else {
      await db.doc(`engagementSessions/${sessionId}`).set({ lastSeenAt: FieldValue.serverTimestamp() }, { merge: true });
    }

    return res.status(200).json({
      ok: true,
      sessionId,
      uid: tokenData.uid || '',
      studentName: tokenData.displayName || '',
      classCode: tokenData.classCode || '',
      className: tokenData.className || '',
      expiresAt: Date.now() + (1000 * 60 * 60 * 8)
    });
  } catch (err) {
    console.error('createEngagementSessionFromToken failed', err);
    return res.status(500).json({ error: 'session_create_failed' });
  }
});

export const logEngagementEventHttp = onRequest({ region: REGION }, async (req, res) => {
  if (allowCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const body = req.body || {};
    const events = Array.isArray(body.events) ? body.events : (body.event ? [body.event] : []);
    if (!events.length) return res.status(400).json({ error: 'events_required' });

    const accepted = [];
    for (const item of events.slice(0, 100)) {
      const sessionId = String(item.sessionId || '').trim();
      if (!sessionId) continue;
      const sessionSnap = await db.doc(`engagementSessions/${sessionId}`).get();
      if (!sessionSnap.exists) continue;
      const session = sessionSnap.data() || {};
      const eventRef = db.collection('engagementEvents').doc();
      const payload = item.payload && typeof item.payload === 'object' ? item.payload : {};
      const safeEventType = String(item.eventType || '').slice(0, 100);
      await eventRef.set({
        eventId: eventRef.id,
        sessionId,
        userId: session.uid || '',
        studentName: session.studentName || '',
        classCode: session.classCode || '',
        className: session.className || '',
        teacherId: session.teacherId || '',
        teacherName: session.teacherName || '',
        pagePath: String(item.pagePath || '').slice(0, 200),
        pageTitle: String(item.pageTitle || '').slice(0, 200),
        pageKind: String(item.pageKind || '').slice(0, 80),
        pageUrl: String(item.pageUrl || '').slice(0, 500),
        eventType: safeEventType,
        payload,
        createdAt: FieldValue.serverTimestamp()
      });
      if (session.uid && (safeEventType === 'page_exit' || safeEventType === 'content_interaction')) {
        try { await evaluateAndAwardBadges(session.uid); } catch (badgeErr) { console.warn('badge evaluation failed', badgeErr); }
      }
      accepted.push(eventRef.id);
    }
    return res.status(200).json({ ok: true, accepted: accepted.length });
  } catch (err) {
    console.error('logEngagementEventHttp failed', err);
    return res.status(500).json({ error: 'ingest_failed' });
  }
});


export const submitGameScoreHttp = onRequest({ region: REGION }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });
  try {
    const body = req.body || {};
    const sessionId = String(body.sessionId || '').trim();
    const session = await getEngagementSessionById(sessionId);
    if (!session?.uid || !session?.classCode || !session?.teacherId) {
      return res.status(401).json({ error: 'valid-session-required', message: 'Launch the game from the worksheet app to save class scores.' });
    }

    const score = Math.max(0, Number(body.score || 0));
    const maxScore = Math.max(0, Number(body.maxScore || body.questionsPlayed || 0));
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : Math.max(0, Math.min(100, Number(body.percentage || 0)));
    const gameId = sanitiseGameId(body.gameId || body.topicKey || body.pagePath || 'game');
    const gameTitle = toDisplayGameTitle(body.gameTitle || body.topicLabel || body.pageTitle || gameId, 'Game');
    const topicKey = String(body.topicKey || '').trim();
    const questionsPlayed = Math.max(0, Number(body.questionsPlayed || maxScore || 0));
    const attemptRef = db.collection('gameScores').doc();
    const now = FieldValue.serverTimestamp();
    const displayName = String(session.studentName || body.playerName || 'Student').trim().slice(0, 120);

    const scoreRow = {
      userId: session.uid,
      teacherId: session.teacherId || '',
      classCode: session.classCode || '',
      className: session.className || session.classCode || '',
      studentName: displayName,
      gameId,
      gameTitle,
      topicKey,
      score,
      maxScore,
      percentage,
      questionsPlayed,
      sourcePage: String(body.pagePath || '').trim(),
      sourceUrl: String(body.pageUrl || '').trim(),
      createdAt: now,
      sessionId
    };

    await attemptRef.set(scoreRow);
    await db.collection('engagementEvents').add({
      userId: session.uid,
      sessionId,
      studentName: displayName,
      classCode: session.classCode || '',
      className: session.className || session.classCode || '',
      teacherId: session.teacherId || '',
      eventType: 'game_score_submitted',
      pagePath: gameId,
      pageTitle: gameTitle,
      pageKind: 'game',
      payload: {
        score,
        maxScore,
        percentage,
        questionsPlayed,
        topicKey,
        gameId,
        gameTitle
      },
      createdAt: now
    });

    return res.json({ ok: true, percentage, saved: true, gameId, classCode: session.classCode || '' });
  } catch (error) {
    console.error('submitGameScoreHttp failed', error);
    return res.status(500).json({ error: 'internal', message: 'Unable to save game score right now.' });
  }
});

export const getGameLeaderboardHttp = onRequest({ region: REGION }, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method-not-allowed' });
  try {
    const sessionId = String(req.query.sessionId || '').trim();
    const session = await getEngagementSessionById(sessionId);
    if (!session?.uid || !session?.classCode || !session?.teacherId) {
      return res.status(401).json({ error: 'valid-session-required', message: 'Launch the game from the worksheet app to view class scores.' });
    }
    const gameId = sanitiseGameId(req.query.gameId || req.query.topicKey || '');
    let query = db.collection('gameScores')
      .where('teacherId', '==', session.teacherId)
      .where('classCode', '==', session.classCode)
      .orderBy('createdAt', 'desc')
      .limit(250);
    const snap = await query.get();
    let rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (gameId) rows = rows.filter((row) => row.gameId === gameId || sanitiseGameId(row.topicKey || '') === gameId);

    const bestByUser = new Map();
    for (const row of rows) {
      const key = String(row.userId || '').trim();
      if (!key) continue;
      const current = bestByUser.get(key);
      const created = row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : '';
      const candidate = {
        userId: key,
        displayName: row.studentName || 'Student',
        score: Number(row.score || 0),
        maxScore: Number(row.maxScore || 0),
        percentage: Number(row.percentage || 0),
        gameId: row.gameId || gameId || '',
        gameTitle: row.gameTitle || 'Game',
        createdAt: created
      };
      if (!current || candidate.percentage > current.percentage || (candidate.percentage === current.percentage && candidate.score > current.score) || (candidate.percentage === current.percentage && candidate.score === current.score && candidate.createdAt > current.createdAt)) {
        bestByUser.set(key, candidate);
      }
    }
    const leaderboard = [...bestByUser.values()].sort((a, b) => b.percentage - a.percentage || b.score - a.score || ((b.createdAt || '').localeCompare(a.createdAt || ''))).slice(0, 10);
    const myBestIndex = leaderboard.findIndex((row) => row.userId === session.uid);
    return res.json({ ok: true, leaderboard, classCode: session.classCode || '', className: session.className || session.classCode || '', myRank: myBestIndex >= 0 ? myBestIndex + 1 : null });
  } catch (error) {
    console.error('getGameLeaderboardHttp failed', error);
    return res.status(500).json({ error: 'internal', message: 'Unable to load class leaderboard right now.' });
  }
});

export const studentGetBadges = onCall({ region: REGION, cors: true }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
  const uid = request.auth.uid;
  await evaluateAndAwardBadges(uid);
  const badgeSnap = await db.doc(`userBadges/${uid}`).get();
  const badgeData = badgeSnap.exists ? (badgeSnap.data() || {}) : { userId: uid, earned: {}, badgeCount: 0, totalPoints: 0 };

  const [worksheet, engagement, hybrid] = await Promise.all([
    getWorksheetBadgeStats(uid),
    getEngagementBadgeStats(uid),
    getHybridBadgeStats(uid)
  ]);
  const ctx = { worksheet, engagement, hybrid };
  const earnedMap = badgeData.earned || {};
  const earned = Object.values(earnedMap).sort((a, b) => String(b?.earnedAt || '').localeCompare(String(a?.earnedAt || '')));
  const nextTargets = BADGE_DEFINITIONS
    .filter((badge) => !earnedMap[badge.id])
    .slice(0, 3)
    .map((badge) => {
      const prog = typeof badge.progress === 'function' ? badge.progress(ctx) : null;
      return {
        badgeId: badge.id,
        title: badge.title,
        description: badge.description,
        progress: prog ? `${prog.current} / ${prog.target} ${prog.unit}` : ''
      };
    });

  return {
    badgeCount: badgeData.badgeCount || earned.length,
    totalPoints: badgeData.totalPoints || 0,
    earned,
    nextTargets
  };
});

export const studentGetEngagementSummary = onCall({ region: REGION, cors: true }, async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in first.');
  const profile = await getUserProfile(request.auth.uid);
  const snap = await db.collection('engagementEvents')
    .where('userId', '==', request.auth.uid)
    .orderBy('createdAt', 'desc')
    .limit(120)
    .get();

  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const summary = summariseEvents(rows);
  const recent = rows.slice(0, 8).map((row) => ({
    eventType: row.eventType,
    pagePath: row.pagePath || '',
    pageTitle: row.pageTitle || '',
    payload: row.payload || {},
    createdAt: row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : ''
  }));

  let classLeaderboard = [];
  if (profile?.teacherId && profile?.classCode) {
    const teacherRowsSnap = await db.collection('engagementEvents')
      .where('teacherId', '==', profile.teacherId)
      .where('classCode', '==', profile.classCode)
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get();
    const byUser = new Map();
    teacherRowsSnap.docs.forEach((docSnap) => {
      const row = docSnap.data() || {};
      const uid = row.userId || '';
      if (!uid) return;
      if (!byUser.has(uid)) byUser.set(uid, []);
      byUser.get(uid).push(row);
    });
    classLeaderboard = [...byUser.entries()].map(([uid, entries]) => {
      const s = summariseEvents(entries);
      return {
        userId: uid,
        displayName: entries[0]?.studentName || 'Student',
        classCode: entries[0]?.classCode || '',
        className: entries[0]?.className || '',
        minutesActive: s.minutesActive,
        resourceClicks: s.resourceClicks,
        gameCompletions: s.gameCompletions,
        gameBestPercentage: s.gameBestPercentage,
        score: s.score
      };
    }).sort((a, b) => b.score - a.score || b.minutesActive - a.minutesActive).slice(0, 5);
  }

  const classRankIndex = classLeaderboard.findIndex((row) => row.userId === request.auth.uid);
  return {
    summary,
    recent,
    leaderboard: [],
    classLeaderboard,
    rankLabel: '',
    classRankLabel: classRankIndex >= 0 ? `Class rank #${classRankIndex + 1}` : 'Class rank unplaced'
  };
});

export const teacherGetBadgeDashboard = onCall({ region: REGION, cors: true }, async (request) => {
  const activeRole = await requireRole(request.auth?.uid, 'teacher', 'admin');
  const selectedClassId = cleanClassCode(String(request.data?.classId || 'all')) || 'ALL';

  let students = [];
  if (activeRole === 'admin') {
    const snap = await db.collection('users').where('role', '==', 'student').get();
    students = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  } else {
    const snap = await db.collection('users').where('teacherId', '==', request.auth.uid).get();
    students = snap.docs.map((d) => ({ uid: d.id, ...d.data() })).filter((row) => row.role === 'student');
  }

  const availableClassesMap = new Map();
  students.forEach((student) => {
    const classCode = cleanClassCode(student.classCode || '');
    if (!classCode) return;
    if (!availableClassesMap.has(classCode)) {
      availableClassesMap.set(classCode, {
        classCode,
        className: student.className || classCode,
        count: 0
      });
    }
    availableClassesMap.get(classCode).count += 1;
  });
  const availableClasses = [...availableClassesMap.values()].sort((a, b) => String(a.className || a.classCode || '').localeCompare(String(b.className || b.classCode || '')));

  const filteredStudents = selectedClassId === 'ALL'
    ? students
    : students.filter((student) => cleanClassCode(student.classCode || '') === selectedClassId);

  const badgeSnaps = await Promise.all(filteredStudents.map((student) => db.doc(`userBadges/${student.uid}`).get()));
  const badgeRows = filteredStudents.map((student, index) => {
    const badgeData = badgeSnaps[index].exists ? (badgeSnaps[index].data() || {}) : {};
    const earnedMap = badgeData.earned || {};
    const earned = Object.values(earnedMap);
    earned.sort((a, b) => {
      const aTime = a?.earnedAt?.toMillis ? a.earnedAt.toMillis() : 0;
      const bTime = b?.earnedAt?.toMillis ? b.earnedAt.toMillis() : 0;
      return bTime - aTime;
    });
    const latest = earned[0] || null;
    const categories = { worksheet: 0, engagement: 0, hybrid: 0 };
    earned.forEach((item) => {
      const key = String(item?.category || '').trim();
      if (key && Object.prototype.hasOwnProperty.call(categories, key)) categories[key] += 1;
    });
    return {
      userId: student.uid,
      displayName: student.displayName || student.email || 'Student',
      email: student.email || '',
      classCode: student.classCode || '',
      className: student.className || student.classCode || 'No class',
      badgeCount: Number(badgeData.badgeCount || earned.length || 0),
      totalPoints: Number(badgeData.totalPoints || 0),
      latestBadgeTitle: latest?.title || '',
      latestBadgeAt: latest?.earnedAt?.toDate ? latest.earnedAt.toDate().toISOString() : '',
      worksheetBadges: categories.worksheet,
      engagementBadges: categories.engagement,
      hybridBadges: categories.hybrid,
      badgesPreview: earned.slice(0, 4).map((item) => ({
        title: item?.title || 'Badge',
        category: item?.category || '',
        points: Number(item?.points || 0)
      }))
    };
  }).sort((a, b) => b.badgeCount - a.badgeCount || b.totalPoints - a.totalPoints || String(a.displayName || '').localeCompare(String(b.displayName || '')));

  const summary = {
    trackedStudents: filteredStudents.length,
    studentsWithBadges: badgeRows.filter((row) => row.badgeCount > 0).length,
    totalBadges: badgeRows.reduce((sum, row) => sum + Number(row.badgeCount || 0), 0),
    totalPoints: badgeRows.reduce((sum, row) => sum + Number(row.totalPoints || 0), 0),
    avgBadges: badgeRows.length ? Math.round((badgeRows.reduce((sum, row) => sum + Number(row.badgeCount || 0), 0) / badgeRows.length) * 10) / 10 : 0
  };

  const classInsightsMap = new Map();
  badgeRows.forEach((row) => {
    const key = cleanClassCode(row.classCode || '') || row.className || 'NO_CLASS';
    if (!classInsightsMap.has(key)) {
      classInsightsMap.set(key, {
        classCode: row.classCode || '',
        className: row.className || row.classCode || 'No class',
        students: 0,
        studentsWithBadges: 0,
        totalBadges: 0,
        totalPoints: 0
      });
    }
    const item = classInsightsMap.get(key);
    item.students += 1;
    item.totalBadges += Number(row.badgeCount || 0);
    item.totalPoints += Number(row.totalPoints || 0);
    if (row.badgeCount > 0) item.studentsWithBadges += 1;
  });
  const classInsights = [...classInsightsMap.values()].map((row) => ({
    ...row,
    avgBadges: row.students ? Math.round((row.totalBadges / row.students) * 10) / 10 : 0
  })).sort((a, b) => b.totalBadges - a.totalBadges || b.totalPoints - a.totalPoints || String(a.className || '').localeCompare(String(b.className || '')));

  const followUp = badgeRows
    .filter((row) => row.badgeCount === 0 || row.totalPoints < 20)
    .sort((a, b) => a.badgeCount - b.badgeCount || a.totalPoints - b.totalPoints || String(a.displayName || '').localeCompare(String(b.displayName || '')))
    .slice(0, 8);

  const metaBadges = [
    selectedClassId === 'ALL' ? 'All classes' : `Class ${selectedClassId}`,
    `${summary.studentsWithBadges}/${summary.trackedStudents || 0} students with badges`,
    `${summary.totalBadges} badges awarded`
  ];

  return {
    selectedClassId,
    availableClasses,
    summary,
    leaderboard: badgeRows.slice(0, 5),
    classInsights: classInsights.slice(0, 8),
    followUp,
    studentRows: badgeRows,
    metaBadges
  };
});

export const teacherGetEngagementDashboard = onCall({ region: REGION, cors: true }, async (request) => {
  const activeRole = await requireRole(request.auth?.uid, 'teacher', 'admin');
  const selectedClassId = String(request.data?.classId || 'all');

  let baseRows = [];
  if (activeRole === 'admin') {
    const snap = await db.collection('engagementEvents')
      .orderBy('createdAt', 'desc')
      .limit(1500)
      .get();
    baseRows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } else {
    const teacherId = request.auth?.uid || '';
    const snap = await db.collection('engagementEvents')
      .where('teacherId', '==', teacherId)
      .orderBy('createdAt', 'desc')
      .limit(1200)
      .get();
    baseRows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  const availableClasses = [...new Map(baseRows
    .filter((row) => row.classCode || row.className)
    .map((row) => [row.classCode || row.className, {
      classCode: row.classCode || row.className || '',
      className: row.className || row.classCode || 'Class',
      count: 0
    }])).values()];
  const counts = new Map();
  baseRows.forEach((row) => {
    const key = row.classCode || row.className || '';
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  availableClasses.forEach((row) => { row.count = counts.get(row.classCode || row.className || '') || 0; });
  availableClasses.sort((a, b) => (a.className || a.classCode || '').localeCompare(b.className || b.classCode || ''));

  let rows = baseRows;
  if (selectedClassId && selectedClassId !== 'all') {
    rows = baseRows.filter((row) => row.classCode === selectedClassId || row.className === selectedClassId);
  }

  const participationRows = buildStudentParticipationRows(rows, 60);
  const leaderboard = participationRows.slice(0, 5).map((row) => ({
    userId: row.userId,
    displayName: row.displayName,
    classCode: row.classCode,
    className: row.className,
    pagesVisited: row.pagesVisited,
    minutesActive: row.minutesActive,
    resourceClicks: row.resourceClicks,
    quizAttempts: row.quizAttempts,
    gameCompletions: row.gameCompletions,
    gameBestPercentage: row.gameBestPercentage,
    score: row.score
  }));

  const totalSummary = summariseEvents(rows);
  const breakdown = buildInteractionBreakdown(rows);
  return {
    summary: {
      trackedStudents: participationRows.length,
      pagesVisited: totalSummary.pagesVisited,
      minutesActive: totalSummary.minutesActive,
      resourceClicks: totalSummary.resourceClicks,
      quizAttempts: totalSummary.quizAttempts,
      videoClicks: totalSummary.videoClicks,
      podcastClicks: totalSummary.podcastClicks,
      gameLaunches: totalSummary.gameLaunches,
      gameCompletions: totalSummary.gameCompletions,
      gameBestPercentage: totalSummary.gameBestPercentage
    },
    leaderboard,
    participationRows,
    pageWatch: buildTeacherPageWatch(rows, 20),
    recent: rows.slice(0, 12).map((row) => ({
      studentName: row.studentName || '',
      classCode: row.classCode || '',
      className: row.className || '',
      pageTitle: row.pageTitle || '',
      pagePath: row.pagePath || '',
      eventType: row.eventType || '',
      payload: row.payload || {},
      createdAt: row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : ''
    })),
    topPages: buildTopPages(rows, 8),
    classInsights: buildClassInsights(rows, 8),
    followUp: buildFollowUpStudents(rows, 8),
    interactionBreakdown: breakdown,
    availableClasses,
    selectedClassId,
    scopeLabel: activeRole === 'admin' ? 'All tracked users' : 'Your linked students',
    metaBadges: [
      `${participationRows.length} tracked student${participationRows.length === 1 ? '' : 's'}`,
      `${leaderboard.length} leaderboard place${leaderboard.length === 1 ? '' : 's'}`,
      `${breakdown.video} video click${breakdown.video === 1 ? '' : 's'}`,
      `${breakdown.quiz} quiz click${breakdown.quiz === 1 ? '' : 's'}`,
      `${selectedClassId === 'all' ? 'All classes' : selectedClassId}`,
      activeRole === 'admin' ? 'Admin scope' : 'Teacher scope'
    ]
  };
});
