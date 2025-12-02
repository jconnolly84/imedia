// Research Methods Adventure – Mega Game
// Uses the iMedia Genius style HUD, timer, multiplier and leaderboard,
// wired up to the HTML structure in research-methods-megagame.html
// and the stage data in research-methods-megagame-data.js.

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const STAGES = window.RESEARCH_STAGES || [];

// DOM references
const setupCard = document.querySelector(".setup-card");
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

const gameSection = document.getElementById("gameSection");
const stageLabel = document.getElementById("stageLabel");
const stageNameLabel = document.getElementById("stageNameLabel");
const scoreDisplay = document.getElementById("scoreDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const livesDisplay = document.getElementById("livesDisplay");

const timerBar = document.getElementById("timerBar");

const stageIntro = document.getElementById("stageIntro");
const scorePopEl = document.getElementById("scorePop");
const questionTextEl = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackEl = document.getElementById("feedback");
const progressLabel = document.getElementById("progressLabel");

const stageCompletePanel = document.getElementById("stageCompletePanel");
const completedStageName = document.getElementById("completedStageName");
const stageScoreDisplay = document.getElementById("stageScoreDisplay");
const nextStageBtn = document.getElementById("nextStageBtn");

const gameOverPanel = document.getElementById("gameOverPanel");
const gameOverTitle = document.getElementById("gameOverTitle");
const finalScoreEl = document.getElementById("finalScore");
const lastStageNameEl = document.getElementById("lastStageName");
const restartBtn = document.getElementById("restartBtn");

const leaderboardContainer = document.getElementById("leaderboardContainer");

// Game state
let currentStageIndex = 0;
let currentStage = null;
let questionQueue = [];
let currentQuestionIndex = 0;

let score = 0;
let lives = 3;
let multiplier = 1;
let correctStreak = 0;
let answeredQuestions = 0;

// Timer state
let timerDuration = 20000; // 20s per question
let timerStart = 0;
let timerAnimationFrame = null;

// Simple sfx (optional – will just fail quietly if files missing)
const sfxCorrect = new Audio("sfx/correct.mp3");
const sfxWrong = new Audio("sfx/wrong.mp3");
const sfxStage = new Audio("sfx/stage-complete.mp3");

function initSfx() {
  [sfxCorrect, sfxWrong, sfxStage].forEach((audio) => {
    audio.volume = 0.7;
  });
}

// Utility – Fisher–Yates shuffle
function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Convert a raw question object into a generic {prompt, options[]} structure
function buildQuestionForStage(stage, rawQ) {
  const type = stage.type;
  let prompt = "";
  let options = [];

  switch (type) {
    case "primarySecondary": {
      prompt = rawQ.label;
      options = [
        { text: "Primary", correct: rawQ.category === "primary" },
        { text: "Secondary", correct: rawQ.category === "secondary" },
      ];
      break;
    }
    case "methodMatch": {
      prompt = rawQ.description;
      options = rawQ.options.map((opt) => ({
        text: opt,
        correct: opt === rawQ.answer,
      }));
      break;
    }
    case "advDisadv": {
      prompt = `${rawQ.method}: ${rawQ.statement}`;
      options = [
        { text: "Advantage", correct: rawQ.kind === "advantage" },
        { text: "Disadvantage", correct: rawQ.kind === "disadvantage" },
      ];
      break;
    }
    case "quantQual": {
      prompt = rawQ.statement;
      options = [
        { text: "Quantitative (numbers)", correct: rawQ.kind === "quantitative" },
        { text: "Qualitative (descriptive)", correct: rawQ.kind === "qualitative" },
      ];
      break;
    }
    case "reliability": {
      prompt = rawQ.statement;
      options = [
        { text: "Reliable", correct: rawQ.rating === "reliable" },
        { text: "Questionable", correct: rawQ.rating === "questionable" },
        { text: "Unreliable", correct: rawQ.rating === "unreliable" },
      ];
      break;
    }
    case "scenario": {
      prompt = rawQ.scenario;
      options = rawQ.options.map((opt) => ({
        text: opt,
        correct: opt === rawQ.answer,
      }));
      break;
    }
    case "eightMark": {
      prompt = rawQ.question;
      options = rawQ.options.map((opt, idx) => ({
        text: opt,
        correct: idx === rawQ.answer,
      }));
      break;
    }
    default: {
      // Fallback: assume already has {question, options[{text,correct}]}
      prompt = rawQ.question || "Question";
      options = (rawQ.options || []).map((opt) =>
        typeof opt === "string"
          ? { text: opt, correct: false }
          : opt
      );
      break;
    }
  }

  return { prompt, options };
}

// HUD & lives
function updateHUD() {
  stageLabel.textContent = (currentStageIndex + 1).toString();
  stageNameLabel.textContent = currentStage ? currentStage.name : "";
  scoreDisplay.textContent = score.toString();
  multiplierDisplay.textContent = `x${multiplier}`;

  const maxLives = 3;
  const livesIcons = [];
  for (let i = 0; i < maxLives; i++) {
    livesIcons.push(i < lives ? "♥" : "✖");
  }
  livesDisplay.textContent = livesIcons.join(" ");
}

// Timer
function startTimer() {
  stopTimer();
  timerStart = performance.now();
  timerBar.style.width = "100%";
  timerAnimationFrame = requestAnimationFrame(updateTimer);
}

function updateTimer(timestamp) {
  const elapsed = timestamp - timerStart;
  const fraction = Math.max(0, 1 - elapsed / timerDuration);
  timerBar.style.width = `${fraction * 100}%`;

  if (fraction <= 0) {
    // Time's up – treat as incorrect
    handleAnswer(false, true);
    return;
  }

  timerAnimationFrame = requestAnimationFrame(updateTimer);
}

function stopTimer() {
  if (timerAnimationFrame !== null) {
    cancelAnimationFrame(timerAnimationFrame);
    timerAnimationFrame = null;
  }
}

// Score pop animation
function showScorePop(text) {
  if (!scorePopEl) return;
  scorePopEl.textContent = text;
  scorePopEl.classList.remove("hidden");
  scorePopEl.classList.remove("visible");
  void scorePopEl.offsetWidth; // force reflow
  scorePopEl.classList.add("visible");
  setTimeout(() => {
    scorePopEl.classList.remove("visible");
  }, 600);
}

// Game flow
function startGameHandler() {
  const name = (playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your name to begin the adventure.");
    return;
  }

  if (!STAGES.length) {
    alert("No stages loaded – check research-methods-megagame-data.js");
    return;
  }

  score = 0;
  lives = 3;
  multiplier = 1;
  correctStreak = 0;
  answeredQuestions = 0;
  currentStageIndex = 0;

  setupCard.classList.add("hidden");
  gameOverPanel.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameSection.classList.remove("hidden");

  loadStage(currentStageIndex);
}

function loadStage(stageIndex) {
  if (stageIndex >= STAGES.length) {
    // All stages complete
    endGame(true);
    return;
  }

  currentStage = STAGES[stageIndex];
  questionQueue = shuffleArray(currentStage.questions || []);
  currentQuestionIndex = 0;

  stageIntro.textContent = currentStage.intro || "";
  feedbackEl.textContent = "";
  answersContainer.innerHTML = "";
  progressLabel.textContent = "";

  updateHUD();
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  if (!currentStage || currentQuestionIndex >= questionQueue.length) {
    // Stage finished
    handleStageComplete();
    return;
  }

  const rawQ = questionQueue[currentQuestionIndex];
  const { prompt, options } = buildQuestionForStage(currentStage, rawQ);

  questionTextEl.textContent = prompt;
  answersContainer.innerHTML = "";
  feedbackEl.textContent = "";

  const shuffledOptions = shuffleArray(options);

  shuffledOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "btn answer-button";
    btn.textContent = opt.text;
    btn.dataset.correct = opt.correct ? "true" : "false";
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      handleAnswer(isCorrect, false);
    });
    answersContainer.appendChild(btn);
  });

  const totalQuestionsInStage = questionQueue.length;
  progressLabel.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestionsInStage} | Stage ${currentStageIndex + 1} of ${STAGES.length}`;

  startTimer();
}

function handleAnswer(isCorrect, fromTimeout) {
  stopTimer();
  answeredQuestions++;

  const answerButtons = answersContainer.querySelectorAll(".answer-button");
  answerButtons.forEach((b) => (b.disabled = true));

  if (isCorrect) {
    correctStreak++;
    multiplier = Math.min(5, 1 + Math.floor(correctStreak / 2));

    const elapsed = performance.now() - timerStart;
    const fraction = Math.max(0, 1 - elapsed / timerDuration);

    const basePoints = 100;
    const timeBonus = Math.floor(100 * fraction);

    const earned = (basePoints + timeBonus) * multiplier;
    score += earned;

    feedbackEl.textContent = `Correct! +${earned} points (x${multiplier} multiplier)`;
    showScorePop(`+${earned}`);

    try {
      sfxCorrect.currentTime = 0;
      sfxCorrect.play();
    } catch (e) {}
  } else {
    correctStreak = 0;
    multiplier = 1;
    lives--;

    if (fromTimeout) {
      feedbackEl.textContent = "Time's up! You lose a life.";
    } else {
      feedbackEl.textContent = "Incorrect. You lose a life.";
    }

    showScorePop("✖");

    try {
      sfxWrong.currentTime = 0;
      sfxWrong.play();
    } catch (e) {}
  }

  updateHUD();

  if (lives <= 0) {
    setTimeout(() => endGame(false), 800);
  } else {
    currentQuestionIndex++;
    setTimeout(() => {
      renderCurrentQuestion();
    }, 800);
  }
}

function handleStageComplete() {
  // Play stage sound
  try {
    sfxStage.currentTime = 0;
    sfxStage.play();
  } catch (e) {}

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.remove("hidden");

  completedStageName.textContent = currentStage ? currentStage.name : "";
  stageScoreDisplay.textContent = score.toString();
}

function nextStageHandler() {
  stageCompletePanel.classList.add("hidden");
  currentStageIndex++;
  if (currentStageIndex >= STAGES.length) {
    endGame(true);
  } else {
    gameSection.classList.remove("hidden");
    loadStage(currentStageIndex);
  }
}

function endGame(completedAllStages) {
  stopTimer();

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameOverPanel.classList.remove("hidden");

  const playerName = (playerNameInput.value || "Unknown").trim() || "Unknown";

  finalScoreEl.textContent = score.toString();
  lastStageNameEl.textContent = completedAllStages
    ? `Stage ${STAGES.length} – ${STAGES[STAGES.length - 1].name}`
    : `Stage ${currentStageIndex + 1}`;

  if (completedAllStages) {
    gameOverTitle.textContent = "Adventure Complete!";
  } else if (lives <= 0) {
    gameOverTitle.textContent = "Out of Lives!";
  } else {
    gameOverTitle.textContent = "Adventure Over";
  }

  // Submit score and refresh leaderboard
  submitScore(playerName, score);
  setTimeout(loadLeaderboardFromSheet, 1000);
}

function restartHandler() {
  stopTimer();
  gameOverPanel.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameSection.classList.add("hidden");
  setupCard.classList.remove("hidden");

  // Reset HUD / text
  stageLabel.textContent = "1";
  stageNameLabel.textContent = "";
  questionTextEl.innerHTML = 'Press <strong>Start Adventure</strong> to begin.';
  answersContainer.innerHTML = "";
  feedbackEl.textContent = "";
  progressLabel.textContent = "";
  timerBar.style.width = "100%";
  score = 0;
  lives = 3;
  multiplier = 1;
  correctStreak = 0;
  updateHUD();
}

// Leaderboard submission
function submitScore(name, scoreValue) {
  const payload = new URLSearchParams();
  payload.append("name", name);
  payload.append("score", scoreValue.toString());
  payload.append("topic", "ResearchMethodsAdventure");
  payload.append("topicLabel", "Research Methods Mega Game");

  fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  }).catch((err) => {
    console.error("Error submitting score:", err);
  });
}

// Leaderboard rendering – same pattern as the Guess Who game (no topic filter)
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

      entries.push({ name, score: scoreVal, topicLabel, topicId, timestamp });
    }

    if (!entries.length) {
      leaderboardContainer.innerHTML =
        "<p class='leaderboard-note'>No scores yet. Complete the adventure to be first on the board!</p>";
      return;
    }

    entries.sort((a, b) => b.score - a.score);

    const rowsHtml = entries
      .map((e, i) => {
        const place = i + 1;
        const safeName = e.name || "Anonymous";
        return `
          <tr>
            <td>${place}</td>
            <td>${safeName}</td>
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

// Initial wiring
initSfx();
loadLeaderboardFromSheet();

startBtn.addEventListener("click", startGameHandler);
nextStageBtn.addEventListener("click", nextStageHandler);
restartBtn.addEventListener("click", restartHandler);
