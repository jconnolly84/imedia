// Client Brief Builder – arcade edition
// Standalone game reusing the iMedia Genius arcade patterns,
// locked to a single topic: Client Briefs (R093 Topics 11 & 12).

// === CONFIG ===
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "clientBriefs";

// === QUESTION BANK (20 QUESTIONS) ===
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "11 & 12 – Client Briefs",
    questions: [
      {
        q: "A client sends a detailed written document with budget, deadlines and deliverables clearly listed. What type of brief is this?",
        options: ["Formal brief", "Informal brief", "Negotiated brief", "Co-operative brief"],
        answerIndex: 0,
        explanation:
          "A formal brief is a structured written document that clearly sets out expectations, deliverables and timescales."
      },
      {
        q: "A producer and a client go back and forth in meetings until they agree on realistic goals and deadlines. What type of brief is this?",
        options: ["Commissioned brief", "Informal brief", "Negotiated brief", "Tendered brief"],
        answerIndex: 2,
        explanation:
          "A negotiated brief is developed through discussion until both sides agree on what is realistic."
      },
      {
        q: "Two companies work together from the start to define the aims of a joint campaign. They co-create the brief. What is this called?",
        options: ["Tendered brief", "Co-operative brief", "Formal brief", "Contractual brief"],
        answerIndex: 1,
        explanation:
          "In a co-operative brief, both parties collaborate to create the brief together."
      },
      {
        q: "An advertising agency sends a pitch document to win a project. Several agencies are competing for the same job. What type of brief is this?",
        options: ["Tendered brief", "Commissioned brief", "Informal brief", "Negotiated brief"],
        answerIndex: 0,
        explanation:
          "A tendered brief is issued to multiple providers who submit pitches or tenders to win the work."
      },
      {
        q: "A TV channel hires a trusted production company and simply tells them the outcome they want. The production company writes the full brief. What type of brief is this?",
        options: ["Tendered brief", "Commissioned brief", "Formal brief", "Co-operative brief"],
        answerIndex: 1,
        explanation:
          "In a commissioned brief, the production company is hired to develop and deliver the project."
      },
      {
        q: "A quick chat in a corridor where the client says, “We need a short promo for social media next week.” What type of brief is this MOST likely to be?",
        options: ["Formal brief", "Informal brief", "Tendered brief", "Contractual brief"],
        answerIndex: 1,
        explanation:
          "An informal brief often happens verbally or quickly, without a detailed written document."
      },
      {
        q: "Which of the following is the BEST example of a requirement in a client brief?",
        options: [
          "The budget is limited to £1,000.",
          "The video must be exactly 60 seconds long and in portrait format.",
          "Filming cannot happen during exams.",
          "We must follow copyright law when using music."
        ],
        answerIndex: 1,
        explanation:
          "A requirement describes what the final product must include or be like, such as length and format."
      },
      {
        q: "Which of the following is the BEST example of a constraint in a client brief?",
        options: [
          "The podcast must be suitable for 13–16 year olds.",
          "The video must include the school logo.",
          "The advert must be finished by 1 July because the campaign starts then.",
          "The client wants the tone to be friendly and inspiring."
        ],
        answerIndex: 2,
        explanation:
          "Deadlines, budget and legal limits are constraints because they restrict what can be done."
      },
      {
        q: "A brief states: “The app must support both Android and iOS devices.” This is mainly a…",
        options: ["Requirement", "Constraint", "Risk", "Milestone"],
        answerIndex: 0,
        explanation:
          "This is a requirement about what the final product must be able to do (platform support)."
      },
      {
        q: "A brief states: “The maximum budget is £5,000 and no overtime can be paid.” This is mainly a…",
        options: ["Requirement", "Constraint", "Risk", "Target audience"],
        answerIndex: 1,
        explanation:
          "Budget limits are constraints because they restrict how the project can be delivered."
      },
      {
        q: "“The project must follow GDPR when collecting user data.” In a client brief, this is best described as a…",
        options: ["Requirement", "Constraint linked to legal issues", "Milestone", "Risk assessment"],
        answerIndex: 1,
        explanation:
          "Legal requirements like GDPR act as constraints because they limit how data can be collected and stored."
      },
      {
        q: "Which of these is MOST likely to be included in the requirements section of a brief?",
        options: [
          "List of health and safety laws",
          "Number of social media posts and platforms to use",
          "The client’s company registration number",
          "The wages for each team member"
        ],
        answerIndex: 1,
        explanation:
          "Requirements describe what content will be produced (e.g. number of posts and which platforms)."
      },
      {
        q: "Which statement BEST describes the purpose of a client brief?",
        options: [
          "To confuse the production team",
          "To outline the aims, target audience, content and constraints of the project",
          "To list every single camera shot that must be used",
          "To replace all contracts and legal documents"
        ],
        answerIndex: 1,
        explanation:
          "A brief sets out the main aims, audience, content ideas and any limits so everyone understands the project."
      },
      {
        q: "A brief says: “We must have the first draft ready 2 weeks before launch for feedback.” This is mainly a…",
        options: ["Requirement", "Constraint (schedule)", "Risk", "Health and safety rule"],
        answerIndex: 1,
        explanation:
          "Schedule details and deadlines are constraints that affect how the team plan their work."
      },
      {
        q: "After reading a brief, the production team creates their own document showing how they will meet the requirements. What is this document usually called?",
        options: ["Risk assessment", "Pitch or proposal", "Storyboard", "Asset log"],
        answerIndex: 1,
        explanation:
          "A pitch or proposal explains to the client how the production team will meet the brief."
      },
      {
        q: "Why is it important to identify constraints early when responding to a client brief?",
        options: [
          "So the team can ignore them later",
          "So the team can plan around time, budget and legal limits and avoid problems",
          "So the client cannot change their mind",
          "So there is no need for a schedule"
        ],
        answerIndex: 1,
        explanation:
          "Knowing the limits helps the team plan realistic solutions and avoid breaking the budget or the law."
      },
      {
        q: "Which option shows a requirement and a matching constraint?",
        options: [
          "Requirement: include a jingle. Constraint: the jingle must be catchy.",
          "Requirement: 3 posters for bus stops. Constraint: council rules on poster sizes.",
          "Requirement: use bright colours. Constraint: use a high‑quality printer.",
          "Requirement: make it funny. Constraint: make actors laugh."
        ],
        answerIndex: 1,
        explanation:
          "The requirement is what is being made (3 posters); the constraint is an external limit (council size rules)."
      },
      {
        q: "A brief says: “All filming must take place inside the school site.” This is mainly a…",
        options: ["Requirement", "Constraint (location)", "Milestone", "Target audience detail"],
        answerIndex: 1,
        explanation:
          "Limiting filming to one location is a constraint, as it restricts where footage can be captured."
      },
      {
        q: "A client writes an email saying, “Can we also create a shorter cut-down version for social media?” What should the production team do FIRST?",
        options: [
          "Ignore the request as it is informal",
          "Treat it as a new legal contract",
          "Clarify and update the brief so requirements are agreed",
          "Cancel the project"
        ],
        answerIndex: 2,
        explanation:
          "Any change to requirements should be clarified and added to the brief so everyone understands the new expectations."
      },
      {
        q: "Which statement BEST explains the difference between requirements and constraints in a brief?",
        options: [
          "Requirements are what the product must do; constraints are limits such as time, budget and law.",
          "Requirements are optional; constraints are optional too.",
          "Requirements are about target audience; constraints are about mood.",
          "There is no difference – they mean the same thing."
        ],
        answerIndex: 0,
        explanation:
          "Requirements describe what must be included in the final product; constraints are the limits that affect how you achieve this."
      }
    ]
  }
};

// === DOM REFERENCES ===
const playerNameInput = document.getElementById("playerName");
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
const leaderboardTabs = Array.from(document.querySelectorAll(".lb-tab"));
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

function getTopicLabel() {
  const t = TOPICS[TOPIC_KEY];
  return t ? t.label : "Client Briefs";
}

function buildQuestionSet() {
  const t = TOPICS[TOPIC_KEY];
  if (!t) return [];
  const qs = t.questions.map((q) => ({ ...q, __topicKey: TOPIC_KEY }));
  return shuffle(qs);
}

// === GAME FLOW ===
function resetGameState() {
  currentQuestions = buildQuestionSet();
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
  topicLabel.textContent = getTopicLabel();
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

  questionText.textContent = q.q;
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
    feedbackEl.textContent = "Not quite. " + (currentQuestions[index].explanation || "Multiplier reset.");
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
  lastGameTopicEl.textContent = getTopicLabel();

  const name = (playerNameInput.value || "Anonymous").trim();
  submitScore(name, TOPIC_KEY, score, currentQuestions.length);

  playSfx(sfxGameOver);

  setTimeout(loadLeaderboardFromSheet, 800);
}

// === SCORE LOGGING ===
function submitScore(name, topicKey, scoreValue, questionsPlayed) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name);
    params.append("topic", topicKey);
    params.append("score", String(scoreValue));
    params.append("questionsPlayed", String(questionsPlayed));
    params.append("timestamp", new Date().toISOString());

    const img = new Image();
    img.src = GAS_URL + "?" + params.toString();
    console.log("Submitting score to:", img.src);
  } catch (err) {
    console.error("Error creating score beacon:", err);
  }
}

// === LEADERBOARD (Google Visualization API) ===
function renderLeaderboardFromSheet(response) {
  try {
    const table = response.table;
    const rows = table.rows || [];

    const entries = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].c;
      const name = (r[0] && r[0].v) || "";
      if (!name || name.toLowerCase() === "name") continue;

      const score = (r[1] && r[1].v) || 0;
      const topicLabel = (r[2] && r[2].v) || "";
      const topicId = (r[3] && r[3].v) || "";
      const timestamp = (r[4] && r[4].v) || "";

      entries.push({ name, score, topicLabel, topicId, timestamp });
    }

    if (!entries.length) {
      leaderboardContainer.innerHTML =
        "<p class='leaderboard-note'>No scores yet. Play a game to be the first on the board!</p>";
      return;
    }

    entries.sort((a, b) => b.score - a.score);

    const rowsHtml = entries
      .map((e, i) => {
        const place = i + 1;
        const topic = e.topicLabel || e.topicId || "All Topics";
        const safeName = e.name || "Anonymous";
        return `
          <tr>
            <td>${place}</td>
            <td>${safeName}</td>
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
  if (!leaderboardContainer) return;

  leaderboardContainer.innerHTML =
    "<p class='leaderboard-note'>Loading leaderboard...</p>";

  const tq = encodeURIComponent(
    "select A,B,C,D,F order by B desc limit 10"
  );

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

// === LEADERBOARD TABS ===
function setupLeaderboardTabs() {
  leaderboardTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      leaderboardTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      if (tab === "all") {
        leaderboardTitle.textContent = "Leaderboards – All Time";
      } else if (tab === "week") {
        leaderboardTitle.textContent =
          "Leaderboards – This Week (visual only)";
      } else if (tab === "today") {
        leaderboardTitle.textContent =
          "Leaderboards – Today (visual only)";
      }
    });
  });
}

// === START / RESTART ===
function startGameHandler() {
  const name = (playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your initials so we can log your score!");
    return;
  }

  resetGameState();
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
setupLeaderboardTabs();
initSfx();
loadLeaderboardFromSheet();

if (startBtn) startBtn.addEventListener("click", startGameHandler);
if (restartBtn) restartBtn.addEventListener("click", restartGameHandler);
