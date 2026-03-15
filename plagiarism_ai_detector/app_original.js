const els = {
  pickFolderBtn: document.getElementById('pickFolderBtn'),
  folderInput: document.getElementById('folderInput'),
  scanBtn: document.getElementById('scanBtn'),
  status: document.getElementById('status'),
  folderTableWrap: document.getElementById('folderTableWrap'),
  dashboard: document.getElementById('dashboard'),
  exactReuse: document.getElementById('exactReuse'),
  heatmap: document.getElementById('heatmap'),
  sharingClusters: document.getElementById('sharingClusters'),
  clusters: document.getElementById('clusters'),
  aiPanel: document.getElementById('aiPanel'),
  possiblePlagiarismSummary: document.getElementById('possiblePlagiarismSummary'),
  studentFilter: document.getElementById('studentFilter'),
  threshold: document.getElementById('similarityThreshold'),
  thresholdValue: document.getElementById('similarityThresholdValue'),
  minParagraphChars: document.getElementById('minParagraphChars'),
  aiSensitivity: document.getElementById('aiSensitivity'),
  ignoreSameFolder: document.getElementById('ignoreSameFolder'),
  statStudents: document.getElementById('statStudents'),
  statFiles: document.getElementById('statFiles'),
  statCopied: document.getElementById('statCopied'),
  statRed: document.getElementById('statRed'),
  statExact: document.getElementById('statExact'),
  downloadCsvBtn: document.getElementById('downloadCsvBtn'),
  downloadClassReportBtn: document.getElementById('downloadClassReportBtn'),
  downloadStudentReportsBtn: document.getElementById('downloadStudentReportsBtn'),
};

const state = { pickedDirHandle: null, files: [], scanResult: null };

els.threshold.addEventListener('input', () => { els.thresholdValue.textContent = Number(els.threshold.value).toFixed(2); });
els.studentFilter.addEventListener('input', renderDashboard);
els.pickFolderBtn.addEventListener('click', pickFolder);
els.folderInput.addEventListener('change', handleFolderUpload);
els.scanBtn.addEventListener('click', scanLoadedFiles);
els.downloadCsvBtn.addEventListener('click', downloadCsv);
els.downloadClassReportBtn.addEventListener('click', downloadClassReport);
els.downloadStudentReportsBtn.addEventListener('click', downloadStudentReports);

function setStatus(message) { els.status.textContent = message; }

async function pickFolder() {
  if (!window.showDirectoryPicker) { setStatus('Browser folder access is not available here. Use Fallback folder upload.'); return; }
  try {
    const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
    state.pickedDirHandle = dirHandle;
    state.files = await collectFilesFromDirectory(dirHandle);
    renderLoadedFiles();
    setStatus(`Loaded ${state.files.length} supported files from ${dirHandle.name}.`);
    els.scanBtn.disabled = state.files.length === 0;
  } catch (err) { if (err?.name !== 'AbortError') setStatus(`Folder load failed: ${err.message}`); }
}

async function collectFilesFromDirectory(dirHandle, path = dirHandle.name) {
  const out = [];
  for await (const entry of dirHandle.values()) {
    const entryPath = `${path}/${entry.name}`;
    if (entry.kind === 'directory') out.push(...await collectFilesFromDirectory(entry, entryPath));
    else if (isSupported(entry.name)) { const file = await entry.getFile(); file.fullPath = entryPath; out.push(file); }
  }
  return out;
}

function handleFolderUpload(e) {
  state.pickedDirHandle = null;
  state.files = Array.from(e.target.files || []).filter(f => isSupported(f.name));
  renderLoadedFiles();
  setStatus(`Loaded ${state.files.length} supported files via browser upload.`);
  els.scanBtn.disabled = state.files.length === 0;
}

function isSupported(name) { return /\.(pptx|docx)$/i.test(name); }

function parseRootFolder(fullPath, fileName) {
  const normal = (fullPath || fileName || '').replace(/\\/g, '/');
  const parts = normal.split('/').filter(Boolean);
  const filePart = parts[parts.length - 1] || fileName || '';
  const rootCandidate = parts.length >= 2 ? parts[parts.length - 2] : filePart.replace(/\.[^.]+$/, '');
  const m = rootCandidate.match(/^(\d{3,6})_([^_]+(?:_[^_]+)*)_(R\d{3})_(.+)$/i);
  if (m) return { rootFolder: rootCandidate, candidateNumber: m[1], studentName: m[2].replace(/_/g, ' '), unitCode: m[3].toUpperCase(), assignmentName: m[4].replace(/_/g, ' ') };
  return { rootFolder: rootCandidate, candidateNumber: '', studentName: rootCandidate.replace(/_/g, ' '), unitCode: '', assignmentName: '' };
}

function renderLoadedFiles() {
  if (!state.files.length) { els.folderTableWrap.innerHTML = '<div class="empty">No supported files found.</div>'; return; }
  const rows = state.files.map(file => {
    const meta = parseRootFolder(file.webkitRelativePath || file.fullPath || file.name, file.name);
    return `<tr><td>${escapeHtml(meta.candidateNumber || '—')}</td><td>${escapeHtml(meta.studentName)}</td><td>${escapeHtml(meta.unitCode || '—')}</td><td>${escapeHtml(meta.assignmentName || '—')}</td><td>${escapeHtml(file.name)}</td><td>${escapeHtml(file.webkitRelativePath || file.fullPath || file.name)}</td><td>${formatBytes(file.size)}</td></tr>`;
  }).join('');
  els.folderTableWrap.innerHTML = `<table><thead><tr><th>Candidate</th><th>Student</th><th>Unit</th><th>Assignment</th><th>File</th><th>Path</th><th>Size</th></tr></thead><tbody>${rows}</tbody></table>`;
}

async function scanLoadedFiles() {
  if (!state.files.length) return;
  const threshold = parseFloat(els.threshold.value);
  const minChars = parseInt(els.minParagraphChars.value, 10);
  const ignoreSameFolder = els.ignoreSameFolder.value === 'yes';
  setStatus('Extracting text from files…');

  const extractedDocs = [];
  for (let i = 0; i < state.files.length; i++) {
    const file = state.files[i];
    setStatus(`Extracting text ${i + 1}/${state.files.length}: ${file.name}`);
    try {
      const text = await extractTextFromFile(file);
      const meta = parseRootFolder(file.webkitRelativePath || file.fullPath || file.name, file.name);
      const paragraphs = splitParagraphs(text, minChars).map((p, idx) => ({ raw: p, norm: normalizeParagraph(p), idx }));
      const ai = scoreAiSignals(text, paragraphs.map(p => p.raw), els.aiSensitivity.value);
      extractedDocs.push({ ...meta, fileName: file.name, path: file.webkitRelativePath || file.fullPath || file.name, size: file.size, text, firstPagePreview: firstMeaningfulLine(text), paragraphs, ai });
    } catch (err) {
      extractedDocs.push({ ...parseRootFolder(file.webkitRelativePath || file.fullPath || file.name, file.name), fileName: file.name, path: file.webkitRelativePath || file.fullPath || file.name, size: file.size, text: '', firstPagePreview: `Extraction failed: ${err.message}`, paragraphs: [], ai: { score: 0, level: 'green', reasons: ['Extraction failed'] }, extractionError: err.message });
    }
  }

  const exactReuse = detectExactParagraphReuse(extractedDocs, ignoreSameFolder);
  setStatus('Comparing likely copied sections across students…');
  const paragraphMatches = compareParagraphs(extractedDocs, threshold, ignoreSameFolder, exactReuse);
  const students = buildStudentSummaries(extractedDocs, paragraphMatches, exactReuse);
  const heatmap = buildSimilarityMap(students, paragraphMatches, exactReuse);
  const clusters = buildLikelyCopyClusters(paragraphMatches);
  const sharingClusters = buildSharingClusters(students, paragraphMatches, exactReuse);

  state.scanResult = { extractedDocs, exactReuse, paragraphMatches, students, heatmap, clusters, sharingClusters, settings: { threshold, minChars, ignoreSameFolder } };
  renderResults();
  setStatus(`Scan complete. ${students.length} students, ${paragraphMatches.length} likely copied sections, ${exactReuse.length} exact reused paragraph clusters.`);
  els.downloadCsvBtn.disabled = false;
  els.downloadClassReportBtn.disabled = false;
  els.downloadStudentReportsBtn.disabled = false;
}

async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) return await extractDocx(file);
  if (name.endsWith('.pptx')) return await extractPptx(file);
  return '';
}

async function extractDocx(file) { const arrayBuffer = await file.arrayBuffer(); const result = await window.mammoth.extractRawText({ arrayBuffer }); return result.value || ''; }
async function extractPptx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideNames = Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/i.test(n)).sort((a,b) => numericSort(a,b));
  const noteNames = Object.keys(zip.files).filter(n => /^ppt\/notesSlides\/notesSlide\d+\.xml$/i.test(n)).sort((a,b) => numericSort(a,b));
  const parts = [];
  for (const s of slideNames) parts.push(cleanXmlText(await zip.file(s).async('string')));
  for (const n of noteNames) parts.push(cleanXmlText(await zip.file(n).async('string')));
  return parts.join('\n\n');
}
function cleanXmlText(xml) { return xml.replace(/<a:br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim(); }
function splitParagraphs(text, minChars) { return (text || '').split(/\n{2,}|(?<=[.!?])\s{2,}/).map(s => s.replace(/\s+/g, ' ').trim()).filter(s => s.length >= minChars); }
function firstMeaningfulLine(text) { return (text || '').split(/\n+/).map(s => s.trim()).find(s => s.length > 2) || ''; }
function tokenize(text) { return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(Boolean); }
function uniqueBigrams(tokens) { const set = new Set(); for (let i = 0; i < tokens.length - 1; i++) set.add(tokens[i] + ' ' + tokens[i+1]); return set; }
function normalizeParagraph(text) { return tokenize(text).join(' '); }

function paragraphSimilarity(a, b) {
  const aTokens = tokenize(a); const bTokens = tokenize(b); if (aTokens.length < 8 || bTokens.length < 8) return 0;
  const aSet = uniqueBigrams(aTokens); const bSet = uniqueBigrams(bTokens); let inter = 0; for (const t of aSet) if (bSet.has(t)) inter++;
  const union = new Set([...aSet, ...bSet]).size || 1; const jaccard = inter / union; const lenPenalty = Math.min(a.length, b.length) / Math.max(a.length, b.length);
  return (jaccard * 0.85) + (lenPenalty * 0.15);
}

function scoreAiSignals(text, paragraphs, sensitivity) {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  const words = tokenize(clean); const uniqueWords = new Set(words); const avgSentence = sentenceLengths(clean);
  const repeatedPhrases = ['target audience', 'client brief', 'luxury lifestyle', 'this meets the client brief', 'to attract the target audience', 'colour scheme', 'visual identity', 'i have chosen'];
  const genericHits = repeatedPhrases.filter(p => clean.toLowerCase().includes(p)).length;
  const longParagraphRatio = paragraphs.length ? paragraphs.filter(p => p.length > 700).length / paragraphs.length : 0;
  const typeTokenRatio = words.length ? uniqueWords.size / words.length : 0;
  let score = 0; const reasons = [];
  if (avgSentence > 24) { score += 18; reasons.push('Long average sentence length'); }
  if (genericHits >= 4) { score += 18; reasons.push('Many generic coursework phrases'); }
  if (longParagraphRatio > 0.35) { score += 16; reasons.push('Large polished paragraph blocks'); }
  if (typeTokenRatio < 0.42 && words.length > 400) { score += 12; reasons.push('Low vocabulary variation for long response'); }
  if (/\b(furthermore|moreover|in conclusion|overall|this demonstrates|therefore)\b/i.test(clean)) { score += 10; reasons.push('Highly formal connective style'); }
  if (/\b(resonates with|connotates with|evoke[s]? a sense of|aesthetics? of the brand)\b/i.test(clean)) { score += 14; reasons.push('Repeated design-analysis phrasing'); }
  const modifier = sensitivity === 'strict' ? 1.15 : sensitivity === 'lenient' ? 0.85 : 1;
  score = Math.min(100, Math.round(score * modifier));
  const level = score >= 55 ? 'red' : score >= 30 ? 'amber' : 'green';
  return { score, level, reasons };
}
function sentenceLengths(text) { const s = text.split(/[.!?]+/).map(x => tokenize(x).length).filter(Boolean); return s.length ? s.reduce((a,b)=>a+b,0) / s.length : 0; }

function detectExactParagraphReuse(extractedDocs, ignoreSameFolder) {
  const groups = new Map();
  for (const doc of extractedDocs) {
    for (const para of doc.paragraphs) {
      if (para.norm.length < 80) continue;
      if (!groups.has(para.norm)) groups.set(para.norm, []);
      groups.get(para.norm).push({ rootFolder: doc.rootFolder, studentName: doc.studentName, candidateNumber: doc.candidateNumber, fileName: doc.fileName, excerpt: para.raw.slice(0, 320) });
    }
  }
  const clusters = [];
  for (const [norm, items] of groups.entries()) {
    const distinctRoots = [...new Set(items.map(i => i.rootFolder))];
    if (distinctRoots.length < 2) continue;
    if (ignoreSameFolder && distinctRoots.length === 1) continue;
    clusters.push({ norm, items, roots: distinctRoots, exactText: items[0].excerpt, count: items.length });
  }
  return clusters.sort((a,b) => b.roots.length - a.roots.length || b.count - a.count);
}

function compareParagraphs(extractedDocs, threshold, ignoreSameFolder, exactReuse) {
  const exactNorms = new Set(exactReuse.map(c => c.norm));
  const matches = [];
  const seen = new Set();
  for (let i = 0; i < extractedDocs.length; i++) {
    for (let j = i + 1; j < extractedDocs.length; j++) {
      const a = extractedDocs[i], b = extractedDocs[j];
      if (ignoreSameFolder && a.rootFolder === b.rootFolder) continue;
      for (const pa of a.paragraphs) {
        for (const pb of b.paragraphs) {
          const exact = pa.norm === pb.norm && pa.norm.length >= 80 && exactNorms.has(pa.norm);
          const sim = exact ? 1 : paragraphSimilarity(pa.raw, pb.raw);
          if (exact || sim >= threshold) {
            const key = `${a.rootFolder}|${b.rootFolder}|${pa.norm.slice(0,120)}|${pb.norm.slice(0,120)}`;
            if (seen.has(key)) continue;
            seen.add(key);
            matches.push({
              aStudent: a.studentName, bStudent: b.studentName, aCandidate: a.candidateNumber, bCandidate: b.candidateNumber,
              aRoot: a.rootFolder, bRoot: b.rootFolder, aFile: a.fileName, bFile: b.fileName, similarity: sim,
              excerptA: pa.raw.slice(0, 280), excerptB: pb.raw.slice(0, 280), exact,
            });
          }
        }
      }
    }
  }
  return matches.sort((a,b) => b.similarity - a.similarity);
}

function buildStudentSummaries(extractedDocs, matches, exactReuse) {
  const map = new Map();
  for (const doc of extractedDocs) {
    if (!map.has(doc.rootFolder)) map.set(doc.rootFolder, { rootFolder: doc.rootFolder, candidateNumber: doc.candidateNumber, studentName: doc.studentName, unitCode: doc.unitCode, assignmentName: doc.assignmentName, files: [], copiedMatches: [], exactMatches: [], aiScores: [], aiReasons: [], preview: doc.firstPagePreview });
    const s = map.get(doc.rootFolder);
    s.files.push(doc); s.aiScores.push(doc.ai.score); s.aiReasons.push(...(doc.ai.reasons || [])); if (!s.preview && doc.firstPagePreview) s.preview = doc.firstPagePreview;
  }
  for (const match of matches) { const a = map.get(match.aRoot), b = map.get(match.bRoot); if (a) a.copiedMatches.push(match); if (b) b.copiedMatches.push(match); }
  for (const cluster of exactReuse) {
    for (const item of cluster.items) {
      const s = map.get(item.rootFolder); if (s) s.exactMatches.push(cluster);
    }
  }
  return [...map.values()].map(s => {
    const avgAi = s.aiScores.length ? Math.round(s.aiScores.reduce((a,b)=>a+b,0) / s.aiScores.length) : 0;
    const strongestSimilarity = s.copiedMatches.length ? Math.max(...s.copiedMatches.map(m => Math.round(m.similarity * 100))) : 0;
    const exactCount = s.exactMatches.length;
    const flag = exactCount >= 1 || strongestSimilarity >= 85 || avgAi >= 55 ? 'red' : strongestSimilarity >= 70 || avgAi >= 30 ? 'amber' : 'green';
    const likelyCopiedSections = s.copiedMatches.slice(0, 4).map(m => {
      const ownExcerpt = m.aRoot === s.rootFolder ? m.excerptA : m.excerptB;
      const other = m.aRoot === s.rootFolder ? `${m.bCandidate} ${m.bStudent}`.trim() : `${m.aCandidate} ${m.aStudent}`.trim();
      return { similarity: Math.round(m.similarity * 100), other, exact: m.exact, excerpt: ownExcerpt };
    });
    const aiReasonCounts = [...new Map(s.aiReasons.map(r => [r, (s.aiReasons.filter(x => x === r).length)])).entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([reason]) => reason);
    return { ...s, avgAi, strongestSimilarity, exactCount, flag, aiReasonCounts, uniqueMatchPartners: new Set(s.copiedMatches.flatMap(m => [m.aRoot, m.bRoot]).filter(r => r !== s.rootFolder)).size, likelyCopiedSections };
  }).sort((a,b) => a.studentName.localeCompare(b.studentName));
}

function buildSimilarityMap(students, matches, exactReuse) {
  const matrix = {};
  for (const a of students) matrix[a.rootFolder] = {};
  for (const m of matches) {
    const val = Math.max(matrix[m.aRoot]?.[m.bRoot] || 0, Math.round(m.similarity * 100));
    matrix[m.aRoot][m.bRoot] = val;
    matrix[m.bRoot][m.aRoot] = val;
  }
  for (const ex of exactReuse) {
    for (let i = 0; i < ex.roots.length; i++) {
      for (let j = i + 1; j < ex.roots.length; j++) {
        matrix[ex.roots[i]][ex.roots[j]] = 100;
        matrix[ex.roots[j]][ex.roots[i]] = 100;
      }
    }
  }
  return matrix;
}

function buildLikelyCopyClusters(matches) {
  const groups = new Map();
  for (const m of matches) {
    const key = normalizeClusterKey(m.excerptA, m.excerptB);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  return [...groups.entries()].map(([key, items]) => ({ key, items, students: [...new Set(items.flatMap(i => [`${i.aCandidate} ${i.aStudent}`.trim(), `${i.bCandidate} ${i.bStudent}`.trim()]))], strongest: Math.max(...items.map(i => i.similarity)), sample: items[0].excerptA, exactCount: items.filter(i => i.exact).length })).sort((a,b) => b.strongest - a.strongest || b.students.length - a.students.length);
}

function buildSharingClusters(students, matches, exactReuse) {
  const nodes = new Map(students.map(s => [s.rootFolder, { id: s.rootFolder, label: `${s.candidateNumber} ${s.studentName}`.trim(), edges: new Set() }]));
  for (const m of matches) { nodes.get(m.aRoot)?.edges.add(m.bRoot); nodes.get(m.bRoot)?.edges.add(m.aRoot); }
  for (const ex of exactReuse) for (const r1 of ex.roots) for (const r2 of ex.roots) if (r1 !== r2) nodes.get(r1)?.edges.add(r2);
  const visited = new Set();
  const clusters = [];
  for (const node of nodes.values()) {
    if (visited.has(node.id) || node.edges.size === 0) continue;
    const stack = [node.id], component = [];
    visited.add(node.id);
    while (stack.length) {
      const cur = stack.pop(); component.push(cur);
      for (const nxt of nodes.get(cur).edges) if (!visited.has(nxt)) { visited.add(nxt); stack.push(nxt); }
    }
    if (component.length >= 2) {
      const componentMatches = matches.filter(m => component.includes(m.aRoot) && component.includes(m.bRoot));
      clusters.push({ members: component.map(id => nodes.get(id).label), size: component.length, strongest: componentMatches.length ? Math.max(...componentMatches.map(m => Math.round(m.similarity * 100))) : 100, exactReuseCount: exactReuse.filter(ex => ex.roots.some(r => component.includes(r))).length });
    }
  }
  return clusters.sort((a,b) => b.size - a.size || b.strongest - a.strongest);
}

function normalizeClusterKey(a, b) { const x = tokenize(a).slice(0, 18).join(' '); const y = tokenize(b).slice(0, 18).join(' '); return [x, y].sort().join(' || '); }

function renderResults() {
  const { students, extractedDocs, paragraphMatches, exactReuse } = state.scanResult;
  els.statStudents.textContent = students.length;
  els.statFiles.textContent = extractedDocs.length;
  els.statCopied.textContent = paragraphMatches.length;
  els.statRed.textContent = students.filter(s => s.flag === 'red').length;
  els.statExact.textContent = exactReuse.length;
  renderDashboard(); renderPlagiarismSummary(); renderHeatmap(); renderExactReuse(); renderSharingClusters(); renderLikelyCopiedSections(); renderAiPanel();
}

function renderPlagiarismSummary() {
  if (!state.scanResult) return;
  const { students, paragraphMatches, exactReuse, sharingClusters } = state.scanResult;
  const red = students.filter(s => s.flag === 'red').length;
  const amber = students.filter(s => s.flag === 'amber').length;
  els.possiblePlagiarismSummary.innerHTML = `<b>${paragraphMatches.length}</b> likely copied matches · <b>${exactReuse.length}</b> exact reused paragraph groups · <b>${sharingClusters.length}</b> sharing clusters · <b>${red}</b> red and <b>${amber}</b> amber student flags.`;
}

function renderAiPanel() {
  if (!state.scanResult) return;
  const students = [...state.scanResult.students].filter(s => s.avgAi >= 20 || s.aiReasonCounts.length).sort((a,b) => b.avgAi - a.avgAi);
  if (!students.length) { els.aiPanel.innerHTML = '<div class="empty">No notable AI review signals at the current sensitivity.</div>'; return; }
  els.aiPanel.innerHTML = `<div class="ai-grid">${students.map(s => `
    <article class="ai-card">
      <div class="row-between">
        <div>
          <div class="student-name">${escapeHtml(s.studentName)}</div>
          <div class="student-meta">${escapeHtml([s.candidateNumber, s.unitCode, s.assignmentName].filter(Boolean).join(' · '))}</div>
        </div>
        <div><span class="badge flag-${s.avgAi >= 55 ? 'red' : s.avgAi >= 30 ? 'amber' : 'green'}">${s.avgAi >= 55 ? 'HIGH' : s.avgAi >= 30 ? 'MEDIUM' : 'LOW'}</span></div>
      </div>
      <div class="metric-row">
        <div class="metric"><b class="ai-score">${s.avgAi}</b><small>AI signal</small></div>
        <div class="metric"><b>${s.files.length}</b><small>Files</small></div>
        <div class="metric"><b>${s.strongestSimilarity}%</b><small>Top similarity</small></div>
        <div class="metric"><b>${s.exactCount}</b><small>Exact reuse</small></div>
      </div>
      <div class="preview"><b>First-page preview:</b><br>${escapeHtml(s.preview || 'No preview found')}</div>
      <ul class="ai-reasons">${(s.aiReasonCounts.length ? s.aiReasonCounts : ['No strong AI-style reasons triggered.']).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <div class="ai-files">Files: ${s.files.map(f => escapeHtml(f.fileName)).join(' · ')}</div>
    </article>`).join('')}</div>`;
}

function renderDashboard() {
  if (!state.scanResult) return;
  const q = els.studentFilter.value.trim().toLowerCase();
  const students = state.scanResult.students.filter(s => (`${s.candidateNumber} ${s.studentName} ${s.unitCode} ${s.assignmentName}`).toLowerCase().includes(q) || !q);
  if (!students.length) { els.dashboard.innerHTML = '<div class="empty">No students match the current filter.</div>'; return; }
  els.dashboard.innerHTML = students.map(s => `
    <article class="student-card">
      <div class="student-top">
        <div>
          <div class="student-name">${escapeHtml(s.studentName)}</div>
          <div class="student-meta">${escapeHtml([s.candidateNumber, s.unitCode, s.assignmentName].filter(Boolean).join(' · '))}</div>
        </div>
        <div><span class="badge flag-${s.flag}">${s.flag.toUpperCase()}</span></div>
      </div>
      <div class="metric-row">
        <div class="metric"><b>${s.files.length}</b><small>Files</small></div>
        <div class="metric"><b>${s.strongestSimilarity}%</b><small>Top similarity</small></div>
        <div class="metric"><b>${s.avgAi}</b><small>AI signal</small></div>
        <div class="metric"><b>${s.exactCount}</b><small>Exact reuse</small></div>
      </div>
      <div class="preview"><b>First-page preview:</b><br>${escapeHtml(s.preview || 'No preview found')}</div>
      <div class="copied-highlight"><b>Possible plagiarism summary:</b><br>${s.copiedMatches.length ? `${s.copiedMatches.length} likely copied matches across ${s.uniqueMatchPartners} other student folders.` : 'No likely copied matches found at the current threshold.'}</div>
      <div class="small" style="margin-top:10px;">Files: ${s.files.map(f => escapeHtml(f.fileName)).join(' · ')}</div>
    </article>`).join('');
}

function renderHeatmap() {
  const { students, heatmap } = state.scanResult;
  if (!students.length) { els.heatmap.innerHTML = '<div class="empty">No heatmap data.</div>'; return; }
  const header = students.map(s => `<th>${escapeHtml((s.candidateNumber || s.studentName).split(' ')[0] || s.studentName)}</th>`).join('');
  const rows = students.map(row => {
    const cells = students.map(col => {
      if (row.rootFolder === col.rootFolder) return '<td class="cell cell-0">—</td>';
      const value = heatmap[row.rootFolder]?.[col.rootFolder] || 0;
      const bucket = value >= 100 ? 6 : value >= 90 ? 6 : value >= 80 ? 5 : value >= 70 ? 4 : value >= 55 ? 3 : value >= 35 ? 2 : value > 0 ? 1 : 0;
      return `<td class="cell cell-${bucket}" title="${escapeHtml(row.studentName)} vs ${escapeHtml(col.studentName)} = ${value}%">${value || ''}</td>`;
    }).join('');
    return `<tr><th class="label">${escapeHtml(`${row.candidateNumber || ''} ${row.studentName}`.trim())}</th>${cells}</tr>`;
  }).join('');
  els.heatmap.innerHTML = `<div class="heatmap-wrap"><table class="heatmap"><thead><tr><th class="label">Student</th>${header}</tr></thead><tbody>${rows}</tbody></table></div><div class="legend"><span>0 none</span><span>1 low</span><span>2 watch</span><span>3 medium</span><span>4 strong</span><span>5 very strong</span><span>6 exact / near exact</span></div>`;
}

function renderExactReuse() {
  const clusters = state.scanResult.exactReuse;
  if (!clusters.length) { els.exactReuse.innerHTML = '<div class="empty">No exact paragraph reuse found across different students.</div>'; return; }
  els.exactReuse.innerHTML = clusters.slice(0, 100).map(c => `<div class="reuse-card"><div class="cluster-title">Exact reuse across ${c.roots.length} student folders</div><div class="small">${c.items.map(i => escapeHtml(`${i.candidateNumber} ${i.studentName}`.trim())).join(' · ')}</div><p><mark>${escapeHtml(c.exactText)}</mark></p><div class="small">Files: ${c.items.map(i => escapeHtml(i.fileName)).join(' · ')}</div></div>`).join('');
}

function renderSharingClusters() {
  const clusters = state.scanResult.sharingClusters;
  if (!clusters.length) { els.sharingClusters.innerHTML = '<div class="empty">No multi-student sharing clusters found.</div>'; return; }
  els.sharingClusters.innerHTML = clusters.map(c => `<div class="share-card"><div class="cluster-title">${c.size}-student sharing cluster · strongest ${c.strongest}%</div><div class="small">Exact reuse clusters inside group: ${c.exactReuseCount}</div><p>${c.members.map(escapeHtml).join(' · ')}</p></div>`).join('');
}

function renderLikelyCopiedSections() {
  const matches = state.scanResult.paragraphMatches;
  if (!matches.length) { els.clusters.innerHTML = '<div class="empty">No likely copied sections found at the current threshold.</div>'; return; }
  els.clusters.innerHTML = matches.slice(0, 120).map(m => `
    <div class="compare-card">
      <div class="row-between">
        <div class="cluster-title">${m.exact ? 'Exact paragraph reuse' : 'Possible copied section'} · ${Math.round(m.similarity * 100)}%</div>
        <div><span class="badge flag-${m.exact || m.similarity >= 85 ? 'red' : m.similarity >= 70 ? 'amber' : 'green'}">${m.exact ? 'EXACT' : Math.round(m.similarity * 100) + '%'}</span></div>
      </div>
      <div class="small">${escapeHtml(`${m.aCandidate} ${m.aStudent}`.trim())} ↔ ${escapeHtml(`${m.bCandidate} ${m.bStudent}`.trim())}</div>
      <div class="compare-grid">
        <div class="compare-side">
          <h4>${escapeHtml(`${m.aCandidate} ${m.aStudent}`.trim())} · ${escapeHtml(m.aFile)}</h4>
          <div class="compare-text"><mark>${escapeHtml(m.excerptA)}</mark></div>
        </div>
        <div class="compare-side">
          <h4>${escapeHtml(`${m.bCandidate} ${m.bStudent}`.trim())} · ${escapeHtml(m.bFile)}</h4>
          <div class="compare-text"><mark>${escapeHtml(m.excerptB)}</mark></div>
        </div>
      </div>
    </div>`).join('');
}

function downloadCsv() {
  if (!state.scanResult) return;
  const rows = [['Candidate', 'Student', 'Unit', 'Assignment', 'RootFolder', 'Files', 'TopSimilarityPercent', 'AiSignal', 'ExactReuseCount', 'Flag']];
  for (const s of state.scanResult.students) rows.push([s.candidateNumber, s.studentName, s.unitCode, s.assignmentName, s.rootFolder, String(s.files.length), String(s.strongestSimilarity), String(s.avgAi), String(s.exactCount), s.flag]);
  const csv = rows.map(r => r.map(csvCell).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'moderation_summary_v6.csv');
}

function downloadClassReport() {
  if (!state.scanResult) return;
  const { students, paragraphMatches, exactReuse, sharingClusters, settings } = state.scanResult;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Moderation Class Report v6</title><style>${reportCss()}</style></head><body>
  <h1>Moderation Class Report v6</h1>
  <p>Threshold: ${settings.threshold.toFixed(2)} · Min paragraph chars: ${settings.minChars} · Ignore same folder: ${settings.ignoreSameFolder ? 'Yes' : 'No'}</p>
  <h2>Student Summary</h2>
  <table><thead><tr><th>Candidate</th><th>Student</th><th>Unit</th><th>Assignment</th><th>Files</th><th>Top Similarity</th><th>AI</th><th>Exact Reuse</th><th>Flag</th></tr></thead><tbody>
  ${students.map(s => `<tr><td>${escapeHtml(s.candidateNumber)}</td><td>${escapeHtml(s.studentName)}</td><td>${escapeHtml(s.unitCode)}</td><td>${escapeHtml(s.assignmentName)}</td><td>${s.files.length}</td><td>${s.strongestSimilarity}%</td><td>${s.avgAi}</td><td>${s.exactCount}</td><td>${escapeHtml(s.flag.toUpperCase())}</td></tr>`).join('')}
  </tbody></table>
  <h2>Sharing clusters</h2>
  ${sharingClusters.map(c => `<section><h3>${c.size}-student cluster · strongest ${c.strongest}%</h3><p>${escapeHtml(c.members.join(' · '))}</p></section>`).join('') || '<p>No sharing clusters.</p>'}
  <h2>Exact reused paragraphs</h2>
  ${exactReuse.slice(0,120).map(c => `<section><h3>${c.roots.length} student folders</h3><p><mark>${escapeHtml(c.exactText)}</mark></p><p>${c.items.map(i => escapeHtml(`${i.candidateNumber} ${i.studentName}`.trim())).join(' · ')}</p></section>`).join('') || '<p>No exact reused paragraphs.</p>'}
  <h2>Likely copied sections</h2>
  ${paragraphMatches.slice(0,250).map(m => `<section><h3>${Math.round(m.similarity*100)}% · ${escapeHtml(m.aStudent)} ↔ ${escapeHtml(m.bStudent)}${m.exact ? ' · EXACT' : ''}</h3><p><b>${escapeHtml(m.aFile)}</b>: ${escapeHtml(m.excerptA)}</p><p><b>${escapeHtml(m.bFile)}</b>: ${escapeHtml(m.excerptB)}</p></section>`).join('')}
  </body></html>`;
  downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), 'moderation_class_report_v6.html');
}

function downloadStudentReports() {
  if (!state.scanResult) return;
  const zip = new JSZip();
  for (const s of state.scanResult.students) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(s.studentName)} report</title><style>${reportCss()}</style></head><body>
      <h1>${escapeHtml(s.studentName)}</h1>
      <p>Candidate: ${escapeHtml(s.candidateNumber)} · Unit: ${escapeHtml(s.unitCode)} · Assignment: ${escapeHtml(s.assignmentName)} · Flag: ${escapeHtml(s.flag.toUpperCase())}</p>
      <p>Files: ${s.files.length} · Strongest similarity: ${s.strongestSimilarity}% · AI signal: ${s.avgAi} · Exact reused paragraphs: ${s.exactCount}</p>
      <h2>First page preview</h2><p>${escapeHtml(s.preview || '')}</p>
      <h2>Likely copied sections</h2>
      ${s.likelyCopiedSections.length ? s.likelyCopiedSections.map(sec => `<section><h3>${sec.exact ? 'EXACT' : sec.similarity + '%'} ↔ ${escapeHtml(sec.other)}</h3><p><mark>${escapeHtml(sec.excerpt)}</mark></p></section>`).join('') : '<p>No likely copied sections.</p>'}
      <h2>AI review reasons</h2><ul>${(s.aiReasonCounts.length ? s.aiReasonCounts : ['No strong AI-style reasons triggered.']).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <h2>Files</h2><ul>${s.files.map(f => `<li>${escapeHtml(f.fileName)} (${formatBytes(f.size)})</li>`).join('')}</ul>
    </body></html>`;
    const safeName = `${s.candidateNumber || 'candidate'}_${s.studentName.replace(/\s+/g, '_')}_report_v6.html`;
    zip.file(safeName, html);
  }
  zip.generateAsync({ type: 'blob' }).then(blob => downloadBlob(blob, 'student_reports_v6.zip'));
}

function reportCss() { return `body{font-family:Arial,sans-serif;padding:24px;color:#111}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd;text-align:left}section{margin:18px 0;padding:12px;border:1px solid #ddd;border-radius:8px}mark{background:#fde68a;padding:0 3px;border-radius:4px}h1,h2,h3{margin-top:0}`; }
function downloadBlob(blob, fileName) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function escapeHtml(s = '') { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function csvCell(s = '') { const t = String(s ?? ''); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; }
function formatBytes(bytes) { if (!bytes && bytes !== 0) return '—'; const units = ['B','KB','MB','GB']; let b = bytes, i = 0; while (b >= 1024 && i < units.length - 1) { b /= 1024; i++; } return `${b.toFixed(i ? 1 : 0)} ${units[i]}`; }
function numericSort(a, b) { const na = parseInt((a.match(/(\d+)/) || [0])[0], 10); const nb = parseInt((b.match(/(\d+)/) || [0])[0], 10); return na - nb; }
