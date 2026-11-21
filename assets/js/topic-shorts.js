/* YouTube Shorts for R093 topic pages.
   The list of Shorts lives in data/topic-shorts.json – one line per topic page.
   To add a Short, put its video ID (the part after /shorts/ in the link,
   e.g. youtube.com/shorts/_Pdl6jkoRAw -> _Pdl6jkoRAw) between the empty quotes for that topic.
   Topics with "" show no Shorts block.
   The list is fetched fresh on every visit, so a new Short appears as soon as it is deployed
   (no 10-minute browser cache). */
(function () {
  'use strict';

  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (!/^topic-\d+/.test(page)) return;

  function addCss() {
    if (document.getElementById('topicShortsCss')) return;
    var css = document.createElement('style');
    css.id = 'topicShortsCss';
    css.textContent =
      '.topic-short-wrap{display:flex;gap:28px;align-items:center;flex-wrap:wrap}' +
      '.topic-short-copy{flex:1 1 260px;min-width:0}' +
      '.topic-short-copy h2{margin-top:0}' +
      '.topic-short-badge{display:inline-block;margin-bottom:10px;padding:3px 10px;border-radius:999px;background:var(--course-soft,#f0f7ce);color:var(--course-ink,#364512);font-size:.8rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase}' +
      '.topic-short-frame{flex:0 0 auto;width:min(300px,100%);aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:#202322;box-shadow:0 6px 16px rgba(0,0,0,.18)}' +
      '.topic-short-frame iframe{display:block;width:100%;height:100%;border:0}' +
      '@media (max-width:640px){.topic-short-wrap{justify-content:center}.topic-short-frame{width:min(280px,100%)}}';
    document.head.appendChild(css);
  }

  // If the "On this page" menu was already built, add the Short to it just before "Video Overview".
  function addToAnchorMenu() {
    var list = document.querySelector('.topic-anchor-list');
    if (!list || list.querySelector('[data-anchor-id="quick-revision-short"]')) return;
    var li = document.createElement('li');
    li.innerHTML = '<a class="topic-anchor-link" href="#quick-revision-short" data-anchor-id="quick-revision-short">Quick Revision Short</a>';
    li.firstChild.addEventListener('click', function () {
      var panel = document.getElementById('topicAnchorPanel');
      var toggle = document.querySelector('.topic-anchor-toggle');
      if (panel) panel.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
    var links = Array.prototype.slice.call(list.querySelectorAll('.topic-anchor-link'));
    var before = links.filter(function (a) { return /video overview/i.test(a.textContent); })[0];
    if (before && before.parentNode) list.insertBefore(li, before.parentNode);
    else list.appendChild(li);
  }

  function build(id) {
    var media = document.querySelector('.revision-media');
    var hero = document.querySelector('.hero-band');
    if ((!media && !hero) || document.querySelector('.topic-short')) return;
    addCss();

    var watch = 'https://www.youtube.com/shorts/' + id;
    var section = document.createElement('section');
    section.className = 'topic-section topic-short';
    section.innerHTML =
      '<div class="topic-short-wrap">' +
        '<div class="topic-short-copy">' +
          '<span class="topic-short-badge">YouTube Short</span>' +
          '<span class="topic-anchor-sentinel" id="quick-revision-short" aria-hidden="true"></span>' +
          '<h2>Quick Revision Short</h2>' +
          '<p>Short on time? Start with this quick recap of the key points, then watch the full video or listen to the podcast below to go deeper.</p>' +
          '<p class="video-note">Prefer the YouTube app? <a href="' + watch + '" rel="noopener" target="_blank">Watch this Short on YouTube</a>.</p>' +
        '</div>' +
        '<div class="topic-short-frame">' +
          '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0" title="Quick revision Short on YouTube" loading="lazy"' +
          ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"' +
          ' referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
        '</div>' +
      '</div>';
    // Sit directly above the Video Overview / Podcast section (fall back to under the banner).
    if (media) media.insertAdjacentElement('beforebegin', section);
    else hero.insertAdjacentElement('afterend', section);
    addToAnchorMenu();
  }

  function whenReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  if (!window.fetch) return;
  fetch('data/topic-shorts.json', { cache: 'no-store' })
    .then(function (res) { return res.ok ? res.json() : {}; })
    .then(function (shorts) {
      var id = shorts && shorts[page];
      if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return;
      whenReady(function () { build(id); });
    })
    .catch(function () { /* no Short if the list cannot be loaded */ });
})();
