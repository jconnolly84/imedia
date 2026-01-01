import { auth, db } from "./firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  collection, getDocs, query, orderBy,
  doc, updateDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/**
 * Marking desk for the R093 Pre‑Mock Mini Exam (PM01).
 * Teacher-only view: browse submissions, copy answers/prompts, mark/unmark, delete.
 */

const EXAM_ID = "R093-PM01";
const MARKSPEC_URL = "/r093-pm01-markscheme-spec.json"; // optional; falls back to stored prompt if missing
const MAX_TOTAL = 31;

let MARKSPEC = null;

const els = {
  signInBtn: document.getElementById("signInBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  deleteAllBtn: document.getElementById("deleteAllBtn"),
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

let cache = [];
let current = null;

function fmtTime(ts){
  try{
    const d = ts?.toDate ? ts.toDate() : null;
    return d ? d.toLocaleString() : "";
  } catch {
    return "";
  }
}

function matchesFilters(sub){
  const c = (els.classFilter?.value || "").trim().toLowerCase();
  const s = (els.statusFilter?.value || "").trim().toLowerCase();
  if (c && (sub.classCode || "").toLowerCase() !== c) return false;

  // status can be missing in older docs; treat as "unmarked"
  const status = (sub.status || "unmarked").toLowerCase();
  if (s && status !== s) return false;

  return true;
}

async function setMarked(sub, marked){
  const ref = doc(db, "exams", EXAM_ID, "submissions", sub.id);
  const nextStatus = marked ? "marked" : "unmarked";
  const patch = marked
    ? { status: nextStatus, markedAt: serverTimestamp() }
    : { status: nextStatus, markedAt: null };
  await updateDoc(ref, patch);
  sub.status = nextStatus;
}

async function deleteAttempt(sub){
  const ref = doc(db, "exams", EXAM_ID, "submissions", sub.id);
  await deleteDoc(ref);
  cache = cache.filter(x => x.id !== sub.id);
}

async function deleteAllAttempts(){
  const first = confirm("Delete ALL submissions for this mini exam? This cannot be undone.");
  if(!first) return;

  const second = prompt("Type DELETE to confirm:");
  if(second !== "DELETE"){
    alert("Cancelled.");
    return;
  }

  els.authStatus.textContent = "Deleting all…";

  try{
    if (!cache.length){
      await load(false);
    }

    let deleted = 0;
    for (const sub of [...cache]){
      try{
        await deleteDoc(doc(db, "exams", EXAM_ID, "submissions", sub.id));
        deleted++;
      }catch(e){
        console.error("Failed to delete", sub.id, e);
      }
    }

    cache = [];
    current = null;
    renderList(cache);
    els.subMeta.textContent = "Pick a submission…";
    if (els.answersBox) els.answersBox.textContent = "";
    els.authStatus.textContent = `Deleted ${deleted} submissions.`;
  }catch(err){
    console.error(err);
    alert("Delete all failed. Check Firestore rules/network.");
    els.authStatus.textContent = "Delete all failed.";
  }
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

    const status = (sub.status || "unmarked").toLowerCase();
    const isMarked = status === "marked";

    div.innerHTML = `
      <div>
        <div><strong>${sub.studentName || "Unknown"}</strong> <small>${sub.classCode || ""}</small></div>
        <small>${fmtTime(sub.submittedAt)}</small>
      </div>
      <div class="row-actions">
        <span class="k status-pill ${isMarked ? "marked" : "unmarked"}">${status}</span>
        <button class="btn small" data-action="toggleMarked">${isMarked ? "Unmark" : "Mark"}</button>
        <button class="btn small danger" data-action="deleteAttempt">🗑️ Delete</button>
      </div>
    `;

    // Select on row click (not on buttons)
    div.addEventListener("click", (e)=>{
      const btn = e.target?.closest?.("button[data-action]");
      if (btn) return;
      selectSub(sub);
    });

    // Button actions
    div.querySelectorAll("button[data-action]").forEach(btn=>{
      btn.addEventListener("click", async (e)=>{
        e.preventDefault();
        e.stopPropagation();

        const action = btn.dataset.action;
        btn.disabled = true;

        try{
          if (action === "toggleMarked"){
            await setMarked(sub, !isMarked);
            renderList(cache);
            return;
          }

          if (action === "deleteAttempt"){
            const ok = confirm(`Delete submission from ${sub.studentName || "Unknown"}? This cannot be undone.`);
            if(!ok) return;

            await deleteAttempt(sub);

            // Refresh list + clear panel if needed
            try{
              renderList(cache);
              if (current && current.id === sub.id){
                current = null;
                els.subMeta.textContent = "Pick a submission…";
                if (els.answersBox) els.answersBox.textContent = "";
              }
            }catch(uiErr){
              console.warn("UI refresh after delete had an issue (delete succeeded).", uiErr);
            }
            return;
          }
        }catch(err){
          console.error(err);
          alert("Action failed. Check console / Firestore rules.");
        }finally{
          btn.disabled = false;
        }
      });
    });

    els.subList.appendChild(div);
  });
}

function answersOnlyText(sub){
  const a = sub.answers || {};
  const keys = Object.keys(a).sort((x,y)=>{
    // numeric sort: Q1, Q2, Q10 etc; then subparts
    const nx = parseInt((x.match(/\d+/)||["0"])[0],10);
    const ny = parseInt((y.match(/\d+/)||["0"])[0],10);
    if (nx !== ny) return nx - ny;
    return x.localeCompare(y);
  });

  let out = `Exam: ${sub.examId || EXAM_ID}\nStudent: ${sub.studentName || ""} (${sub.classCode || ""})\n\n`;
  keys.forEach(k=>{
    out += `[${k}]\n${a[k] ?? ""}\n\n---\n\n`;
  });
  return out.trim();
}

async function selectSub(sub){
  current = sub;
  const status = sub.status || "unmarked";
  els.subMeta.textContent =
    `Student: ${sub.studentName || ""} | Class: ${sub.classCode || ""} | Submitted: ${fmtTime(sub.submittedAt)} | Status: ${status}`;
  if (els.answersBox) els.answersBox.textContent = answersOnlyText(sub);

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
    else ansText = String(ans ?? "");

    const ms = q.marking ? JSON.stringify(q.marking, null, 2) : "";

    return `[${q.qnum}] (${q.marks} marks) ${q.command_word}
QUESTION:
${q.question}

MARK SCHEME (AI spec):
${ms}

STUDENT ANSWER:
${ansText}
`;
  }).join("\n---\n\n");

  return `You are an OCR Cambridge National Creative iMedia R093 examiner.

Task: Mark this ${MAX_TOTAL}-mark mini exam question-by-question using ONLY the mark scheme specifications provided below.

MARKING RULES (OCR-style)
${rules}

OUTPUT:
- Give a mark for each question part.
- Provide total /${MAX_TOTAL}.
- Provide WWW, EBI, and 2 targets for improvement.
- Use UK English.

At the very end, output JSON (no commentary) exactly in this shape:
{
  "awarded_by_part": { "Q1": 1, "Q2": 2, "Q9a": 1 },
  "sum_check_1": X,
  "sum_check_2": X,
  "final_total": X,
  "max_total": ${MAX_TOTAL}
}
Rules: sum_check_1 MUST equal sum_check_2 MUST equal final_total.

${qBlocks}`;
}

// UI hooks
els.copyAnswersBtn2?.addEventListener("click", ()=>{
  if (!current) return;
  copyText(answersOnlyText(current));
});

els.copyPromptBtn2?.addEventListener("click", async ()=>{
  if (!current) return;

  // Prefer building a fresh prompt from the markscheme spec (if present in the repo).
  try{
    await ensureMarkspec();
    const prompt = buildFullPrompt(current);
    if (prompt){
      current.prompt = prompt;
      return copyText(prompt);
    }
  }catch(e){
    // Spec missing is fine: fall back to stored prompt fields.
    console.warn("Could not build prompt from markscheme spec. Falling back.", e);
    els.authStatus.textContent = "Could not build prompt from spec; using stored prompt if available.";
  }

  if (current.prompt) return copyText(current.prompt);
  if (current.promptUrl){
    els.authStatus.textContent = "Prompt stored — click “Open stored prompt”.";
  } else {
    els.authStatus.textContent = "No stored prompt found for this submission.";
  }
});

els.signInBtn?.addEventListener("click", async ()=>{
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
});

els.refreshBtn?.addEventListener("click", ()=>load(false));
els.deleteAllBtn?.addEventListener("click", ()=>deleteAllAttempts());

els.classFilter?.addEventListener("input", ()=>renderList(cache));
els.statusFilter?.addEventListener("change", ()=>renderList(cache));

async function load(useCache=false){
  if (useCache && cache.length){
    renderList(cache);
    return;
  }
  els.authStatus.textContent = "Loading…";
  const q = query(collection(db, "exams", EXAM_ID, "submissions"), orderBy("submittedAt","desc"));
  const snap = await getDocs(q);
  cache = snap.docs.map(d=>({ id: d.id, ...d.data() }));
  renderList(cache);
  els.authStatus.textContent = "";
}

onAuthStateChanged(auth, (user)=>{
  els.authStatus.textContent = user ? `Signed in: ${user.email}` : "Not signed in.";
});

// initial load
load(false);
