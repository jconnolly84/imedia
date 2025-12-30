import { db, storage } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


const QUESTIONS = [
  {
    "id": "JUN25-Q1",
    "marks": 1,
    "command_word": "Identify",
    "text": "Action, arcade, first person, puzzle and RPG are examples of which new media product?",
    "response_type": "short_text",
    "mark_scheme": [
      "Correct answer: computer/digital games (accept 'gaming', 'video games')."
    ]
  },
  {
    "id": "JUN25-Q2",
    "marks": 2,
    "command_word": "Complete",
    "text": "Complete the sentences.

Write a job role from the list in each of the two spaces. You can use each job role only once or not at all.

content creator • graphic designer • web designer • web developer

A __________________________ is responsible for planning the style and layout of a website.

A __________________________ is responsible for creating the website.",
    "response_type": "short_list",
    "expected_responses": 2,
    "mark_scheme": [
      "1 mark: Web designer",
      "1 mark: Web developer",
      "Correct answers only (no half marks)."
    ]
  },
  {
    "id": "JUN25-Q3",
    "marks": 1,
    "command_word": "Select",
    "text": "Which lighting position is used to create a shadow effect from behind?",
    "response_type": "mcq_single",
    "options": [
      {
        "key": "A",
        "text": "Back light"
      },
      {
        "key": "B",
        "text": "Low angle"
      },
      {
        "key": "C",
        "text": "Practical lighting"
      },
      {
        "key": "D",
        "text": "Side angle"
      }
    ],
    "mark_scheme": [
      "Correct answer: A (Back light)."
    ]
  },
  {
    "id": "JUN25-Q4",
    "marks": 2,
    "command_word": "Identify",
    "text": "Identify the components of the workplan labelled A and B.",
    "response_type": "short_list",
    "expected_responses": 2,
    "figure": {
      "src": "img/jun_25_04_workplan.jpg",
      "label": "Fig. 1",
      "caption": "Workplan labelled A and B.",
      "alt": "A workplan with labels A and B."
    },
    "mark_scheme": [
      "A: Task / production process (do not accept 'activities').",
      "B: Milestone."
    ]
  },
  {
    "id": "JUN25-Q5",
    "marks": 1,
    "command_word": "Identify",
    "text": "Which intellectual property gives exclusive rights to the creator of a design?",
    "response_type": "short_text",
    "mark_scheme": [
      "Patent / patents (1)."
    ]
  },
  {
    "id": "JUN25-Q6",
    "marks": 1,
    "command_word": "Identify",
    "text": "Which property of digital audio files counts the number of pieces of data captured each second?",
    "response_type": "short_text",
    "mark_scheme": [
      "Sample rate / sample frequency (1)."
    ]
  },
  {
    "id": "JUN25-Q7",
    "marks": 1,
    "command_word": "Complete",
    "text": "Complete the sentence.

Write one word or phrase from the list in the space.

icons • posters • still images • videos

MP4 is an example of a file format used for __________________________.",
    "response_type": "mcq_single",
    "options": [
      {
        "key": "A",
        "text": "icons"
      },
      {
        "key": "B",
        "text": "posters"
      },
      {
        "key": "C",
        "text": "still images"
      },
      {
        "key": "D",
        "text": "videos"
      }
    ],
    "mark_scheme": [
      "Correct answer: D (videos)."
    ]
  },
  {
    "id": "JUN25-Q8",
    "marks": 1,
    "command_word": "Select",
    "text": "Which is an example of quantitative information?",
    "response_type": "mcq_single",
    "options": [
      {
        "key": "A",
        "text": "33"
      },
      {
        "key": "B",
        "text": "Blue"
      },
      {
        "key": "C",
        "text": "Television"
      },
      {
        "key": "D",
        "text": "Workflow"
      }
    ],
    "mark_scheme": [
      "Correct answer: A (33)."
    ]
  },
  {
    "id": "JUN25-Q9a",
    "marks": 1,
    "command_word": "Identify",
    "text": "Identify the purpose of the interactive travel magazine.",
    "response_type": "short_text",
    "mark_scheme": [
      "Any valid purpose e.g. inform / entertain / educate / promote (1)."
    ]
  },
  {
    "id": "JUN25-Q9b",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain what is meant by interactive media.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies user interaction/control OR gives a valid example.",
      "2 marks: explains media responds to user input/actions (e.g. click/touch/swipe, links, controls)."
    ]
  },
  {
    "id": "JUN25-Q9c",
    "marks": 1,
    "command_word": "Identify",
    "text": "Identify one example of traditional media other than print publishing.",
    "response_type": "short_text",
    "mark_scheme": [
      "Any valid example e.g. radio / television / film (1)."
    ]
  },
  {
    "id": "JUN25-Q10a",
    "marks": 2,
    "command_word": "Describe",
    "text": "Describe one way the typography changes on the front cover of this magazine.",
    "response_type": "long_text",
    "figure": {
      "src": "img/jun_25_10_workplan.jpg",
      "label": "Fig. 2",
      "caption": "Magazine cover.",
      "alt": "A magazine cover image."
    },
    "mark_scheme": [
      "1 mark: identifies a typography feature (font/size/weight/case/colour).",
      "2 marks: describes how it changes and effect/purpose."
    ]
  },
  {
    "id": "JUN25-Q10b",
    "marks": 2,
    "command_word": "Describe",
    "text": "Describe one way the elements are positioned to meet the purpose of this magazine cover.",
    "response_type": "long_text",
    "figure": {
      "src": "img/jun_25_10_workplan.jpg",
      "label": "Fig. 2",
      "caption": "Magazine cover.",
      "alt": "A magazine cover image."
    },
    "mark_scheme": [
      "1 mark: identifies positioning/layout choice.",
      "2 marks: describes how positioning supports purpose (inform/attract)."
    ]
  },
  {
    "id": "JUN25-Q10c",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one way informal language is used on this magazine cover.",
    "response_type": "long_text",
    "figure": {
      "src": "img/jun_25_10_workplan.jpg",
      "label": "Fig. 2",
      "caption": "Magazine cover.",
      "alt": "A magazine cover image."
    },
    "mark_scheme": [
      "1 mark: identifies informal language feature/example.",
      "2 marks: explains how/why it targets audience/purpose."
    ]
  },
  {
    "id": "JUN25-Q10d",
    "marks": 2,
    "command_word": "Identify",
    "text": "Identify two secondary research sources, other than magazines, that could be used to help plan the next issue of the interactive travel magazine.",
    "response_type": "short_list",
    "expected_responses": 2,
    "mark_scheme": [
      "1 mark per valid secondary source (max 2). Do not credit magazines."
    ]
  },
  {
    "id": "JUN25-Q10e",
    "marks": 2,
    "command_word": "Describe",
    "text": "Describe what is meant by symbolic media codes.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies symbolic codes are signs/symbols that carry meaning.",
      "2 marks: describes how they communicate ideas/associations/mood."
    ]
  },
  {
    "id": "JUN25-Q11a",
    "marks": 6,
    "command_word": "Explain",
    "text": "Explain two ways that a production manager could contribute to the production of the interactive travel magazine.",
    "response_type": "long_text",
    "mark_scheme": [
      "Level of response (6). Credit two contributions with explanation (e.g. schedules/budgets/resources, coordinating staff, workflow, quality control, risk management, liaising with stakeholders)."
    ]
  },
  {
    "id": "JUN25-Q11b",
    "marks": 2,
    "command_word": "Identify",
    "text": "Identify two responsibilities of a creative director.",
    "response_type": "short_list",
    "expected_responses": 2,
    "mark_scheme": [
      "1 mark per valid responsibility (max 2)."
    ]
  },
  {
    "id": "JUN25-Q12a",
    "marks": 1,
    "command_word": "Identify",
    "text": "Identify the phase of production in which a graphic artist is involved.",
    "response_type": "short_text",
    "mark_scheme": [
      "Pre-production OR production (1)."
    ]
  },
  {
    "id": "JUN25-Q12b",
    "marks": 9,
    "command_word": "Discuss",
    "text": "An asset log has been provided for the graphic artist.

Discuss the suitability of the asset log for use by the graphic artist.

Marks will be awarded for:
• Suggesting changes that improve the asset log.
• Explaining how the changes you suggest will improve the effectiveness of the asset log for the graphic artist.",
    "response_type": "long_text",
    "figure": {
      "src": "img/jun_25_12b_workplan.jpg",
      "label": "Fig. 3",
      "caption": "Asset log.",
      "alt": "An asset log table."
    },
    "mark_scheme": [
      "Level of response (9). Improvements + explained impact for a graphic artist (clarity, consistency, completeness, copyright/source, file formats, resolution, naming, location)."
    ]
  },
  {
    "id": "JUN25-Q12c",
    "marks": 1,
    "command_word": "Identify",
    "text": "Identify one piece of software that could be used to create an asset log.",
    "response_type": "short_text",
    "mark_scheme": [
      "Spreadsheet / database / word processor / DTP (or named software such as Excel) (1)."
    ]
  },
  {
    "id": "JUN25-Q13a",
    "marks": 2,
    "command_word": "Describe",
    "text": "Describe one action UniqJny must take to ensure photographs included in the interactive travel magazine can be used for commercial purposes.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies an action (permission/licence/pay/contract/model release/royalty-free/take own photos).",
      "2 marks: explains why it makes commercial use legal."
    ]
  },
  {
    "id": "JUN25-Q13b",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one way a photographer can protect the photographs they take from being used illegally.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies a method (watermark/metadata/low-res/licensing/copyright notice).",
      "2 marks: explains how it reduces illegal use."
    ]
  },
  {
    "id": "JUN25-Q13c",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one reason why pixels per inch (PPI) should be considered when choosing photographs to use in the interactive magazine.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: links PPI to resolution/quality.",
      "2 marks: explains impact (too low = pixelated; too high = larger files/slow loading)."
    ]
  },
  {
    "id": "JUN25-Q13d",
    "marks": 4,
    "command_word": "Identify & Describe",
    "text": "Identify two online distribution platforms. Describe one way each platform could be used to distribute a digital product.",
    "response_type": "short_list_with_explain",
    "expected_responses": 2,
    "mark_scheme": [
      "For each platform: 1 mark identify + 1 mark describe use (max 4)."
    ]
  },
  {
    "id": "JUN25-Q13e",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one difference between lossy and lossless compression.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies a correct difference.",
      "2 marks: explains difference (lossy removes data/quality loss vs lossless keeps data/no quality loss)."
    ]
  },
  {
    "id": "JUN25-Q14",
    "marks": 9,
    "command_word": "Discuss",
    "text": "A wireframe of the interactive index double page of the next issue of the interactive travel magazine is shown.

You cannot draw/annotate directly on the wireframe here. Instead, discuss how the effectiveness of the wireframe could be improved for use in the interactive travel magazine.

Marks will be awarded for:
• Suggesting improvements to the wireframe layout, structure and content.
• Explaining how each improvement would improve usability, navigation or user experience for the audience.",
    "response_type": "long_text",
    "figure": {
      "src": "img/jun_25_14_workplan.jpg",
      "label": "Fig. 4",
      "caption": "Wireframe.",
      "alt": "A wireframe titled Contents with layout boxes."
    },
    "mark_scheme": [
      "Level of response (9). Range of relevant improvements + clear explanation of impact (usability/navigation/UX), using appropriate terminology."
    ]
  },
  {
    "id": "JUN25-Q15",
    "marks": 2,
    "command_word": "Explain",
    "text": "Explain one way libel laws could affect the content of a magazine.",
    "response_type": "long_text",
    "mark_scheme": [
      "1 mark: identifies what libel is OR gives a relevant impact.",
      "2 marks: explains impact (check facts/avoid false statements/fairness)."
    ]
  }
];
const elQuestions = document.getElementById('questions');
const elTotal = document.getElementById('totalMarks');
const elPrompt = document.getElementById('promptBox');

const SAVE_KEY = 'imediagenius_r093_jun2025_save';

// Firebase submission settings
const EXAM_ID = 'R093-2025-JUN';
const PROMPT_VERSION = 'R093-2025-JUN-v1';


let secondsLeft = 90 * 60;
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
  if (q.response_type === 'short_text') {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Write your answer…';
    inp.dataset.key = getAnswerKey(i);
    container.appendChild(inp);
    return;
  }

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

  if (q.response_type === 'short_list_with_explain') {
    const n = q.expected_responses || 2;
    for (let k=1;k<=n;k++) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = `Platform ${k}…`;
      inp.dataset.key = getAnswerKey(i, `p${k}`);
      container.appendChild(inp);
      const ta = document.createElement('textarea');
      ta.placeholder = 'Describe how this platform could be used to distribute the digital product…';
      ta.dataset.key = getAnswerKey(i, `e${k}`);
      container.appendChild(ta);
    }
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
    + `Task: Mark this 70-mark exam paper question-by-question using ONLY the mark schemes provided.\n\n`
    + `MARKING RULES (OCR-style)\n`
    + `- Mark ONLY what the student has written. Do not credit implied knowledge.\n`
    + `- If a short question requires two responses, mark only the required number, in order.\n`
    + `- For MCQ, award 1 only for the correct option.\n`
    + `- For the 9-mark question, apply a level-of-response judgement (Level 3/2/1/0) then choose a mark within the level.\n`
    + `- Reward role-specific improvements and clear justification.\n`
    + `- Use UK English.\n\n`
    + `OUTPUT: Provide marks per question, total /70, then WWW, EBI, and 1–2 targets.\n\n`;

  QUESTIONS.forEach((q,i)=>{
    const qKey = `Q${i+1}`;
    let studentAnswer = '';
    if (q.response_type === 'short_list_with_explain') {
    const n = q.expected_responses || 2;
    for (let k=1;k<=n;k++) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = `Platform ${k}…`;
      inp.dataset.key = getAnswerKey(i, `p${k}`);
      container.appendChild(inp);
      const ta = document.createElement('textarea');
      ta.placeholder = 'Describe how this platform could be used to distribute the digital product…';
      ta.dataset.key = getAnswerKey(i, `e${k}`);
      container.appendChild(ta);
    }
    return;
  }

    if (q.response_type === 'short_list_with_explain') {
      const n = q.expected_responses || 2;
      const items = [];
      for (let k=1;k<=n;k++) {
        const p = answers[getAnswerKey(i, `p${k}`)] || '';
        const e = answers[getAnswerKey(i, `e${k}`)] || '';
        items.push(`${k}) ${p}\n   ${e}`);
      }
      studentAnswer = items.join('\n');
    } else 
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
    if (q.response_type === 'short_list_with_explain') {
    const n = q.expected_responses || 2;
    for (let k=1;k<=n;k++) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = `Platform ${k}…`;
      inp.dataset.key = getAnswerKey(i, `p${k}`);
      container.appendChild(inp);
      const ta = document.createElement('textarea');
      ta.placeholder = 'Describe how this platform could be used to distribute the digital product…';
      ta.dataset.key = getAnswerKey(i, `e${k}`);
      container.appendChild(ta);
    }
    return;
  }

    if (q.response_type === 'short_list_with_explain') {
      const n = q.expected_responses || 2;
      const items = [];
      for (let k=1;k<=n;k++) {
        const p = answers[getAnswerKey(i, `p${k}`)] || '';
        const e = answers[getAnswerKey(i, `e${k}`)] || '';
        items.push(`${k}) ${p}\n   ${e}`);
      }
      studentAnswer = items.join('\n');
    } else 
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
