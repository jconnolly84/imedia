// IPR Gauntlet – Intellectual Property Rights Mega Game
// Uses iMedia Genius HUD, timer, multiplier & leaderboard.

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const STAGES = window.IPR_STAGES || [];

// DOM references
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

const gameSection = document.getElementById("gameSection");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackEl = document.getElementById("feedback");
const stageIntroEl = document.getElementById("stageIntro");
const progressLabel = document.getElementById("progressLabel");
const scorePopEl = document.getElementById("scorePop");

const stageLabel = document.getElementById("stageLabel");
const stageNameLabel = document.getElementById("stageNameLabel");
const scoreDisplay = document.getElementById("scoreDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const livesDisplay = document.getElementById("livesDisplay");

const timerBar = document.getElementById("timerBar");
const timerLabel = document.getElementById("timerLabel");

const stageCompletePanel = document.getElementById("stageCompletePanel");
const completedStageNameEl = document.getElementById("completedStageName");
const stageScoreDisplay = document.getElementById("stageScoreDisplay");
const nextStageBtn = document.getElementById("nextStageBtn");

const gameOverPanel = document.getElementById("gameOverPanel");
const gameOverTitle = document.getElementById("gameOverTitle");
const finalScoreEl = document.getElementById("finalScore");
const lastStageNameEl = document.getElementById("lastStageName");
const restartBtn = document.getElementById("restartBtn");

const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardContainer = document.getElementById("leaderboardContainer");
const leaderboardTabs = Array.from(document.querySelectorAll(".lb-tab"));

// SFX
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
    console.warn("SFX not initialised:", err);
  }
}

function playSfx(audioObj) {
  if (!audioObj) return;
  try {
    audioObj.currentTime = 0;
    audioObj.play().catch(() => {});
  } catch {}
}

// Game state
let currentStageIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let multiplier = 1;
let lives = 3;
let questionResolved = false;

const MAX_MULTIPLIER = 5;
const QUESTION_TIME_MS = 15000;
let questionEndTime = 0;
let timerHandle = null;

// Utils
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

function renderLives() {
  const maxLives = 3;
  const hearts = [];
  for (let i = 0; i < maxLives; i++) {
    hearts.push(i < lives ? "♥" : "✖");
  }
  livesDisplay.textContent = hearts.join(" ");
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

// Timer
function stopTimer() {
  if (timerHandle) {
    cancelAnimationFrame(timerHandle);
    timerHandle = null;
  }
  if (timerBar) timerBar.classList.remove("timer-active");
}

function startTimer() {
  stopTimer();
  if (!timerBar) return;
  const startTime = performance.now();
  questionEndTime = Date.now() + QUESTION_TIME_MS;
  timerBar.style.width = "100%";
  timerBar.classList.add("timer-active");

  function tick(now) {
    if (questionResolved) {
      stopTimer();
      return;
    }
    const elapsed = now - startTime;
    const remaining = Math.max(0, QUESTION_TIME_MS - elapsed);
    const ratio = remaining / QUESTION_TIME_MS;
    timerBar.style.width = (ratio * 100).toFixed(1) + "%";
    if (remaining <= 0) {
      timerHandle = null;
      handleTimeout();
    } else {
      timerHandle = requestAnimationFrame(tick);
    }
  }

  timerHandle = requestAnimationFrame(tick);
}

// Game reset & start
function resetGame() {
  currentStageIndex = 0;
  currentQuestionIndex = 0;
  score = 0;
  multiplier = 1;
  lives = 3;
  questionResolved = false;
  stopTimer();

  scoreDisplay.textContent = "0";
  multiplierDisplay.textContent = "x1";
  updateMultiplierHeat();
  renderLives();
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  stageIntroEl.textContent = "";
  progressLabel.textContent = "";
  stageLabel.textContent = "1";
  stageNameLabel.textContent = STAGES[0] ? STAGES[0].name : "";
  timerLabel.textContent = "Answer quickly for more points!";
}

function startGameHandler() {
  const name = (playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your name so your score can be logged.");
    return;
  }
  if (!STAGES.length) {
    alert("No stages loaded – check ipr-megagame-data.js.");
    return;
  }

  resetGame();
  gameOverPanel.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameSection.classList.remove("hidden");

  playSfx(sfxStart);
  loadStageIntro();
  showQuestion();
}

function loadStageIntro() {
  const stage = STAGES[currentStageIndex];
  if (!stage) return;
  stageLabel.textContent = (currentStageIndex + 1).toString();
  stageNameLabel.textContent = stage.name;
  stageIntroEl.textContent = stage.intro;
}

// Question rendering
function showQuestion() {
  const stage = STAGES[currentStageIndex];
  if (!stage) {
    endGame(true);
    return;
  }

  const questions = stage.questions || [];
  if (currentQuestionIndex >= questions.length) {
    handleStageComplete();
    return;
  }

  const q = questions[currentQuestionIndex];
  questionResolved = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  questionCard.classList.remove("flash-correct", "flash-wrong");
  answersContainer.innerHTML = "";
  progressLabel.textContent =
    "Question " + (currentQuestionIndex + 1) + " of " + questions.length;

  switch (stage.type) {
    case "lawType":
      renderLawTypeQuestion(q);
      break;
    case "copyrightCheck":
      renderCopyrightQuestion(q);
      break;
    case "ccLicence":
      renderCcLicenceQuestion(q);
      break;
    case "permissions":
      renderPermissionsQuestion(q);
      break;
    case "fairDealing":
      renderFairDealingQuestion(q);
      break;
    case "iprScenario":
      renderIprScenarioQuestion(q);
      break;
    case "eightMarkIPR":
      renderEightMarkQuestion(q);
      break;
    default:
      questionText.textContent = "Unknown question type.";
  }

  startTimer();
}

function createAnswerButton(text, isCorrect) {
  const btn = document.createElement("button");
  btn.className = "answer-btn";
  btn.textContent = text;
  btn.dataset.correct = isCorrect ? "true" : "false";
  btn.addEventListener("click", () => handleAnswer(isCorrect, btn));
  return btn;
}

// Stage-specific renderers
function renderLawTypeQuestion(q) {
  questionText.innerHTML =
    "Which type of intellectual property right best protects this?<br><br>" +
    "<span class='highlight-term'>" +
    q.example +
    "</span>";
  const options = shuffle(q.options || []);
  options.forEach((opt) => {
    const btn = createAnswerButton(opt, opt === q.answer);
    answersContainer.appendChild(btn);
  });
}

function renderCopyrightQuestion(q) {
  questionText.innerHTML =
    "What is the best description of the copyright position here?<br><br>" +
    "<em>" +
    q.statement +
    "</em>";
  const options = shuffle(q.options || []);
  options.forEach((opt) => {
    const btn = createAnswerButton(opt, opt === q.answer);
    answersContainer.appendChild(btn);
  });
}

function renderCcLicenceQuestion(q) {
  questionText.innerHTML =
    "What does this Creative Commons licence or icon allow?<br><br>" +
    "<span class='highlight-term'>" +
    q.question +
    "</span>";
  const options = shuffle(q.options || []);
  options.forEach((opt) => {
    const btn = createAnswerButton(opt, opt === q.answer);
    answersContainer.appendChild(btn);
  });
}

function renderPermissionsQuestion(q) {
  questionText.innerHTML =
    "What should the producer do in this situation?<br><br>" +
    "<em>" +
    q.scenario +
    "</em>";
  const options = shuffle(q.options || []);
  options.forEach((opt) => {
    const btn = createAnswerButton(opt, opt === q.answer);
    answersContainer.appendChild(btn);
  });
}

function renderFairDealingQuestion(q) {
  questionText.innerHTML =
    "Is this an example of <strong>fair dealing</strong> or <strong>infringement</strong>?<br><br>" +
    "<em>" +
    q.statement +
    "</em>";
  const options = shuffle(q.options || []);
  options.forEach((opt) => {
    const btn = createAnswerButton(opt, opt === q.answer);
    answersContainer.appendChild(btn);
  });
}

function renderIprScenarioQuestion(q) {
  questionText.innerHTML =
    "What is the best legal decision in this scenario?<br><br>" +
    "<em>" +
    q.scenario +
    "</em>";
  const options = shuffle(q.options || []);
  options.forEach((opt) => {
    const btn = createAnswerButton(opt, opt === q.answer);
    answersContainer.appendChild(btn);
  });
}

function renderEightMarkQuestion(q) {
  questionText.innerHTML =
    "Pick the sentence that would gain the <strong>most marks</strong> in an 8-mark exam answer.<br><br>" +
    "<em>" +
    q.question +
    "</em>";
  const indexedOptions = (q.options || []).map((text, index) => ({
    text,
    index
  }));
  shuffle(indexedOptions).forEach((opt) => {
    const btn = createAnswerButton(opt.text, opt.index === q.answer);
    answersContainer.appendChild(btn);
  });
}

// Answer handling
function handleAnswer(correct, clickedBtn) {
  if (questionResolved) return;
  questionResolved = true;
  stopTimer();

  const buttons = Array.from(answersContainer.querySelectorAll("button"));
  buttons.forEach((b) => (b.disabled = true));
  buttons.forEach((b) => {
    if (b.dataset.correct === "true") b.classList.add("correct");
  });

  if (correct) {
    if (clickedBtn) clickedBtn.classList.add("correct");
    const remaining = Math.max(0, questionEndTime - Date.now());
    const ratio = QUESTION_TIME_MS > 0 ? remaining / QUESTION_TIME_MS : 0;
    const timeBonus = 0.4 + ratio * 0.6;
    const stageBonusFactor = 1 + currentStageIndex * 0.1;
    const basePoints = 100 * multiplier * stageBonusFactor;
    const points = Math.max(10, Math.round(basePoints * timeBonus));

    score += points;
    multiplier = Math.min(MAX_MULTIPLIER, multiplier + 1);

    feedbackEl.textContent = "Correct! +" + points;
    feedbackEl.className = "feedback correct";
    playSfx(sfxCorrect);
    questionCard.classList.add("flash-correct");
    showScorePop("+" + points);
  } else {
    if (clickedBtn) clickedBtn.classList.add("wrong");
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

  currentQuestionIndex += 1;

  setTimeout(() => {
    if (lives <= 0) {
      endGame(false);
    } else {
      showQuestion();
    }
  }, 900);
}

function handleTimeout() {
  if (questionResolved) return;
  questionResolved = true;
  stopTimer();

  const buttons = Array.from(answersContainer.querySelectorAll("button"));
  buttons.forEach((b) => {
    b.disabled = true;
    if (b.dataset.correct === "true") b.classList.add("correct");
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

  currentQuestionIndex += 1;

  setTimeout(() => {
    if (lives <= 0) {
      endGame(false);
    } else {
      showQuestion();
    }
  }, 900);
}

// Stage complete & game over
function handleStageComplete() {
  currentQuestionIndex = 0;
  stopTimer();
  questionResolved = true;

  const stage = STAGES[currentStageIndex];
  const isLastStage = currentStageIndex >= STAGES.length - 1;

  if (isLastStage) {
    endGame(true);
    return;
  }

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.remove("hidden");
  completedStageNameEl.textContent = stage.name;
  stageScoreDisplay.textContent = score.toString();
}

function endGame(completedAll) {
  stopTimer();
  questionResolved = true;

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameOverPanel.classList.remove("hidden");

  finalScoreEl.textContent = score.toString();
  const lastStage = STAGES[Math.min(currentStageIndex, STAGES.length - 1)];
  lastStageNameEl.textContent = lastStage ? lastStage.name : "Stage 1";
  gameOverTitle.textContent = completedAll
    ? "Gauntlet Complete!"
    : "Game Over";

  const name = (playerNameInput.value || "Anonymous").trim();
  submitScore(name, completedAll);

  playSfx(sfxGameOver);
  setTimeout(loadLeaderboardFromSheet, 800);
}

function nextStageHandler() {
  stageCompletePanel.classList.add("hidden");
  currentStageIndex += 1;
  currentQuestionIndex = 0;
  questionResolved = false;
  if (currentStageIndex >= STAGES.length) {
    endGame(true);
    return;
  }
  gameSection.classList.remove("hidden");
  loadStageIntro();
  showQuestion();
}

// Score logging
function submitScore(name, completedAll) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name);
    params.append("topic", "IPRGauntlet");
    params.append("score", String(score));
    params.append(
      "questionsPlayed",
      String(
        STAGES.reduce((total, stg, index) => {
          if (index < currentStageIndex) return total + (stg.questions || []).length;
          if (index === currentStageIndex) {
            return total + currentQuestionIndex;
          }
          return total;
        }, 0)
      )
    );
    params.append("completedAll", completedAll ? "yes" : "no");
    params.append("timestamp", new Date().toISOString());

    const img = new Image();
    img.src = GAS_URL + "?" + params.toString();
    console.log("Submitting score to:", img.src);
  } catch (err) {
    console.error("Error creating score beacon:", err);
  }
}

// Leaderboard
function renderLeaderboardFromSheet(response) {
  try {
    const table = response.table;
    const rows = table.rows || [];
    const entries = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].c;
      const name = (r[0] && r[0].v) || "";
      if (!name || name.toLowerCase() === "name") continue;

      const scoreVal = (r[1] && r[1].v) || 0;
      const topicLabel = (r[2] && r[2].v) || "";
      const topicId = (r[3] && r[3].v) || "";
      const timestamp = (r[4] && r[4].v) || "";

      // Topic filter removed so this shows the same global leaderboard as other games
      entries.push({ name, score: scoreVal, topicLabel, topicId, timestamp });
    }

    if (!entries.length) {
      leaderboardContainer.innerHTML =
        "<p class='leaderboard-note'>No scores yet. Complete the gauntlet to be first on the board!</p>";
      return;
    }

    entries.sort((a, b) => b.score - a.score);

    const rowsHtml = entries
      .map((e, i) => {
        const place = i + 1;
        const name = e.name || "Anonymous";
        return `
          <tr>
            <td>${place}</td>
            <td>${name}</td>
            <td>${e.score}</td>
          </tr>`;
      })
      .join("");

    leaderboardContainer.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>`;
  } catch (err) {
    console.error("Error rendering leaderboard:", err);
    leaderboardContainer.innerHTML =
      "<p class='leaderboard-note'>Couldn't load leaderboard. Check sheet sharing or try again.</p>";
  }
}

function loadLeaderboardFromSheet() {
  if (!leaderboardContainer) return;

  leaderboardContainer.innerHTML =
    "<p class='leaderboard-note'>Loading leaderboard...</p>";

  const tq = encodeURIComponent("select A,B,C,D,F order by B desc limit 10");
  const callbackName = "renderLeaderboardFromSheet";
  const url =
    "https://docs.google.com/spreadsheets/d/" +
    SHEET_ID +
    "/gviz/tq?sheet=Sheet1&tq=" +
    tq +
    "&tqx=responseHandler:" +
    callbackName +
    "&_=" +
    Date.now();

  const script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}

// Leaderboard tabs (if present)
function setupLeaderboardTabs() {
  leaderboardTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      leaderboardTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      if (tab === "all") {
        leaderboardTitle.textContent = "IPR Gauntlet – Leaderboard (All Time)";
      } else if (tab === "week") {
        leaderboardTitle.textContent =
          "IPR Gauntlet – This Week (visual only)";
      } else if (tab === "today") {
        leaderboardTitle.textContent =
          "IPR Gauntlet – Today (visual only)";
      }
    });
  });
}

// Restart
function restartHandler() {
  gameOverPanel.classList.add("hidden");
  gameSection.classList.add("hidden");
}

// Init
initSfx();
setupLeaderboardTabs();
loadLeaderboardFromSheet();

startBtn.addEventListener("click", startGameHandler);
nextStageBtn.addEventListener("click", nextStageHandler);
restartBtn.addEventListener("click", restartHandler);
