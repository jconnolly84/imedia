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
    maxQueueSize: 150,
    autoTrackButtons: true,
    autoTrackForms: true,
    autoTrackMedia: true
  }, window.IMEDIA_ENGAGEMENT_CONFIG || {});

  const nowIso = () => new Date().toISOString();
  const pagePath = location.pathname.split('/').pop() || 'index.html';
  const pageTitle = (document.title || '').trim() || pagePath;
  const pageKind = inferPageKind(pagePath);
  const state = {
    pageStartedAt: Date.now(),
    visibleStartedAt: document.visibilityState === 'visible' ? Date.now() : null,
    visibleMs: 0,
    lastHeartbeatAt: Date.now(),
    mediaMilestones: new WeakMap(),
    session: loadSession(),
    verifying: false,
    flushedOnce: false
  };

  function debug(...args) {
    if (config.debug) console.log('[iMedia engagement]', ...args);
  }

  function inferPageKind(path) {
    if (/^topic-\d+/i.test(path)) return 'topic';
    if (/exam|mini-exam|markable-mini-exam|nine-mark|marking-desk/i.test(path)) return 'assessment';
    if (/game|challenge|simulator|detective|arena|sorter|inspector|builder|command|dash|doctor|critic|race|room|picker|showdown|megagame/i.test(path)) return 'game';
    if (/^index\.html$/i.test(path)) return 'home';
    return 'page';
  }

  function safeJsonParse(raw, fallback) {
    try { return JSON.parse(raw); } catch (_) { return fallback; }
  }

  function loadSession() {
    const session = safeJsonParse(localStorage.getItem(config.storageKey), null);
    if (!session) return null;
    if (session.expiresAt && Date.now() > Number(session.expiresAt)) {
      localStorage.removeItem(config.storageKey);
      return null;
    }
    return session;
  }

  function saveSession(session) {
    state.session = session;
    if (session) localStorage.setItem(config.storageKey, JSON.stringify(session));
  }

  function queueEvent(evt) {
    const queue = safeJsonParse(localStorage.getItem(config.queueKey), []);
    queue.push(evt);
    while (queue.length > config.maxQueueSize) queue.shift();
    localStorage.setItem(config.queueKey, JSON.stringify(queue));
  }

  async function flushQueue(useBeacon) {
    const queue = safeJsonParse(localStorage.getItem(config.queueKey), []);
    if (!queue.length || !config.ingestEndpoint) return;
    const payload = JSON.stringify({ events: queue });

    if (useBeacon && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(config.ingestEndpoint, new Blob([payload], { type: 'application/json' }));
      if (ok) localStorage.removeItem(config.queueKey);
      return;
    }

    try {
      const res = await fetch(config.ingestEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
        mode: 'cors'
      });
      if (res.ok) {
        localStorage.removeItem(config.queueKey);
        state.flushedOnce = true;
      }
    } catch (err) {
      debug('flush failed', err);
    }
  }

  function buildBasePayload() {
    return {
      siteName: config.siteName,
      pagePath,
      pageTitle,
      pageKind,
      pageUrl: location.href,
      referrer: document.referrer || '',
      recordedAt: nowIso(),
      sessionId: state.session?.sessionId || null,
      userId: state.session?.uid || null,
      classCode: state.session?.classCode || null,
      studentName: state.session?.studentName || null
    };
  }

  function track(eventType, payload) {
    const evt = Object.assign(buildBasePayload(), {
      eventType,
      payload: payload || {}
    });
    queueEvent(evt);
    if (state.session || state.flushedOnce) flushQueue(false);
  }

  async function verifyToken(token) {
    if (!token || !config.verifyEndpoint || state.verifying) return;
    state.verifying = true;
    try {
      const res = await fetch(config.verifyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, siteName: config.siteName, pagePath, pageTitle }),
        mode: 'cors',
        credentials: 'omit'
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data && (data.sessionId || data.uid)) {
        saveSession({
          sessionId: data.sessionId || token,
          uid: data.uid || null,
          classCode: data.classCode || null,
          studentName: data.studentName || null,
          expiresAt: data.expiresAt ? Number(data.expiresAt) : (Date.now() + 1000 * 60 * 60 * 8)
        });
        track('session_verified', { tokenAccepted: true });
        flushQueue(false);
      } else {
        track('session_rejected', { reason: data?.error || 'invalid_token' });
      }
    } catch (err) {
      debug('verify failed', err);
      track('session_verify_failed', { message: String(err && err.message || err) });
    } finally {
      state.verifying = false;
      removeTokenFromUrl();
    }
  }

  function removeTokenFromUrl() {
    const url = new URL(location.href);
    if (!url.searchParams.has(config.tokenParam)) return;
    url.searchParams.delete(config.tokenParam);
    history.replaceState({}, document.title, url.pathname + (url.search ? url.search : '') + url.hash);
  }

  function updateVisibleMs() {
    if (state.visibleStartedAt) {
      state.visibleMs += Math.max(0, Date.now() - state.visibleStartedAt);
      state.visibleStartedAt = Date.now();
    }
  }

  function startVisibilityTimer() {
    if (!state.visibleStartedAt) state.visibleStartedAt = Date.now();
  }

  function stopVisibilityTimer() {
    if (state.visibleStartedAt) {
      state.visibleMs += Math.max(0, Date.now() - state.visibleStartedAt);
      state.visibleStartedAt = null;
    }
  }

  function summariseElement(el) {
    if (!el) return '';
    const parts = [
      el.getAttribute?.('data-engagement-label'),
      el.getAttribute?.('aria-label'),
      el.innerText,
      el.textContent,
      el.value,
      el.name,
      el.id,
      el.className
    ].filter(Boolean).map((x) => String(x).replace(/\s+/g, ' ').trim()).filter(Boolean);
    const txt = parts.find(Boolean) || el.tagName.toLowerCase();
    return txt.slice(0, 120);
  }

  function nearestHeadingText(el) {
    const container = el.closest('section, article, .card, .topic-card, .game-card, .ai-exam-card, .infographic-card, .flashcard');
    if (!container) return '';
    const heading = container.querySelector('h1, h2, h3, h4, .topic-card-label span, .collapsible-title');
    return heading ? heading.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  }

  function wireClicks() {
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest('a, button, summary, [role="button"], .btn-link');
      if (!el) return;
      const href = el.tagName.toLowerCase() === 'a' ? (el.getAttribute('href') || '') : '';
      const label = summariseElement(el);
      const section = nearestHeadingText(el);
      const payload = {
        label,
        href,
        section,
        tagName: el.tagName.toLowerCase(),
        interactionCategory: classifyInteraction(el, href, label)
      };
      track('content_interaction', payload);
    }, true);
  }

  function classifyInteraction(el, href, label) {
    const text = `${href} ${label} ${el.className || ''}`.toLowerCase();
    if (text.includes('video') || href.includes('youtu')) return 'video_link';
    if (text.includes('podcast') || text.includes('audio')) return 'audio_link';
    if (text.includes('game') || pageKind === 'game') return 'game_interaction';
    if (text.includes('exam') || text.includes('mark') || text.includes('submit') || text.includes('answer')) return 'assessment_interaction';
    return 'general_interaction';
  }

  function wireForms() {
    document.addEventListener('submit', (ev) => {
      const form = ev.target;
      const fields = Array.from(form.querySelectorAll('input, textarea, select')).length;
      track('form_submit', {
        formId: form.id || '',
        formClass: String(form.className || '').slice(0, 120),
        fields,
        section: nearestHeadingText(form)
      });
    }, true);

    document.addEventListener('change', (ev) => {
      const el = ev.target;
      if (!el.matches('select, input[type="checkbox"], input[type="radio"], input[type="range"]')) return;
      track('form_change', {
        field: el.name || el.id || el.type || el.tagName.toLowerCase(),
        value: String(el.value || el.checked || '').slice(0, 60),
        section: nearestHeadingText(el)
      });
    }, true);
  }

  function wireMedia() {
    const mediaEls = document.querySelectorAll('audio, video');
    mediaEls.forEach((media, index) => {
      state.mediaMilestones.set(media, {});
      const label = media.getAttribute('data-engagement-label') || media.currentSrc || media.getAttribute('src') || `media-${index + 1}`;
      media.addEventListener('play', () => track('media_play', buildMediaPayload(media, label)));
      media.addEventListener('pause', () => track('media_pause', buildMediaPayload(media, label)));
      media.addEventListener('ended', () => track('media_complete', buildMediaPayload(media, label, 100)));
      media.addEventListener('timeupdate', () => {
        const duration = media.duration || 0;
        if (!duration || !isFinite(duration)) return;
        const pct = Math.max(0, Math.min(100, Math.round((media.currentTime / duration) * 100)));
        const milestones = state.mediaMilestones.get(media) || {};
        [25, 50, 75, 100].forEach((step) => {
          if (pct >= step && !milestones[step]) {
            milestones[step] = true;
            track('media_progress', buildMediaPayload(media, label, step));
          }
        });
        state.mediaMilestones.set(media, milestones);
      });
    });
  }

  function buildMediaPayload(media, label, progressOverride) {
    const duration = media.duration || 0;
    const progress = progressOverride ?? (duration ? Math.round((media.currentTime / duration) * 100) : null);
    return {
      label: String(label).slice(0, 180),
      mediaType: media.tagName.toLowerCase(),
      durationSeconds: duration ? Math.round(duration) : null,
      currentSeconds: media.currentTime ? Math.round(media.currentTime) : 0,
      progressPercent: progress,
      section: nearestHeadingText(media)
    };
  }

  function wireHeartbeat() {
    setInterval(() => {
      if (document.visibilityState === 'visible') updateVisibleMs();
      const activeSeconds = Math.round(state.visibleMs / 1000);
      if (activeSeconds <= 0) return;
      track('page_heartbeat', { activeSeconds, pageKind });
      state.visibleMs = 0;
      state.lastHeartbeatAt = Date.now();
      flushQueue(false);
    }, Math.max(10, Number(config.heartbeatSeconds || 30)) * 1000);
  }

  function handleExit() {
    if (document.visibilityState === 'visible') updateVisibleMs();
    const totalSeconds = Math.round((Date.now() - state.pageStartedAt) / 1000);
    const activeSeconds = Math.round(state.visibleMs / 1000);
    track('page_exit', { totalSeconds, activeSeconds, pageKind });
    state.visibleMs = 0;
    flushQueue(true);
  }

  function init() {
    const url = new URL(location.href);
    const token = url.searchParams.get(config.tokenParam);
    if (token) verifyToken(token);

    track('page_view', {
      pageKind,
      hasSession: Boolean(state.session),
      internalReferrer: document.referrer && document.referrer.includes(location.hostname)
    });
    flushQueue(false);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        startVisibilityTimer();
        track('page_focus', { pageKind });
      } else {
        stopVisibilityTimer();
        track('page_blur', { pageKind });
        flushQueue(true);
      }
    });

    window.addEventListener('pagehide', handleExit);
    window.addEventListener('beforeunload', handleExit);

    if (config.autoTrackButtons) wireClicks();
    if (config.autoTrackForms) wireForms();
    if (config.autoTrackMedia) wireMedia();
    wireHeartbeat();

    window.imediaEngagement = {
      track,
      getSession: () => state.session,
      clearSession: () => {
        localStorage.removeItem(config.storageKey);
        state.session = null;
      },
      flush: () => flushQueue(false)
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
