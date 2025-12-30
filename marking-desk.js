import { auth, db } from "./firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const EXAM_ID = "R093-PM01";

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

els.copyAnswersBtn2?.addEventListener("click", ()=>{
  if (!current) return;
  copyText(answersOnlyText(current));
});

els.copyPromptBtn2?.addEventListener("click", ()=>{
  if (!current) return;
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
