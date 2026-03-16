(function () {
  const config = Object.assign({
    siteName: 'imediagenius-static',
    tokenParam: 'engagement',
    storageKey: 'imediaEngagementSession',
    queueKey: 'imediaEngagementQueue',
    verifyEndpoint: '',
    ingestEndpoint: '',
    debug: false,
    heartbeatSeconds: 30,
    maxQueueSize: 150
  }, window.IMEDIA_ENGAGEMENT_CONFIG || {});

  const state = {
    session: loadSession(),
    pageStartedAt: Date.now(),
    visibleStartedAt: document.visibilityState === 'visible' ? Date.now() : null,
    visibleMs: 0,
    mediaMilestones: new WeakMap()
  };

  function safeParse(raw, fallback) {
    try {
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  }
  function getQueue() {
    const queue = safeParse(localStorage.getItem(config.queueKey), []);
    return Array.isArray(queue) ? queue : [];
  }
  function saveQueue(queue) {
    localStorage.setItem(config.queueKey, JSON.stringify(Array.isArray(queue) ? queue : []));
  }
  function loadSession() {
    const session = safeParse(localStorage.getItem(config.storageKey), null);
    if (!session || typeof session !== 'object') return null;
    if (session.expiresAt && Date.now() > Number(session.expiresAt)) {
      localStorage.removeItem(config.storageKey);
      return null;
    }
    return session;
  }
  function saveSession(session) {
    state.session = session;
    if (session) localStorage.setItem(config.storageKey, JSON.stringify(session));
    else localStorage.removeItem(config.storageKey);
  }
  function nowIso() { return new Date().toISOString(); }
  function pagePath() {
    const path = location.pathname || '/';
    const cleaned = path.endsWith('/') ? path + 'index.html' : path;
    return cleaned.split('/').pop() || 'index.html';
  }
  function pageTitle() {
    return (document.title || '').trim() || pagePath();
  }
  function inferPageKind(path) {
    if (/^topic-\d+/i.test(path)) return 'topic';
    if (/exam|mini-exam|markable-mini-exam|nine-mark|marking-desk/i.test(path)) return 'assessment';
    if (/game|challenge|simulator|detective|arena|sorter|inspector|builder|command|dash|doctor|critic|race|room|picker|showdown|megagame/i.test(path)) return 'game';
    if (/^index\.html$/i.test(path)) return 'home';
    return 'page';
  }
  function buildBasePayload() {
    const path = pagePath();
    return {
      siteName: config.siteName,
      pagePath: path,
      pageTitle: pageTitle(),
      pageKind: inferPageKind(path),
      pageUrl: location.href,
      referrer: document.referrer || '',
      recordedAt: nowIso(),
      sessionId: state.session && state.session.sessionId ? state.session.sessionId : null
    };
  }
  function queueEvent(eventType, payload) {
    const queue = getQueue();
    queue.push(Object.assign(buildBasePayload(), { eventType, payload: payload || {} }));
    while (queue.length > Number(config.maxQueueSize || 150)) queue.shift();
    saveQueue(queue);
  }
  async function flushQueue(useBeacon) {
    const queue = getQueue();
    if (!queue.length || !config.ingestEndpoint) return;
    const withSession = queue.filter((item) => item && item.sessionId);
    if (!withSession.length) return;
    const body = JSON.stringify({ events: withSession });
    if (useBeacon && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(config.ingestEndpoint, new Blob([body], { type: 'application/json' }));
      if (ok) saveQueue(queue.filter((item) => !item || !item.sessionId));
      return;
    }
    try {
      const res = await fetch(config.ingestEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        mode: 'cors'
      });
      if (res.ok) saveQueue(queue.filter((item) => !item || !item.sessionId));
    } catch (_) {}
  }
  async function verifyToken(token) {
    if (!token || !config.verifyEndpoint) return;
    try {
      const res = await fetch(config.verifyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, pagePath: pagePath(), pageTitle: pageTitle() }),
        mode: 'cors'
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data && data.sessionId) {
        saveSession({
          sessionId: data.sessionId,
          uid: data.uid || '',
          classCode: data.classCode || '',
          studentName: data.studentName || '',
          expiresAt: Number(data.expiresAt || (Date.now() + 1000 * 60 * 60 * 8))
        });
        queueEvent('session_verified', { tokenAccepted: true });
        await flushQueue(false);
      }
    } catch (_) {}
    try {
      const url = new URL(location.href);
      if (url.searchParams.has(config.tokenParam)) {
        url.searchParams.delete(config.tokenParam);
        history.replaceState({}, document.title, url.pathname + (url.search || '') + url.hash);
      }
    } catch (_) {}
  }
  function nearestHeadingText(el) {
    const container = el && el.closest ? el.closest('section, article, .card, .topic-card, .game-card, .ai-exam-card, .infographic-card, .flashcard') : null;
    if (!container || !container.querySelector) return '';
    const heading = container.querySelector('h1, h2, h3, h4');
    return heading ? String(heading.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  }
  function classifyInteraction(el, href, label) {
    const text = `${href} ${label} ${el && el.className ? el.className : ''}`.toLowerCase();
    if (text.includes('youtu') || text.includes('video')) return 'video_link';
    if (text.includes('podcast') || text.includes('audio') || text.includes('spotify')) return 'audio_link';
    if (text.includes('game') || text.includes('play')) return 'game_interaction';
    if (text.includes('exam') || text.includes('mark') || text.includes('submit') || text.includes('answer') || text.includes('quiz')) return 'assessment_interaction';
    return 'general_interaction';
  }
  function summariseElement(el) {
    if (!el) return '';
    const txt = [
      el.getAttribute && el.getAttribute('data-engagement-label'),
      el.getAttribute && el.getAttribute('aria-label'),
      el.innerText,
      el.textContent,
      el.value,
      el.name,
      el.id
    ].filter(Boolean).map((v) => String(v).replace(/\s+/g, ' ').trim()).find(Boolean);
    return (txt || (el.tagName || 'element')).slice(0, 120);
  }
  function wireClicks() {
    document.addEventListener('click', function (ev) {
      const el = ev.target && ev.target.closest ? ev.target.closest('a, button, summary, [role="button"], .btn-link') : null;
      if (!el) return;
      const href = el.tagName && el.tagName.toLowerCase() === 'a' ? (el.getAttribute('href') || '') : '';
      queueEvent('content_interaction', {
        label: summariseElement(el),
        href,
        section: nearestHeadingText(el),
        tagName: el.tagName ? el.tagName.toLowerCase() : '',
        interactionCategory: classifyInteraction(el, href, summariseElement(el))
      });
      flushQueue(false);
    }, true);
  }
  function buildMediaPayload(media, label, progressOverride) {
    const duration = media.duration || 0;
    const progress = progressOverride != null ? progressOverride : (duration ? Math.round((media.currentTime / duration) * 100) : null);
    return {
      label: String(label || '').slice(0, 180),
      mediaType: media.tagName ? media.tagName.toLowerCase() : 'media',
      durationSeconds: duration ? Math.round(duration) : null,
      currentSeconds: media.currentTime ? Math.round(media.currentTime) : 0,
      progressPercent: progress,
      section: nearestHeadingText(media)
    };
  }
  function wireMedia() {
    document.querySelectorAll('audio, video').forEach(function (media, index) {
      state.mediaMilestones.set(media, {});
      const label = media.getAttribute('data-engagement-label') || media.currentSrc || media.getAttribute('src') || ('media-' + (index + 1));
      media.addEventListener('play', function () { queueEvent('media_play', buildMediaPayload(media, label)); flushQueue(false); });
      media.addEventListener('pause', function () { queueEvent('media_pause', buildMediaPayload(media, label)); flushQueue(false); });
      media.addEventListener('ended', function () { queueEvent('media_complete', buildMediaPayload(media, label, 100)); flushQueue(false); });
      media.addEventListener('timeupdate', function () {
        const duration = media.duration || 0;
        if (!duration || !isFinite(duration)) return;
        const pct = Math.max(0, Math.min(100, Math.round((media.currentTime / duration) * 100)));
        const milestones = state.mediaMilestones.get(media) || {};
        [25, 50, 75, 100].forEach(function (step) {
          if (pct >= step && !milestones[step]) {
            milestones[step] = true;
            queueEvent('media_progress', buildMediaPayload(media, label, step));
          }
        });
        state.mediaMilestones.set(media, milestones);
      });
    });
  }
  function updateVisibleMs() {
    if (state.visibleStartedAt) {
      state.visibleMs += Math.max(0, Date.now() - state.visibleStartedAt);
      state.visibleStartedAt = Date.now();
    }
  }
  function handleExit() {
    if (document.visibilityState === 'visible') updateVisibleMs();
    queueEvent('page_exit', {
      totalSeconds: Math.round((Date.now() - state.pageStartedAt) / 1000),
      activeSeconds: Math.round(state.visibleMs / 1000),
      pageKind: inferPageKind(pagePath())
    });
    state.visibleMs = 0;
    flushQueue(true);
  }
  function init() {
    try {
      const token = new URL(location.href).searchParams.get(config.tokenParam);
      if (token) verifyToken(token);
    } catch (_) {}
    queueEvent('page_view', { pageKind: inferPageKind(pagePath()) });
    flushQueue(false);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        state.visibleStartedAt = Date.now();
        queueEvent('page_focus', { pageKind: inferPageKind(pagePath()) });
      } else {
        updateVisibleMs();
        state.visibleStartedAt = null;
        queueEvent('page_blur', { pageKind: inferPageKind(pagePath()) });
        flushQueue(true);
      }
    });
    window.addEventListener('pagehide', handleExit);
    window.addEventListener('beforeunload', handleExit);
    setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      updateVisibleMs();
      const activeSeconds = Math.round(state.visibleMs / 1000);
      if (activeSeconds <= 0) return;
      queueEvent('page_heartbeat', { activeSeconds, pageKind: inferPageKind(pagePath()) });
      state.visibleMs = 0;
      flushQueue(false);
    }, Math.max(10, Number(config.heartbeatSeconds || 30)) * 1000);
    wireClicks();
    wireMedia();
    window.imediaEngagement = {
      getSession: function () { return state.session; },
      flush: function () { return flushQueue(false); }
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();