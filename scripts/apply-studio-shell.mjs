// Bring every page onto the shared studio shell. Safe to run any time: it only adds what is
// missing, so a second run changes nothing. Run after adding or editing pages:
//   node scripts/apply-studio-shell.mjs
//
// Page types and what they get:
//   R093 home + topic pages   studio.css, studio.js  (light revision layout)
//   R094 / R097 course pages  studio.css, studio.js  (light coursework layout + progress)
//   Games and exam tools      studio.css, studio-game.css, studio.js  (dark game stage)
//                             + the games' navy palette is moved onto the studio palette
//   Help and legal pages      studio.css, studio-page.css, studio.js
//   Dreamweaver build guide   studio.css, studio.js  (guide mode with a step rail)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const infoPages = new Set(['help.html', 'privacy-policy.html', 'cookie-notice.html', 'terms-of-service.html']);
let changed = 0;

async function update(file, transform) {
  const text = await readFile(file, 'utf8');
  const next = transform(text);
  if (next !== text) { await writeFile(file, next); changed++; }
}

// <head> additions, skipped when already present.
function addHead(html, tags) {
  const missing = tags.filter(([marker]) => !html.includes(marker)).map(([, tag]) => tag);
  return missing.length ? html.replace('</head>', missing.join('\n') + '\n</head>') : html;
}
const css = (prefix, name) => ['assets/css/' + name, '<link rel="stylesheet" href="' + prefix + 'assets/css/' + name + '">'];
const scripts = prefix => [
  ['apple-touch-icon', '<link rel="apple-touch-icon" href="' + prefix + 'assets/img/brand/apple-touch-icon.png">'],
  ['assets/js/lucide.min.js', '<script defer src="' + prefix + 'assets/js/lucide.min.js"></script>'],
  ['assets/js/studio.js', '<script defer src="' + prefix + 'assets/js/studio.js"></script>']
];

// Merge duplicate class attributes and add classes/attributes to <body>.
function setBody(html, classes, attrs) {
  return html.replace(/<body([^>]*)>/i, (_, raw) => {
    const found = [...raw.matchAll(/\sclass="([^"]*)"/g)].flatMap(m => m[1].split(/\s+/)).filter(Boolean);
    let rest = raw.replace(/\sclass="[^"]*"/g, '');
    for (const [name, value] of Object.entries(attrs)) if (!new RegExp('\\s' + name + '=').test(rest)) rest += ' ' + name + '="' + value + '"';
    return '<body class="' + [...new Set([...found, ...classes])].join(' ') + '"' + rest + '>';
  });
}

// ---- Navy → studio palette for game styles -------------------------------------------------
// Dark or greyish blues become green-grey at the same lightness; saturated light blues become teal.
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hslToRgb(h, s, l) {
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return [f(0), f(8), f(4)];
}
function convert(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (!(h >= 195 && h <= 260 && s > 0.12)) return null;
  return l < 0.45 || s < 0.5 ? hslToRgb(150, Math.min(s, 0.16), l) : hslToRgb(168, Math.min(s, 0.6), Math.max(l, 0.62));
}
function recolour(text) {
  const hex = n => n.toString(16).padStart(2, '0');
  return text
    .replace(/#([0-9a-f]{6})\b/gi, (m, v) => { const o = convert(parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)); return o ? '#' + o.map(hex).join('') : m; })
    .replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/gi, (m, r, g, b, a) => { const o = convert(+r, +g, +b); return o ? (a ? 'rgba(' : 'rgb(') + o.join(', ') + (a ? ', ' + a.replace(/^,\s*/, '').trim() : '') + ')' : m; });
}
const recolourInlineStyles = html => html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, open, body, close) => open + recolour(body) + close);

// ---- 1. Root pages --------------------------------------------------------------------------
const gameStylesheets = new Set();
for (const name of (await readdir(root)).filter(n => n.endsWith('.html'))) {
  const file = path.join(root, name);
  const html = await readFile(file, 'utf8');
  if (html.includes('assets/js/game-shell.js')) {
    for (const m of html.matchAll(/assets\/css\/([\w.-]+\.css)/g)) gameStylesheets.add(m[1]);
    await update(file, h => recolourInlineStyles(setBody(addHead(h, [css('', 'studio.css'), css('', 'studio-game.css'), ...scripts('')]), ['studio-game'], { 'data-course': 'r093', 'data-studio-mode': 'game' })));
  } else if (infoPages.has(name)) {
    await update(file, h => setBody(addHead(h, [css('', 'studio.css'), css('', 'studio-page.css'), ...scripts('')]), ['studio-site', 'studio-page'], { 'data-course': 'r093', 'data-studio-mode': 'page' }));
  } else if (name === 'index.html' || /^topic-\d.*\.html$/.test(name)) {
    await update(file, h => setBody(addHead(h, [css('', 'studio.css'), ...scripts('')]), ['studio-site', name === 'index.html' ? 'studio-home' : 'studio-topic'], { 'data-course': 'r093' }));
  }
}

// Game stylesheets: only those not shared with the light pages.
const shared = new Set(['studio.css', 'studio-game.css', 'studio-page.css', 'host.css', 'topic.css', 'lightbox.css']);
for (const name of gameStylesheets) {
  if (shared.has(name)) continue;
  await update(path.join(root, 'assets/css', name), recolour);
  // Follow @import chains (several small games import work-plan-megagame.css)
  const text = await readFile(path.join(root, 'assets/css', name), 'utf8');
  for (const m of text.matchAll(/@import url\(['"]?([\w.-]+\.css)/g)) if (!shared.has(m[1])) await update(path.join(root, 'assets/css', m[1]), recolour);
}

// ---- 2. R094 / R097 coursework ----------------------------------------------------------------
for (const course of ['r094', 'r097']) {
  for (const page of (await readdir(path.join(root, course))).filter(n => n.endsWith('.html'))) {
    await update(path.join(root, course, page), h => {
      let out = setBody(addHead(h, [css('../', 'studio.css'), ...scripts('../')]), ['studio-site', page === 'index.html' ? 'studio-course-home' : 'studio-course-lesson'], { 'data-course': course });
      // The original coursework pages used Markdown emphasis inside HTML text.
      return out.replace(/\*\*([^<>*\r\n]+)\*\*/g, '<strong>$1</strong>');
    });
  }
}

// ---- 3. Dreamweaver build guide ---------------------------------------------------------------
const dw = path.join(root, 'r097-dreamweaver');
const dwPages = [['index.html', '../'], ...(await readdir(path.join(dw, 'pages'))).filter(n => n.endsWith('.html')).map(n => ['pages/' + n, '../../'])];
for (const [rel, prefix] of dwPages) {
  await update(path.join(dw, rel), h => h.includes('http-equiv="refresh"') ? h // retired step: redirect only
    : setBody(addHead(h, [css(prefix, 'studio.css'), ...scripts(prefix)]), ['studio-site', 'studio-guide', ...(rel === 'index.html' ? ['dw-home'] : [])], { 'data-course': 'r097', 'data-studio-mode': 'guide', 'data-root': prefix }));
}

console.log(changed ? 'Updated ' + changed + ' files.' : 'Everything already uses the studio shell.');
