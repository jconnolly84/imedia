/* Flow Chart Fixer – R093 Topic 36 (flow charts in media products) */
(function () {
  'use strict';

  /* ---------- tiny SVG flow chart kit ---------- */
  var W = 150, H = 54; // default symbol size
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function text(x, y, label, size) {
    var lines = String(label).split('\n');
    var fs = size || 15, lh = fs + 2, top = y - ((lines.length - 1) * lh) / 2 + fs * 0.35;
    return lines.map(function (l, i) {
      return '<text x="' + x + '" y="' + (top + i * lh) + '" text-anchor="middle" font-size="' + fs + '" class="fc-label">' + esc(l) + '</text>';
    }).join('');
  }
  // n = {t:'term'|'proc'|'dec'|'io'|'blank', x, y, label, w, h, hl}
  function node(n) {
    var w = n.w || (n.t === 'dec' ? 150 : W), h = n.h || (n.t === 'dec' ? 76 : H);
    var x = n.x - w / 2, y = n.y - h / 2, cls = 'fc-shape fc-' + n.t + (n.hl ? ' fc-hl' : ''), s = '';
    if (n.t === 'term') s = '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '"/>';
    else if (n.t === 'proc' || n.t === 'blank') s = '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6"/>';
    else if (n.t === 'dec') s = '<path class="' + cls + '" d="M' + n.x + ' ' + y + 'L' + (x + w) + ' ' + n.y + 'L' + n.x + ' ' + (y + h) + 'L' + x + ' ' + n.y + 'Z"/>';
    else if (n.t === 'io') s = '<path class="' + cls + '" d="M' + (x + 18) + ' ' + y + 'H' + (x + w) + 'L' + (x + w - 18) + ' ' + (y + h) + 'H' + x + 'Z"/>';
    return s + (n.label != null ? text(n.x, n.y, n.label, n.fs) : '');
  }
  // e = {p:[[x,y],...], label, lx, ly, hl}
  function edge(e) {
    var d = 'M' + e.p.map(function (pt) { return pt[0] + ' ' + pt[1]; }).join('L');
    var s = '<path class="fc-line' + (e.hl ? ' fc-hl-line' : '') + '" d="' + d + '" marker-end="url(#fcArrow)"/>';
    if (e.label) s += '<text class="fc-edge-label" x="' + e.lx + '" y="' + e.ly + '" font-size="14">' + esc(e.label) + '</text>';
    return s;
  }
  function chart(w, h, nodes, edges) {
    return '<svg class="fc-chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Flow chart diagram">' +
      '<defs><marker id="fcArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fc-arrowhead"/></marker></defs>' +
      (edges || []).map(edge).join('') + nodes.map(node).join('') + '</svg>';
  }
  function symbolOnly(t) {
    return chart(220, 110, [{ t: t, x: 110, y: 55, w: t === 'dec' ? 170 : 170, h: t === 'dec' ? 90 : 64 }], []);
  }
  function arrowOnly() {
    return '<svg class="fc-chart" viewBox="0 0 220 110" role="img" aria-label="An arrow"><defs><marker id="fcArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="fc-arrowhead"/></marker></defs><path class="fc-line" d="M30 55H190" marker-end="url(#fcArrow)"/></svg>';
  }

  /* ---------- question bank ---------- */
  // cat: symbols | uses | fix
  var BANK = [
    // --- Symbols ---
    { cat: 'symbols', q: 'What does this symbol represent in a flow chart?', svg: function () { return symbolOnly('term'); },
      options: ['The start or end of the process', 'A decision', 'Data input or output', 'A process or action'], a: 0,
      why: 'A rounded rectangle (or oval) is the terminator. Every flow chart has one start and at least one end.' },
    { cat: 'symbols', q: 'What does this symbol represent in a flow chart?', svg: function () { return symbolOnly('dec'); },
      options: ['A process or action', 'A decision with an exit for each answer', 'The start of the process', 'A stored file'], a: 1,
      why: 'The diamond is the decision symbol. It holds a question, e.g. "Logged in?", and has a labelled exit for each answer (usually Yes / No).' },
    { cat: 'symbols', q: 'What does this symbol represent in a flow chart?', svg: function () { return symbolOnly('proc'); },
      options: ['A decision', 'The end of the process', 'A process – an action, task or screen', 'Data entered by the user'], a: 2,
      why: 'A rectangle is a process: an action such as "Show home page" or "Add 1 point".' },
    { cat: 'symbols', q: 'What does this symbol represent in a flow chart?', svg: function () { return symbolOnly('io'); },
      options: ['Input or output of data', 'A decision', 'The start or end', 'A loop'], a: 0,
      why: 'A parallelogram is input/output, e.g. "User enters email" or "Display score".' },
    { cat: 'symbols', q: 'What does this part of a flow chart show?', svg: arrowOnly,
      options: ['A decision', 'The direction of flow to the next step', 'The end of the process', 'A process that repeats'], a: 1,
      why: 'Arrows (flow lines) join the symbols and show the direction the process moves in.' },
    { cat: 'symbols', q: 'An app asks "Is the basket empty?". Which symbol should this step use?', svg: null,
      options: ['Rectangle (process)', 'Diamond (decision)', 'Parallelogram (input/output)', 'Rounded rectangle (terminator)'], a: 1,
      why: 'It is a question with more than one possible answer, so it is a decision – a diamond with Yes and No exits.' },
    { cat: 'symbols', q: 'A website step says "User types their postcode". Which symbol fits best?', svg: null,
      options: ['Parallelogram (input/output)', 'Diamond (decision)', 'Rounded rectangle (terminator)', 'Arrow (flow line)'], a: 0,
      why: 'The user is entering data, so it is an input – a parallelogram.' },
    { cat: 'symbols', q: 'Which of these is a convention of flow charts?', svg: null,
      options: ['Arrows should point in any direction', 'Read from top to bottom or left to right', 'Decisions only need one exit', 'Each chart has several start points'], a: 1,
      why: 'Flow charts are read top to bottom or left to right, with one start, clear end(s) and an exit for every answer.' },

    // --- Uses / users / when ---
    { cat: 'uses', q: 'Which media product would MOST need a flow chart during planning?', svg: null,
      options: ['A printed poster', 'A radio advert', 'An interactive quiz app', 'A magazine front cover'], a: 2,
      why: 'Flow charts plan choices and logic. A quiz app has branches (right/wrong answers, scoring); the others are linear or static.' },
    { cat: 'uses', q: 'A game designer is planning what happens when a player picks one of three doors. Why use a flow chart?', svg: null,
      options: ['To show the colours of each door', 'To map the branching routes for each choice', 'To record where the door images came from', 'To list the actors needed'], a: 1,
      why: 'Flow charts show branching choices and the route for each one. Colours would be on a visualisation diagram; sources on an asset log.' },
    { cat: 'uses', q: 'Who would use a flow chart to plan how the pages of a website link together?', svg: null,
      options: ['A web developer', 'A camera operator', 'A sound engineer', 'A make-up artist'], a: 0,
      why: 'Web designers and developers use flow charts to plan navigation and links between pages.' },
    { cat: 'uses', q: 'What does a flow chart show that a wireframe does NOT?', svg: null,
      options: ['The position of images on a screen', 'The fonts and colours', 'The routes and decisions a user can take', 'The size of the buttons'], a: 2,
      why: 'A flow chart shows how the product works (routes and logic). A wireframe shows what each screen looks like.' },
    { cat: 'uses', q: 'Why might a client be shown a flow chart?', svg: null,
      options: ['To approve how the product will work before it is built', 'To check the budget', 'To choose the actors', 'To sign the copyright licence'], a: 0,
      why: 'The client can check the user journey and agree it early, before time is spent building the product.' },
    { cat: 'uses', q: 'Which is a NON-interactive use of a flow chart in the media industry?', svg: null,
      options: ['Website navigation', 'An emergency procedure in a TV studio', 'Character logic in a game', 'An app checkout'], a: 1,
      why: 'Flow charts can also set out processes, such as what crew should do in an emergency.' },
    { cat: 'uses', q: 'A designer wants to edit and share a flow chart with a client easily. What should they use?', svg: null,
      options: ['Pencil and paper', 'Diagramming software such as draw.io or Visio', 'A digital camera', 'A microphone'], a: 1,
      why: 'Digital diagramming software makes the chart easy to edit, rearrange and share, with neat standard symbols.' },
    { cat: 'uses', q: 'Why is a flow chart NOT the best choice to plan a printed poster?', svg: null,
      options: ['Posters have no choices or routes to plan', 'Flow charts cannot show text', 'Posters are too large', 'Flow charts are only for films'], a: 0,
      why: 'A poster is static with no decisions, so a visualisation diagram is more useful.' },

    // --- Fix the flow ---
    { cat: 'fix', q: 'This flow chart is for an app log-in. What is wrong with it?',
      svg: function () {
        return chart(520, 330, [
          { t: 'term', x: 110, y: 40, label: 'Start' },
          { t: 'io', x: 110, y: 120, label: 'Enter password' },
          { t: 'dec', x: 110, y: 215, label: 'Password\ncorrect?' },
          { t: 'proc', x: 360, y: 215, label: 'Show home screen' },
          { t: 'term', x: 360, y: 300, label: 'End' }
        ], [
          { p: [[110, 67], [110, 93]] }, { p: [[110, 147], [110, 177]] },
          { p: [[185, 215], [285, 215]], label: 'Yes', lx: 215, ly: 205 }, { p: [[360, 242], [360, 273]] }
        ]);
      },
      options: ['The decision has no "No" route', 'The start symbol is the wrong shape', 'Arrows should point upwards', 'There are too many symbols'], a: 0,
      why: 'Every decision needs an exit for each answer. Add a "No" route, e.g. show an error and loop back to "Enter password".' },
    { cat: 'fix', q: 'What should be changed in this quiz flow chart?',
      svg: function () {
        return chart(520, 330, [
          { t: 'term', x: 260, y: 36, label: 'Start' },
          { t: 'io', x: 260, y: 110, label: 'Player answers' },
          { t: 'proc', x: 260, y: 190, label: 'Answer correct?' },
          { t: 'proc', x: 100, y: 275, label: 'Add 1 point' },
          { t: 'proc', x: 420, y: 275, label: 'Show answer' }
        ], [
          { p: [[260, 63], [260, 83]] }, { p: [[260, 137], [260, 163]] },
          { p: [[185, 190], [100, 190], [100, 248]], label: 'Yes', lx: 120, ly: 182 },
          { p: [[335, 190], [420, 190], [420, 248]], label: 'No', lx: 380, ly: 182 }
        ]);
      },
      options: ['"Answer correct?" should be a diamond (decision)', '"Start" should be a rectangle', '"Player answers" should be a diamond', 'Nothing – it is correct'], a: 0,
      why: 'A question with Yes/No exits is a decision, so it must use the diamond symbol. Both routes also need to reach an End.' },
    { cat: 'fix', q: 'This website checkout flow chart has a problem. What is it?',
      svg: function () {
        return chart(520, 330, [
          { t: 'term', x: 110, y: 36, label: 'Start' },
          { t: 'proc', x: 110, y: 110, label: 'View basket' },
          { t: 'dec', x: 110, y: 200, label: 'Pay now?' },
          { t: 'io', x: 360, y: 200, label: 'Enter card details' },
          { t: 'term', x: 360, y: 290, label: 'End' },
          { t: 'proc', x: 110, y: 295, label: 'Keep shopping' }
        ], [
          { p: [[110, 63], [110, 83]] }, { p: [[110, 137], [110, 162]] },
          { p: [[185, 200], [285, 200]], label: 'Yes', lx: 215, ly: 190 },
          { p: [[110, 238], [110, 268]], label: 'No', lx: 118, ly: 258 }, { p: [[360, 227], [360, 263]] }
        ]);
      },
      options: ['"Keep shopping" is a dead end – it should loop back to the basket or products', 'The decision should be a rectangle', 'There should be two Start symbols', 'Card details should be a terminator'], a: 0,
      why: 'Every route must lead somewhere. "Keep shopping" stops dead, so add an arrow back into the shop or basket.' },
    { cat: 'fix', q: 'What is missing from this game flow chart?',
      svg: function () {
        return chart(520, 320, [
          { t: 'proc', x: 110, y: 40, label: 'Load level' },
          { t: 'proc', x: 110, y: 120, label: 'Play level' },
          { t: 'dec', x: 110, y: 210, label: 'Lives\nleft?' },
          { t: 'proc', x: 360, y: 210, label: 'Game over screen' },
          { t: 'term', x: 360, y: 280, label: 'End' }
        ], [
          { p: [[110, 67], [110, 93]] }, { p: [[110, 147], [110, 172]] },
          { p: [[185, 210], [285, 210]], label: 'No', lx: 215, ly: 200 },
          { p: [[35, 210], [12, 210], [12, 120], [32, 120]], label: 'Yes', lx: 16, ly: 236 }, { p: [[360, 237], [360, 253]] }
        ]);
      },
      options: ['A Start terminator', 'A second End', 'An extra decision', 'Nothing is missing'], a: 0,
      why: 'Every flow chart begins with a Start terminator so the reader knows where the process begins.' },
    { cat: 'fix', q: 'The client finds this flow chart hard to follow. Which improvement would help MOST?',
      svg: function () {
        return chart(520, 320, [
          { t: 'term', x: 90, y: 40, label: 'Start' },
          { t: 'proc', x: 90, y: 130, label: 'Thing 1' },
          { t: 'dec', x: 280, y: 130, label: 'OK?' },
          { t: 'proc', x: 450, y: 130, w: 120, label: 'Bit 2' },
          { t: 'proc', x: 280, y: 250, label: 'Next part' },
          { t: 'term', x: 450, y: 250, w: 120, label: 'End' }
        ], [
          { p: [[90, 67], [90, 103]] }, { p: [[165, 130], [205, 130]] },
          { p: [[355, 130], [390, 130]], label: 'Yes', lx: 360, ly: 120 },
          { p: [[280, 168], [280, 223]], label: 'No', lx: 288, ly: 200 },
          { p: [[450, 157], [450, 223]] }, { p: [[355, 250], [390, 250]] }
        ]);
      },
      options: ['Use specific labels, e.g. "Show basket page"', 'Remove all the arrows', 'Make every symbol a rectangle', 'Add more decisions'], a: 0,
      why: 'Vague labels such as "Thing 1" and "Bit 2" mean nothing to the client. Specific labels make the chart effective for its users.' },

    // --- Complete the flow (also fix category) ---
    { cat: 'fix', q: 'Which symbol should go in the gap marked "?"',
      svg: function () {
        return chart(520, 320, [
          { t: 'term', x: 110, y: 36, label: 'Start' },
          { t: 'proc', x: 110, y: 110, label: 'Show question' },
          { t: 'blank', x: 110, y: 200, label: '?', hl: true, fs: 26 },
          { t: 'proc', x: 360, y: 200, label: 'Add 1 point' },
          { t: 'proc', x: 110, y: 290, label: 'Show answer' }
        ], [
          { p: [[110, 63], [110, 83]] }, { p: [[110, 137], [110, 173]] },
          { p: [[185, 200], [285, 200]], label: 'Yes', lx: 215, ly: 190 },
          { p: [[110, 227], [110, 263]], label: 'No', lx: 118, ly: 250 }
        ]);
      },
      options: ['A diamond: "Correct answer?"', 'A rectangle: "Correct answer?"', 'A terminator: "End"', 'A parallelogram: "Print certificate"'], a: 0,
      why: 'The gap has Yes and No exits, so it must be a decision – a diamond containing a question.' },
    { cat: 'fix', q: 'Which step belongs in the gap marked "?" in this cinema app flow chart?',
      svg: function () {
        return chart(520, 320, [
          { t: 'term', x: 110, y: 36, label: 'Start' },
          { t: 'proc', x: 110, y: 110, label: 'Choose film' },
          { t: 'dec', x: 110, y: 200, label: 'Seats\navailable?' },
          { t: 'blank', x: 360, y: 200, label: '?', hl: true, fs: 26 },
          { t: 'proc', x: 110, y: 290, label: 'Show "Sold out"' }
        ], [
          { p: [[110, 63], [110, 83]] }, { p: [[110, 137], [110, 162]] },
          { p: [[185, 200], [285, 200]], label: 'Yes', lx: 215, ly: 190 },
          { p: [[110, 238], [110, 263]], label: 'No', lx: 118, ly: 254 }
        ]);
      },
      options: ['Enter payment details', 'Show "Sold out"', 'Start', 'Seats available?'], a: 0,
      why: 'If seats are available (Yes), the user continues to book, so the next step is entering payment details – an input.' },
    { cat: 'fix', q: 'Which of these would make a flow chart LESS effective?',
      svg: null,
      options: ['Arrows that cross over each other many times', 'Labelled Yes/No exits', 'A key explaining the symbols', 'A clear Start and End'], a: 0,
      why: 'Lots of crossing lines make the route hard to follow. The other options all improve a flow chart.' }
  ];

  /* ---------- game state ---------- */
  var ROUND = 12;
  var $ = function (id) { return document.getElementById(id); };
  var els = {
    mode: $('modeSelect'), start: $('newGameBtn'), qNum: $('questionNumber'), qTotal: $('questionTotal'),
    score: $('scoreDisplay'), streak: $('streakDisplay'), cat: $('modeLabel'), q: $('questionText'),
    diagram: $('diagram'), answers: $('answersContainer'), next: $('nextQuestionBtn'), feedback: $('feedback'),
    progress: $('progressBar')
  };
  var deck = [], idx = 0, score = 0, streak = 0, correct = 0, answered = false;
  var CAT_LABEL = { symbols: 'Symbols & conventions', uses: 'Flow charts in media', fix: 'Fix the flow' };

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function newGame() {
    var mode = els.mode.value;
    var pool = BANK.filter(function (b) { return mode === 'all' || b.cat === mode; });
    deck = shuffle(pool.slice()).slice(0, Math.min(ROUND, pool.length));
    idx = 0; score = 0; streak = 0; correct = 0;
    els.qTotal.textContent = deck.length;
    render();
  }

  function render() {
    var item = deck[idx];
    answered = false;
    els.qNum.textContent = idx + 1;
    els.score.textContent = score;
    els.streak.textContent = streak;
    els.progress.style.width = (idx / deck.length * 100) + '%';
    els.cat.textContent = CAT_LABEL[item.cat];
    els.q.textContent = item.q;
    els.diagram.innerHTML = item.svg ? item.svg() : '';
    els.diagram.hidden = !item.svg;
    els.feedback.innerHTML = '';
    els.feedback.className = 'feedback';
    els.next.disabled = true;
    els.next.textContent = idx === deck.length - 1 ? 'See results' : 'Next question';
    var order = shuffle(item.options.map(function (o, i) { return i; }));
    els.answers.innerHTML = '';
    order.forEach(function (i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'answer-btn'; b.textContent = item.options[i];
      b.dataset.index = i;
      b.addEventListener('click', function () { choose(i, b); });
      els.answers.appendChild(b);
    });
  }

  function choose(i, btn) {
    if (answered) return;
    answered = true;
    var item = deck[idx], ok = i === item.a;
    Array.prototype.forEach.call(els.answers.children, function (b) {
      b.disabled = true;
      if (Number(b.dataset.index) === item.a) b.classList.add('correct');
    });
    if (ok) {
      streak++; correct++;
      score += 10 + Math.min(streak - 1, 4) * 2;
    } else {
      streak = 0; btn.classList.add('wrong');
    }
    els.score.textContent = score;
    els.streak.textContent = streak;
    els.feedback.className = 'feedback ' + (ok ? 'good' : 'bad');
    els.feedback.innerHTML = '<strong>' + (ok ? '✅ Correct!' : '❌ Not quite.') + '</strong> ' + esc(item.why);
    els.next.disabled = false;
    els.next.focus();
  }

  function finish() {
    var pct = Math.round(correct / deck.length * 100);
    els.progress.style.width = '100%';
    els.cat.textContent = 'Results';
    els.q.innerHTML = 'You got <strong>' + correct + ' / ' + deck.length + '</strong> (' + pct + '%) and scored <strong>' + score + '</strong> points.';
    els.diagram.hidden = true; els.diagram.innerHTML = '';
    els.answers.innerHTML = '';
    els.feedback.className = 'feedback';
    els.feedback.innerHTML = pct >= 80 ? '🏆 Flow chart expert! You can read, judge and fix flow charts like an examiner.'
      : pct >= 50 ? '👍 Good work. Revise the symbols and the "Fix the flow" rounds, then play again.'
      : '📘 Revisit the Topic 36 page, especially the symbols and conventions, then try again.';
    els.next.disabled = true;
    if (window.imediaGameScores && window.imediaGameScores.submitScore) {
      var session = window.imediaGameScores.getSession && window.imediaGameScores.getSession();
      window.imediaGameScores.submitScore({
        playerName: String((session && (session.displayName || session.studentName)) || '').trim(),
        topicKey: 'flow-chart-fixer', gameId: 'flow-chart-fixer', gameTitle: document.title || 'Flow Chart Fixer',
        score: correct, maxScore: deck.length, questionsPlayed: deck.length
      });
    }
  }

  els.start.addEventListener('click', newGame);
  els.next.addEventListener('click', function () {
    if (idx < deck.length - 1) { idx++; render(); } else { finish(); }
  });
})();
