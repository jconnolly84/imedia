import { auth, db } from "./firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const EXAM_ID = "R093-2025-JUN";
const MARKSPEC_URL = "/r093-2025-jun-markscheme-spec.json";
let MARKSPEC = null;

const els = {
  signInBtn: document.getElementById("signInBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  classFilter: document.getElementById("classFilter"),
  statusFilter: document.getElementById("statusFilter"),
  authStatus: document.getElementById("authStatus"),
  subList: document.getElementById("subList"),
  subMeta: document.getElementById("subMeta"),
  answersBox: document.getElementById("answersBox"),
  copyAnswersBtn2: document.getElementById("copyAnswersBtn2"),
  copyPromptBtn2: document.getElementById("copyPromptBtn2"),
  openPromptUrl: document.getElementById("openPromptUrl"),
};

let current = null;

function fmtTime(ts){
  try{
    const d = ts?.toDate ? ts.toDate() : null;
    return d ? d.toLocaleString() : "";
  } catch { return ""; }
}

function matchesFilters(sub){
  const c = (els.classFilter.value || "").trim().toLowerCase();
  const s = (els.statusFilter.value || "").trim().toLowerCase();
  if (c && (sub.classCode || "").toLowerCase() !== c) return false;
  if (s && (sub.status || "").toLowerCase() !== s) return false;
  return true;
}

function renderList(items){
  els.subList.innerHTML = "";
  const filtered = items.filter(matchesFilters);
  if (!filtered.length){
    els.subList.innerHTML = "<div class='k'>No submissions match your filters.</div>";
    return;
  }
  filtered.forEach(sub=>{
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <div>
        <div><strong>${sub.studentName || "Unknown"}</strong> <small>${sub.classCode || ""}</small></div>
        <small>${fmtTime(sub.submittedAt)}</small>
      </div>
      <div class="k">${sub.status || "unmarked"}</div>
    `;
    div.addEventListener("click", ()=>selectSub(sub));
    els.subList.appendChild(div);
  });
}

function answersOnlyText(sub){
  const a = sub.answers || {};
  const keys = Object.keys(a).sort((x,y)=>{
    const ax = x.match(/\d+/)?.[0] || "0";
    const ay = y.match(/\d+/)?.[0] || "0";
    const nx = parseInt(ax,10), ny = parseInt(ay,10);
    if (nx !== ny) return nx-ny;
    return x.localeCompare(y);
  });
  let out = `Exam: ${sub.examId || EXAM_ID}\nStudent: ${sub.studentName || ""} (${sub.classCode || ""})\n\n`;
  keys.forEach(k=>{
    out += `[${k}]\n${a[k] || ""}\n\n---\n\n`;
  });
  return out.trim();
}

async function selectSub(sub){
  current = sub;
  els.subMeta.textContent = `Student: ${sub.studentName || ""} | Class: ${sub.classCode || ""} | Submitted: ${fmtTime(sub.submittedAt)} | Status: ${sub.status || "unmarked"}`;
  els.answersBox.textContent = answersOnlyText(sub);

  if (sub.promptUrl){
    els.openPromptUrl.style.display = "inline-block";
    els.openPromptUrl.href = sub.promptUrl;
  } else {
    els.openPromptUrl.style.display = "none";
  }
}

async function copyText(t){
  try{
    await navigator.clipboard.writeText(t);
    els.authStatus.textContent = "✅ Copied.";
  } catch {
    els.authStatus.textContent = "⚠️ Could not auto-copy.";
  }
}


async function ensureMarkspec(){
  if (MARKSPEC) return MARKSPEC;
  const res = await fetch(MARKSPEC_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load markscheme spec (${res.status})`);
  MARKSPEC = await res.json();
  return MARKSPEC;
}

function buildFullPrompt(sub){
  if (!MARKSPEC) return "";
  const rules = (MARKSPEC.global_marking_rules || []).map(r=>`- ${r}`).join("\n");
  const qBlocks = (MARKSPEC.questions || []).map(q=>{
    const ans = (sub.answers && sub.answers[q.id] !== undefined) ? sub.answers[q.id] : "";
    let ansText = "";
    if (Array.isArray(ans)) ansText = ans.map((v,i)=>`${i+1}. ${v}`).join("\n");
    else if (ans && typeof ans === "object") ansText = Object.entries(ans).map(([k,v])=>`${k}: ${v}`).join("\n");
    else ansText = String(ans || "");
    const ms = q.marking ? JSON.stringify(q.marking, null, 2) : "";
    const header = `[${q.qnum}] (${q.marks} marks) ${q.command_word}\nQUESTION:\n${q.question}\n\nMARK SCHEME (AI spec):\n${ms}\n\nSTUDENT ANSWER:\n${ansText}\n`;
    return header;
  }).join("\n---\n\n");

  return `You are an OCR Cambridge National Creative iMedia R093 examiner.\n\nTask: Mark this full 70-mark paper question-by-question using ONLY the mark scheme specifications provided below.\n\nMARKING RULES (OCR-style)\n${rules}\n\nOUTPUT:\n- Give a mark for each question part.\n- Provide total /70.\n- Provide WWW, EBI, and 2 targets for improvement.\n- Use UK English.\n\n${qBlocks}`;
}

els.copyAnswersBtn2?.addEventListener("click", ()=>{
  if (!current) return;
  copyText(answersOnlyText(current));
});

els.copyPromptBtn2?.addEventListener("click", async ()=>{
  if (!current) return;
  try {
    await ensureMarkspec();
    const generated = buildFullPrompt(current);
    if (generated){
      current.prompt = generated;
      return copyText(generated);
    }
  } catch(e){
    console.error(e);
    els.authStatus.textContent = "Could not build prompt (markscheme spec missing).";
    return;
  }
  if (current.prompt) return copyText(current.prompt);
  if (current.promptUrl){
    els.authStatus.textContent = "Prompt stored in Storage — click “Open stored prompt”.";
  } else {
    els.authStatus.textContent = "No stored prompt found for this submission.";
  }
});

els.signInBtn?.addEventListener("click", async ()=>{
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
});

els.refreshBtn?.addEventListener("click", ()=>load());

els.classFilter?.addEventListener("input", ()=>load(true));
els.statusFilter?.addEventListener("change", ()=>load(true));

let cache = [];

async function load(useCache=false){
  if (useCache && cache.length){
    renderList(cache);
    return;
  }
  els.authStatus.textContent = "Loading…";
  const q = query(collection(db, "exams", EXAM_ID, "submissions"), orderBy("submittedAt","desc"));
  const snap = await getDocs(q);
  cache = snap.docs.map(d=>({ id:d.id, ...d.data() }));
  renderList(cache);
  els.authStatus.textContent = "";
}

onAuthStateChanged(auth, (user)=>{
  els.authStatus.textContent = user ? `Signed in: ${user.email}` : "Not signed in.";
});

load();
