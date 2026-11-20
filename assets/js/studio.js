(function () {
  'use strict';
  const body = document.body;
  const course = body.dataset.course;
  if (!course) return;
  // data-studio-mode: unset for course hubs/lessons; 'game', 'guide', 'tools' or 'page' for shell-only pages.
  const mode = body.dataset.studioMode || '';
  const root = body.dataset.root != null ? body.dataset.root : (course === 'r093' ? '' : '../');
  const icons = { arrow: 'ArrowRight', back: 'ArrowLeft', book: 'BookOpen', game: 'Gamepad2', pen: 'Pencil', check: 'Check', download: 'Download', login: 'LogIn', chevron: 'ChevronRight', tools: 'Wrench', external: 'ExternalLink', image: 'Image', vector: 'PenTool', voice: 'AudioLines', shield: 'ShieldCheck', sparkles: 'Sparkles', monitor: 'Monitor', type: 'Type', convert: 'ArrowLeftRight' };
  function icon(name) { return window.lucide.createElement(window.lucide.icons[icons[name] || 'ArrowRight'], { 'aria-hidden': 'true', 'stroke-width': 1.7 }).outerHTML; }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const nav = document.createElement('nav');
  nav.className = 'studio-nav';
  nav.setAttribute('aria-label', 'Course navigation');
  nav.innerHTML = '<div class="studio-nav-inner"><a class="studio-brand" href="' + root + 'index.html"><img class="studio-mark" src="' + root + 'assets/img/brand/imedia-genius-mark.svg" alt="" width="40" height="40"><span><strong>iMedia Genius<span class="studio-brand-dot">.</span></strong><small>Your creative media toolkit</small></span></a><div class="studio-course-tabs">' +
    [['r093', 'Revision', 'index.html'], ['r094', 'Graphics', 'r094/index.html'], ['r097', 'Websites', 'r097/index.html']].map(([id, label, path]) => '<a href="' + root + path + '"' + (course === id ? ' aria-current="page"' : '') + '>' + id.toUpperCase() + ' <span>' + label + '</span></a>').join('') +
    '</div><a class="studio-tools-link" href="' + root + 'tools/index.html"' + (course === 'tools' ? ' aria-current="page"' : '') + '>' + icon('tools') + '<span>iMedia Tools</span></a><a class="studio-login" href="https://imediagenius.web.app/">Log in ' + icon('login') + '</a></div>';
  body.prepend(nav);
  body.classList.add('studio-ready');
  const home = body.classList.contains('studio-home') || body.classList.contains('studio-course-home');
  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'studio-breadcrumb';
  function crumbs(items) { return items.map(([label, href]) => href ? '<a href="' + href + '">' + escapeHtml(label) + '</a>' : '<span>' + escapeHtml(label) + '</span>').join(icon('chevron')); }

  if (mode) {
    // Shell-only pages: games, the Dreamweaver build guide, iMedia Tools and site information pages.
    const heading = document.querySelector('h1') || document.querySelector('h2');
    const pageTitle = (heading ? heading.textContent : document.title.split('|')[0]).replace(/\s+/g, ' ').trim();
    const trail = [['iMedia Genius', root + 'index.html']];
    if (mode === 'game') {
      const exam = !document.querySelector('body > .app');
      trail.push(['R093', root + 'index.html'], exam ? ['Exam practice', root + 'index.html#miniExamsCollapsible'] : ['Revision games', root + 'index.html#gamesCollapsible'], [pageTitle]);
    }
    else if (mode === 'guide') { trail.push(['R097', root + 'r097/index.html'], ['Dreamweaver build guide', body.classList.contains('dw-home') ? null : root + 'r097-dreamweaver/index.html']); if (!body.classList.contains('dw-home')) trail.push([pageTitle]); }
    else if (mode === 'tools') trail.push(['iMedia Tools']);
    else trail.push([pageTitle]);
    breadcrumb.innerHTML = crumbs(trail);
    nav.after(breadcrumb);
    if (mode === 'guide' && !body.classList.contains('dw-home')) buildGuide();
    return;
  }

  breadcrumb.innerHTML = '<a href="' + root + 'index.html">iMedia Genius</a>' + icon('chevron') + '<a href="index.html">' + course.toUpperCase() + '</a>' + icon('chevron') + '<span>' + (home ? (course === 'r093' ? 'Revision arcade' : 'Project studio') : 'Learning guide') + '</span>';
  (document.querySelector('.page') || document.querySelector('main.container')).prepend(breadcrumb);

  // Dreamweaver build guide: a step rail generated from the guide's own page menu.
  function buildGuide() {
    const select = document.getElementById('pageSelect');
    const main = document.querySelector('main.container');
    if (!select || !main) return;
    const current = decodeURIComponent(location.pathname.split('/').pop()) || 'index.html';
    const steps = [...select.options].map(o => ({ href: o.value, file: o.value.split('/').pop(), label: o.textContent.trim() }));
    const groups = [
      ['Start here', s => !/^Step/.test(s.label)],
      ['Prepare your graphics', s => /^Step [1-3]:/.test(s.label)],
      ['Build in Dreamweaver', s => /^Step [4-9]:/.test(s.label)],
      ['Add media & features', s => /^Step 1[0-5]:/.test(s.label)]
    ];
    const link = s => {
      const match = s.label.match(/^Step (\d+):\s*(.*)$/);
      const num = match ? String(match[1]).padStart(2, '0') : (s.file === 'index.html' ? icon('book') : icon('sparkles'));
      const title = match ? match[2] : s.label.replace('Home / Overview', 'Guide overview');
      return '<a class="studio-lesson-link" href="' + s.href + '"' + (s.file === current ? ' aria-current="page"' : '') + '><span>' + num + '</span><span>' + escapeHtml(title) + '</span>' + icon('arrow') + '</a>';
    };
    const aside = document.createElement('aside');
    aside.className = 'studio-lesson-sidebar';
    aside.setAttribute('aria-label', 'Build guide steps');
    aside.innerHTML = '<a href="' + root + 'r097/index.html" class="studio-label">R097 / Project overview</a>' + groups.map(([name, test]) => '<span class="studio-label">' + name + '</span>' + steps.filter(test).map(link).join('')).join('');
    const content = document.createElement('div');
    content.className = 'studio-lesson-body';
    const footer = main.querySelector(':scope > footer, :scope > .footer');
    [...main.children].filter(el => el !== footer).forEach(el => content.append(el));
    const mobile = select.cloneNode(true);
    mobile.removeAttribute('id'); mobile.removeAttribute('onchange'); mobile.className = 'studio-topic-select';
    mobile.setAttribute('aria-label', 'Choose a build guide step');
    mobile.addEventListener('change', () => { location.href = mobile.value; });
    content.prepend(mobile);
    const stepMatch = (steps.find(s => s.file === current) || {}).label;
    const heading = content.querySelector('.page > h2');
    if (heading) {
      const h1 = document.createElement('h1'); h1.innerHTML = heading.innerHTML.replace(/^Step \d+:\s*/, ''); heading.replaceWith(h1);
      const eyebrow = document.createElement('span'); eyebrow.className = 'studio-eyebrow';
      const n = stepMatch && stepMatch.match(/^Step (\d+)/);
      eyebrow.textContent = 'Dreamweaver build guide' + (n ? ' / Step ' + n[1].padStart(2, '0') + ' of 15' : '');
      h1.before(eyebrow);
    }
    const layout = document.createElement('div');
    layout.className = 'studio-lesson-layout';
    layout.append(aside, content);
    footer ? footer.before(layout) : main.append(layout);
  }

  if (course === 'r093') {
    const gameShortcut = document.querySelector('.studio-hero a[href="#gamesCollapsible"]');
    if (gameShortcut) gameShortcut.title = 'Jump into a game';
    document.querySelectorAll('a[href="#gamesCollapsible"],a[href="#miniExamsCollapsible"]').forEach(a => a.addEventListener('click', () => { const details = document.querySelector(a.getAttribute('href')); if (details) details.open = true; }));
    // Games link back to index.html#gamesCollapsible: open that section on arrival.
    if (/^#(gamesCollapsible|miniExamsCollapsible)$/.test(location.hash)) { const target = document.querySelector(location.hash); if (target && target.tagName === 'DETAILS') { target.open = true; requestAnimationFrame(() => target.scrollIntoView()); } }
    const tracker = document.querySelector('.revision-tracker');
    if (tracker) tracker.id = 'revisionTracker';
    const topics = document.querySelector('section[aria-label="R093 topic guides"]');
    if (topics) topics.id = 'topicGuides';
    // Keep the original tracker and all its listeners intact, but make it optional to expand.
    const trackerSide = document.querySelector('.tracker-side');
    if (trackerSide) {
      const details = document.createElement('details'); details.className = 'studio-tracker-details';
      const summary = document.createElement('summary'); summary.textContent = 'Revision missions & suggested next moves';
      trackerSide.before(details); details.append(summary, trackerSide);
    }
    return;
  }

  const select = document.getElementById('pageSelect');
  if (!select) return;
  const lessons = [...select.options].filter(o => o.value !== 'index.html').map((o, i) => ({ href: o.value, title: o.textContent.replace(/^\d+\s*[\u2013\u2014-]\s*/, ''), number: i + 1 }));
  const config = course === 'r094' ? {
    boundaries: [8, 14], descriptions: ['Explore the brief, audience and visual direction.', 'Create your identity, develop the product and export.', 'Evaluate the result against the brief and audience.']
  } : {
    boundaries: [9, 14], descriptions: ['Define the audience, plan the experience and assets.', 'Prepare media, build the website and publish.', 'Test, evaluate and make purposeful improvements.']
  };
  const stages = ['Plan & explore', 'Create & develop', 'Review & refine'];
  const stageFor = number => number <= config.boundaries[0] ? 0 : number <= config.boundaries[1] ? 1 : 2;
  const current = decodeURIComponent(location.pathname.split('/').pop());
  const lesson = lessons.find(l => l.href === current);
  const key = 'imediaStudioProgress:' + course + ':v1';
  function readProgress() { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return new Set(Array.isArray(value) ? value.filter(href => lessons.some(l => l.href === href)) : []); } catch (_) { return new Set(); } }
  let done = readProgress();
  function saveProgress() { try { localStorage.setItem(key, JSON.stringify([...done])); return true; } catch (_) { return false; } }
  function lessonLinks(stage) { return lessons.filter(l => stageFor(l.number) === stage).map(l => '<a class="studio-lesson-link' + (done.has(l.href) ? ' is-done' : '') + '" data-lesson="' + l.href + '" href="' + l.href + '"' + (l.href === current ? ' aria-current="page"' : '') + '><span>' + (done.has(l.href) ? '&#10003;' : String(l.number).padStart(2, '0')) + '</span><span>' + l.title + '</span>' + icon('arrow') + '</a>').join(''); }
  function update() {
    document.querySelectorAll('[data-course-progress]').forEach(el => { el.textContent = done.size + ' / ' + lessons.length + ' guides completed'; });
    document.querySelectorAll('.studio-progress-track').forEach(el => el.style.setProperty('--progress', (done.size / lessons.length * 100) + '%'));
    document.querySelectorAll('[data-lesson]').forEach(el => { const complete = done.has(el.dataset.lesson); el.classList.toggle('is-done', complete); const item = lessons.find(l => l.href === el.dataset.lesson); el.firstElementChild.textContent = complete ? '\u2713' : String(item.number).padStart(2, '0'); });
    const next = lessons.find(l => !done.has(l.href));
    document.querySelectorAll('[data-continue-course]').forEach(el => { el.href = next ? next.href : lessons[0].href; el.innerHTML = (done.size === lessons.length ? 'Revisit the project' : done.size ? 'Continue your project' : 'Start your project') + icon('arrow'); });
    const mark = document.getElementById('studioMarkComplete');
    if (mark && lesson) { mark.innerHTML = icon('check') + (done.has(lesson.href) ? 'Completed' : 'Mark guide complete'); mark.setAttribute('aria-pressed', String(done.has(lesson.href))); }
  }
  const journey = document.querySelector('[data-course-journey]');
  if (journey) journey.innerHTML = stages.map((title, i) => '<section class="studio-stage"><div class="studio-stage-head"><span>0' + (i + 1) + '</span><h3>' + title + '</h3></div><p>' + config.descriptions[i] + '</p>' + lessonLinks(i) + '</section>').join('');

  if (lesson) {
    body.classList.add('studio-course-lesson');
    const main = document.querySelector('main.container');
    const footer = main.querySelector('.site-footer');
    const layout = document.createElement('div'); layout.className = 'studio-lesson-layout';
    const aside = document.createElement('aside'); aside.className = 'studio-lesson-sidebar'; aside.setAttribute('aria-label', 'Project guides');
    aside.innerHTML = '<a href="index.html" class="studio-label">' + course.toUpperCase() + ' / Project overview</a><div data-course-progress></div><div class="studio-progress-track"><span></span></div>' + stages.map((name, i) => '<span class="studio-label">' + name + '</span>' + lessonLinks(i)).join('');
    const content = document.createElement('div'); content.className = 'studio-lesson-body';
    [...main.children].filter(el => el !== footer && el !== breadcrumb).forEach(el => content.append(el));
    const hero = content.querySelector('.hero');
    const infographic = content.querySelector(':scope > .infographic');
    if (hero) {
      content.prepend(hero);
      const heading = hero.querySelector('h2');
      if (heading) { const h1 = document.createElement('h1'); h1.innerHTML = heading.innerHTML; heading.replaceWith(h1); }
      const label = document.createElement('span'); label.className = 'studio-eyebrow'; label.textContent = course.toUpperCase() + ' / Guide ' + String(lesson.number).padStart(2, '0') + ' / ' + stages[stageFor(lesson.number)]; hero.prepend(label);
    }
    if (infographic) {
      const details = document.createElement('details'); details.className = 'studio-overview-image';
      const summary = document.createElement('summary'); summary.textContent = 'Visual guide: ' + lesson.title;
      details.append(summary, infographic); hero ? hero.after(details) : content.prepend(details);
    }
    const mobileSelect = select.cloneNode(true); mobileSelect.removeAttribute('id'); mobileSelect.removeAttribute('onchange'); mobileSelect.className = 'studio-topic-select'; mobileSelect.setAttribute('aria-label', 'Choose a project guide'); mobileSelect.value = current; mobileSelect.addEventListener('change', () => { location.href = mobileSelect.value; }); content.prepend(mobileSelect);
    const stage = stageFor(lesson.number);
    const evidence = document.createElement('section'); evidence.className = 'studio-evidence';
    const prompts = [
      ['Capture your research or planning document, including a clear version or date.', 'Identify a specific requirement from the brief and explain how your idea responds to it.', 'Explain what the target audience needs and how that informed one design decision.'],
      ['Capture a meaningful before-and-after stage, including the tools or settings you used.', 'Explain why you chose that technique, format or layout for this product and audience.', 'Record where the finished asset or output is saved, with a clear filename.'],
      ['Record the expected result and the actual result, with a screenshot or other supporting evidence.', 'Explain how the result meets a requirement, or identify a specific shortcoming.', 'Suggest or make a justified improvement, then check whether it solved the problem.']
    ];
    evidence.innerHTML = '<span class="studio-label">Evidence checkpoint</span><h2>Make your decisions visible.</h2><p>Adapt these prompts to this guide and your own assignment brief.</p><ul>' + prompts[stage].map(p => '<li>' + p + '</li>').join('') + '</ul><blockquote>“I chose ___ because my audience needs ___. This meets the brief by ___. My evidence shows ___.”</blockquote>';
    content.append(evidence);
    const controls = document.createElement('div'); controls.className = 'studio-lesson-controls';
    const previous = lessons[lesson.number - 2], next = lessons[lesson.number];
    controls.innerHTML = (previous ? '<a class="studio-button secondary" href="' + previous.href + '">Previous guide</a>' : '<a class="studio-button secondary" href="index.html">Project overview</a>') + '<button class="studio-button" id="studioMarkComplete" type="button" aria-pressed="false"></button>' + (next ? '<a class="studio-button secondary" href="' + next.href + '">Next guide ' + icon('arrow') + '</a>' : '<a class="studio-button secondary" href="index.html">Project overview ' + icon('arrow') + '</a>');
    const status = document.createElement('p'); status.className = 'studio-status'; status.setAttribute('role', 'status');
    content.append(controls, status); layout.append(aside, content); footer ? footer.before(layout) : main.append(layout);
    document.getElementById('studioMarkComplete').addEventListener('click', () => { done.has(lesson.href) ? done.delete(lesson.href) : done.add(lesson.href); const saved = saveProgress(); update(); status.textContent = saved ? (done.has(lesson.href) ? 'Guide completed. Your progress is saved in this browser.' : 'Guide marked as still in progress.') : 'This browser could not save your progress. Keep this page open or export your progress from the project overview.'; });
  }

  // Coursework progress exports are separate from the existing R093 revision tracker.
  const exportButton = document.querySelector('[data-export-course]');
  if (exportButton) exportButton.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ version: 1, course, completed: [...done] }, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = course + '-project-progress.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const importInput = document.querySelector('[data-import-course]');
  const importButton = document.querySelector('[data-import-course-button]');
  if (importButton && importInput) importButton.addEventListener('click', () => importInput.click());
  if (importInput) importInput.addEventListener('change', async () => {
    const status = document.querySelector('[data-progress-status]');
    try {
      if (!importInput.files[0]) return;
      const value = JSON.parse(await importInput.files[0].text());
      if (value.course !== course || value.version !== 1 || !Array.isArray(value.completed) || value.completed.some(href => !lessons.some(l => l.href === href))) throw new Error('Choose a valid ' + course.toUpperCase() + ' progress export.');
      done = new Set([...done, ...value.completed]); const saved = saveProgress(); update(); status.textContent = saved ? 'Progress imported and combined with this browser\'s progress.' : 'Progress imported for this visit, but this browser could not save it.';
    } catch (error) { status.textContent = error.message || 'The progress file could not be read.'; }
    importInput.value = '';
  });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { done = readProgress(); update(); } });
  update();
})();
