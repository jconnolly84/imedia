(function () {
  const CONFIG = {
    storageKey: (window.IMEDIA_ENGAGEMENT_CONFIG && window.IMEDIA_ENGAGEMENT_CONFIG.storageKey) || 'imediaEngagementSession',
    submitEndpoint: 'https://europe-west2-imediagenius.cloudfunctions.net/submitGameScoreHttp',
    leaderboardEndpoint: 'https://europe-west2-imediagenius.cloudfunctions.net/getGameLeaderboardHttp'
  };

  function safeParse(raw, fallback) {
    try { const parsed = JSON.parse(raw); return parsed == null ? fallback : parsed; } catch (_) { return fallback; }
  }
  function getSession() {
    const session = safeParse(localStorage.getItem(CONFIG.storageKey), null);
    return session && typeof session === 'object' ? session : null;
  }
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function getPageTitle() { return (document.title || '').trim() || 'Game'; }
  function getPagePath() { const path = location.pathname || '/'; return path.split('/').pop() || 'index.html'; }
  function normaliseGameId(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'game';
  }
  function renderMessage(container, message) {
    if (!container) return;
    container.innerHTML = `<p class="leaderboard-note">${escapeHtml(message)}</p>`;
  }
  async function submitScore(options) {
    const session = getSession();
    if (!session || !session.sessionId) return { ok: false, reason: 'no-session' };
    const payload = Object.assign({
      sessionId: session.sessionId,
      pagePath: getPagePath(),
      pageUrl: location.href,
      gameTitle: getPageTitle()
    }, options || {});
    try {
      const res = await fetch(CONFIG.submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
      });
      const data = await res.json().catch(() => ({}));
      return Object.assign({ ok: res.ok }, data || {});
    } catch (err) {
      console.error('submitScore failed', err);
      return { ok: false, reason: 'network' };
    }
  }
  async function loadLeaderboard(options) {
    const session = getSession();
    const container = options && options.container;
    if (!session || !session.sessionId) {
      renderMessage(container, 'Launch this game from the worksheet app to view your class leaderboard.');
      return { ok: false, reason: 'no-session', leaderboard: [] };
    }
    if (container) renderMessage(container, 'Loading class leaderboard...');
    const params = new URLSearchParams({ sessionId: session.sessionId });
    if (options && options.gameId) params.set('gameId', normaliseGameId(options.gameId));
    if (options && options.topicKey) params.set('topicKey', normaliseGameId(options.topicKey));
    try {
      const res = await fetch(`${CONFIG.leaderboardEndpoint}?${params.toString()}`, { mode: 'cors' });
      const data = await res.json().catch(() => ({}));
      const rows = Array.isArray(data.leaderboard) ? data.leaderboard : [];
      if (container) {
        if (!res.ok) renderMessage(container, data.message || 'Unable to load class leaderboard right now.');
        else if (!rows.length) renderMessage(container, 'No class scores yet. Launch from the worksheet app and be the first to post one.');
        else {
          const html = rows.map((row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(row.displayName || 'Student')}</td>
              <td>${escapeHtml(String(row.score || 0))}</td>
              <td>${escapeHtml(String(row.percentage || 0))}%</td>
            </tr>`).join('');
          container.innerHTML = `<table class="leaderboard-table"><thead><tr><th>#</th><th>Name</th><th>Score</th><th>%</th></tr></thead><tbody>${html}</tbody></table><p class="leaderboard-note" style="margin-top:8px;">Showing your class only.</p>`;
        }
      }
      return { ok: res.ok, leaderboard: rows, myRank: data.myRank || null };
    } catch (err) {
      console.error('loadLeaderboard failed', err);
      renderMessage(container, 'Unable to load class leaderboard right now.');
      return { ok: false, reason: 'network', leaderboard: [] };
    }
  }
  window.imediaGameScores = { submitScore, loadLeaderboard, getSession, normaliseGameId };
})();
