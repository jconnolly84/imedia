
(function () {
  function safeParse(raw, fallback) {
    try { const parsed = JSON.parse(raw); return parsed == null ? fallback : parsed; } catch (_) { return fallback; }
  }

  function getSession() {
    const key = (window.IMEDIA_ENGAGEMENT_CONFIG && window.IMEDIA_ENGAGEMENT_CONFIG.storageKey) || 'imediaEngagementSession';
    return safeParse(localStorage.getItem(key), null);
  }

  function getGameTitle() {
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    const title = (document.title || '').replace(/iMedia Genius\s*[·|-]\s*/i, '').trim();
    return title || 'Revision Game';
  }

  function getSubtitle() {
    const subtitle = document.querySelector('.subtitle');
    return subtitle ? subtitle.textContent.trim() : 'Play, revise and post scores back into your class leaderboard.';
  }

  function findScoreValue() {
    const candidates = ['#scoreDisplay', '#score', '#totalScore', '#finalScore'];
    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return '0';
  }

  function findLeaderboardAnchor() {
    return document.querySelector('#leaderboardContainer') || document.querySelector('#leaderboardContainerCard') || document.querySelector('.leaderboard-card');
  }

  function normaliseGameUi(app) {
    const cardSelectors = ['.question-panel', '.help-panel', '.question-card', '.setup-card', '.game-card', '.leaderboard-card', '.footer-card', '.nine-card', '.interface-panel', '.side-panel', '.panel'];
    cardSelectors.forEach(function(selector) {
      app.querySelectorAll(selector).forEach(function(el) { el.classList.add('shared-game-card'); });
    });

    app.querySelectorAll('.hud').forEach(function(el) { el.classList.add('shared-game-hud'); });

    const resultSelectors = ['.game-over', '.modal', '[id*=gameOver]', '[id*=Result]', '[id*=result]'];
    resultSelectors.forEach(function(selector) {
      app.querySelectorAll(selector).forEach(function(el) {
        if (!el.classList.contains('shared-result-screen')) el.classList.add('shared-result-screen');
      });
    });

    const leaderboardSelectors = ['.leaderboard-card', '.leaderboard-list', '#leaderboardContainer', '#leaderboardContainerCard'];
    leaderboardSelectors.forEach(function(selector) {
      app.querySelectorAll(selector).forEach(function(el) { el.classList.add('shared-leaderboard-card'); });
    });

    app.querySelectorAll('.return-menu').forEach(function(el) {
      el.classList.add('shared-game-footer-actions');
      el.querySelectorAll('a, button').forEach(function(btn) { if (btn.classList.contains('btn')) return; btn.classList.add('btn', 'secondary'); });
    });
  }

  function createShell() {
    document.body.classList.add('game-shell-enabled');
    const app = document.querySelector('.app') || document.body;
    const header = app.querySelector('.app-header, header');
    if (!header) return;

    normaliseGameUi(app);

    const session = getSession();
    const inWorksheet = !!(session && session.sessionId);
    const classLabel = session && (session.className || session.classCode) ? (session.className || session.classCode) : 'Launch from worksheet app';
    const leaderboardAnchor = findLeaderboardAnchor();
    if (leaderboardAnchor && !leaderboardAnchor.id) leaderboardAnchor.id = 'leaderboardContainerCard';

    const bar = document.createElement('section');
    bar.className = 'game-shell-bar';
    bar.innerHTML = `
      <div class="game-shell-panel">
        <div class="game-shell-title">
          <span class="game-shell-kicker">Shared game shell</span>
          <strong>${escapeHtml(getGameTitle())}</strong>
        </div>
        <p class="game-shell-copy">${escapeHtml(getSubtitle())}</p>
        <div class="game-shell-meta">
          <div class="game-shell-chip">
            <div>
              <span class="game-shell-chip-label">Leaderboard</span>
              <span class="game-shell-chip-value">${inWorksheet ? 'Class only' : 'Login needed'}</span>
            </div>
          </div>
          <div class="game-shell-chip">
            <div>
              <span class="game-shell-chip-label">Class</span>
              <span class="game-shell-chip-value">${escapeHtml(classLabel)}</span>
            </div>
          </div>
          <div class="game-shell-chip">
            <div>
              <span class="game-shell-chip-label">Mode</span>
              <span class="game-shell-chip-value">${inWorksheet ? 'Tracked score' : 'Practice mode'}</span>
            </div>
          </div>
        </div>
        <div class="game-shell-links">
          <a class="game-shell-link primary" href="index.html">Back to arcade</a>
          ${leaderboardAnchor ? `<a class="game-shell-link secondary" href="#${leaderboardAnchor.id || 'leaderboardContainerCard'}">Jump to leaderboard</a>` : '<a class="game-shell-link secondary" href="https://imediagenius.web.app/" target="_blank" rel="noopener noreferrer">Open worksheet app</a>'}
        </div>
      </div>
      <div class="game-shell-panel game-shell-score-card">
        <div>
          <div class="game-shell-chip-label">Live score</div>
          <div class="game-shell-score-value" id="gameShellLiveScore">${escapeHtml(findScoreValue())}</div>
          <p class="game-shell-score-note">${inWorksheet ? 'Scores post back to your class leaderboard and engagement dashboard.' : 'Open this game from the worksheet app to save scores and appear on your class board.'}</p>
        </div>
        <div class="game-shell-callout ${inWorksheet ? '' : 'warning'}" id="gameShellStatusCallout">${inWorksheet ? 'Visible only to students in your class and your teacher dashboard.' : 'Standalone visits stay playable, but they do not post a tracked class score.'}</div>
      </div>`;

    header.insertAdjacentElement('afterend', bar);

    const footer = document.createElement('section');
    footer.className = 'game-shell-footer';
    footer.innerHTML = `
      <div class="game-shell-footer-row">
        <div>
          <strong>Shared game shell active</strong>
          <p>Cleaner structure, consistent actions, and the same class-safe score rules across the arcade.</p>
        </div>
        <div class="game-shell-links" style="margin-top:0;">
          <a class="game-shell-link primary" href="index.html">Return to arcade</a>
          <a class="game-shell-link secondary" href="https://imediagenius.web.app/" target="_blank" rel="noopener noreferrer">Worksheet app</a>
        </div>
      </div>`;
    app.appendChild(footer);

    const scoreTarget = document.getElementById('gameShellLiveScore');
    const observerTargets = ['#scoreDisplay', '#score', '#totalScore', '#finalScore'];
    observerTargets.forEach(function (selector) {
      const el = document.querySelector(selector);
      if (!el || !scoreTarget) return;
      const sync = function () { scoreTarget.textContent = (el.textContent || '0').trim() || '0'; };
      sync();
      const observer = new MutationObserver(sync);
      observer.observe(el, { childList: true, subtree: true, characterData: true });
    });

    const leaderboard = document.getElementById('leaderboardContainer');
    if (leaderboard && !leaderboard.id) leaderboard.id = 'leaderboardContainer';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createShell);
  } else {
    createShell();
  }
})();
