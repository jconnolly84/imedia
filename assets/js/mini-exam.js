
const QUESTIONS = [
  {
    "id": "PM01-Q1",
    "marks": 1,
    "command_word": "Define",
    "text": "What is meant by new media?",
    "response_type": "long_text",
    "mark_scheme": [
      "Interactive digital media distributed electronically (via computers/mobile/internet).",
      "May reference on-demand, user interaction, digital platforms."
    ]
  },
  {
    "id": "PM01-Q2",
    "marks": 1,
    "command_word": "Select",
    "text": "Which media product is most likely to include interactive elements?",
    "response_type": "mcq_single",
    "options": [
      {
        "key": "A",
        "text": "Radio advert"
      },
      {
        "key": "B",
        "text": "Poster"
      },
      {
        "key": "C",
        "text": "Website"
      },
      {
        "key": "D",
        "text": "Magazine"
      }
    ],
    "mark_scheme": [
      "Correct answer: C (Website)."
    ]
  },
  {
    "id": "PM01-Q3",
    "marks": 2,
    "command_word": "Identify",
    "text": "Identify two phases of a media project other than production.",
    "response_type": "short_list",
    "expected_responses": 2,
    "mark_scheme": [
      "1 mark per correct phase (max 2).",
      "Accept: pre-production, post-production (or equivalent)."
    ]
  },
  {
    "id": "PM01-Q4",
    "marks": 1,
    "command_word": "Identify",
    "text": "Name one category of audience segmentation related to a person\u2019s financial situation.",
    "response_type": "long_text",
    "mark_scheme": [
      "Income / socio-economic group / earnings."
    ]
  },
  {
    "id": "PM01-Q5",
    "marks": 1,
    "command_word": "Identify",
    "text": "Identify one colour commonly used to create urgency in media products.",
    "response_type": "long_text",
    "mark_scheme": [
      "Red or orange (or other plausible urgency colour with justification)."
    ]
  },
  {
    "id": "PM01-Q6",
    "marks": 2,
    "command_word": "Identify",
    "text": "Identify two physical distribution methods for media products.",
    "response_type": "short_list",
    "expected_responses": 2,
    "mark_scheme": [
      "1 mark per valid physical method (max 2).",
      "Accept: DVD/Blu\u2011ray, CD, printed magazine/newspaper, poster/leaflet, USB drive, physical book, etc."
    ]
  },
  {
    "id": "PM01-Q7",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one purpose of using a flowchart during pre-production.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies a valid purpose (shows sequence/logic/decisions).",
      "1 mark: develops how it helps planning/communication/testing/efficiency."
    ]
  },
  {
    "id": "PM01-Q8",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one reason why sample rate is important in digital audio files.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: states sample rate affects quality/accuracy of sound representation.",
      "1 mark: develops (higher sample rate captures more detail; reduces distortion; more data/large files)."
    ]
  },
  {
    "id": "PM01-Q9",
    "marks": 4,
    "command_word": "Describe & explain",
    "text": "A charity is creating a social media campaign to raise awareness of ocean pollution. (a) Describe one feature of a social media platform. (b) Explain one way the language style of posts could help achieve the campaign\u2019s purpose.",
    "response_type": "long_text",
    "mark_scheme": [
      "(a) Up to 2 marks: description of a feature (e.g., user profiles, feeds, hashtags, sharing, comments, analytics, followers).",
      "(b) Up to 2 marks: language style/tone (e.g., emotive, urgent, call-to-action) linked to motivating action/awareness."
    ]
  },
  {
    "id": "PM01-Q10",
    "marks": 6,
    "command_word": "Explain",
    "text": "Explain two differences between a formal client brief and a commission-style client brief.",
    "response_type": "long_text",
    "mark_scheme": [
      "Up to 3 marks per explained difference (max 6).",
      "Credit differences such as: written/detailed vs informal/short; fixed requirements vs flexible; sign-off/legal clarity vs quicker commissioning; includes constraints/budget/timescales vs minimal detail."
    ]
  },
  {
    "id": "PM01-Q11",
    "marks": 9,
    "command_word": "Discuss",
    "text": "A draft digital mood board is given to a campaign content creator. Discuss the suitability of the draft digital mood board for use by the campaign content creator.\n\nMarks will be awarded for:\n\u2022 Suggesting changes that improve the digital mood board.\n\u2022 Explaining how the changes you suggest will improve the effectiveness of the digital mood board for the campaign content creator.",
    "response_type": "long_text",
    "figure": {
      "src": "img/01-mini-exam-moodboard.png",
      "label": "Fig.1",
      "caption": "Draft digital mood board (placeholder). Replace this with your generated exam-style image.",
      "alt": "A rough digital mood board with mixed, unrelated imagery, inconsistent typography and a visible watermark."
    },
    "mark_scheme": [
      "Level 3 (7\u20139): range of relevant improvements + clear, role-focused explanations; good terminology (palette, typography, style, composition, audience, purpose).",
      "Level 2 (4\u20136): some improvements with some explanation; generally role-focused.",
      "Level 1 (1\u20133): limited/basic points; weak explanation and/or limited role focus.",
      "Level 0 (0): no relevant content."
    ]
  }
];

const elQuestions = document.getElementById('questions');
const elTotal = document.getElementById('totalMarks');
const elPrompt = document.getElementById('promptBox');

const SAVE_KEY = 'imediagenius_pre_mock_01_save';

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
    + `Task: Mark this 30-mark mini exam question-by-question using ONLY the mark schemes provided.\n\n`
    + `MARKING RULES (OCR-style)\n`
    + `- Mark ONLY what the student has written. Do not credit implied knowledge.\n`
    + `- If a short question requires two responses, mark only the required number, in order.\n`
    + `- For MCQ, award 1 only for the correct option.\n`
    + `- For the 9-mark question, apply a level-of-response judgement (Level 3/2/1/0) then choose a mark within the level.\n`
    + `- Reward role-specific improvements and clear justification.\n`
    + `- Use UK English.\n\n`
    + `OUTPUT: Provide marks per question, total /30, then WWW, EBI, and 1–2 targets.\n\n`;

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
