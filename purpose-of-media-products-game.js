// Purpose of Media Products Arena – arcade edition
// Upgraded from a simple 3-question quiz to the full iMedia Genius arcade engine.
// Focus: Topic 10 – Purpose of Media Products (inform, educate, entertain, promote, sell, raise awareness).

/* === CONFIG === */
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "purposeOfMedia";

/* === QUESTION BANK (20 QUESTIONS) === */
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "10 – Purpose of Media Products",
    questions: [
      {
        q: "A national campaign uses posters and videos in schools to warn young people about the dangers of vaping. What is the PRIMARY purpose?",
        options: ["Entertain", "Raise awareness", "Sell", "Promote"],
        answerIndex: 1,
        explanation:
          "The campaign aims to raise awareness of a health risk and change behaviour, not to sell a product."
      },
      {
        q: "A TV advert shows off the features, benefits and price of a new games console with a clear call to action to buy now. What is the PRIMARY purpose?",
        options: ["Inform", "Educate", "Sell", "Entertain"],
        answerIndex: 2,
        explanation:
          "The advert is designed to persuade the audience to buy the console, so the main purpose is to sell."
      },
      {
        q: "A feature-length documentary explains how plastic pollution affects oceans, using experts, facts and statistics. What is the MAIN purpose?",
        options: ["Entertain", "Educate", "Promote a brand", "Sell tickets"],
        answerIndex: 1,
        explanation:
          "Documentaries mainly aim to educate by providing detailed information and explanations."
      },
      {
        q: "A comedy series on a streaming platform focuses on funny characters and silly situations with no clear message. What is the MAIN purpose?",
        options: ["Entertain", "Raise awareness", "Educate", "Promote a charity"],
        answerIndex: 0,
        explanation:
          "The primary purpose is to entertain the audience and make them laugh."
      },
      {
        q: "A company releases a glossy brochure and social media campaign to show how eco-friendly their products are compared to rivals. What is the MAIN purpose?",
        options: ["Inform only", "Promote the brand image", "Raise awareness of climate change", "Educate about recycling in schools"],
        answerIndex: 1,
        explanation:
          "The campaign mainly promotes the company and improves its brand image to attract customers."
      },
      {
        q: "A news website publishes a breaking news article about a major train strike, including times and routes affected. What is the PRIMARY purpose?",
        options: ["Entertain", "Inform", "Sell", "Promote"],
        answerIndex: 1,
        explanation:
          "News reports mainly inform the audience by giving factual, up-to-date information."
      },
      {
        q: "A charity produces a powerful TV advert showing real stories of people affected by a disaster and asking viewers to donate. What is the MAIN purpose?",
        options: ["Sell a product", "Entertain", "Raise awareness and encourage donations", "Educate about filmmaking"],
        answerIndex: 2,
        explanation:
          "Charity adverts aim to raise awareness of an issue and persuade viewers to donate or support the cause."
      },
      {
        q: "A revision app includes short animated videos that explain science topics step by step for GCSE students. What is the MAIN purpose?",
        options: ["Educate", "Entertain only", "Promote a celebrity", "Raise awareness of a charity"],
        answerIndex: 0,
        explanation:
          "The app is focused on helping learners understand exam content, so its primary purpose is to educate."
      },
      {
        q: "A poster for a new superhero film shows the release date, actors and a striking image of the main character. What is the PRIMARY purpose?",
        options: ["Inform about exam dates", "Promote the film", "Raise awareness of road safety", "Educate about superheroes"],
        answerIndex: 1,
        explanation:
          "Film posters primarily promote the movie and encourage audiences to go and watch it."
      },
      {
        q: "A YouTube channel uploads daily vlogs of a gamer’s life, focusing on their personality, jokes and daily activities. What is the MAIN purpose?",
        options: ["Raise awareness of a charity", "Entertain and build an audience", "Educate about coding", "Issue a health warning"],
        answerIndex: 1,
        explanation:
          "The content is mainly designed to entertain, keep viewers engaged and build a loyal audience."
      },
      {
        q: "A supermarket sends an email newsletter with discount codes, special offers and links to buy products online. What is the PRIMARY purpose?",
        options: ["Educate about healthy eating only", "Sell products and increase sales", "Entertain with stories", "Raise awareness of exam boards"],
        answerIndex: 1,
        explanation:
          "The newsletter is focused on offers and discounts, so the main purpose is to sell products."
      },
      {
        q: "A government produces a series of social media posts explaining new road safety laws and how they affect drivers. What is the MAIN purpose?",
        options: ["Entertain drivers", "Promote a specific brand", "Inform and educate the public", "Sell cars"],
        answerIndex: 2,
        explanation:
          "The posts are designed to inform and educate people about the new laws so they follow them correctly."
      },
      {
        q: "A short animated video is shown in primary schools to help children understand how to wash their hands properly. What is the MAIN purpose?",
        options: ["Entertain only", "Sell soap", "Educate young children", "Promote a film"],
        answerIndex: 2,
        explanation:
          "The key aim is to teach children a health routine, so the main purpose is to educate."
      },
      {
        q: "A social media campaign encourages people to talk about mental health and share support helplines. What is the PRIMARY purpose?",
        options: ["Sell merchandise", "Raise awareness of mental health issues", "Entertain with memes", "Promote a new game"],
        answerIndex: 1,
        explanation:
          "The main purpose is to raise awareness and encourage people to seek or offer support."
      },
      {
        q: "A game studio releases a behind-the-scenes video showing how they created the characters and levels for their new game, linking to pre-order pages. What is the MAIN purpose?",
        options: ["Entertain only", "Educate about game engines", "Promote and help sell the new game", "Raise awareness of recycling"],
        answerIndex: 2,
        explanation:
          "Although it may inform and entertain, the main purpose is to promote and increase sales of the new game."
      },
      {
        q: "A radio advert describes a car’s safety features, fuel efficiency and low monthly payments, ending with a phone number and website. What is the PRIMARY purpose?",
        options: ["Entertain", "Sell the car to listeners", "Raise awareness of roadworks", "Educate about engines"],
        answerIndex: 1,
        explanation:
          "The advert uses persuasive language and pricing details to sell the car."
      },
      {
        q: "A lifestyle magazine runs an article explaining how to budget money effectively, with step-by-step tips and examples. What is the MAIN purpose?",
        options: ["Entertain with jokes", "Educate and inform readers", "Promote a film premiere", "Sell specific products only"],
        answerIndex: 1,
        explanation:
          "The article aims to educate and inform readers about money management, even if adverts also appear nearby."
      },
      {
        q: "A school newsletter is sent home each week with dates of trips, exam timetables and headteacher updates. What is the PRIMARY purpose?",
        options: ["Inform parents and students", "Sell new uniforms", "Entertain with fiction stories", "Raise awareness of a national campaign"],
        answerIndex: 0,
        explanation:
          "School newsletters mainly inform families about key events, dates and news."
      },
      {
        q: "A charity live-stream event includes music performances and interviews, while regularly reminding viewers to donate using a link on screen. What is the MAIN purpose?",
        options: ["Entertain and promote donations for the charity", "Sell concert tickets only", "Educate about coding", "Promote a TV drama"],
        answerIndex: 0,
        explanation:
          "The stream entertains but repeatedly encourages donations, so the key purpose is to raise awareness and support for the charity."
      },
      {
        q: "A company blog post explains what personal data is and how customers can protect their privacy online, without directly trying to sell anything. What is the PRIMARY purpose?",
        options: ["Sell products immediately", "Entertain readers", "Inform and educate customers", "Promote a film festival"],
        answerIndex: 2,
        explanation:
          "The post focuses on giving useful information and advice, so the main purpose is to inform and educate."
      }
    ]
  }
};

/* === DOM REFERENCES === */
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

/* Leaderboard DOM */
const leaderboardTabs = Array.from(document.querySelectorAll(".lb-tab"));
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardContainer = document.getElementById("leaderboardContainer");

/* === SOUND EFFECTS === */
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

/* === GAME STATE === */
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

/* === UTILS === */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* === TIMER & HUD FX === */
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
  return t ? t.label : "Purpose of Media Products";
}

function buildQuestionSet() {
  const t = TOPICS[TOPIC_KEY];
  if (!t) return [];
  const qs = t.questions.map((q) => ({ ...q, __topicKey: TOPIC_KEY }));
  return shuffle(qs);
}

/* === GAME FLOW === */
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

/* === SCORE LOGGING === */
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

/* === LEADERBOARD (Google Visualization API) === */
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

/* === LEADERBOARD TABS === */
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

/* === START / RESTART === */
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

/* === INIT === */
setupLeaderboardTabs();
initSfx();
loadLeaderboardFromSheet();

if (startBtn) startBtn.addEventListener("click", startGameHandler);
if (restartBtn) restartBtn.addEventListener("click", restartGameHandler);
