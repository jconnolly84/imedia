import { auth, db } from "./firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, writeBatch, limit, startAfter, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const EXAM_ID = "R093-2025-JUN";
const MARKSPEC_URL = "/r093-2025-jun-markscheme-spec.json";
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


async function setMarked(sub, marked){
  const ref = doc(db, "exams", EXAM_ID, "submissions", sub.id);
  const nextStatus = marked ? "marked" : "unmarked";
  const patch = marked ? { status: nextStatus, markedAt: serverTimestamp() } : { status: nextStatus, markedAt: null };
  await updateDoc(ref, patch);
  sub.status = nextStatus;
}

async function deleteAttempt(sub){
  const ref = doc(db, "exams", EXAM_ID, "submissions", sub.id);
  await deleteDoc(ref);
  cache = cache.filter(x=>x.id !== sub.id);
}

async function deleteAllAttempts(){
  // Double confirmation because this is destructive.
  const first = confirm("Delete ALL submissions for this paper? This cannot be undone.");
  if(!first) return;
  const second = prompt("Type DELETE to confirm:");
  if(second !== "DELETE"){
    alert("Cancelled.");
    return;
  }

  els.authStatus.textContent = "Deleting all…";

  try{
    // Use the SAME delete pathway as individual deletes (more compatible with rules than batched deletes).
    // Delete currently loaded records (cache) one-by-one.
    // If cache is empty, load first.
    if (!cache || !cache.length){
      await load(false);
    }
    const ids = (cache || []).map(s=>s.id);

    let deleted = 0;
    for (const id of ids){
      try{
        await deleteDoc(doc(db, "exams", EXAM_ID, "submissions", id));
        deleted++;
      }catch(e){
        console.error("Failed to delete", id, e);
      }
    }

    cache = [];
    current = null;
    renderList(cache);
    els.subMeta.innerHTML = "";
    els.answersBox.textContent = "";
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
        <button class="btn small" data-action="toggleMarked" data-id="${sub.id}">
          ${isMarked ? "Unmark" : "Mark"}
        </button>
        <button class="btn small danger" data-action="deleteAttempt" data-id="${sub.id}">
          Delete
        </button>
      </div>
    `;

    // Row click selects; action buttons do not.
    div.addEventListener("click", (e)=>{
      const btn = e.target?.closest?.("button[data-action]");
      if (btn) return;
      selectSub(sub);
    });

    // Button handlers
    div.querySelectorAll("button[data-action]").forEach(btn=>{
      btn.addEventListener("click", async (e)=>{
        e.preventDefault();
        e.stopPropagation();

        const action = btn.dataset.action;
        try{
          if (action === "toggleMarked"){
            btn.disabled = true;
            await setMarked(sub, !isMarked);
            renderList(cache);
          }
          if (action === "deleteAttempt"){
            const ok = confirm(`Delete submission from ${sub.studentName || "Unknown"}? This cannot be undone.`);
            if(!ok) return;

            btn.disabled = true;

            // Delete first (this is the only part that must succeed).
            try{
              await deleteAttempt(sub);
            }catch(err){
              console.error(err);
              alert("Delete failed. Check console / Firestore rules.");
              return;
            }finally{
              btn.disabled = false;
            }

            // UI refresh (do not treat UI issues as a failed delete)
            try{
              renderList(cache);

              // If we deleted the selected one, clear panel
              if (current && current.id === sub.id){
                current = null;
                els.subMeta.innerHTML = "";
                els.promptOut.value = "";
                if (els.answersBox) els.answersBox.textContent = "";
              }
            }catch(e){
              console.warn("UI refresh after delete had an issue (delete succeeded).", e);
            }
          }
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

  return `You are an OCR Cambridge National Creative iMedia R093 examiner.\n\nTask: Mark this full 70-mark paper question-by-question using ONLY the mark scheme specifications provided below.\n\nMARKING RULES (OCR-style)\n${rules}\n\nOUTPUT:\n- Give a mark for each question part.\n- Provide total /70.\n- Provide WWW, EBI, and 2 targets for improvement.\n- Use UK English.\n\nAt the very end, output JSON (no commentary) exactly in this shape:
{
  "awarded_by_part": { "Q1": 1, "Q2": 2, "Q9a": 1 },
  "sum_check_1": X,
  "sum_check_2": X,
  "final_total": X,
  "max_total": 70
}
Rules: sum_check_1 MUST equal sum_check_2 MUST equal final_total.

${qBlocks}`;
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

els.deleteAllBtn?.addEventListener("click", ()=>deleteAllAttempts());

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
