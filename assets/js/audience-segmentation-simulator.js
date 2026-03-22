// Audience Segmentation Simulator – arcade edition
// Standalone game reusing the iMedia Genius arcade patterns,
// locked to a single topic: Audience Segmentation (R093 Topic 13).

// === CONFIG ===
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "audienceSegmentation";

// === QUESTION BANK (20 QUESTIONS) ===
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "13 – Audience Segmentation",
    questions: [
      {
        q: "A skateboard brand wants to reach adventurous teenage boys aged 14–18 who watch extreme sports online. Which segmentation factor is MOST relevant?",
        options: [
          "Demographic (age & gender)",
          "Psychographic (lifestyle & interests)",
          "Behavioural (purchase behaviour)",
          "Geographic (location only)"
        ],
        answerIndex: 1,
        explanation:
          "Psychographic segmentation focuses on lifestyle, attitudes and interests such as adventure and extreme sports."
      },
      {
        q: "An online cooking course targets busy working parents aged 30–45 who want quick healthy meals. What BEST describes this audience?",
        options: [
          "Demographic only (age)",
          "Psychographic only (interest in food)",
          "Both demographic and psychographic factors",
          "Behavioural (loyalty to one brand)"
        ],
        answerIndex: 2,
        explanation:
          "Age and parental status are demographic factors, while interest in healthy cooking is psychographic."
      },
      {
        q: "A mobile game targets players who frequently spend money on in-app upgrades. Which segmentation type does this reflect MOST clearly?",
        options: ["Demographic", "Psychographic", "Behavioural", "Geographic"],
        answerIndex: 2,
        explanation:
          "Behavioural segmentation looks at spending patterns, in-app purchases and how often users pay."
      },
      {
        q: "A new horror film campaign is aimed at 18–25 year olds who enjoy scary, intense entertainment. Which two segmentation bases are being combined?",
        options: [
          "Demographic (age) and psychographic (genre preference)",
          "Geographic and behavioural",
          "Demographic and geographic",
          "Behavioural and geographic"
        ],
        answerIndex: 0,
        explanation:
          "Age is demographic; enjoyment of horror and intense entertainment is psychographic."
      },
      {
        q: "A local gym wants to attract office workers who live within 5 miles and commute by train. Which segmentation factor is MOST important here?",
        options: [
          "Demographic (age)",
          "Psychographic (interests)",
          "Behavioural (loyalty)",
          "Geographic (where they live/work)"
        ],
        answerIndex: 3,
        explanation:
          "The campaign focuses heavily on location and travel distance, which is geographic segmentation."
      },
      {
        q: "A luxury watch advert targets high-income professionals who value status and premium brands. Which segmentation factors are MOST relevant?",
        options: [
          "Demographic (income) and psychographic (status)",
          "Geographic and behavioural only",
          "Behavioural (heavy users) only",
          "Age and gender only"
        ],
        answerIndex: 0,
        explanation:
          "Income level is demographic; valuing status and premium brands is a psychographic trait."
      },
      {
        q: "A charity campaign is aimed at people who have donated to similar causes in the last year. Which segmentation is being used?",
        options: [
          "Demographic (age)",
          "Psychographic (values) only",
          "Behavioural (past donations)",
          "Geographic (country)"
        ],
        answerIndex: 2,
        explanation:
          "Targeting people based on donation history is behavioural segmentation."
      },
      {
        q: "A streaming service advertises a new sci-fi series to users who have previously watched lots of sci-fi shows. This example mainly uses:",
        options: [
          "Geographic segmentation",
          "Behavioural segmentation",
          "Demographic segmentation",
          "Random targeting"
        ],
        answerIndex: 1,
        explanation:
          "Viewing history and previous choices are part of behavioural segmentation."
      },
      {
        q: "A brand is planning a campaign for eco-friendly cleaning products aimed at people who care about the environment. Which segmentation base is MOST important?",
        options: [
          "Demographic (age)",
          "Psychographic (values & attitudes)",
          "Geographic (country)",
          "Behavioural (loyalty card use)"
        ],
        answerIndex: 1,
        explanation:
          "Caring about the environment is a psychographic value or attitude."
      },
      {
        q: "A fast-food chain runs a late-night menu advert specifically for shift workers and gamers who order after 10pm. Which TWO segmentation types are being used?",
        options: [
          "Demographic and geographic",
          "Psychographic and behavioural (time of use)",
          "Geographic and behavioural",
          "Demographic and behavioural only"
        ],
        answerIndex: 1,
        explanation:
          "Lifestyle (shift workers, gamers) is psychographic, while ordering after 10pm is behavioural."
      },
      {
        q: "A mobile network offers a special tariff for students aged 16–21. Which segmentation factor is this MOST clearly?",
        options: [
          "Demographic (age & life stage)",
          "Psychographic (interests)",
          "Behavioural (loyalty)",
          "Geographic (location)"
        ],
        answerIndex: 0,
        explanation:
          "Targeting students by age and life stage is demographic segmentation."
      },
      {
        q: "A game developer wants to promote a new puzzle game to older adults who enjoy brain-training apps on tablets. Which segmentation combination is MOST accurate?",
        options: [
          "Demographic (age) and behavioural (app usage)",
          "Psychographic and geographic only",
          "Behavioural only",
          "Demographic and geographic only"
        ],
        answerIndex: 0,
        explanation:
          "Age is demographic; using puzzle / brain-training apps regularly is behavioural."
      },
      {
        q: "A cinema releases an advert in one specific city where a film is premiering. Which segmentation base is this an example of?",
        options: ["Demographic", "Psychographic", "Behavioural", "Geographic"],
        answerIndex: 3,
        explanation:
          "Targeting audiences in a specific city or region is geographic segmentation."
      },
      {
        q: "Why might a media company create different posters for the same film in different countries?",
        options: [
          "To change the film rating",
          "Because geographic segmentation means cultural tastes and languages differ",
          "To reduce printing quality",
          "To avoid segmentation completely"
        ],
        answerIndex: 1,
        explanation:
          "Geographic segmentation considers language, culture and local tastes in each country."
      },
      {
        q: "A fashion brand releases a campaign aimed at trend-conscious teenagers who follow influencers on TikTok. Which segmentation base is MOST important here?",
        options: [
          "Behavioural (loyalty)",
          "Psychographic (style, trend focus)",
          "Geographic (climate)",
          "Demographic (income only)"
        ],
        answerIndex: 1,
        explanation:
          "Being trend-conscious and following influencers are psychographic traits."
      },
      {
        q: "What is the MAIN benefit of using audience segmentation when planning a media campaign?",
        options: [
          "It guarantees viral success",
          "It helps tailor content and messages to specific groups for more effective targeting",
          "It removes the need for any research",
          "It means you can ignore the client brief"
        ],
        answerIndex: 1,
        explanation:
          "Segmentation allows campaigns to be customised for specific groups, making them more effective."
      },
      {
        q: "A video-on-demand platform creates a kids’ profile option with age-appropriate content for under 12s. Which segmentation factor is used here?",
        options: [
          "Demographic (age)",
          "Psychographic (values) only",
          "Behavioural (heavy users) only",
          "Geographic (time zone)"
        ],
        answerIndex: 0,
        explanation:
          "Creating profiles for under-12s is based on age, a clear demographic factor."
      },
      {
        q: "An energy drink brand targets 18–30 year old gamers who attend eSports events and watch streams. Which THREE segmentation bases could they combine?",
        options: [
          "Demographic, psychographic and behavioural",
          "Demographic, legal and regulatory",
          "Geographic, legal and regulatory",
          "Only behavioural"
        ],
        answerIndex: 0,
        explanation:
          "Age is demographic; being a gamer and attending eSports is psychographic and behavioural."
      },
      {
        q: "A music streaming app offers a discounted family plan aimed at households with multiple users. Which segmentation factor is this MOST linked to?",
        options: [
          "Demographic (family/household structure)",
          "Psychographic (music tastes)",
          "Behavioural (time of day listening)",
          "Geographic (country)"
        ],
        answerIndex: 0,
        explanation:
          "The offer is based on family or household structure, which is a demographic characteristic."
      },
      {
        q: "Which statement BEST describes behavioural segmentation in media campaigns?",
        options: [
          "Grouping audiences by age and gender",
          "Grouping audiences by where they live",
          "Grouping audiences by how they act, such as usage level, loyalty or response to offers",
          "Grouping audiences by their favourite colour"
        ],
        answerIndex: 2,
        explanation:
          "Behavioural segmentation focuses on how audiences behave: how often they use products, how loyal they are and how they respond to promotions."
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
  return t ? t.label : "Audience Segmentation";
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
