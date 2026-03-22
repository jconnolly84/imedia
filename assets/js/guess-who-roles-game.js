// Guess Who? – Roles in iMedia
// Uses the iMedia Genius arcade framework (timer, multiplier, class leaderboard)
// but generates questions from the GUESS_WHO_ROLES bank.

// === CONFIG ===

const ROLES = window.GUESS_WHO_ROLES || [];

const CATEGORY_LABELS = {
  all: "All Roles – Random Mix",
  creative: "Creative roles only",
  technical: "Technical roles only",
  senior: "Senior roles only"
};

// === DOM REFERENCES ===
const playerNameInput = document.getElementById("playerName");
const topicSelect = document.getElementById("topicSelect");
const startBtn = document.getElementById("startBtn");

const gameSection = document.getElementById("gameSection");
const topicLabel = document.getElementById("topicLabel");
const scoreDisplay = document.getElementById("scoreDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackEl = document.getElementById("feedback");
const questionCard = document.getElementById("questionCard");
const timerBar = document.getElementById("timerBar");
const timerLabel = document.getElementById("timerLabel");
const scorePopEl = document.getElementById("scorePop");

const gameOverPanel = document.getElementById("gameOverPanel");
const finalScoreEl = document.getElementById("finalScore");
const lastGameTopicEl = document.getElementById("lastGameTopic");
const restartBtn = document.getElementById("restartBtn");

// Leaderboard DOM
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardContainer = document.getElementById("leaderboardContainer");

// === SOUND EFFECTS ===
let sfxCorrect, sfxWrong, sfxStart, sfxGameOver;

function initSfx() {
  try {
    sfxCorrect = new Audio("sfx-correct.mp3");
    sfxWrong = new Audio("sfx-wrong.mp3");
    sfxStart = new Audio("sfx-start.mp3");
    sfxGameOver = new Audio("sfx-gameover.mp3");

    [sfxCorrect, sfxWrong, sfxStart, sfxGameOver].forEach((a) => {
      if (!a) return;
      a.volume = 0.5;
    });
  } catch (err) {
    console.warn("SFX not initialised (missing files is fine):", err);
  }
}

function playSfx(audioObj) {
  if (!audioObj) return;
  try {
    audioObj.currentTime = 0;
    audioObj.play().catch(() => {});
  } catch {
    // ignore autoplay issues
  }
}

// === GAME STATE ===
let currentQuestions = [];
let currentCategoryKey = "all";
let score = 0;
let multiplier = 1;
let lives = 3;
let index = 0;
const MAX_MULTIPLIER = 5;

const QUESTION_TIME_MS = 15000; // 15s per question
let questionEndTime = 0;
let questionTimerHandle = null;
let questionResolved = false;

// === UTILS ===
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a set of Guess Who questions for a given category
function buildQuestionSet(categoryKey) {
  if (!ROLES || !ROLES.length) return [];

  let pool = ROLES.slice();
  if (categoryKey !== "all") {
    pool = pool.filter((r) => r.category === categoryKey);
  }

  // For each role in the pool, create one multiple-choice question
  const questions = pool.map((role) => {
    const wrongPool = pool.filter((r) => r.id !== role.id);
    const wrongOptions = shuffle(wrongPool).slice(0, 3);
    const allOptions = shuffle([role, ...wrongOptions]);
    const answerIndex = allOptions.findIndex((r) => r.id === role.id);

    const clueHtml = `
      <p class="clue-intro">Guess the job role from these clues:</p>
      <ul class="clue-list">
        ${role.clues.map((c) => `<li>${c}</li>`).join("")}
      </ul>
    `;

    return {
      clueHtml,
      options: allOptions.map((r) => r.name),
      answerIndex
    };
  });

  return shuffle(questions);
}

function getCategoryLabel(key) {
  return CATEGORY_LABELS[key] || key;
}

// === TIMER & HUD FX ===
function stopQuestionTimer() {
  if (questionTimerHandle) {
    cancelAnimationFrame(questionTimerHandle);
    questionTimerHandle = null;
  }
  if (timerBar) {
    timerBar.classList.remove("timer-active");
  }
}

function startQuestionTimer() {
  if (!timerBar) return;
  stopQuestionTimer();
  const startTime = performance.now();
  questionEndTime = Date.now() + QUESTION_TIME_MS;
  timerBar.style.width = "100%";
  timerBar.classList.add("timer-active");

  function tick(now) {
    if (questionResolved) {
      stopQuestionTimer();
      return;
    }
    const elapsed = now - startTime;
    const remaining = Math.max(0, QUESTION_TIME_MS - elapsed);
    const ratio = remaining / QUESTION_TIME_MS;
    timerBar.style.width = (ratio * 100).toFixed(1) + "%";

    if (remaining <= 0) {
      questionTimerHandle = null;
      handleTimeout();
    } else {
      questionTimerHandle = requestAnimationFrame(tick);
    }
  }

  questionTimerHandle = requestAnimationFrame(tick);
}

function renderLives() {
  if (!livesDisplay) return;
  const maxLives = 3;
  const hearts = [];
  for (let i = 0; i < maxLives; i++) {
    hearts.push(i < lives ? "♥" : "✖");
  }
  livesDisplay.textContent = hearts.join(" ");
}

function pulseStat(el) {
  if (!el) return;
  el.classList.remove("stat-pulse");
  void el.offsetWidth;
  el.classList.add("stat-pulse");
}

function updateMultiplierHeat() {
  if (!multiplierDisplay) return;
  if (multiplier >= 4) {
    multiplierDisplay.classList.add("multiplier-hot");
  } else {
    multiplierDisplay.classList.remove("multiplier-hot");
  }
}

function showScorePop(text) {
  if (!scorePopEl) return;
  scorePopEl.textContent = text;
  scorePopEl.classList.remove("hidden", "score-pop-anim");
  void scorePopEl.offsetWidth;
  scorePopEl.classList.add("score-pop-anim");
  setTimeout(() => {
    scorePopEl.classList.add("hidden");
  }, 750);
}

// === GAME FLOW ===
function resetGameState(categoryKey) {
  currentCategoryKey = categoryKey;
  currentQuestions = buildQuestionSet(categoryKey);
  score = 0;
  multiplier = 1;
  lives = 3;
  index = 0;
  questionResolved = false;
  stopQuestionTimer();

  scoreDisplay.textContent = score.toString();
  multiplierDisplay.textContent = "x" + multiplier;
  updateMultiplierHeat();
  renderLives();
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  topicLabel.textContent = getCategoryLabel(categoryKey);
  if (timerLabel) {
    timerLabel.textContent = "Answer quickly for more points!";
  }

  questionCard.classList.remove("flash-correct", "flash-wrong");
}

function showQuestion() {
  if (lives <= 0 || index >= currentQuestions.length) {
    endGame();
    return;
  }

  const q = currentQuestions[index];
  questionResolved = false;

  // Use HTML so we can show bullet-point clues
  questionText.innerHTML = q.clueHtml;
  answersContainer.innerHTML = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  questionCard.classList.remove("flash-correct", "flash-wrong");

  const optionObjects = q.options.map((text, i) => ({
    text,
    isCorrect: i === q.answerIndex
  }));

  const shuffledOptions = shuffle(optionObjects);

  shuffledOptions.forEach((optObj) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = optObj.text;
    btn.dataset.correct = optObj.isCorrect ? "true" : "false";
    btn.addEventListener("click", () => handleAnswer(optObj.isCorrect, btn));
    answersContainer.appendChild(btn);
  });

  startQuestionTimer();
}

function handleAnswer(correct, clickedBtn) {
  if (questionResolved) return;
  questionResolved = true;
  stopQuestionTimer();

  const buttons = Array.from(answersContainer.querySelectorAll("button"));
  buttons.forEach((b) => (b.disabled = true));
  buttons.forEach((b) => {
    if (b.dataset.correct === "true") {
      b.classList.add("correct");
    }
  });

  if (correct) {
    if (clickedBtn) {
      clickedBtn.classList.add("correct");
    }
    const remaining = Math.max(0, questionEndTime - Date.now());
    const ratio = QUESTION_TIME_MS > 0 ? remaining / QUESTION_TIME_MS : 0;
    const timeBonusMultiplier = 0.4 + ratio * 0.6;
    const basePoints = 100 * multiplier;
    const points = Math.max(10, Math.round(basePoints * timeBonusMultiplier));

    score += points;
    multiplier = Math.min(MAX_MULTIPLIER, multiplier + 1);

    feedbackEl.textContent = "Correct! +" + points;
    feedbackEl.className = "feedback correct";
    playSfx(sfxCorrect);
    questionCard.classList.add("flash-correct");
    showScorePop("+" + points);
  } else {
    if (clickedBtn) {
      clickedBtn.classList.add("wrong");
    }
    feedbackEl.textContent = "Wrong! Multiplier reset.";
    feedbackEl.className = "feedback wrong";
    lives -= 1;
    multiplier = 1;
    playSfx(sfxWrong);
    questionCard.classList.add("flash-wrong");
  }

  scoreDisplay.textContent = score.toString();
  multiplierDisplay.textContent = "x" + multiplier;
  updateMultiplierHeat();
  renderLives();
  pulseStat(scoreDisplay);
  pulseStat(multiplierDisplay);

  index += 1;

  setTimeout(() => {
    if (lives <= 0 || index >= currentQuestions.length) {
      endGame();
    } else {
      showQuestion();
    }
  }, 900);
}

function handleTimeout() {
  if (questionResolved) return;
  questionResolved = true;
  stopQuestionTimer();

  const buttons = Array.from(answersContainer.querySelectorAll("button"));
  buttons.forEach((b) => {
    b.disabled = true;
    if (b.dataset.correct === "true") {
      b.classList.add("correct");
    }
  });

  feedbackEl.textContent = "Out of time! Multiplier reset.";
  feedbackEl.className = "feedback wrong";

  lives -= 1;
  multiplier = 1;

  playSfx(sfxWrong);
  questionCard.classList.add("flash-wrong");

  scoreDisplay.textContent = score.toString();
  multiplierDisplay.textContent = "x" + multiplier;
  updateMultiplierHeat();
  renderLives();
  pulseStat(multiplierDisplay);

  index += 1;

  setTimeout(() => {
    if (lives <= 0 || index >= currentQuestions.length) {
      endGame();
    } else {
      showQuestion();
    }
  }, 900);
}

function endGame() {
  stopQuestionTimer();
  questionResolved = true;

  gameSection.classList.add("hidden");
  gameOverPanel.classList.remove("hidden");

  finalScoreEl.textContent = score.toString();
  lastGameTopicEl.textContent = getCategoryLabel(currentCategoryKey);

  const name = (playerNameInput.value || "Student").trim();
  // Log scores under the category key so they can mix with other games if needed
  submitScore(name, currentCategoryKey, score, currentQuestions.length);

  playSfx(sfxGameOver);

  setTimeout(loadLeaderboardFromFirebase, 800);
}

// === SCORE LOGGING (fire-and-forget GET via Apps Script) ===
function submitScore(name, topicKey, scoreValue, questionsPlayed) {
  const service = window.imediaGameScores;
  if (!service || typeof service.submitScore !== 'function') return;
  const maxScore = Number(questionsPlayed || 0);
  service.submitScore({
    playerName: String(name || '').trim(),
    topicKey: String(topicKey || window.TOPIC_KEY || '').trim(),
    gameId: String(topicKey || window.TOPIC_KEY || document.body?.dataset?.topicKey || location.pathname.split('/').pop().replace(/\.html$/i, '') || 'game'),
    gameTitle: document.title || 'Game',
    score: Number(scoreValue || 0),
    maxScore,
    questionsPlayed: maxScore
  });
}

function loadLeaderboardFromFirebase() {
  const service = window.imediaGameScores;
  if (!leaderboardContainer) return;
  if (!service || typeof service.loadLeaderboard !== 'function') {
    leaderboardContainer.innerHTML = "<p class='leaderboard-note'>Launch this game from the worksheet app to view your class leaderboard.</p>";
    return;
  }
  service.loadLeaderboard({
    container: leaderboardContainer,
    topicKey: String(window.TOPIC_KEY || document.body?.dataset?.topicKey || location.pathname.split('/').pop().replace(/\.html$/i, '') || 'game')
  });
}

// === LEADERBOARD UI ===
function setupLeaderboardTabs() {
  if (leaderboardTitle) leaderboardTitle.textContent = "Class leaderboard";
}

// === CATEGORY SELECT ===
function populateCategorySelect() {
  if (!topicSelect) return;
  topicSelect.innerHTML = "";

  Object.keys(CATEGORY_LABELS).forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = CATEGORY_LABELS[key];
    topicSelect.appendChild(opt);
  });
}

// === START / RESTART HANDLERS ===
function startGameHandler() {
  const name = (playerNameInput.value || "Student").trim() || "Student";

  if (!ROLES.length) {
    alert("Role data not loaded – check guess-who-roles-data.js.");
    return;
  }

  const categoryKey = topicSelect.value || "all";
  resetGameState(categoryKey);
  if (!currentQuestions.length) {
    alert("No roles found for that category. Check the data file.");
    return;
  }

  gameOverPanel.classList.add("hidden");
  gameSection.classList.remove("hidden");
  playSfx(sfxStart);
  showQuestion();
}

function restartGameHandler() {
  gameOverPanel.classList.add("hidden");
  gameSection.classList.add("hidden");
}

// === INIT ===
populateCategorySelect();
setupLeaderboardTabs();
initSfx();
loadLeaderboardFromFirebase();

startBtn.addEventListener("click", startGameHandler);
restartBtn.addEventListener("click", restartGameHandler);
