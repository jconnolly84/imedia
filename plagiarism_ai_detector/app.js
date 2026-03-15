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
  plagiarismNetwork: document.getElementById('plagiarismNetwork'),
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
  statAiRed: document.getElementById('statAiRed'),
  statExact: document.getElementById('statExact'),
  downloadCsvBtn: document.getElementById('downloadCsvBtn'),
  downloadClassReportBtn: document.getElementById('downloadClassReportBtn'),
  downloadStudentReportsBtn: document.getElementById('downloadStudentReportsBtn'),
  downloadDetailedCsvBtn: document.getElementById('downloadDetailedCsvBtn'),
  downloadScanTextBtn: document.getElementById('downloadScanTextBtn'),
  downloadExtractedTextBtn: document.getElementById('downloadExtractedTextBtn'),
  downloadChatgptPackBtn: document.getElementById('downloadChatgptPackBtn'),
  copyPromptBtn: document.getElementById('copyPromptBtn'),
  openChatgptBtn: document.getElementById('openChatgptBtn'),
  promptOutput: document.getElementById('promptOutput'),
  exportStatus: document.getElementById('exportStatus'),
};

const state = { pickedDirHandle: null, files: [], scanResult: null, excludedFiles: [] };

function syncActionButtons(hasScan = !!state.scanResult) {
  const disabled = !hasScan;
  [
    els.downloadCsvBtn,
    els.downloadClassReportBtn,
    els.downloadStudentReportsBtn,
    els.downloadDetailedCsvBtn,
    els.downloadScanTextBtn,
    els.downloadExtractedTextBtn,
    els.downloadChatgptPackBtn,
    els.copyPromptBtn,
    els.openChatgptBtn,
  ].forEach(btn => { if (btn) btn.disabled = disabled; });
  if (els.exportStatus) els.exportStatus.textContent = disabled ? 'Export buttons unlock after a successful scan.' : 'Exports ready: CSV, reports, extracted texts, and ChatGPT pack.';
}

syncActionButtons(false);

els.threshold.addEventListener('input', () => { els.thresholdValue.textContent = Number(els.threshold.value).toFixed(2); });
els.studentFilter.addEventListener('input', renderDashboard);
els.pickFolderBtn.addEventListener('click', pickFolder);
els.folderInput.addEventListener('change', handleFolderUpload);
els.scanBtn.addEventListener('click', scanLoadedFiles);
els.downloadCsvBtn.addEventListener('click', downloadCsv);
els.downloadClassReportBtn.addEventListener('click', downloadClassReport);
els.downloadStudentReportsBtn.addEventListener('click', downloadStudentReports);
els.downloadDetailedCsvBtn.addEventListener('click', downloadDetailedCsv);
els.downloadScanTextBtn.addEventListener('click', downloadScanText);
els.downloadExtractedTextBtn.addEventListener('click', downloadExtractedTexts);
els.downloadChatgptPackBtn.addEventListener('click', downloadChatgptPack);
els.copyPromptBtn.addEventListener('click', copyPrompt);
els.openChatgptBtn.addEventListener('click', openChatgptWithPrompt);

function setStatus(message) { els.status.textContent = message; }

async function pickFolder() {
  if (!window.showDirectoryPicker) { setStatus('Browser folder access is not available here. Use Fallback folder upload.'); return; }
  try {
    const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
    state.pickedDirHandle = dirHandle;
    state.excludedFiles = [];
    state.scanResult = null;
    syncActionButtons(false);
    if (els.promptOutput) els.promptOutput.value = '';
    if (els.plagiarismNetwork) els.plagiarismNetwork.innerHTML = '<div class="empty">Run a scan to build the plagiarism network view.</div>';
    state.files = await collectFilesFromDirectory(dirHandle);
    renderLoadedFiles();
    setStatus(`Loaded ${state.files.length} submission files from ${dirHandle.name}. Ignored ${state.excludedFiles.length} support files.`);
    els.scanBtn.disabled = state.files.length === 0;
  } catch (err) { if (err?.name !== 'AbortError') setStatus(`Folder load failed: ${err.message}`); }
}

async function collectFilesFromDirectory(dirHandle, path = dirHandle.name) {
  const out = [];
  for await (const entry of dirHandle.values()) {
    const entryPath = `${path}/${entry.name}`;
    if (entry.kind === 'directory') out.push(...await collectFilesFromDirectory(entry, entryPath));
    else {
      const pseudo = { name: entry.name, webkitRelativePath: entryPath, fullPath: entryPath, size: 0 };
      if (shouldIncludeFile(pseudo)) {
        const file = await entry.getFile();
        file.fullPath = entryPath;
        out.push(file);
      } else {
        state.excludedFiles.push({ name: entry.name, path: entryPath });
      }
    }
  }
  return out;
}

function handleFolderUpload(e) {
  state.pickedDirHandle = null;
  state.excludedFiles = [];
  state.scanResult = null;
  syncActionButtons(false);
  if (els.promptOutput) els.promptOutput.value = '';
  if (els.plagiarismNetwork) els.plagiarismNetwork.innerHTML = '<div class="empty">Run a scan to build the plagiarism network view.</div>';
  const allFiles = Array.from(e.target.files || []);
  state.files = allFiles.filter(f => {
    const keep = shouldIncludeFile(f);
    if (!keep) state.excludedFiles.push({ name: f.name, path: f.webkitRelativePath || f.fullPath || f.name });
    return keep;
  });
  renderLoadedFiles();
  setStatus(`Loaded ${state.files.length} submission files via browser upload. Ignored ${state.excludedFiles.length} support files.`);
  els.scanBtn.disabled = state.files.length === 0;
}

function isSupported(name) { return /\.(pptx|docx)$/i.test(name); }

function shouldIncludeFile(file) {
  const name = (file.name || '').toLowerCase();
  if (!isSupported(name)) return false;
  const blocked = [
    'asset table', 'asset list', 'completed asset table', 'checklist', 'brief',
    'set assignment', 'task sheet', 'assignment evidence', 'mark scheme', 'coversheet'
  ];
  if (blocked.some(term => name.includes(term))) return false;
  return true;
}

function parseRootFolder(fullPath, fileName) {
  const normal = (fullPath || fileName || '').replace(/\\/g, '/');
  const parts = normal.split('/').filter(Boolean);
  const filePart = parts[parts.length - 1] || fileName || '';
  const rootIndex = parts.findIndex(part => /^(\d{3,6})_([^_]+(?:_[^_]+)*)_(R\d{3})_(.+)$/i.test(part));
  const rootCandidate = rootIndex >= 0 ? parts[rootIndex] : (parts.length >= 2 ? parts[parts.length - 2] : filePart.replace(/\.[^.]+$/, ''));
  const m = rootCandidate.match(/^(\d{3,6})_([^_]+(?:_[^_]+)*)_(R\d{3})_(.+)$/i);
  if (m) return { rootFolder: rootCandidate, candidateNumber: m[1], studentName: m[2].replace(/_/g, ' '), unitCode: m[3].toUpperCase(), assignmentName: m[4].replace(/_/g, ' '), isValidStudentRoot: true };
  return { rootFolder: rootCandidate, candidateNumber: '', studentName: rootCandidate.replace(/_/g, ' '), unitCode: '', assignmentName: '', isValidStudentRoot: false };
}

function cleanPreviewText(text) {
  return (text || '')
    .replace(/style\.visibility/gi, ' ')
    .replace(/ppt_[a-z0-9_\-]+/gi, ' ')
    .replace(/\bslide\s*\d+\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderLoadedFiles() {
  if (!state.files.length) { els.folderTableWrap.innerHTML = '<div class="empty">No supported submission files found.</div>'; return; }
  const rows = state.files.map(file => {
    const meta = parseRootFolder(file.webkitRelativePath || file.fullPath || file.name, file.name);
    return `<tr><td>${escapeHtml(meta.candidateNumber || '—')}</td><td>${escapeHtml(meta.studentName)}</td><td>${escapeHtml(meta.unitCode || '—')}</td><td>${escapeHtml(meta.assignmentName || '—')}</td><td>${escapeHtml(file.name)}</td><td>${escapeHtml(file.webkitRelativePath || file.fullPath || file.name)}</td><td>${formatBytes(file.size)}</td></tr>`;
  }).join('');
  const ignored = state.excludedFiles.length ? `<div class="small" style="margin:0 0 10px 0;">Ignored ${state.excludedFiles.length} support files such as asset tables, briefs and non-submission documents.</div>` : '';
  els.folderTableWrap.innerHTML = `${ignored}<table><thead><tr><th>Candidate</th><th>Student</th><th>Unit</th><th>Assignment</th><th>File</th><th>Path</th><th>Size</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderPrimarySubmissionTable(primaryDocs) {
  if (!primaryDocs || !primaryDocs.length) return;
  const rows = primaryDocs.map(doc => `<tr><td>${escapeHtml(doc.candidateNumber || '—')}</td><td>${escapeHtml(doc.studentName)}</td><td>${escapeHtml(doc.unitCode || '—')}</td><td>${escapeHtml(doc.assignmentName || '—')}</td><td>${escapeHtml(doc.fileName)}</td><td>${escapeHtml(doc.path)}</td><td>${formatBytes(doc.size)}</td></tr>`).join('');
  const duplicateCount = primaryDocs.reduce((sum, doc) => sum + ((doc.duplicateFiles || []).length), 0);
  const ignored = state.excludedFiles.length ? `<div class="small" style="margin:0 0 10px 0;">Ignored ${state.excludedFiles.length} support files and ${duplicateCount} duplicate submission copies.</div>` : `<div class="small" style="margin:0 0 10px 0;">Ignored ${duplicateCount} duplicate submission copies.</div>`;
  els.folderTableWrap.innerHTML = `${ignored}<table><thead><tr><th>Candidate</th><th>Student</th><th>Unit</th><th>Assignment</th><th>Primary file</th><th>Path</th><th>Size</th></tr></thead><tbody>${rows}</tbody></table>`;
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

  const primaryDocs = choosePrimaryDocs(extractedDocs);
  renderPrimarySubmissionTable(primaryDocs);
  const exactReuse = detectExactParagraphReuse(primaryDocs, ignoreSameFolder);
  setStatus('Comparing likely copied sections across students…');
  const paragraphMatches = compareParagraphs(primaryDocs, threshold, ignoreSameFolder, exactReuse);
  const students = buildStudentSummaries(extractedDocs, primaryDocs, paragraphMatches, exactReuse);
  const heatmap = buildSimilarityMap(students, paragraphMatches, exactReuse);
  const clusters = buildLikelyCopyClusters(paragraphMatches);
  const sharingClusters = buildSharingClusters(students, paragraphMatches, exactReuse);

  state.scanResult = { extractedDocs, primaryDocs, exactReuse, paragraphMatches, students, heatmap, clusters, sharingClusters, settings: { threshold, minChars, ignoreSameFolder, aiSensitivity: els.aiSensitivity.value } };
  renderResults();
  setStatus(`Scan complete. ${students.length} students, ${primaryDocs.length} primary files, ${paragraphMatches.length} likely copied sections, ${exactReuse.length} exact reused paragraph clusters.`);
  syncActionButtons(true);
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
function firstMeaningfulLine(text) { return cleanPreviewText((text || '').split(/\n+/).map(s => s.trim()).find(s => s.length > 2) || ''); }
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

function choosePrimaryDocs(extractedDocs) {
  const groups = new Map();
  for (const doc of extractedDocs) {
    if (!doc.isValidStudentRoot) continue;
    if (!groups.has(doc.rootFolder)) groups.set(doc.rootFolder, []);
    groups.get(doc.rootFolder).push(doc);
  }
  const chosen = [];
  for (const docs of groups.values()) {
    docs.sort((a, b) => scorePrimaryDoc(b) - scorePrimaryDoc(a));
    const primary = docs[0];
    primary.duplicateFiles = docs.slice(1);
    chosen.push(primary);
  }
  return chosen;
}

function isRootLevelPath(path, rootFolder) {
  const parts = String(path || '').replace(/\\/g, '/').split('/').filter(Boolean);
  const idx = parts.indexOf(rootFolder);
  return idx >= 0 && idx === parts.length - 2;
}

function scorePrimaryDoc(doc) {
  const name = (doc.fileName || '').toLowerCase();
  let score = 0;
  if (isRootLevelPath(doc.path, doc.rootFolder)) score += 45;
  if (name.endsWith('.pptx')) score += 40;
  if (name.includes('project log')) score += 25;
  if (name.includes('final')) score += 12;
  if (name.includes('real one')) score += 8;
  score += Math.min(30, Math.round((doc.text || '').length / 1500));
  score += Math.min(20, doc.paragraphs.length);
  score += Math.min(10, Math.round(doc.size / (1024 * 1024)));
  return score;
}

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

function buildStudentSummaries(extractedDocs, primaryDocs, matches, exactReuse) {
  const map = new Map();
  for (const doc of primaryDocs) {
    if (!doc.isValidStudentRoot) continue;
    map.set(doc.rootFolder, {
      rootFolder: doc.rootFolder,
      candidateNumber: doc.candidateNumber,
      studentName: doc.studentName,
      unitCode: doc.unitCode,
      assignmentName: doc.assignmentName,
      files: [doc],
      allFiles: [doc, ...(doc.duplicateFiles || [])],
      duplicateFiles: doc.duplicateFiles || [],
      copiedMatches: [],
      exactMatches: [],
      aiScores: [doc.ai.score],
      aiReasons: [...(doc.ai.reasons || [])],
      preview: cleanPreviewText(doc.firstPagePreview || ''),
      primaryFileName: doc.fileName,
      text: doc.text || '',
      primaryPath: doc.path || '',
      primarySize: doc.size || 0,
    });
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
    const plagiarismFlag = exactCount >= 1 || strongestSimilarity >= 85 ? 'red' : strongestSimilarity >= 70 ? 'amber' : 'green';
    const aiFlag = avgAi >= 60 ? 'red' : avgAi >= 42 ? 'amber' : 'green';
    const flag = plagiarismFlag === 'red' || aiFlag === 'red' ? 'red' : plagiarismFlag === 'amber' || aiFlag === 'amber' ? 'amber' : 'green';
    const likelyCopiedSections = s.copiedMatches.slice(0, 4).map(m => {
      const ownExcerpt = m.aRoot === s.rootFolder ? m.excerptA : m.excerptB;
      const other = m.aRoot === s.rootFolder ? `${m.bCandidate} ${m.bStudent}`.trim() : `${m.aCandidate} ${m.aStudent}`.trim();
      return { similarity: Math.round(m.similarity * 100), other, exact: m.exact, excerpt: ownExcerpt };
    });
    const aiReasonCounts = [...new Map(s.aiReasons.map(r => [r, (s.aiReasons.filter(x => x === r).length)])).entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([reason]) => reason);
    return { ...s, avgAi, strongestSimilarity, exactCount, plagiarismFlag, aiFlag, flag, aiReasonCounts, uniqueMatchPartners: new Set(s.copiedMatches.flatMap(m => [m.aRoot, m.bRoot]).filter(r => r !== s.rootFolder)).size, likelyCopiedSections };
  }).sort((a,b) => (a.candidateNumber || '').localeCompare(b.candidateNumber || '') || a.studentName.localeCompare(b.studentName));
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
  const { students, extractedDocs, primaryDocs, paragraphMatches, exactReuse } = state.scanResult;
  els.statStudents.textContent = students.length;
  els.statFiles.textContent = primaryDocs.length;
  els.statCopied.textContent = paragraphMatches.length;
  els.statRed.textContent = students.filter(s => s.plagiarismFlag === 'red').length;
  if (els.statAiRed) els.statAiRed.textContent = students.filter(s => s.aiFlag === 'red').length;
  els.statExact.textContent = exactReuse.length;
  renderDashboard(); renderPlagiarismSummary(); renderHeatmap(); renderSharingClusters(); renderPlagiarismNetwork(); renderExactReuse(); renderLikelyCopiedSections(); renderAiPanel(); renderGeneratedPrompt();
}

function renderPlagiarismSummary() {
  if (!state.scanResult) return;
  const { students, paragraphMatches, exactReuse, sharingClusters } = state.scanResult;
  const red = students.filter(s => s.plagiarismFlag === 'red').length;
  const amber = students.filter(s => s.plagiarismFlag === 'amber').length;
  els.possiblePlagiarismSummary.innerHTML = `<b>${paragraphMatches.length}</b> likely copied matches · <b>${exactReuse.length}</b> exact reused paragraph groups · <b>${sharingClusters.length}</b> sharing clusters · <b>${red}</b> red and <b>${amber}</b> amber <b>plagiarism</b> flags.`;
}

function renderAiPanel() {
  if (!state.scanResult) return;
  const students = [...state.scanResult.students].filter(s => s.avgAi >= 8 || s.aiReasonCounts.length).sort((a,b) => b.avgAi - a.avgAi);
  if (state.scanResult.settings.aiSensitivity === 'off') { els.aiPanel.innerHTML = '<div class="empty">AI review is turned off for this scan.</div>'; return; }
  if (!students.length) { els.aiPanel.innerHTML = '<div class="empty">No notable AI review signals at the current sensitivity.</div>'; return; }
  els.aiPanel.innerHTML = `<div class="ai-grid">${students.map(s => `
    <article class="ai-card">
      <div class="row-between">
        <div>
          <div class="student-name">${escapeHtml(s.studentName)}</div>
          <div class="student-meta">${escapeHtml([s.candidateNumber, s.unitCode, s.assignmentName].filter(Boolean).join(' · '))}</div>
        </div>
        <div><span class="badge flag-${s.aiFlag}">${s.aiFlag === 'red' ? 'HIGH' : s.aiFlag === 'amber' ? 'MEDIUM' : 'LOW'}</span></div>
      </div>
      <div class="metric-row">
        <div class="metric"><b class="ai-score">${s.avgAi}</b><small>AI signal</small></div>
        <div class="metric"><b>1</b><small>Primary file</small></div>
        <div class="metric"><b>${s.strongestSimilarity}%</b><small>Top similarity</small></div>
        <div class="metric"><b>${s.exactCount}</b><small>Exact reuse</small></div>
      </div>
      <div class="preview"><b>First-page preview:</b><br>${escapeHtml(s.preview || 'No preview found')}</div>
      <ul class="ai-reasons">${(s.aiReasonCounts.length ? s.aiReasonCounts : ['No strong AI-style reasons triggered.']).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <div class="ai-files">Primary file: ${escapeHtml(s.primaryFileName)}${s.duplicateFiles.length ? ` · ${s.duplicateFiles.length} duplicate copy${s.duplicateFiles.length === 1 ? '' : 'ies'} ignored` : ''}</div>
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
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><span class="badge flag-${s.plagiarismFlag}">Plagiarism ${s.plagiarismFlag.toUpperCase()}</span><span class="badge flag-${s.aiFlag}">AI ${s.aiFlag.toUpperCase()}</span></div>
      </div>
      <div class="metric-row">
        <div class="metric"><b>1</b><small>Primary file</small></div>
        <div class="metric"><b>${s.strongestSimilarity}%</b><small>Top similarity</small></div>
        <div class="metric"><b>${s.avgAi}</b><small>AI signal</small></div>
        <div class="metric"><b>${s.exactCount}</b><small>Exact reuse</small></div>
      </div>
      <div class="preview"><b>First-page preview:</b><br>${escapeHtml(s.preview || 'No preview found')}</div>
      <div class="copied-highlight"><b>Possible plagiarism summary:</b><br>${s.copiedMatches.length ? `${s.copiedMatches.length} likely copied matches across ${s.uniqueMatchPartners} other student folders.` : 'No likely copied matches found at the current threshold.'}</div>
      <div class="small" style="margin-top:10px;">Primary file: ${escapeHtml(s.primaryFileName)}${s.duplicateFiles.length ? ` · ${s.duplicateFiles.length} duplicate copy${s.duplicateFiles.length === 1 ? '' : 'ies'} ignored` : ''}</div>
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



function renderPlagiarismNetwork() {
  const { students, heatmap } = state.scanResult;
  const links = [];
  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const a = students[i], b = students[j];
      const value = heatmap[a.rootFolder]?.[b.rootFolder] || 0;
      if (value >= 35) links.push({ a, b, value });
    }
  }
  if (!links.length) { els.plagiarismNetwork.innerHTML = '<div class="empty">No plagiarism links above the network threshold.</div>'; return; }
  const width = 980, height = 520, cx = width / 2, cy = height / 2, radius = Math.min(width, height) * 0.38;
  const positioned = students.map((s, idx) => {
    const angle = (Math.PI * 2 * idx / students.length) - (Math.PI / 2);
    return { ...s, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
  const posMap = Object.fromEntries(positioned.map(p => [p.rootFolder, p]));
  const edgeSvg = links.map(link => {
    const a = posMap[link.a.rootFolder], b = posMap[link.b.rootFolder];
    const stroke = link.value >= 80 ? '#ef4444' : link.value >= 55 ? '#f59e0b' : '#60a5fa';
    const strokeW = link.value >= 80 ? 4 : link.value >= 55 ? 3 : 2;
    return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${stroke}" stroke-width="${strokeW}" opacity="0.78"><title>${escapeHtml(a.studentName)} ↔ ${escapeHtml(b.studentName)} = ${link.value}%</title></line>`;
  }).join('');
  const nodeSvg = positioned.map(node => {
    const fill = node.plagiarismFlag === 'red' ? '#ef4444' : node.plagiarismFlag === 'amber' ? '#f59e0b' : '#10b981';
    const label = `${node.candidateNumber || ''} ${node.studentName}`.trim();
    return `<g><circle cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" r="17" fill="${fill}" stroke="#e5e7eb" stroke-width="1.5"><title>${escapeHtml(label)}</title></circle><text x="${node.x.toFixed(1)}" y="${(node.y + 5).toFixed(1)}" text-anchor="middle" font-size="10" fill="#fff">${escapeHtml((node.candidateNumber || '').slice(-2) || '?')}</text><text x="${node.x.toFixed(1)}" y="${(node.y + 32).toFixed(1)}" text-anchor="middle" font-size="10" fill="#cbd5e1">${escapeHtml((node.studentName || '').split(' ')[0])}</text></g>`;
  }).join('');
  els.plagiarismNetwork.innerHTML = `<div class="summary-note">Network threshold: 35%+ similarity. Blue = watch, amber = strong, red = very strong.</div><div class="network-wrap"><svg viewBox="0 0 ${width} ${height}" class="network-svg">${edgeSvg}${nodeSvg}</svg></div>`;
}

function buildGeneratedPrompt() {
  if (!state.scanResult) return '';
  const { students, paragraphMatches, exactReuse, sharingClusters, settings } = state.scanResult;
  const aiHigh = students.filter(s => s.aiFlag === 'red').slice(0, 12).map(s => `${s.candidateNumber} ${s.studentName} (AI ${s.avgAi})`.trim());
  const aiWatch = students.filter(s => s.aiFlag === 'amber').slice(0, 20).map(s => `${s.candidateNumber} ${s.studentName} (AI ${s.avgAi})`.trim());
  return [
    'You are reviewing OCR Creative iMedia coursework moderation data.',
    '',
    'I am uploading a moderation pack ZIP from my Browser Moderation Scanner.',
    'Use the extracted primary texts, summary CSVs and scan export together.',
    'Treat AI-style indicators as review signals only, not proof.',
    '',
    'Tasks:',
    '1. Check the extracted texts for cross-student plagiarism, reused structure, or suspiciously similar wording.',
    '2. Check whether the AI signals look credible once you read the real extracted student text.',
    '3. Distinguish normal OCR coursework phrasing from genuinely suspicious overlap.',
    '4. Give me a priority moderation list: high concern, medium concern, low concern.',
    '5. For every concern, reference the exact student(s) and quote the relevant extracted text.',
    '',
    `Settings: threshold=${settings.threshold.toFixed(2)}, minParagraphChars=${settings.minChars}, aiMode=${settings.aiSensitivity}, ignoreSameFolder=${settings.ignoreSameFolder ? 'Yes' : 'No'}.`,
    `Summary: students=${students.length}, likelyCopiedMatches=${paragraphMatches.length}, exactReuseGroups=${exactReuse.length}, sharingClusters=${sharingClusters.length}.`,
    `AI high flags: ${aiHigh.length ? aiHigh.join('; ') : 'none'}.`,
    `AI watch flags: ${aiWatch.length ? aiWatch.join('; ') : 'none'}.`,
    '',
    'Please produce:',
    '- concise moderation summary',
    '- plagiarism concern table',
    '- AI concern table',
    '- final list of students to manually review first'
  ].join('\n');
}

function renderGeneratedPrompt() {
  els.promptOutput.value = buildGeneratedPrompt();
}

async function copyPrompt() {
  const text = els.promptOutput.value || buildGeneratedPrompt();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    setStatus('ChatGPT prompt copied. Open ChatGPT and upload the ChatGPT pack ZIP or extracted-text export.');
  } catch (err) {
    setStatus('Could not copy the prompt automatically.');
  }
}

function openChatgptWithPrompt() {
  const text = els.promptOutput.value || buildGeneratedPrompt();
  if (!text) return;
  const url = `https://chatgpt.com/?q=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
}

function buildSummaryCsv() {
  const rows = [['Candidate', 'Student', 'Unit', 'Assignment', 'RootFolder', 'PrimaryFile', 'IgnoredDuplicates', 'TopSimilarityPercent', 'AiSignal', 'ExactReuseCount', 'PlagiarismFlag', 'AiFlag']];
  for (const s of state.scanResult.students) rows.push([s.candidateNumber, s.studentName, s.unitCode, s.assignmentName, s.rootFolder, s.primaryFileName, String(s.duplicateFiles.length), String(s.strongestSimilarity), String(s.avgAi), String(s.exactCount), s.plagiarismFlag, s.aiFlag]);
  return rows.map(r => r.map(csvCell).join(',')).join('\n');
}

function buildDetailedCsv() {
  const rows = [['RowType','Candidate','Student','Unit','Assignment','PrimaryFile','IgnoredDuplicates','TopSimilarityPercent','AiSignal','ExactReuseCount','PlagiarismFlag','AiFlag','CounterpartCandidate','CounterpartStudent','SimilarityPercent','ExactReuse','OwnExcerpt','OtherExcerpt']];
  for (const s of state.scanResult.students) {
    if (!s.copiedMatches.length) {
      rows.push(['student', s.candidateNumber, s.studentName, s.unitCode, s.assignmentName, s.primaryFileName, String(s.duplicateFiles.length), String(s.strongestSimilarity), String(s.avgAi), String(s.exactCount), s.plagiarismFlag, s.aiFlag, '', '', '', '', '', '']);
    } else {
      for (const m of s.copiedMatches) {
        const ownIsA = m.aRoot === s.rootFolder;
        rows.push([
          'student_match', s.candidateNumber, s.studentName, s.unitCode, s.assignmentName, s.primaryFileName, String(s.duplicateFiles.length),
          String(s.strongestSimilarity), String(s.avgAi), String(s.exactCount), s.plagiarismFlag, s.aiFlag,
          ownIsA ? m.bCandidate : m.aCandidate, ownIsA ? m.bStudent : m.aStudent, String(Math.round(m.similarity * 100)), m.exact ? 'yes' : 'no',
          ownIsA ? m.excerptA : m.excerptB, ownIsA ? m.excerptB : m.excerptA
        ]);
      }
    }
  }
  for (const c of state.scanResult.exactReuse) {
    for (const item of c.items) rows.push(['exact_reuse', item.candidateNumber, item.studentName, '', '', item.fileName, '', '100', '', '', 'red', '', '', '', String(c.roots.length), 'yes', item.excerpt, c.exactText]);
  }
  return rows.map(r => r.map(csvCell).join(',')).join('\n');
}

function buildExtractedTexts() {
  if (!state.scanResult) return '';
  const { students } = state.scanResult;
  const lines = [];
  lines.push('Browser Moderation Scanner extracted primary texts v8.0');
  lines.push('');
  for (const s of students) {
    lines.push('='.repeat(100));
    lines.push(`CANDIDATE: ${s.candidateNumber}`);
    lines.push(`STUDENT: ${s.studentName}`);
    lines.push(`UNIT: ${s.unitCode}`);
    lines.push(`ASSIGNMENT: ${s.assignmentName}`);
    lines.push(`PRIMARY FILE: ${s.primaryFileName}`);
    if (s.duplicateFiles?.length) lines.push(`DUPLICATES IGNORED: ${s.duplicateFiles.length}`);
    lines.push('-'.repeat(100));
    lines.push((s.text || '').trim() || '[No extracted text available]');
    lines.push('');
  }
  return lines.join('\n');
}

function downloadExtractedTexts() {
  const txt = buildExtractedTexts();
  if (!txt) return;
  downloadBlob(new Blob([txt], { type: 'text/plain;charset=utf-8' }), 'moderation_extracted_primary_texts_v8.txt');
}

async function downloadChatgptPack() {
  if (!state.scanResult) return;
  const zip = new JSZip();
  zip.file('moderation_summary_v8.csv', buildSummaryCsv());
  zip.file('moderation_detailed_export_v8.csv', buildDetailedCsv());
  zip.file('moderation_scan_summary_v8.txt', buildFullScanText());
  zip.file('moderation_extracted_primary_texts_v8.txt', buildExtractedTexts());
  zip.file('chatgpt_prompt_v8.txt', buildGeneratedPrompt());
  zip.file('README.txt', [
    'ChatGPT moderation pack',
    '',
    'Suggested workflow:',
    '1. Open ChatGPT.',
    '2. Upload this ZIP or upload the extracted_primary_texts and CSV files.',
    '3. Paste the prompt from chatgpt_prompt_v8.txt.',
    '4. Ask ChatGPT to review plagiarism and AI concerns cautiously.'
  ].join('\n'));
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'moderation_chatgpt_pack_v8.zip');
}

function downloadDetailedCsv() {
  if (!state.scanResult) return;
  const csv = buildDetailedCsv();
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'moderation_detailed_export_v8.csv');
}

function buildFullScanText() {
  if (!state.scanResult) return '';
  const { students, paragraphMatches, exactReuse, sharingClusters, settings } = state.scanResult;
  const lines = [];
  lines.push('Browser Moderation Scanner export v8.0');
  lines.push('');
  lines.push(`Settings: threshold=${settings.threshold.toFixed(2)} | minParagraphChars=${settings.minChars} | aiMode=${settings.aiSensitivity} | ignoreSameFolder=${settings.ignoreSameFolder ? 'Yes' : 'No'}`);
  lines.push(`Summary: students=${students.length} | primaryFiles=${state.scanResult.extractedDocs.length} | likelyCopiedMatches=${paragraphMatches.length} | exactReuseGroups=${exactReuse.length} | sharingClusters=${sharingClusters.length}`);
  lines.push('');
  lines.push('STUDENT SUMMARY');
  for (const s of students) {
    lines.push(`- ${s.candidateNumber} | ${s.studentName} | ${s.unitCode} | ${s.assignmentName} | plagiarism=${s.plagiarismFlag} | ai=${s.aiFlag} | topSimilarity=${s.strongestSimilarity}% | aiSignal=${s.avgAi} | exactReuse=${s.exactCount} | primary=${s.primaryFileName}${s.duplicateFiles.length ? ` | duplicatesIgnored=${s.duplicateFiles.length}` : ''}`);
    if (s.preview) lines.push(`  Preview: ${s.preview}`);
    if (s.aiReasonCounts?.length) lines.push(`  AI reasons: ${s.aiReasonCounts.join('; ')}`);
    if (s.likelyCopiedSections?.length) {
      for (const sec of s.likelyCopiedSections) lines.push(`  Possible copied section: ${sec.exact ? 'EXACT' : sec.similarity + '%'} with ${sec.other} | ${sec.excerpt}`);
    }
  }
  lines.push('');
  lines.push('LIKELY COPIED MATCHES');
  if (!paragraphMatches.length) lines.push('None');
  for (const m of paragraphMatches) {
    lines.push(`- ${Math.round(m.similarity * 100)}% | ${m.exact ? 'EXACT' : 'SIMILAR'} | ${m.aCandidate} ${m.aStudent} <-> ${m.bCandidate} ${m.bStudent}`);
    lines.push(`  A (${m.aFile}): ${m.excerptA}`);
    lines.push(`  B (${m.bFile}): ${m.excerptB}`);
  }
  lines.push('');
  lines.push('EXACT REUSE GROUPS');
  if (!exactReuse.length) lines.push('None');
  for (const c of exactReuse) {
    lines.push(`- roots=${c.roots.length} | count=${c.count}`);
    lines.push(`  Text: ${c.exactText}`);
    lines.push(`  Students: ${c.items.map(i => `${i.candidateNumber} ${i.studentName}`).join(' | ')}`);
  }
  lines.push('');
  lines.push('SHARING CLUSTERS');
  if (!sharingClusters.length) lines.push('None');
  for (const c of sharingClusters) lines.push(`- size=${c.size} | strongest=${c.strongest}% | exactReuseCount=${c.exactReuseCount} | members=${c.members.join(' | ')}`);
  return lines.join('\n');
}

function downloadScanText() {
  const txt = buildFullScanText();
  if (!txt) return;
  downloadBlob(new Blob([txt], { type: 'text/plain;charset=utf-8' }), 'moderation_scan_summary_v8.txt');
}

function downloadCsv() {
  if (!state.scanResult) return;
  const csv = buildSummaryCsv();
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'moderation_summary_v8.csv');
}

function downloadClassReport() {
  if (!state.scanResult) return;
  const { students, paragraphMatches, exactReuse, sharingClusters, settings } = state.scanResult;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Moderation Class Report v8</title><style>${reportCss()}</style></head><body>
  <h1>Moderation Class Report v8</h1>
  <p>Threshold: ${settings.threshold.toFixed(2)} · Min paragraph chars: ${settings.minChars} · AI mode: ${settings.aiSensitivity} · Ignore same folder: ${settings.ignoreSameFolder ? 'Yes' : 'No'}</p>
  <h2>Student Summary</h2>
  <table><thead><tr><th>Candidate</th><th>Student</th><th>Unit</th><th>Assignment</th><th>Files</th><th>Top Similarity</th><th>AI</th><th>Exact Reuse</th><th>Flag</th></tr></thead><tbody>
  ${students.map(s => `<tr><td>${escapeHtml(s.candidateNumber)}</td><td>${escapeHtml(s.studentName)}</td><td>${escapeHtml(s.unitCode)}</td><td>${escapeHtml(s.assignmentName)}</td><td>1</td><td>${s.strongestSimilarity}%</td><td>${s.avgAi}</td><td>${s.exactCount}</td><td>${escapeHtml(`P:${s.plagiarismFlag.toUpperCase()} / AI:${s.aiFlag.toUpperCase()}`)}</td></tr>`).join('')}
  </tbody></table>
  <h2>Sharing clusters</h2>
  ${sharingClusters.map(c => `<section><h3>${c.size}-student cluster · strongest ${c.strongest}%</h3><p>${escapeHtml(c.members.join(' · '))}</p></section>`).join('') || '<p>No sharing clusters.</p>'}
  <h2>Exact reused paragraphs</h2>
  ${exactReuse.slice(0,120).map(c => `<section><h3>${c.roots.length} student folders</h3><p><mark>${escapeHtml(c.exactText)}</mark></p><p>${c.items.map(i => escapeHtml(`${i.candidateNumber} ${i.studentName}`.trim())).join(' · ')}</p></section>`).join('') || '<p>No exact reused paragraphs.</p>'}
  <h2>Likely copied sections</h2>
  ${paragraphMatches.slice(0,250).map(m => `<section><h3>${Math.round(m.similarity*100)}% · ${escapeHtml(m.aStudent)} ↔ ${escapeHtml(m.bStudent)}${m.exact ? ' · EXACT' : ''}</h3><p><b>${escapeHtml(m.aFile)}</b>: ${escapeHtml(m.excerptA)}</p><p><b>${escapeHtml(m.bFile)}</b>: ${escapeHtml(m.excerptB)}</p></section>`).join('')}
  </body></html>`;
  downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), 'moderation_class_report_v8.html');
}

function downloadStudentReports() {
  if (!state.scanResult) return;
  const zip = new JSZip();
  for (const s of state.scanResult.students) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(s.studentName)} report</title><style>${reportCss()}</style></head><body>
      <h1>${escapeHtml(s.studentName)}</h1>
      <p>Candidate: ${escapeHtml(s.candidateNumber)} · Unit: ${escapeHtml(s.unitCode)} · Assignment: ${escapeHtml(s.assignmentName)} · Flags: ${escapeHtml(`P:${s.plagiarismFlag.toUpperCase()} / AI:${s.aiFlag.toUpperCase()}`)}</p>
      <p>Files: ${s.files.length} · Strongest similarity: ${s.strongestSimilarity}% · AI signal: ${s.avgAi} · Exact reused paragraphs: ${s.exactCount}</p>
      <h2>First page preview</h2><p>${escapeHtml(s.preview || '')}</p>
      <h2>Likely copied sections</h2>
      ${s.likelyCopiedSections.length ? s.likelyCopiedSections.map(sec => `<section><h3>${sec.exact ? 'EXACT' : sec.similarity + '%'} ↔ ${escapeHtml(sec.other)}</h3><p><mark>${escapeHtml(sec.excerpt)}</mark></p></section>`).join('') : '<p>No likely copied sections.</p>'}
      <h2>AI review reasons</h2><ul>${(s.aiReasonCounts.length ? s.aiReasonCounts : ['No strong AI-style reasons triggered.']).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <h2>Files</h2><ul>${s.files.map(f => `<li>${escapeHtml(f.fileName)} (${formatBytes(f.size)})</li>`).join('')}</ul>
    </body></html>`;
    const safeName = `${s.candidateNumber || 'candidate'}_${s.studentName.replace(/\s+/g, '_')}_report_v8.html`;
    zip.file(safeName, html);
  }
  zip.generateAsync({ type: 'blob' }).then(blob => downloadBlob(blob, 'student_reports_v8.zip'));
}

function reportCss() { return `body{font-family:Arial,sans-serif;padding:24px;color:#111}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd;text-align:left}section{margin:18px 0;padding:12px;border:1px solid #ddd;border-radius:8px}mark{background:#fde68a;padding:0 3px;border-radius:4px}h1,h2,h3{margin-top:0}`; }
function downloadBlob(blob, fileName) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function escapeHtml(s = '') { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function csvCell(s = '') { const t = String(s ?? ''); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; }
function formatBytes(bytes) { if (!bytes && bytes !== 0) return '—'; const units = ['B','KB','MB','GB']; let b = bytes, i = 0; while (b >= 1024 && i < units.length - 1) { b /= 1024; i++; } return `${b.toFixed(i ? 1 : 0)} ${units[i]}`; }
function numericSort(a, b) { const na = parseInt((a.match(/(\d+)/) || [0])[0], 10); const nb = parseInt((b.match(/(\d+)/) || [0])[0], 10); return na - nb; }
