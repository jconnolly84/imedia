(function () {
  function safeParse(raw, fallback) {
    try { const parsed = JSON.parse(raw); return parsed == null ? fallback : parsed; } catch (_) { return fallback; }
  }

  function getSession() {
    const key = (window.IMEDIA_ENGAGEMENT_CONFIG && window.IMEDIA_ENGAGEMENT_CONFIG.storageKey) || 'imediaEngagementSession';
    return safeParse(localStorage.getItem(key), null);
  }

  function getPlayerDisplayName(session) {
    if (!session || typeof session !== 'object') return 'Student';
    return String(session.displayName || session.studentName || session.userName || session.name || 'Student').trim() || 'Student';
  }

  function stripNameEntry(session) {
    const input = document.getElementById('playerName');
    if (!input) return;
    input.value = getPlayerDisplayName(session);
    input.setAttribute('type', 'hidden');
    input.setAttribute('aria-hidden', 'true');
    input.dataset.autofilledByShell = 'true';

    const label = document.querySelector('label[for="playerName"]');
    if (label) label.style.display = 'none';

    const row = input.closest('.field-row, .form-row, .setup-row, .control-row, .row');
    if (row) {
      row.classList.add('game-shell-hidden-name-row');
      row.style.display = 'none';
    } else {
      input.style.display = 'none';
    }
  }

  function getGameTitle() {
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    const title = (document.title || '').replace(/iMedia Genius\s*[·|-]\s*/i, '').trim();
    return title || 'Revision Game';
  }

  function getSubtitle() {
    const subtitle = document.querySelector('.subtitle');
    return subtitle ? subtitle.textContent.trim() : 'Play, revise and build your class score in the iMedia Revision Arcade.';
  }

  function findScoreValue() {
    const candidates = ['#scoreDisplay', '#score', '#totalScore', '#finalScore'];
    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return '0';
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
    const app = document.querySelector('.app') || document.querySelector('.page') || document.body;
    const header = app.querySelector('.app-header, header');
    if (!header) return;

    const session = getSession();
    stripNameEntry(session);
    normaliseGameUi(app);

    const inWorksheet = !!(session && session.sessionId);
    const classLabel = session && (session.className || session.classCode) ? (session.className || session.classCode) : 'Open from worksheet app';

    const bar = document.createElement('section');
    bar.className = 'game-shell-bar';
    bar.innerHTML = `
      <div class="game-shell-panel">
        <div class="game-shell-title">
          <span class="game-shell-kicker">iMedia revision arcade</span>
          <strong>${escapeHtml(getGameTitle())}</strong>
        </div>
        <p class="game-shell-copy">${escapeHtml(getSubtitle())}</p>
        <div class="game-shell-meta">
          <div class="game-shell-chip">
            <div>
              <span class="game-shell-chip-label">Tracking</span>
              <span class="game-shell-chip-value">${inWorksheet ? 'Worksheet linked' : 'Worksheet app only'}</span>
            </div>
          </div>
          <div class="game-shell-chip">
            <div>
              <span class="game-shell-chip-label">Worksheet app</span>
              <span class="game-shell-chip-value">${inWorksheet ? escapeHtml(classLabel) : 'Open to track scores'}</span>
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
          <a class="game-shell-link secondary" href="https://imediagenius.web.app/" target="_blank" rel="noopener noreferrer">Open worksheet app</a>
        </div>
      </div>
      <div class="game-shell-panel game-shell-score-card">
        <div>
          <div class="game-shell-chip-label">Live score</div>
          <div class="game-shell-score-value" id="gameShellLiveScore">${escapeHtml(findScoreValue())}</div>
          <p class="game-shell-score-note">${inWorksheet ? 'Finish strong to send your score back to the worksheet app and keep your revision streak going.' : 'Play here for practice, then open the worksheet app to track scores and class progress.'}</p>
        </div>
        <div class="game-shell-callout ${inWorksheet ? '' : 'warning'}" id="gameShellStatusCallout">${inWorksheet ? 'Your tracked score stays linked to the worksheet app for your class.' : 'Practice mode is still playable, but tracked scores now live in the worksheet app only.'}</div>
      </div>`;

    header.insertAdjacentElement('afterend', bar);

    const footer = document.createElement('section');
    footer.className = 'game-shell-footer';
    footer.innerHTML = `
      <div class="game-shell-footer-row">
        <div>
          <strong>Level up your iMedia revision</strong>
          <p>Take on more arcade challenges, sharpen your R093 knowledge, and push your class score even higher.</p>
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
