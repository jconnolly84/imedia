// Work Plan Detective – Mega Game
// Combined data + engine so there's only one JS file to include.

const WORK_PLAN_STAGES = [
  {
    id: "spotIssue",
    name: "Stage 1 – Spot the Issue",
    intro: "Read each work plan and choose the main problem. Think about order, milestones, contingency and realism.",
    type: "identifyIssue",
    questions: [
      {
        scenario: "The work plan for a short promo video has tasks in this order: Film scenes → Export final video → Plan shots → Edit footage.",
        answer: "Tasks are in the wrong order.",
        options: [
          "Tasks are in the wrong order.",
          "No contingency time has been added.",
          "Too many milestones have been used.",
          "The tasks are all pre-production tasks."
        ]
      },
      {
        scenario: "A work plan includes these tasks: Plan ideas, Write script, Film scenes, Edit footage. There are no milestones at all.",
        answer: "No milestones to check progress against the deadline.",
        options: [
          "No milestones to check progress against the deadline.",
          "Too many overlapping tasks at the same time.",
          "Tasks are not labelled clearly enough.",
          "The work plan uses the wrong file types."
        ]
      },
      {
        scenario: "A client needs a video in 2 weeks. The work plan shows 13 days of tasks and no extra time.",
        answer: "No contingency time to allow for delays or problems.",
        options: [
          "No contingency time to allow for delays or problems.",
          "Too many milestones have been added.",
          "The project finishes too early before the deadline.",
          "The work plan is completely unrelated to the client brief."
        ]
      }
    ]
  },
  {
    id: "fixSequence",
    name: "Stage 2 – Fix the Sequence",
    intro: "Choose the option that puts tasks into the most logical order for a media work plan.",
    type: "reorder",
    questions: [
      {
        scenario: "Which order is the most suitable for creating a magazine advert?",
        answer: "Confirm brief → Research → Sketch ideas → Create digital advert → Get client feedback.",
        options: [
          "Confirm brief → Research → Sketch ideas → Create digital advert → Get client feedback.",
          "Sketch ideas → Create digital advert → Research → Get client feedback → Confirm brief.",
          "Create digital advert → Confirm brief → Get client feedback → Research → Sketch ideas.",
          "Research → Get client feedback → Confirm brief → Sketch ideas → Create digital advert."
        ]
      },
      {
        scenario: "Which order is the most suitable for planning and filming a short documentary?",
        answer: "Confirm brief → Create work plan → Write script → Film footage → Edit footage.",
        options: [
          "Confirm brief → Create work plan → Write script → Film footage → Edit footage.",
          "Write script → Edit footage → Create work plan → Film footage → Confirm brief.",
          "Film footage → Confirm brief → Edit footage → Write script → Create work plan.",
          "Create work plan → Confirm brief → Film footage → Write script → Edit footage."
        ]
      }
    ]
  },
  {
    id: "timeAndContingency",
    name: "Stage 3 – Time & Contingency",
    intro: "Decide which work plan best uses realistic durations and contingency time.",
    type: "timings",
    questions: [
      {
        scenario: "A project has a 4‑week deadline. Which option shows the best use of contingency time?",
        answer: "Plan 3 weeks of tasks and leave 1 week as contingency.",
        options: [
          "Plan 3 weeks of tasks and leave 1 week as contingency.",
          "Plan 4 weeks of tasks with no contingency.",
          "Plan 2 weeks of tasks and ignore the final 2 weeks.",
          "Use the whole 4 weeks as contingency time."
        ]
      },
      {
        scenario: "Which work plan shows realistic timing for a complex animation project?",
        answer: "Allow more time for production and editing, plus a small amount of contingency.",
        options: [
          "Allow more time for production and editing, plus a small amount of contingency.",
          "Use all the time on planning and only one day for production.",
          "Spend equal time on every task without thinking about difficulty.",
          "Leave most of the time as contingency and rush all tasks at the end."
        ]
      }
    ]
  }
];

// Work Plan Detective – Mega Game
// Uses iMedia Genius HUD, timer, multiplier & leaderboard.

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const STAGES = WORK_PLAN_STAGES;

// ---------- DOM REFERENCES ----------

const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const setupCard = document.querySelector(".setup-card");

const gameSection = document.getElementById("gameSection");
const stageLabel = document.getElementById("stageLabel");
const stageNameLabel = document.getElementById("stageNameLabel");
const scoreDisplay = document.getElementById("scoreDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const livesDisplay = document.getElementById("livesDisplay");

const timerBar = document.getElementById("timerBar");
const timerLabel = document.getElementById("timerLabel");

const questionCard = document.getElementById("questionCard");
const stageIntroEl = document.getElementById("stageIntro");
const scorePopEl = document.getElementById("scorePop");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackEl = document.getElementById("feedback");
const progressLabel = document.getElementById("progressLabel");

const stageCompletePanel = document.getElementById("stageCompletePanel");
const completedStageName = document.getElementById("completedStageName");
const stageScoreDisplay = document.getElementById("stageScoreDisplay");
const nextStageBtn = document.getElementById("nextStageBtn");

const gameOverPanel = document.getElementById("gameOverPanel");
const finalScoreEl = document.getElementById("finalScore");
const lastStageNameEl = document.getElementById("lastStageName");
const restartBtn = document.getElementById("restartBtn");

// Leaderboard DOM
const leaderboardTabs = Array.from(document.querySelectorAll(".lb-tab"));
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardContainer = document.getElementById("leaderboardContainer");

// ---------- GAME STATE ----------

let currentStageIndex = 0;
let currentQuestionIndex = 0;
let currentStage = null;
let currentQuestion = null;

let score = 0;
let multiplier = 1;
let lives = 3;

let timerDuration = 15000; // ms per question
let timerStartTime = 0;
let timerHandle = null;

let isGameOver = false;
let completedAllStages = false;

// SOUND EFFECTS
let sfxCorrect, sfxWrong, sfxStart, sfxGameOver;

// ---------- SFX ----------

function initSfx() {
  try {
    sfxCorrect = new Audio("sfx-correct.mp3");
    sfxWrong = new Audio("sfx-wrong.mp3");
    sfxStart = new Audio("sfx-start.mp3");
    sfxGameOver = new Audio("sfx-gameover.mp3");

    [sfxCorrect, sfxWrong, sfxStart, sfxGameOver].forEach((audio) => {
      if (audio && typeof audio.load === "function") {
        audio.load();
      }
    });
  } catch (e) {
    console.warn("SFX could not be initialised:", e);
  }
}

function playSfx(audio) {
  if (!audio || typeof audio.play !== "function") return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ---------- HUD & LIVES ----------

function updateHud() {
  if (scoreDisplay) scoreDisplay.textContent = String(score);
  if (multiplierDisplay) multiplierDisplay.textContent = "x" + multiplier;
  if (stageLabel) stageLabel.textContent = String(currentStageIndex + 1);
  if (stageNameLabel && currentStage) stageNameLabel.textContent = currentStage.name;
}

function renderLives() {
  if (!livesDisplay) return;
  livesDisplay.textContent = String(lives);
}

function showScorePop(text) {
  if (!scorePopEl) return;

  if (!text) {
    scorePopEl.classList.add("hidden");
    return;
  }

  scorePopEl.textContent = text;
  scorePopEl.classList.remove("hidden");
  scorePopEl.classList.remove("animate");
  // Force reflow to restart animation
  void scorePopEl.offsetWidth;
  scorePopEl.classList.add("animate");
}

// ---------- TIMER ----------

function stopTimer() {
  if (timerHandle) {
    cancelAnimationFrame(timerHandle);
    timerHandle = null;
  }
}

function getTimeRemainingRatio() {
  if (!timerStartTime) return 0;
  const elapsed = performance.now() - timerStartTime;
  const ratio = 1 - elapsed / timerDuration;
  return Math.max(0, Math.min(1, ratio));
}

function startTimer() {
  stopTimer();
  if (!timerBar) return;

  timerStartTime = performance.now();
  timerBar.style.width = "100%";

  const startTime = timerStartTime;

  function tick(now) {
    if (isGameOver) return;

    const elapsed = now - startTime;
    const ratio = 1 - elapsed / timerDuration;
    const clamped = Math.max(0, Math.min(1, ratio));

    timerBar.style.width = (clamped * 100).toFixed(1) + "%";

    if (clamped <= 0) {
      timerHandle = null;
      timerLabel.textContent = "Time’s up!";
      handleTimeUp();
    } else {
      timerHandle = requestAnimationFrame(tick);
    }
  }

  timerHandle = requestAnimationFrame(tick);
}

function handleTimeUp() {
  if (isGameOver) return;
  // Treat as a wrong answer but without a specific clicked button
  handleWrongAnswer();
}

// ---------- QUESTION FLOW ----------

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showQuestion() {
  if (!currentStage || !questionText || !answersContainer) return;

  // Guard if we've run out of questions for this stage
  if (
    !currentStage.questions ||
    currentQuestionIndex >= currentStage.questions.length
  ) {
    nextQuestionOrStage();
    return;
  }

  currentQuestion = currentStage.questions[currentQuestionIndex];

  // Stage intro & HUD
  if (stageIntroEl) {
    stageIntroEl.textContent = currentStage.intro || "";
  }

  questionText.textContent =
    currentQuestion.scenario || currentQuestion.text || "Question";

  if (feedbackEl) feedbackEl.textContent = "";
  if (progressLabel) {
    progressLabel.textContent = `Question ${currentQuestionIndex + 1} of ${
      currentStage.questions.length
    }`;
  }

  answersContainer.innerHTML = "";

  const options = shuffleArray(currentQuestion.options || []);

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-option";
    btn.textContent = opt;
    btn.dataset.correct =
      opt === currentQuestion.answer ? "true" : "false";

    btn.addEventListener("click", () => onAnswerClick(btn));

    answersContainer.appendChild(btn);
  });

  if (timerLabel) {
    timerLabel.textContent = "Answer quickly for more points!";
  }

  startTimer();
  updateHud();
  renderLives();
}

function onAnswerClick(btn) {
  if (isGameOver || !currentQuestion) return;

  // Prevent double clicks
  if (btn.classList.contains("answered")) return;

  stopTimer();

  const wasCorrect = btn.dataset.correct === "true";
  const allBtns = Array.from(
    answersContainer.querySelectorAll(".answer-option")
  );

  allBtns.forEach((b) => {
    b.classList.add("answered");
    if (b.dataset.correct === "true") {
      b.classList.add("correct");
    } else if (b === btn && !wasCorrect) {
      b.classList.add("incorrect");
    }
    b.disabled = true;
  });

  if (wasCorrect) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
}

function handleCorrectAnswer() {
  playSfx(sfxCorrect);

  const timeRatio = getTimeRemainingRatio();
  const basePoints = 100;
  const timeBonus = Math.round(basePoints * timeRatio);
  const totalGain = basePoints * multiplier + timeBonus;

  score += totalGain;
  multiplier++;

  updateHud();
  showScorePop("+" + totalGain);

  const explanation =
    currentQuestion.explanation ||
    "Great work – you chose the best option for this work plan.";

  if (feedbackEl) {
    feedbackEl.textContent = "Correct! " + explanation;
  }

  setTimeout(() => {
    if (feedbackEl) feedbackEl.textContent = "";
    showScorePop("");
    nextQuestionOrStage();
  }, 1500);
}

function handleWrongAnswer() {
  playSfx(sfxWrong);

  multiplier = 1;
  lives--;
  updateHud();
  renderLives();

  const explanation =
    currentQuestion && currentQuestion.explanation
      ? currentQuestion.explanation
      : "Remember to think about logical order, milestones and contingency time.";

  if (feedbackEl) {
    feedbackEl.textContent = "Not quite – " + explanation;
  }

  if (lives <= 0) {
    setTimeout(() => {
      endGame(false);
    }, 1200);
  } else {
    setTimeout(() => {
      if (feedbackEl) feedbackEl.textContent = "";
      nextQuestionOrStage();
    }, 1500);
  }
}

function nextQuestionOrStage() {
  if (!currentStage) return;

  currentQuestionIndex++;

  if (
    currentStage.questions &&
    currentQuestionIndex < currentStage.questions.length
  ) {
    showQuestion();
  } else {
    // Stage complete
    if (currentStageIndex < STAGES.length - 1) {
      showStageCompletePanel();
    } else {
      // All stages done
      endGame(true);
    }
  }
}

function showStageCompletePanel() {
  if (!stageCompletePanel || !currentStage) {
    endGame(true);
    return;
  }

  gameSection.classList.add("hidden");
  stageCompletePanel.classList.remove("hidden");

  if (completedStageName) completedStageName.textContent = currentStage.name;
  if (stageScoreDisplay) stageScoreDisplay.textContent = String(score);
}

// ---------- START / STAGE / GAME OVER ----------

function startGame() {
  isGameOver = false;
  completedAllStages = false;

  currentStageIndex = 0;
  currentQuestionIndex = 0;
  currentStage = STAGES[0] || null;
  currentQuestion = currentStage && currentStage.questions
    ? currentStage.questions[0]
    : null;

  score = 0;
  multiplier = 1;
  lives = 3;

  if (setupCard) setupCard.classList.add("hidden");
  if (gameSection) gameSection.classList.remove("hidden");
  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.add("hidden");

  if (stageIntroEl && currentStage) {
    stageIntroEl.textContent = currentStage.intro || "";
  }

  updateHud();
  renderLives();
  showQuestion();
  playSfx(sfxStart);
}

function nextStageHandler() {
  if (currentStageIndex >= STAGES.length - 1) {
    endGame(true);
    return;
  }

  currentStageIndex++;
  currentQuestionIndex = 0;
  currentStage = STAGES[currentStageIndex];
  currentQuestion = currentStage.questions[0];

  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");
  if (gameSection) gameSection.classList.remove("hidden");

  if (stageIntroEl) stageIntroEl.textContent = currentStage.intro || "";

  updateHud();
  showQuestion();
}

function endGame(completedAll) {
  isGameOver = true;
  completedAllStages = completedAll;

  stopTimer();

  if (gameSection) gameSection.classList.add("hidden");
  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");

  if (finalScoreEl) finalScoreEl.textContent = String(score);
  const lastName =
    (currentStage && currentStage.name) ||
    (STAGES[STAGES.length - 1] && STAGES[STAGES.length - 1].name) ||
    "Final Stage";
  if (lastStageNameEl) lastStageNameEl.textContent = lastName;

  if (gameOverPanel) gameOverPanel.classList.remove("hidden");

  playSfx(sfxGameOver);

  // Submit score to shared sheet
  submitGauntletScore(
    (playerNameInput && playerNameInput.value
      ? playerNameInput.value
      : "Anonymous"
    ).trim(),
    score,
    completedAllStages
  );
}

function restartGame() {
  stopTimer();
  isGameOver = false;
  completedAllStages = false;

  currentStageIndex = 0;
  currentQuestionIndex = 0;
  currentStage = null;
  currentQuestion = null;

  score = 0;
  multiplier = 1;
  lives = 3;

  if (gameOverPanel) gameOverPanel.classList.add("hidden");
  if (stageCompletePanel) stageCompletePanel.classList.add("hidden");

  if (gameSection) gameSection.classList.add("hidden");
  if (setupCard) setupCard.classList.remove("hidden");

  if (feedbackEl) feedbackEl.textContent = "";
  if (scorePopEl) {
    scorePopEl.textContent = "";
    scorePopEl.classList.add("hidden");
  }

  updateHud();
  renderLives();
}

// ---------- LEADERBOARD & GOOGLE SHEETS ----------

function submitGauntletScore(name, score, completedAll) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name);
    params.append("topic", "WorkPlanDetective");
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
    params.append("completedAll", completedAll ? "1" : "0");

    fetch(GAS_URL + "?" + params.toString(), { method: "GET", mode: "no-cors" })
      .catch((err) => {
        console.warn("Score submission failed (ignored):", err);
      });
  } catch (err) {
    console.warn("Could not submit score:", err);
  }
}

function loadLeaderboardFromSheet() {
  if (!leaderboardContainer) return;

  const tq =
    "select A,B,C,D,E where A is not null order by B desc limit 20";

  const callbackName = "lbCallback_" + Date.now();

  window[callbackName] = function (data) {
    try {
      if (!data || !data.table) {
        leaderboardContainer.innerHTML =
          "<p class='leaderboard-note'>No leaderboard data available yet.</p>";
        return;
      }

      const rows = data.table.rows || [];
      const entries = [];

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i].c;
        const name = (r[0] && r[0].v) || "";
        if (!name || name.toLowerCase() === "name") continue;

        const scoreVal = (r[1] && r[1].v) || 0;
        const topicLabel = (r[2] && r[2].v) || "";
        const topicId = (r[3] && r[3].v) || "";
        const timestamp = (r[4] && r[4].v) || "";

        // No topic filtering – show the shared iMedia Genius leaderboard
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
          const topic = e.topicLabel || e.topicId || "All Topics";
          return `
          <tr>
            <td>${place}</td>
            <td>${name}</td>
            <td>${e.score}</td>
            <td>${topic}</td>
          </tr>`;
        })
        .join("");

      leaderboardContainer.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Place</th>
            <th>Player</th>
            <th>Score</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>`;
    } finally {
      // Clean up callback
      try {
        delete window[callbackName];
      } catch (e) {
        window[callbackName] = undefined;
      }
    }
  };

  const url =
    "https://docs.google.com/spreadsheets/d/" +
    SHEET_ID +
    "/gviz/tq?sheet=Scores&range=A:E&tq=" +
    encodeURIComponent(tq) +
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
  leaderboardTabs.forEach((btn) =>
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";

      leaderboardTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (filter === "all") {
        leaderboardTitle.textContent = "Work Plan Detective – Leaderboard";
      } else if (filter === "gauntlet") {
        leaderboardTitle.textContent = "Work Plan Detective – Top Runs";
      }

      loadLeaderboardFromSheet();
    })
  );
}

// ---------- EVENT HANDLERS & INIT ----------

function startGameHandler() {
  const name = (playerNameInput && playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your name before starting so we can add you to the leaderboard.");
    if (playerNameInput) playerNameInput.focus();
    return;
  }
  startGame();
}

function restartHandler() {
  restartGame();
}

// Init
initSfx();
setupLeaderboardTabs();
loadLeaderboardFromSheet();

if (startBtn) startBtn.addEventListener("click", startGameHandler);
if (nextStageBtn) nextStageBtn.addEventListener("click", nextStageHandler);
if (restartBtn) restartBtn.addEventListener("click", restartHandler);
