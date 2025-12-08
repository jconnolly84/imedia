// Health & Safety Gauntlet – Mega Game (simplified, HTML-aligned)
// Uses iMedia Genius HUD, timer, multiplier, lives & shared leaderboard.

// -----------------------------------------------------------------------------
// CONFIG & DATA ADAPTER
// -----------------------------------------------------------------------------

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

// Raw stages from data file
const RAW_STAGES = window.HEALTH_SAFETY_STAGES || [];

/**
 * Normalise the stage/question structure coming from
 * health-safety-megagame-data.js into a format the engine can use.
 *
 * Each question becomes:
 *  {
 *    text: "Question text",
 *    answers: [{ text: "Option", correct: true/false }],
 *    explanation: string (optional)
 *  }
 */
function normaliseStages(rawStages) {
  return (rawStages || []).map((stage, stageIndex) => {
    const title = stage.name || stage.title || `Stage ${stageIndex + 1}`;
    const intro = stage.intro || "";

    const questions = (stage.questions || []).map((q) => {
      const text = q.scenario || q.question || "";
      const options = q.options || [];
      const correct = q.answer;

      const answers = options.map((opt, idx) => {
        let isCorrect = false;
        if (typeof correct === "string") {
          isCorrect = opt === correct;
        } else if (typeof correct === "number") {
          isCorrect = idx === correct;
        }
        return { text: opt, correct: isCorrect };
      });

      return {
        text: text || "Question",
        answers,
        explanation: q.explanation || "",
      };
    });

    return { title, intro, questions };
  });
}

const STAGES = normaliseStages(RAW_STAGES);

// -----------------------------------------------------------------------------
// DOM REFERENCES – must match health-safety-megagame.html
// -----------------------------------------------------------------------------

// Setup
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

// Game HUD / layout
const gameSection = document.getElementById("gameSection");
const stageLabelEl = document.getElementById("stageLabel");
const stageNameLabelEl = document.getElementById("stageNameLabel");
const scoreDisplay = document.getElementById("scoreDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const timerBar = document.getElementById("timerBar");

const questionCard = document.getElementById("questionCard");
const stageIntroEl = document.getElementById("stageIntro");
const scorePopEl = document.getElementById("scorePop");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackEl = document.getElementById("feedback");
const progressLabel = document.getElementById("progressLabel");

// Stage complete + game over panels
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

// -----------------------------------------------------------------------------
// GAME STATE
// -----------------------------------------------------------------------------

let currentStageIndex = 0;
let currentQuestionIndex = 0;

let score = 0;
let multiplier = 1;
let lives = 3;

let acceptingAnswers = false;

let timerStartTime = 0;
let timerDuration = 15000; // 15 seconds per question
let timerHandle = null;

// SFX
let sfxCorrect, sfxWrong, sfxStart, sfxGameOver;

// -----------------------------------------------------------------------------
// SOUND EFFECTS
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
// HELPERS
// -----------------------------------------------------------------------------

function getCurrentStage() {
  return STAGES[currentStageIndex] || null;
}

function getCurrentQuestion() {
  const stage = getCurrentStage();
  if (!stage) return null;
  return stage.questions[currentQuestionIndex] || null;
}

function renderLives() {
  const maxLives = 3;
  const hearts = [];
  for (let i = 0; i < maxLives; i++) {
    hearts.push(i < lives ? "♥" : "✖");
  }
  livesDisplay.textContent = hearts.join(" ");
}

function updateHud() {
  const stage = getCurrentStage();
  const totalStages = STAGES.length;

  stageLabelEl.textContent = `${currentStageIndex + 1}/${totalStages}`;
  stageNameLabelEl.textContent = stage ? stage.title : "Stage";
  scoreDisplay.textContent = score;
  multiplierDisplay.textContent = "x" + multiplier;

  const q = getCurrentQuestion();
  const totalQs = stage ? stage.questions.length : 0;
  const currentNum = q ? currentQuestionIndex + 1 : 0;
  if (totalQs > 0) {
    progressLabel.textContent = `Question ${currentNum} of ${totalQs}`;
  } else {
    progressLabel.textContent = "";
  }
}

function showScorePop(text) {
  if (!scorePopEl) return;
  scorePopEl.textContent = text;
  scorePopEl.classList.remove("hidden");
  scorePopEl.classList.remove("score-pop-anim");

  // trigger reflow
  void scorePopEl.offsetWidth;
  scorePopEl.classList.add("score-pop-anim");

  setTimeout(() => {
    scorePopEl.classList.add("hidden");
  }, 800);
}

// -----------------------------------------------------------------------------
// TIMER
// -----------------------------------------------------------------------------

function stopQuestionTimer() {
  if (timerHandle) {
    cancelAnimationFrame(timerHandle);
    timerHandle = null;
  }
  if (timerBar) {
    timerBar.style.width = "0%";
    timerBar.classList.remove("timer-active");
  }
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

    timerHandle = requestAnimationFrame(step);
  };

  timerHandle = requestAnimationFrame(step);
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
  acceptingAnswers = false;
  stopQuestionTimer();

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameOverPanel.classList.add("hidden");
  feedbackEl.textContent = "";
  renderLives();
  updateHud();
}

function showQuestion() {
  const stage = getCurrentStage();
  const question = getCurrentQuestion();

  if (!stage || !question) {
    console.error("No stage/question data – check data file.");
    endGame(false);
    return;
  }

  gameSection.classList.remove("hidden");
  stageCompletePanel.classList.add("hidden");
  gameOverPanel.classList.add("hidden");

  stageIntroEl.textContent = stage.intro || "";
  questionText.textContent = question.text || "Question";

  // Render answers
  answersContainer.innerHTML = "";
  feedbackEl.textContent = "";
  const answers = question.answers || [];

  answers.forEach((ans, idx) => {
    const btn = document.createElement("button");
    btn.className = "answer-option";
    btn.textContent = ans.text;
    btn.dataset.index = String(idx);
    btn.dataset.correct = ans.correct ? "true" : "false";

    btn.addEventListener("click", onAnswerClick);
    answersContainer.appendChild(btn);
  });

  acceptingAnswers = true;
  updateHud();
  startQuestionTimer();
}

function onAnswerClick(e) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;
  stopQuestionTimer();

  const target = e.currentTarget;
  const isCorrect = target.dataset.correct === "true";
  const question = getCurrentQuestion();

  // Highlight answers
  Array.from(answersContainer.children).forEach((btn) => {
    const buttonIsCorrect = btn.dataset.correct === "true";
    btn.classList.remove("correct", "wrong");
    if (buttonIsCorrect) {
      btn.classList.add("correct");
    }
  });

  if (isCorrect) {
    target.classList.add("correct");
    handleCorrectAnswer();
  } else {
    target.classList.add("wrong");
    handleWrongAnswer(question);
  }
}

function handleCorrectAnswer() {
  playSfx(sfxCorrect);

  const widthPercent = parseFloat(timerBar.style.width || "0");
  const timeRatio = widthPercent / 100 || 0;
  const basePoints = 100;
  const timeBonus = Math.round(basePoints * timeRatio);

  const totalGain = basePoints * multiplier + timeBonus;
  score += totalGain;
  multiplier++;

  feedbackEl.textContent = "Nice work – you picked the safest option.";
  showScorePop("+" + totalGain);
  updateHud();

  setTimeout(() => {
    if (lives > 0) {
      nextQuestionOrStage();
    }
  }, 900);
}

function handleWrongAnswer(question) {
  playSfx(sfxWrong);

  lives--;
  multiplier = 1;
  renderLives();
  updateHud();

  let explanation =
    (question && question.explanation) ||
    "Review the hazard, risk and control measure carefully. Ask yourself: what could go wrong here, and which answer actually controls the risk?";

  feedbackEl.textContent = explanation;

  if (lives <= 0) {
    setTimeout(() => endGame(false), 800);
  } else {
    setTimeout(() => {
      nextQuestionOrStage();
    }, 1200);
  }
}

function handleTimeOut() {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;

  lives--;
  multiplier = 1;
  renderLives();
  updateHud();

  feedbackEl.textContent =
    "Time's up! Scan the key details quickly next time so you can choose the safest control measure.";
  if (lives <= 0) {
    setTimeout(() => endGame(false), 800);
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

  if (currentQuestionIndex >= stage.questions.length) {
    // Stage finished
    const lastStageTitle = stage.title || `Stage ${currentStageIndex + 1}`;

    if (currentStageIndex >= STAGES.length - 1) {
      // All stages complete
      endGame(true);
      return;
    }

    // Show stage complete panel
    completedStageNameEl.textContent = lastStageTitle;
    stageScoreDisplay.textContent = score;
    stageCompletePanel.classList.remove("hidden");
    gameSection.classList.add("hidden");
  } else {
    showQuestion();
  }
}

function endGame(completedAllStages) {
  stopQuestionTimer();
  acceptingAnswers = false;

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.add("hidden");
  gameOverPanel.classList.remove("hidden");

  const finalStageIdx =
    completedAllStages || currentStageIndex >= STAGES.length
      ? STAGES.length - 1
      : currentStageIndex;

  const lastStage =
    STAGES[finalStageIdx] || STAGES[STAGES.length - 1] || null;

  gameOverTitleEl.textContent = completedAllStages
    ? "Gauntlet Complete!"
    : "Game Over";
  finalScoreEl.textContent = score;
  lastStageNameEl.textContent = lastStage
    ? lastStage.title
    : `Stage ${finalStageIdx + 1}`;

  // Log score to sheet
  submitGauntletScore(
    (playerNameInput.value || "Anonymous").trim(),
    score,
    completedAllStages
  );

  // Refresh leaderboard shortly afterwards
  setTimeout(loadLeaderboardFromSheet, 1000);
}

// -----------------------------------------------------------------------------
// SCORE LOGGING / LEADERBOARD
// -----------------------------------------------------------------------------

function submitGauntletScore(name, scoreValue, completedAll) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name);
    params.append("topic", "HealthSafetyGauntlet");
    params.append(
      "score",
      typeof scoreValue === "number" ? String(scoreValue) : "0"
    );

    // Questions played so far
    const questionsPlayed = STAGES.reduce((total, stage, index) => {
      if (index < currentStageIndex) {
        return total + (stage.questions || []).length;
      }
      if (index === currentStageIndex) {
        return total + currentQuestionIndex;
      }
      return total;
    }, 0);

    params.append("questionsPlayed", String(questionsPlayed));
    params.append("completedAll", completedAll ? "yes" : "no");
    params.append("timestamp", new Date().toISOString());

    const img = new Image();
    img.src = GAS_URL + "?" + params.toString();
    // Fire-and-forget
  } catch (err) {
    console.error("Error creating score beacon:", err);
  }
}

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
        "<p class='leaderboard-note'>No scores yet. Complete the gauntlet to be first on the board!</p>";
      return;
    }

    entries.sort((a, b) => b.score - a.score);

    const rowsHtml = entries
      .map((e, i) => {
        const place = i + 1;
        const playerName = e.name || "Anonymous";
        const topic = e.topicLabel || e.topicId || "All Topics";
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
            <th>Name</th>
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
      "<p class='leaderboard-note'>Couldn't load leaderboard. Check sheet sharing or try again.</p>";
  }
}

function loadLeaderboardFromSheet() {
  leaderboardContainer.innerHTML =
    "<p class='leaderboard-note'>Loading leaderboard...</p>";

  const tq = encodeURIComponent(
    "select A,B,C,D,F order by B desc limit 10"
  ); // A=name, B=score, C=topicLabel, D=topicId, F=timestamp

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
  const name = (playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your initials so we can log your score!");
    return;
  }

  if (!STAGES.length) {
    alert(
      "No game data loaded. Check that health-safety-megagame-data.js is included."
    );
    return;
  }

  resetGameState();
  playSfx(sfxStart);
  showQuestion();
}

function nextStageHandler() {
  // Move to next stage after "Stage Complete"
  if (currentStageIndex < STAGES.length - 1) {
    currentStageIndex++;
    currentQuestionIndex = 0;
    stageCompletePanel.classList.add("hidden");
    showQuestion();
  } else {
    endGame(true);
  }
}

function restartHandler() {
  // Restart game using existing initials
  resetGameState();
  playSfx(sfxStart);
  showQuestion();
}

// Init once DOM is ready (script is at end of body so this is safe)
initSfx();
loadLeaderboardFromSheet();

if (startBtn) {
  startBtn.addEventListener("click", startGameHandler);
}
if (nextStageBtn) {
  nextStageBtn.addEventListener("click", nextStageHandler);
}
if (restartBtn) {
  restartBtn.addEventListener("click", restartHandler);
}
