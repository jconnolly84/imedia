// Health & Safety Gauntlet – Mega Game (rebuild)
// Uses iMedia Genius HUD, timer, multiplier & shared leaderboard.
// This version is tailored to health-safety-megagame.html & health-safety-megagame-data.js.

// -----------------------------------------------------------------------------
// CONFIG
// -----------------------------------------------------------------------------

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

// Stage & question data from health-safety-megagame-data.js
const STAGES = window.HEALTH_SAFETY_STAGES || [];

// -----------------------------------------------------------------------------
// DOM REFERENCES – these MUST match IDs in health-safety-megagame.html
// -----------------------------------------------------------------------------

// Setup
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

// Game HUD / layout
const gameSection = document.getElementById("gameSection");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const answersList = document.getElementById("answersList");
const feedbackEl = document.getElementById("feedback");
const progressLabel = document.getElementById("progressLabel");

const stageLabelEl = document.getElementById("stageLabel");
const stageNameLabelEl = document.getElementById("stageNameLabel");
const scoreDisplay = document.getElementById("scoreDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const stageIntroEl = document.getElementById("stageIntro");

const timerBar = document.getElementById("timerBar");
const scorePopEl = document.getElementById("scorePop");

// Stage complete & game over panels
const stageCompletePanel = document.getElementById("stageCompletePanel");
const completedStageNameEl = document.getElementById("completedStageName");
const stageScoreDisplay = document.getElementById("stageScoreDisplay");
const nextStageBtn = document.getElementById("nextStageBtn");

const gameOverPanel = document.getElementById("gameOverPanel");
const gameOverTitleEl = document.getElementById("gameOverTitle");
const finalScoreEl = document.getElementById("finalScore");
const lastStageNameEl = document.getElementById("lastStageName");
const restartBtn = document.getElementById("restartBtn");

// Leaderboard
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardContainer = document.getElementById("leaderboardContainer");

// Hide leaderboard panel entirely (not used for this game)
if (leaderboardTitle) {
  const leaderboardCard = leaderboardTitle.closest(".card");
  if (leaderboardCard) {
    leaderboardCard.style.display = "none";
  }
}

// -----------------------------------------------------------------------------
// GAME STATE
// -----------------------------------------------------------------------------

let currentStageIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let multiplier = 1;
let lives = 3;

let currentStage = null;
let currentQuestion = null;

let acceptingAnswers = false;

let questionTimerHandle = null;
let timerStartTime = 0;
let timerDuration = 15000; // 15 seconds per question

// SOUND EFFECTS
let sfxCorrect, sfxWrong, sfxStart, sfxGameOver;

// -----------------------------------------------------------------------------
// UTILS
// -----------------------------------------------------------------------------

function getCurrentStage() {
  return STAGES[currentStageIndex] || null;
}

function getCurrentQuestion() {
  const st = getCurrentStage();
  if (!st || !st.questions) return null;
  return st.questions[currentQuestionIndex] || null;
}

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// -----------------------------------------------------------------------------
// SFX
// -----------------------------------------------------------------------------

function initSfx() {
  try {
    sfxCorrect = new Audio("sfx-correct.mp3");
    sfxWrong = new Audio("sfx-wrong.mp3");
    sfxStart = new Audio("sfx-start.mp3");
    sfxGameOver = new Audio("sfx-gameover.mp3");
    [sfxCorrect, sfxWrong, sfxStart, sfxGameOver].forEach((a) => {
      a.preload = "auto";
      a.volume = 0.6;
    });
  } catch (err) {
    console.warn("Unable to init SFX", err);
  }
}

function playSfx(audioEl) {
  try {
    if (audioEl && typeof audioEl.play === "function") {
      audioEl.currentTime = 0;
      audioEl.play();
    }
  } catch (err) {
    console.warn("SFX play error:", err);
  }
}

// -----------------------------------------------------------------------------
// HUD
// -----------------------------------------------------------------------------

function renderLives() {
  const maxLives = 3;
  const hearts = [];
  for (let i = 0; i < maxLives; i++) {
    hearts.push(i < lives ? "♥" : "✖");
  }
  if (livesDisplay) {
    livesDisplay.textContent = hearts.join(" ");
  }
}

function updateHud() {
  currentStage = getCurrentStage();
  currentQuestion = getCurrentQuestion();

  if (!currentStage || !currentQuestion) return;

  if (stageLabelEl) stageLabelEl.textContent = currentStageIndex + 1;
  if (stageNameLabelEl)
    stageNameLabelEl.textContent = currentStage.name || currentStage.title || `Stage ${currentStageIndex + 1}`;
  if (scoreDisplay) scoreDisplay.textContent = score;
  if (multiplierDisplay) multiplierDisplay.textContent = "x" + multiplier;
  if (stageIntroEl) stageIntroEl.textContent = currentStage.intro || "";

  const totalQs = currentStage.questions ? currentStage.questions.length : 0;
  const qNumber = currentQuestionIndex + 1;
  if (progressLabel && totalQs > 0) {
    progressLabel.textContent = `Question ${qNumber} of ${totalQs}`;
  }
  renderLives();
}

function showScorePop(text) {
  if (!scorePopEl) return;
  scorePopEl.textContent = text;
  scorePopEl.classList.remove("hidden", "score-pop-anim");

  // trigger reflow
  void scorePopEl.offsetWidth;
  scorePopEl.classList.add("score-pop-anim");

  setTimeout(() => {
    scorePopEl.classList.add("hidden");
  }, 900);
}

// -----------------------------------------------------------------------------
// TIMER
// -----------------------------------------------------------------------------

function stopQuestionTimer() {
  if (questionTimerHandle) {
    cancelAnimationFrame(questionTimerHandle);
    questionTimerHandle = null;
  }
  if (timerBar) timerBar.classList.remove("timer-active");
}

function startQuestionTimer() {
  if (!timerBar) return;
  stopQuestionTimer();

  timerStartTime = performance.now();
  timerBar.style.width = "100%";
  timerBar.classList.add("timer-active");

  const step = (now) => {
    const elapsed = now - timerStartTime;
    const ratio = Math.max(0, 1 - elapsed / timerDuration);
    timerBar.style.width = ratio * 100 + "%";

    if (elapsed >= timerDuration) {
      stopQuestionTimer();
      handleTimeOut();
      return;
    }

    questionTimerHandle = requestAnimationFrame(step);
  };

  questionTimerHandle = requestAnimationFrame(step);
}

// -----------------------------------------------------------------------------
// GAME FLOW
// -----------------------------------------------------------------------------

function resetGameState() {
  currentStageIndex = 0;
  currentQuestionIndex = 0;
  score = 0;
  multiplier = 1;
  lives = 3;
  currentStage = getCurrentStage();
  currentQuestion = getCurrentQuestion();
  acceptingAnswers = false;

  if (gameSection) gameSection.classList.add("hidden");
  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.add("hidden");
  if (feedbackEl) feedbackEl.textContent = "";
  if (progressLabel) progressLabel.textContent = "";
  renderLives();
  updateHud();
}

function showQuestion() {
  currentStage = getCurrentStage();
  currentQuestion = getCurrentQuestion();

  if (!currentStage || !currentQuestion) {
    console.error("No stage/question data. Check HEALTH_SAFETY_STAGES.");
    return;
  }

  if (gameSection) gameSection.classList.remove("hidden");
  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.add("hidden");

  updateHud();

  // Build answers
  const qText =
    currentQuestion.scenario ||
    currentQuestion.question ||
    currentQuestion.text ||
    "Question";

  if (questionText) questionText.textContent = qText;

  const options = currentQuestion.options || [];
  const correctValue = currentQuestion.answer;

  const answers = shuffleArray(
    options.map((opt) => ({
      text: opt,
      correct: opt === correctValue,
    }))
  );

  if (answersList) {
    answersList.innerHTML = "";
    answers.forEach((ans, index) => {
      const li = document.createElement("li");
      li.className = "answer-option";
      li.textContent = ans.text;
      li.dataset.correct = ans.correct ? "true" : "false";
      li.dataset.index = String(index);
      li.addEventListener("click", onAnswerClick);
      answersList.appendChild(li);
    });
  }

  if (feedbackEl) feedbackEl.textContent = "";
  acceptingAnswers = true;
  startQuestionTimer();
}

function onAnswerClick(e) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;
  stopQuestionTimer();

  const li = e.currentTarget;
  const isCorrect = li.dataset.correct === "true";

  // highlight all correct options
  if (answersList) {
    Array.from(answersList.children).forEach((child) => {
      const correct = child.dataset.correct === "true";
      child.classList.remove("correct", "wrong");
      if (correct) {
        child.classList.add("correct");
      }
    });
  }

  if (isCorrect) {
    li.classList.add("correct");
    handleCorrectAnswer();
  } else {
    li.classList.add("wrong");
    handleWrongAnswer();
  }
}

function handleCorrectAnswer() {
  playSfx(sfxCorrect);

  let timeRatio = 0;
  if (timerBar) {
    const widthPercent = parseFloat(timerBar.style.width || "0");
    timeRatio = widthPercent / 100 || 0;
  }

  const basePoints = 100;
  const timeBonus = Math.round(basePoints * timeRatio);
  const totalGain = basePoints * multiplier + timeBonus;

  score += totalGain;
  multiplier++;

  if (feedbackEl) {
    feedbackEl.textContent =
      "Nice work – you picked the safest option and protected the production!";
  }

  showScorePop("+" + totalGain);
  updateHud();

  setTimeout(() => {
    if (lives > 0) {
      nextQuestionOrStage();
    }
  }, 900);
}

function handleWrongAnswer() {
  playSfx(sfxWrong);
  lives--;
  multiplier = 1;
  renderLives();

  if (feedbackEl) {
    feedbackEl.textContent =
      "That choice leaves people at risk. Think about the main hazard and which control actually reduces it.";
  }

  updateHud();

  if (lives <= 0) {
    setTimeout(() => endGame(false), 900);
  } else {
    setTimeout(() => nextQuestionOrStage(), 1200);
  }
}

function handleTimeOut() {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;
  lives--;
  multiplier = 1;
  renderLives();

  if (feedbackEl) {
    feedbackEl.textContent =
      "Time's up! In the exam you still need to pick something – scan the scenario quickly and focus on the biggest risk.";
  }

  if (lives <= 0) {
    setTimeout(() => endGame(false), 900);
  } else {
    setTimeout(() => nextQuestionOrStage(), 1200);
  }
}

function nextQuestionOrStage() {
  const stage = getCurrentStage();
  if (!stage) {
    endGame(false);
    return;
  }

  currentQuestionIndex++;

  if (!stage.questions || currentQuestionIndex >= stage.questions.length) {
    // finished this stage
    const stageTitle = stage.name || stage.title || `Stage ${currentStageIndex + 1}`;
    if (currentStageIndex >= STAGES.length - 1) {
      // last stage complete
      endGame(true);
      return;
    }

    if (gameSection) gameSection.classList.add("hidden");
    if (stageCompletePanel) stageCompletePanel.classList.remove("hidden");
    if (completedStageNameEl) completedStageNameEl.textContent = stageTitle;
    if (stageScoreDisplay) stageScoreDisplay.textContent = score;
  } else {
    showQuestion();
  }
}

function endGame(completedAllStages) {
  stopQuestionTimer();
  acceptingAnswers = false;

  if (gameSection) gameSection.classList.add("hidden");
  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.remove("hidden");

  const finalStageIndex =
    completedAllStages || currentStageIndex >= STAGES.length
      ? STAGES.length - 1
      : currentStageIndex;

  const lastStage =
    STAGES[finalStageIndex] || STAGES[STAGES.length - 1] || null;

  if (gameOverTitleEl) {
    gameOverTitleEl.textContent = completedAllStages
      ? "Gauntlet Complete!"
      : "Game Over – Watch Those Hazards!";
  }

  if (finalScoreEl) finalScoreEl.textContent = score;
  if (lastStageNameEl) {
    lastStageNameEl.textContent = lastStage
      ? lastStage.name || lastStage.title || `Stage ${finalStageIndex + 1}`
      : `Stage ${finalStageIndex + 1}`;
  }

  // log score
  submitGauntletScore(
    (playerNameInput && playerNameInput.value ? playerNameInput.value : "Anonymous").trim(),
    score,
    completedAllStages
  );

  // refresh leaderboard shortly afterwards
  setTimeout(loadLeaderboardFromSheet, 1000);
}

// -----------------------------------------------------------------------------
// SCORE LOGGING & LEADERBOARD
// -----------------------------------------------------------------------------

function submitGauntletScore(name, scoreValue, completedAll) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name || "Anonymous");
    params.append("topic", "HealthSafetyGauntlet");
    params.append(
      "score",
      typeof scoreValue === "number" ? String(scoreValue) : "0"
    );

    // Rough count of questions attempted
    let questionsPlayed = 0;
    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i];
      if (!stage.questions) continue;
      if (i < currentStageIndex) {
        questionsPlayed += stage.questions.length;
      } else if (i === currentStageIndex) {
        questionsPlayed += currentQuestionIndex;
      }
    }
    params.append("questionsPlayed", String(questionsPlayed));
    params.append("completedAll", completedAll ? "yes" : "no");
    params.append("timestamp", new Date().toISOString());

    const img = new Image();
    img.src = GAS_URL + "?" + params.toString();
  } catch (err) {
    console.error("Error submitting score:", err);
  }
}

function renderLeaderboardFromSheet(response) {
  try {
    const table = response.table;
    const rows = table.rows || [];
    const entries = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].c;
      if (!r || !r.length) continue;

      const name = (r[0] && r[0].v) || "";
      if (!name || name.toLowerCase() === "name") continue;

      const scoreVal = (r[1] && r[1].v) || 0;
      const topicLabel = (r[2] && r[2].v) || "";
      const topicId = (r[3] && r[3].v) || "";
      const timestamp = (r[4] && r[4].v) || "";

      // Filter to Health & Safety Gauntlet rows if the sheet includes multiple games
      if (
        topicLabel &&
        !String(topicLabel).toLowerCase().includes("health") &&
        !String(topicId).toLowerCase().includes("health")
      ) {
        continue;
      }

      entries.push({ name, score: scoreVal, topicLabel, topicId, timestamp });
    }

    if (!entries.length) {
      leaderboardContainer.innerHTML =
        "<p class='leaderboard-note'>No scores yet. Finish the gauntlet to claim the top spot!</p>";
      return;
    }

    entries.sort((a, b) => b.score - a.score);

    const rowsHtml = entries
      .slice(0, 10)
      .map((e, i) => {
        const place = i + 1;
        const playerName = e.name || "Anonymous";
        const topic = e.topicLabel || e.topicId || "All topics";
        return `
          <tr>
            <td>${place}</td>
            <td>${playerName}</td>
            <td>${e.score}</td>
            <td>${topic}</td>
          </tr>`;
      })
      .join("");

    leaderboardContainer.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name (initials)</th>
            <th>Score</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>`;
  } catch (err) {
    console.error("Error rendering leaderboard:", err);
    leaderboardContainer.innerHTML =
      "<p class='leaderboard-note'>Couldn't load leaderboard. Check sheet sharing or try again later.</p>";
  }
}

function loadLeaderboardFromSheet() {
  if (!leaderboardContainer) return;

  leaderboardContainer.innerHTML =
    "<p class='leaderboard-note'>Loading leaderboard...</p>";

  const tq = encodeURIComponent("select A,B,C,D,F order by B desc limit 20");
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

// -----------------------------------------------------------------------------
// EVENT HANDLERS & INIT
// -----------------------------------------------------------------------------

function startGameHandler() {
  if (!STAGES.length) {
    alert(
      "No Health & Safety stages loaded. Check health-safety-megagame-data.js is included before the game script."
    );
    return;
  }

  const name = (playerNameInput && playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your initials so we can log your score.");
    return;
  }
  if (name.length > 3) {
    alert("Please enter up to 3 initials (e.g. ABC).");
    return;
  }

  resetGameState();
  playSfx(sfxStart);
  showQuestion();
}

function nextStageHandler() {
  if (currentStageIndex < STAGES.length - 1) {
    currentStageIndex++;
    currentQuestionIndex = 0;
    if (stageCompletePanel) stageCompletePanel.classList.add("hidden");
    showQuestion();
  } else {
    endGame(true);
  }
}

function restartHandler() {
  if (gameOverPanel) gameOverPanel.classList.add("hidden");
  resetGameState();
  playSfx(sfxStart);
  showQuestion();
}

// -----------------------------------------------------------------------------
// BOOTSTRAP
// -----------------------------------------------------------------------------

(function init() {
  initSfx();
  // loadLeaderboardFromSheet(); // disabled leaderboard

  if (startBtn) startBtn.addEventListener("click", startGameHandler);
  if (nextStageBtn) nextStageBtn.addEventListener("click", nextStageHandler);
  if (restartBtn) restartBtn.addEventListener("click", restartHandler);
})();
