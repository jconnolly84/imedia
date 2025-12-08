// Health & Safety Gauntlet – Mega Game
// Uses iMedia Genius HUD, timer, multiplier & leaderboard.

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const STAGES = window.HEALTH_SAFETY_STAGES || [];

// DOM references
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

const gameSection = document.getElementById("gameSection");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const answersList = document.getElementById("answersList");
const stageTitleEl = document.getElementById("stageTitle");
const stageIntroEl = document.getElementById("stageIntro");

const hudScore = document.getElementById("hudScore");
const hudMultiplier = document.getElementById("hudMultiplier");
const hudQuestion = document.getElementById("hudQuestion");
const hudStage = document.getElementById("hudStage");
const livesDisplay = document.getElementById("livesDisplay");

const timerBar = document.getElementById("timerBar");
const scorePopEl = document.getElementById("scorePop");

const feedbackPanel = document.getElementById("feedbackPanel");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackBody = document.getElementById("feedbackBody");
const feedbackNextBtn = document.getElementById("feedbackNextBtn");

const gameOverPanel = document.getElementById("gameOverPanel");
const finalScoreEl = document.getElementById("finalScore");
const finalGradeEl = document.getElementById("finalGrade");
const finalCommentEl = document.getElementById("finalComment");
const finalSummaryEl = document.getElementById("finalSummary");
const restartBtn = document.getElementById("restartBtn");

const nextStageBtn = document.getElementById("nextStageBtn");

// Leaderboard DOM
const leaderboardTabs = Array.from(document.querySelectorAll(".lb-tab"));
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardContainer = document.getElementById("leaderboardContainer");

// GAME STATE
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

// GAME LOGIC
function resetGameState() {
  currentStageIndex = 0;
  currentQuestionIndex = 0;
  score = 0;
  multiplier = 1;
  lives = 3;

  currentStage = STAGES[0] || null;
  currentQuestion = currentStage ? currentStage.questions[0] : null;

  updateHud();
  renderLives();
}

function updateHud() {
  hudScore.textContent = score;
  hudMultiplier.textContent = "x" + multiplier;
  hudQuestion.textContent = currentQuestionIndex + 1;
  hudStage.textContent = currentStageIndex + 1;
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
  scorePopEl.classList.remove("hidden");
  scorePopEl.classList.remove("score-pop-anim");

  void scorePopEl.offsetWidth; // trigger reflow
  scorePopEl.classList.add("score-pop-anim");

  setTimeout(() => {
    scorePopEl.classList.add("hidden");
  }, 800);
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

function stopQuestionTimer() {
  if (questionTimerHandle) {
    cancelAnimationFrame(questionTimerHandle);
    questionTimerHandle = null;
  }
  if (timerBar) {
    timerBar.classList.remove("timer-active");
  }
}

function handleTimeOut() {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;

  lives--;
  multiplier = 1;
  renderLives();
  updateHud();

  showFeedback(
    "Time's up!",
    "You ran out of time on this question. Remember to scan the key details quickly before you commit to an answer.",
    false
  );

  if (lives <= 0) {
    endGame();
  }
}

function showQuestion() {
  if (!currentStage) {
    console.error("No stage loaded!");
    return;
  }

  const questions = currentStage.questions || [];
  if (!questions.length) {
    console.error("Stage has no questions:", currentStage);
    return;
  }

  currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    console.error("No question at index", currentQuestionIndex);
    return;
  }

  stageTitleEl.textContent = currentStage.title || "Stage";
  stageIntroEl.textContent = currentStage.intro || "";

  questionText.textContent = currentQuestion.text || "Question";

  // Create a fresh copy of answers and shuffle so the correct option
  // isn't always in the same position.
  const answers = (currentQuestion.answers || []).slice();
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  answersList.innerHTML = "";

  answers.forEach((ans, index) => {
    const li = document.createElement("li");
    li.className = "answer-option";
    li.textContent = ans.text;

    li.dataset.correct = ans.correct ? "true" : "false";
    li.dataset.index = index;

    li.addEventListener("click", onAnswerClick);
    answersList.appendChild(li);
  });

  acceptingAnswers = true;
  startQuestionTimer();
}

function onAnswerClick(e) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;
  stopQuestionTimer();

  const li = e.currentTarget;
  const isCorrect = li.dataset.correct === "true";

  Array.from(answersList.children).forEach((child) => {
    child.classList.remove("correct", "wrong");
    if (child.dataset.correct === "true") {
      child.classList.add("correct");
    }
  });

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

  const timeRemainingRatio = parseFloat(timerBar.style.width) / 100 || 0;
  const basePoints = 100;
  const timeBonus = Math.round(basePoints * timeRemainingRatio);

  const totalGain = basePoints * multiplier + timeBonus;
  score += totalGain;
  multiplier++;
  updateHud();

  showScorePop("+" + totalGain);
  showFeedback(
    "Correct!",
    `Nice work – you spotted the safest option. You earned a base ${
      100 * multiplier
    } points plus a time bonus.`,
    true
  );
}

function handleWrongAnswer() {
  playSfx(sfxWrong);

  lives--;
  multiplier = 1;
  renderLives();
  updateHud();

  let explanation = currentQuestion.explanation || "";
  if (!explanation) {
    explanation =
      "Review the hazard, risk and control measure carefully. Ask yourself: what could go wrong here, and which answer actually controls the risk?";
  }

  showFeedback(
    "Not quite...",
    explanation,
    false
  );

  if (lives <= 0) {
    endGame();
  }
}

function showFeedback(title, body, wasCorrect) {
  feedbackTitle.textContent = title;
  feedbackBody.textContent = body;

  feedbackPanel.classList.remove("hidden");
  questionCard.classList.add("hidden");
}

function hideFeedback() {
  feedbackPanel.classList.add("hidden");
  questionCard.classList.remove("hidden");
}

function nextQuestionOrStage() {
  const questions = currentStage.questions || [];
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    currentQuestionIndex = 0;
    currentStageIndex++;

    if (currentStageIndex >= STAGES.length) {
      endGame(true);
      return;
    }

    currentStage = STAGES[currentStageIndex];
    showStageIntro();
  } else {
    updateHud();
    showQuestion();
  }
}

function showStageIntro() {
  questionCard.classList.add("hidden");
  feedbackPanel.classList.add("hidden");
  gameSection.classList.remove("hidden");

  stageTitleEl.textContent = currentStage.title || "Stage";
  stageIntroEl.textContent = currentStage.intro || "";

  nextStageBtn.classList.remove("hidden");
}

function hideStageIntro() {
  nextStageBtn.classList.add("hidden");
  showQuestion();
}

function endGame(completedAllStages = false) {
  stopQuestionTimer();

  gameSection.classList.add("hidden");
  feedbackPanel.classList.add("hidden");
  questionCard.classList.add("hidden");

  finalScoreEl.textContent = score;

  let grade = "Pass";
  let comment =
    "You’ve made a solid start revising health & safety. Tighten up your understanding of hazards, risks and control measures to boost your score next time.";
  let summary =
    "You completed some of the stages, but there’s still more practice needed to become the safest production manager in iMedia.";

  if (score >= 7000) {
    grade = "Distinction*";
    comment =
      "Outstanding! You show a thorough understanding of hazards, risk levels, control measures and paperwork. You’re ready to keep your cast and crew safe.";
    summary =
      "You answered most questions accurately, even under time pressure, and sustained a strong multiplier. This mirrors the depth expected in top-band exam responses.";
  } else if (score >= 5000) {
    grade = "Distinction";
    comment =
      "Great work. You’ve got a strong, secure understanding of safe working practices. A little more precision on paperwork and high-risk scenarios will push you even higher.";
    summary =
      "You maintained a good multiplier and rarely ran out of lives, which shows consistent decision-making.";
  } else if (score >= 3000) {
    grade = "Merit";
    comment =
      "A good attempt. You recognise many common hazards, but need more practice matching the *best* control measure to each scenario.";
    summary =
      "Focus your revision on the trickier comparisons where more than one answer sounds safe – what makes the *best* control?";
  } else {
    grade = "Pass – Keep Practising";
    comment =
      "You’ve begun to explore health & safety, but you need more practice to apply the ideas under pressure.";
    summary =
      "Revisit your notes on hazards, risks, control measures and paperwork. Use this game again to track your progress over time.";
  }

  finalGradeEl.textContent = grade;
  finalCommentEl.textContent = comment;
  finalSummaryEl.textContent = summary;

  gameOverPanel.classList.remove("hidden");

  // Submit score to shared sheet
  submitGauntletScore(
    (playerNameInput.value || "Anonymous").trim(),
    score,
    completedAllStages
  );

  setTimeout(loadLeaderboardFromSheet, 1000);
}

// SCORE LOGGING FOR GAUNTLET
function submitGauntletScore(name, score, completedAll) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name);
    params.append("topic", "HealthSafetyGauntlet");
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

// Leaderboard tabs (if present)
function setupLeaderboardTabs() {
  leaderboardTabs.forEach((btn) =>
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";

      leaderboardTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (filter === "all") {
        leaderboardTitle.textContent = "Health & Safety Gauntlet – Leaderboard";
      } else if (filter === "gauntlet") {
        leaderboardTitle.textContent = "Health & Safety Gauntlet – Top Runs";
      }

      loadLeaderboardFromSheet();
    })
  );
}

// START / RESTART HANDLERS
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
  gameOverPanel.classList.add("hidden");
  gameSection.classList.remove("hidden");

  playSfx(sfxStart);
  showStageIntro();
}

function nextStageHandler() {
  hideStageIntro();
}

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
