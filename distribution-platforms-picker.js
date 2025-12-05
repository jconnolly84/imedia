// Distribution & Media Platforms Picker – arcade edition
// Standalone game reusing the iMedia Genius arcade patterns,
// locked to a single topic: Distribution Platforms & Media (R093 Topic 30).

// === CONFIG ===
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "distributionPlatforms";

// === QUESTION BANK (20 QUESTIONS) ===
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "30 – Distribution Platforms & Media",
    questions: [
      {
        q: "You have produced a high‑budget drama series and want to maximise global reach with on‑demand viewing. Which platform is MOST suitable?",
        options: [
          "Broadcast TV",
          "Streaming service",
          "Local cinema only",
          "DVD/Blu‑ray only"
        ],
        answerIndex: 1,
        explanation:
          "Streaming services (e.g. Netflix, Disney+) offer on‑demand access and can rapidly reach global audiences."
      },
      {
        q: "An indie filmmaker wants to share a short film with minimal cost and high audience engagement. Which platform should they choose FIRST?",
        options: [
          "Primetime broadcast TV",
          "Streaming service with subscription fees",
          "Social media / video‑sharing site",
          "Physical DVD release"
        ],
        answerIndex: 2,
        explanation:
          "Social platforms like YouTube or TikTok allow low‑cost uploads, comments and sharing to grow an audience."
      },
      {
        q: "A radio station wants to let listeners catch up on missed shows whenever they like. Which distribution method is MOST appropriate?",
        options: [
          "Live broadcast only",
          "Podcast / on‑demand audio",
          "Cinema screenings",
          "Printed magazine"
        ],
        answerIndex: 1,
        explanation:
          "Turning shows into podcasts or on‑demand audio lets listeners catch up at any time."
      },
      {
        q: "A game studio is releasing a big AAA title and wants shops to stock boxed copies as well as online downloads. What is this an example of?",
        options: [
          "Single‑platform distribution",
          "Multiplatform distribution",
          "Exclusive licensing",
          "User‑generated content"
        ],
        answerIndex: 1,
        explanation:
          "Using both physical copies and digital stores is multiplatform distribution, increasing reach."
      },
      {
        q: "A music artist wants fans to be able to buy limited‑edition vinyl and also stream the album on major apps. Which term BEST describes this strategy?",
        options: [
          "Niche distribution only",
          "Multiplatform (physical + digital) distribution",
          "Social media takeover",
          "Exclusive cinema release"
        ],
        answerIndex: 1,
        explanation:
          "Releasing both physical vinyl and streaming versions uses multiplatform distribution to reach different audiences."
      },
      {
        q: "What is a KEY advantage of releasing a film on physical media (DVD/Blu‑ray) compared to streaming only?",
        options: [
          "Instant global reach with no manufacturing costs",
          "Tangible ownership and collectability for fans",
          "Guaranteed top trending position online",
          "It cannot ever be pirated"
        ],
        answerIndex: 1,
        explanation:
          "Physical copies give fans something to own and collect, which some audiences prefer."
      },
      {
        q: "A local community group has produced a short documentary and mainly wants to reach people in their town. Which distribution method is MOST suitable?",
        options: [
          "Limited local cinema screenings and community website",
          "Worldwide cinema release only",
          "Paid streaming subscription only",
          "Physical discs shipped worldwide"
        ],
        answerIndex: 0,
        explanation:
          "Local screenings and hosting on a community website target the specific audience they care about."
      },
      {
        q: "A film is first released in cinemas, then later on DVD and streaming platforms. What is this staged release pattern called?",
        options: [
          "Vertical integration",
          "Windowed distribution",
          "Crowdsourced marketing",
          "Exclusive rights"
        ],
        answerIndex: 1,
        explanation:
          "Windowed distribution releases content in stages (windows), often cinema first, then home media and streaming."
      },
      {
        q: "A company wants to distribute a training video privately so only staff can view it online after logging in. Which is the BEST option?",
        options: [
          "Upload it publicly on social media",
          "Use a secure intranet or password‑protected streaming",
          "Release it on DVD in shops",
          "Show it once at the cinema"
        ],
        answerIndex: 1,
        explanation:
          "A secure intranet or password‑protected platform keeps training content restricted to staff."
      },
      {
        q: "Which platform is MOST appropriate for a live sports event where viewers expect real‑time coverage?",
        options: [
          "Pre‑recorded DVD",
          "Live TV or live streaming platform",
          "Printed newspaper",
          "Static website image gallery"
        ],
        answerIndex: 1,
        explanation:
          "Live TV or live streaming gives real‑time coverage, which is essential for live sport."
      },
      {
        q: "A small business wants to share short promotional clips and interact with customers through comments and messages. Which platform is MOST suitable?",
        options: [
          "Broadcast TV adverts only",
          "Social media platforms",
          "DVD box sets",
          "Radio only"
        ],
        answerIndex: 1,
        explanation:
          "Social media allows regular short clips plus direct engagement through comments and messages."
      },
      {
        q: "What is one MAIN advantage of using streaming services for film distribution instead of only cinema and DVD?",
        options: [
          "No internet is required",
          "Guaranteed awards and reviews",
          "Convenient on‑demand access for viewers worldwide",
          "No need to produce trailers"
        ],
        answerIndex: 2,
        explanation:
          "Streaming lets audiences watch whenever they like, often across many countries."
      },
      {
        q: "A magazine publisher wants to reduce printing costs but still reach readers on phones and tablets. Which is the BEST solution?",
        options: [
          "Stop publishing the magazine completely",
          "Create a digital edition / app version",
          "Only sell printed copies in more shops",
          "Release a DVD version"
        ],
        answerIndex: 1,
        explanation:
          "Creating a digital edition or app reduces printing costs while reaching mobile readers."
      },
      {
        q: "A film studio works with a fast‑food chain so that meal boxes advertise the film and include a QR code to the trailer. What is this an example of?",
        options: [
          "Piracy",
          "Synergy and cross‑promotion",
          "Exclusive cinema‑only distribution",
          "User‑generated content"
        ],
        answerIndex: 1,
        explanation:
          "Two companies promote each other’s products, which is synergy and cross‑promotion."
      },
      {
        q: "Which statement BEST describes a digital download compared to streaming?",
        options: [
          "Streaming means the file is permanently stored on your device.",
          "Downloading means you obtain a copy of the file to store and play offline.",
          "They are exactly the same thing.",
          "Downloading is only for cinemas."
        ],
        answerIndex: 1,
        explanation:
          "A digital download stores a copy on your device; streaming plays the file from a server in real time."
      },
      {
        q: "A podcast creator wants to grow their audience internationally. Which distribution strategy is MOST effective?",
        options: [
          "Only share the podcast on a private school website",
          "Use major podcast platforms and promote via social media",
          "Release episodes on DVD only",
          "Print the scripts in a magazine"
        ],
        answerIndex: 1,
        explanation:
          "Hosting on major podcast platforms plus social promotion helps reach listeners in different countries."
      },
      {
        q: "A school media department wants students to watch coursework films at home without making the videos public. What is the BEST option?",
        options: [
          "Upload as unlisted videos and share links only with students",
          "Broadcast on national TV",
          "Post them publicly with hashtags",
          "Sell them on DVD in shops"
        ],
        answerIndex: 0,
        explanation:
          "Unlisted uploads allow access via link without making content fully public."
      },
      {
        q: "Which distribution platform is MOST suitable for a retro game aimed at collectors who like physical items and extras?",
        options: [
          "Mobile‑only free app",
          "Streaming‑only release",
          "Limited‑run physical cartridges or discs with special packaging",
          "Text‑only website"
        ],
        answerIndex: 2,
        explanation:
          "Collectors often value special physical editions with extras and packaging."
      },
      {
        q: "A company wants to track exactly how many people watch their new advert and from which country. Which distribution method makes this EASIEST?",
        options: [
          "Broadcast TV only",
          "Cinema screenings only",
          "Online video platform with analytics tools",
          "DVDs handed out in the street"
        ],
        answerIndex: 2,
        explanation:
          "Online platforms provide detailed analytics such as view counts, watch time and viewer location."
      },
      {
        q: "Why do many media products now use BOTH traditional and digital platforms in their distribution strategy?",
        options: [
          "To make the project more confusing for audiences",
          "To reach different audience groups and maximise impact",
          "Because digital platforms are only for older audiences",
          "Because traditional platforms are free to use"
        ],
        answerIndex: 1,
        explanation:
          "Combining TV, cinema, social media, streaming and physical media helps reach different demographics and increase overall reach."
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
  return t ? t.label : "Distribution Platforms";
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
    feedbackEl.textContent =
      "Not quite. " + (currentQuestions[index].explanation || "Multiplier reset.");
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
    alert("Please enter your name so we can log your score!");
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
