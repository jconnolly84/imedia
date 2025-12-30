import { db, storage } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


const SPEC_URL = './r093-2025-jun-questions.json';
let QUESTIONS = [];

async function loadQuestions() {
  try {
    const res = await fetch(SPEC_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load spec: ${res.status}`);
    const data = await res.json();
    QUESTIONS = Array.isArray(data) ? data : (data.questions || []);
    if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) throw new Error('Spec loaded but contained no questions');
    return true;
  } catch (err) {
    console.error(err);
    const el = document.getElementById('submitStatus');
    if (el) el.textContent = '❌ Could not load the June 2025 exam questions. Check the JSON file path and try refreshing.';
    const qWrap = document.getElementById('questions');
    if (qWrap) qWrap.innerHTML = `<div class="q-card"><h3>Exam content failed to load</h3><p>${String(err).replace(/</g,'&lt;')}</p><p>Expected: <code>${SPEC_URL}</code> in the repository root.</p></div>`;
    return false;
  }
}


const elQuestions = document.getElementById('questions');
const elTotal = document.getElementById('totalMarks');
const elPrompt = document.getElementById('promptBox');

const SAVE_KEY = 'R093-2025-JUN_savedAnswers_v1';

// Firebase submission settings
const EXAM_ID = 'R093-2025-JUN';
const PROMPT_VERSION = 'PM01-v1';


let secondsLeft = 30 * 60;
let running = false;
let timerHandle = null;

function sumMarks() {
  return QUESTIONS.reduce((s,q)=>s+q.marks,0);
}
function pad2(n) { return String(n).padStart(2,'0'); }
function renderTimer() {
  const m = Math.floor(secondsLeft/60);
  const s = secondsLeft%60;
  document.getElementById('timer').textContent = `${pad2(m)}:${pad2(s)}`;
}
function startTimer() {
  if (running) return;
  running = true;
  timerHandle = setInterval(()=>{
    secondsLeft = Math.max(0, secondsLeft - 1);
    renderTimer();
    if (secondsLeft === 0) pauseTimer();
  }, 1000);
}
function pauseTimer() {
  running = false;
  if (timerHandle) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}
function getAnswerKey(i, sub=null) {
  return sub ? `Q${i+1}.${sub}` : `Q${i+1}`;
}
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function render() {
  elQuestions.innerHTML = '';
  elTotal.textContent = String(sumMarks());

  QUESTIONS.forEach((q,i)=>{
    const wrap = document.createElement('section');
    wrap.className = 'exam-q';

    const meta = `
      <div class="q-meta">
        <span class="tag">Q${i+1}</span>
        <span class="tag">${escapeHtml(q.command_word)}</span>
        <span class="tag">${q.marks} mark${q.marks===1?'':'s'}</span>
      </div>
    `;

    const fig = q.figure ? `
      <div class="figure">
        <img src="${escapeHtml(q.figure.src)}" alt="${escapeHtml(q.figure.alt || 'Figure')}" />
        <div class="cap"><strong>${escapeHtml(q.figure.label || 'Fig.')}</strong> ${escapeHtml(q.figure.caption || '')}</div>
      </div>
    ` : '';

    wrap.innerHTML = `
      <h3>Q${i+1}. ${escapeHtml(q.text)} <span class="hint">[${q.marks}]</span></h3>
      ${meta}
      ${fig}
      <div class="ans" id="ans-${i}"></div>
    `;

    elQuestions.appendChild(wrap);

    const ans = wrap.querySelector(`#ans-${i}`);
    renderAnswer(ans, q, i);
  });
}

function renderAnswer(container, q, i) {
  if (q.response_type === 'mcq_single') {
    const group = `mcq-${i}`;
    const mcq = document.createElement('div');
    mcq.className = 'mcq';
    q.options.forEach(opt => {
      const id = `${group}-${opt.key}`;
      mcq.insertAdjacentHTML('beforeend', `
        <label class="opt" for="${id}">
          <input type="radio" name="${group}" id="${id}" value="${escapeHtml(opt.key)}" />
          <div><strong>${escapeHtml(opt.key)}.</strong> ${escapeHtml(opt.text)}</div>
        </label>
      `);
    });
    container.appendChild(mcq);
    return;
  }

  if (q.response_type === 'short_list') {
    const n = q.expected_responses || 2;
    for (let k=1;k<=n;k++) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = `Response ${k}…`;
      inp.dataset.key = getAnswerKey(i, k);
      container.appendChild(inp);
    }
    return;
  }

  const ta = document.createElement('textarea');
  ta.placeholder = q.marks >= 6 ? 'Write a developed answer…' : 'Write your answer…';
  ta.dataset.key = getAnswerKey(i);
  container.appendChild(ta);
}

function collectAnswers() {
  const data = {};
  document.querySelectorAll('textarea[data-key], input[type="text"][data-key]').forEach(el => {
    data[el.dataset.key] = el.value || '';
  });
  QUESTIONS.forEach((q,i)=>{
    if (q.response_type !== 'mcq_single') return;
    const checked = document.querySelector(`input[name="mcq-${i}"]:checked`);
    data[getAnswerKey(i)] = checked ? checked.value : '';
  });
  return data;
}

function buildPrompt() {
  try { updateL2L3Tips(); } catch(e) {}
  const answers = collectAnswers();

  let prompt = `You are an OCR Cambridge National Creative iMedia R093 examiner.\n\n`
    + `Task: Mark this 31-mark mini exam question-by-question using ONLY the mark schemes provided.\n\n`
    + `MARKING RULES (OCR-style)\n`
    + `- Mark ONLY what the student has written. Do not credit implied knowledge.\n`
    + `- If a short question requires two responses, mark only the required number, in order.\n`
    + `- For MCQ, award 1 only for the correct option.\n`
    + `- For the 9-mark question, apply a level-of-response judgement (Level 3/2/1/0) then choose a mark within the level.\n`
    + `- Reward role-specific improvements and clear justification.\n`
    + `- Use UK English.\n\n`
    + `OUTPUT: Provide marks per question, total /31, then WWW, EBI, and 1–2 targets.\n\n`;

  QUESTIONS.forEach((q,i)=>{
    const qKey = `Q${i+1}`;
    let studentAnswer = '';
    if (q.response_type === 'short_list') {
      const n = q.expected_responses || 2;
      const items = [];
      for (let k=1;k<=n;k++) items.push(`${k}) ${answers[getAnswerKey(i,k)] || ''}`);
      studentAnswer = items.join('\n');
    } else {
      studentAnswer = answers[getAnswerKey(i)] || '';
    }

    prompt += `\n[${qKey}] (${q.marks} marks) ${q.command_word}\nQUESTION:\n${q.text}\n`;
    if (q.figure) {
      prompt += `FIGURE: ${q.figure.label || 'Fig.'} at ${q.figure.src} (alt: ${q.figure.alt || ''})\n`;
    }
    prompt += `\nMARK SCHEME / GUIDANCE:\n- ${q.mark_scheme.join('\n- ')}\n\nSTUDENT ANSWER:\n${studentAnswer || '(no answer)'}\n`;
    prompt += `\n---\n`;
  });

  elPrompt.value = prompt.trim();

  // Auto-copy when the prompt is built (student-friendly workflow)
  const statusEl = document.getElementById('copyStatus');
  const promptText = (elPrompt.value || '').trim();

  if (!promptText){
    if (statusEl) statusEl.textContent = 'Build failed — please try again.';
    return;
  }

  const instructions = '✅ Prompt copied. Next: click ChatGPT / Gemini / Claude / Copilot below, paste (Ctrl+V / ⌘+V) and press Enter.';
  const fallback = '⚠️ Auto-copy not available. The prompt is selected — press Ctrl+C / ⌘+C, then click an AI link and paste.';

  try{
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(promptText).then(()=>{
        if (statusEl) statusEl.textContent = instructions;
      }).catch(()=>{
        elPrompt.focus(); elPrompt.select();
        if (statusEl) statusEl.textContent = fallback;
      });
    } else {
      elPrompt.focus(); elPrompt.select();
      if (statusEl) statusEl.textContent = fallback;
    }
  } catch(e){
    elPrompt.focus(); elPrompt.select();
    if (statusEl) statusEl.textContent = fallback;
  }
}

// Copy prompt and open an AI tool (mirrors behaviour from 9-Mark AI Trainer)
window.openAIAndCopy = async function(url){
  // Ensure prompt exists; if empty, build it first
  if (!elPrompt.value || !elPrompt.value.trim()){
    try { buildPrompt(); } catch(e){}
  }
  const promptText = (elPrompt.value || '').trim();
  const statusEl = document.getElementById('copyStatus');

  if (!promptText){
    if (statusEl) statusEl.textContent = 'Build the prompt first, then choose an AI tool.';
    return;
  }

  // Copy to clipboard if possible
  try{
    if (navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(promptText);
      if (statusEl) statusEl.textContent = '✅ Prompt copied. In the new tab, paste (Ctrl+V / ⌘+V) and press Enter.';
    } else {
      elPrompt.focus(); elPrompt.select();
      if (statusEl) statusEl.textContent = '⚠️ Auto-copy not available. The prompt is selected — press Ctrl+C / ⌘+C, then paste into the AI.';
    }
  } catch(e){
    elPrompt.focus(); elPrompt.select();
    if (statusEl) statusEl.textContent = '⚠️ Could not auto-copy. The prompt is selected — press Ctrl+C / ⌘+C, then paste into the AI.';
  }

  window.open(url, '_blank');
};

function buildAnswersOnlyText(){
  const answers = collectAnswers();
  let out = 'R093 Pre‑Mock Mini Exam — Student Answers (no mark scheme)\n\n';
  QUESTIONS.forEach((q,i)=>{
    const qKey = `Q${i+1}`;
    let studentAnswer = '';
    if (q.response_type === 'short_list') {
      const n = q.expected_responses || 2;
      const items = [];
      for (let k=1;k<=n;k++) items.push(`${k}) ${answers[getAnswerKey(i,k)] || ''}`);
      studentAnswer = items.join('\n');
    } else {
      studentAnswer = answers[getAnswerKey(i)] || '';
    }
    out += `[${qKey}] (${q.marks} marks) ${q.text}\nANSWER:\n${studentAnswer || '(no answer)'}\n\n---\n\n`;
  });
  return out.trim();
}

async function copyAnswersOnly(){
  const text = buildAnswersOnlyText();
  const statusEl = document.getElementById('copyStatus');
  try{
    if (navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      if (statusEl) statusEl.textContent = '✅ Answers copied.';
    } else {
      // Fallback: put into prompt box for manual copy
      elPrompt.value = text;
      elPrompt.focus(); elPrompt.select();
      if (statusEl) statusEl.textContent = '⚠️ Auto-copy not available. Your answers are selected in the box — press Ctrl+C / ⌘+C.';
    }
  } catch(e){
    elPrompt.value = text;
    elPrompt.focus(); elPrompt.select();
    if (statusEl) statusEl.textContent = '⚠️ Could not auto-copy. Your answers are selected — press Ctrl+C / ⌘+C.';
  }
}


async function copyPrompt() {
  const text = elPrompt.value || '';
  if (!text.trim()) return;
  try { await navigator.clipboard.writeText(text); }
  catch { elPrompt.focus(); elPrompt.select(); }
}

function save() {
  const payload = { secondsLeft, answers: collectAnswers() };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const payload = JSON.parse(raw);
    secondsLeft = payload.secondsLeft ?? (30*60);
    renderTimer();

    const answers = payload.answers || {};
    document.querySelectorAll('textarea[data-key], input[type="text"][data-key]').forEach(el => {
      el.value = answers[el.dataset.key] ?? '';
    });
    QUESTIONS.forEach((q,i)=>{
      if (q.response_type !== 'mcq_single') return;
      const val = answers[getAnswerKey(i)] ?? '';
      const radio = document.querySelector(`input[name="mcq-${i}"][value="${val}"]`);
      if (radio) radio.checked = true;
    });
  } catch {}
}

function reset() {
  localStorage.removeItem(SAVE_KEY);
  pauseTimer();
  secondsLeft = 30*60;
  renderTimer();
  render();
  elPrompt.value = '';
}

(() => { const el = document.getElementById('startBtn'); if (el) el.addEventListener('click', startTimer); })();
(() => { const el = document.getElementById('pauseBtn'); if (el) el.addEventListener('click', pauseTimer); })();
(() => { const el = document.getElementById('buildPromptBtn'); if (el) el.addEventListener('click', buildPrompt); })();
(() => { const el = document.getElementById('copyPromptBtn'); if (el) el.addEventListener('click', copyPrompt); })();
(() => { const el = document.getElementById('saveBtn'); if (el) el.addEventListener('click', save); })();
(() => { const el = document.getElementById('loadBtn'); if (el) el.addEventListener('click', load); })();
(() => { const el = document.getElementById('resetBtn'); if (el) el.addEventListener('click', reset); })();



async function submitAttemptToFirebase(){
  const statusEls = [document.getElementById('submitStatus'), document.getElementById('submitStatusBottom')].filter(Boolean);
  const setStatus = (msg) => { statusEls.forEach(el => { el.textContent = msg; }); };
  const nameEl = document.getElementById('studentName');
  const classEl = document.getElementById('classCode');

  const studentName = (nameEl?.value || '').trim();
  const classCode = (classEl?.value || '').trim();

  if (!studentName || !classCode){
    setStatus('Please enter your name and class before submitting.');
    return;
  }

  // Collect answers (small & safe)
  const answers = collectAnswers();

  // Build prompt text (may be large)
  let promptText = '';
  try{
    buildPrompt();
    promptText = (elPrompt?.value || '').trim();
  } catch(e){
    promptText = '';
  }

  setStatus('Submitting…');

  try{
    const payload = {
      examId: EXAM_ID,
      promptVersion: PROMPT_VERSION,
      studentName,
      classCode,
      answers,
      submittedAt: serverTimestamp(),
      status: 'unmarked'
    };

    // Firestore document size limit is 1 MiB. Store prompt only if reasonably small.
    // If it's large, upload to Storage and store the URL instead.
    const approxBytes = new Blob([promptText || '']).size;

    if (promptText && approxBytes <= 650_000){
      payload.prompt = promptText;
      payload.promptStorage = 'firestore';
    } else if (promptText) {
      const safeName = studentName.replace(/[^a-z0-9_-]+/gi,'_').slice(0,40);
      const safeClass = classCode.replace(/[^a-z0-9_-]+/gi,'_').slice(0,20);
      const filePath = `prompts/${EXAM_ID}/${safeClass}/${Date.now()}_${safeName}.txt`;
      const r = storageRef(storage, filePath);
      await uploadString(r, promptText, 'raw');
      const url = await getDownloadURL(r);
      payload.promptUrl = url;
      payload.promptStorage = 'storage';
      payload.promptBytes = approxBytes;
    }

    await addDoc(collection(db, 'exams', EXAM_ID, 'submissions'), payload);

    setStatus('✅ Submitted. You can close this tab now.');
  } catch(err){
    console.error(err);
    {
      const msg = (err && (err.code || err.message)) ? (err.code || err.message) : 'Unknown error';
      setStatus('❌ Submit failed: ' + msg);
    }
  }
}


function updateL2L3Tips(){
  const tipsEl = document.getElementById('l2l3Tips');
  if (!tipsEl) return;

  const q11Box = document.querySelector('textarea[data-key="Q11"]');
  const text = (q11Box?.value || '').trim().toLowerCase();

  tipsEl.innerHTML = '';

  if (!text){
    tipsEl.innerHTML = '<li class="hint">Start typing your Q11 answer to see tailored targets.</li>';
    return;
  }

  const checks = [
    {k:['watermark'], label:'Mention the watermark and explain why it’s a problem (professionalism/licensing/clarity).'},
    {k:['consistent','consistency','palette','colour palette','colour scheme'], label:'Talk about consistency (colour palette) and how it keeps campaign posts looking joined up.'},
    {k:['typography','fonts','font','serif','sans'], label:'Discuss typography (font choices) and why consistent fonts improve readability and brand identity.'},
    {k:['layout','composition','hierarchy','alignment','spacing'], label:'Comment on layout/composition (visual hierarchy, alignment, spacing) so it’s quicker to interpret.'},
    {k:['labels','label','annotation','annotate','notes'], label:'Include labels/annotations AND explain how they guide the content creator (what to include/avoid).'},
    {k:['audience','target','purpose','tone','message'], label:'Link choices to audience and purpose (tone, message, emotional impact) for the campaign.'},
    {k:['stock','images','imagery','relevant','unrelated'], label:'Critique relevance of imagery (remove unrelated; add campaign‑relevant) and justify.'},
    {k:['role','content creator','campaign','posts','assets','social media'], label:'Make the role explicit: explain how your improvements help the campaign content creator produce consistent assets quickly.'},
  ];

  const missing = [];
  for (const c of checks){
    const ok = c.k.some(x => text.includes(x));
    if (!ok) missing.push(c.label);
  }

  for (const t of missing.slice(0,6)){
    const li = document.createElement('li');
    li.className = 'missing';
    li.textContent = t;
    tipsEl.appendChild(li);
  }

  const li = document.createElement('li');
  li.className = 'good';
  li.textContent = missing.length <= 2
    ? 'You’re hitting most Level 3 features. Next: develop each point with “This helps the content creator because…”'
    : 'Top tip: for every improvement, add one sentence: “This helps the content creator because…”';
  tipsEl.appendChild(li);
}

function wireQ11Booster(){
  const q11Box = document.querySelector('textarea[data-key="Q11"]');
  if (!q11Box) return;
  q11Box.addEventListener('input', updateL2L3Tips);
  updateL2L3Tips();
}

(function init(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  renderTimer();
  render();
  load();
  wireQ11Booster();
})();

(() => { const el = document.getElementById('copyAnswersBtn'); if (el) el.addEventListener('click', copyAnswersOnly); })();

(() => {
  const btn = document.getElementById('submitAttemptBtn');
  if (btn) btn.addEventListener('click', submitAttemptToFirebase);
})();
