// Pre‑Production Toolkit Game – arcade edition
// Standalone game using the iMedia Genius arcade pattern,
// locked to a single topic: Pre‑Production Documents (R093 Topics 23–25).

// === CONFIG ===
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "preProductionToolkit";

// === QUESTION BANK (20 QUESTIONS) ===
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "23–25 – Pre‑Production Documents",
    questions: [
      {
        q: "You are planning ideas for a new mobile game. You want to quickly link gameplay ideas, levels and characters using branches. Which document is BEST?",
        options: [
          "Mind map",
          "Mood board",
          "Storyboard",
          "Wireframe"
        ],
        answerIndex: 0,
        explanation:
          "Mind maps use nodes and branches to organise ideas and show how they connect."
      },
      {
        q: "You need to explore the visual style of a fantasy film: colours, textures, costumes and locations. Which pre‑production document should you create?",
        options: [
          "Mood board",
          "Script",
          "Wireframe",
          "Asset log"
        ],
        answerIndex: 0,
        explanation:
          "Mood boards collect images, colours and textures to show the visual style and feel of a project."
      },
      {
        q: "You are planning a TV advert and need to show each shot with notes about camera angles, movement and audio. Which document is MOST suitable?",
        options: [
          "Storyboard",
          "Mind map",
          "Wireframe",
          "Script"
        ],
        answerIndex: 0,
        explanation:
          "Storyboards show a sequence of frames with notes on camera, movement and sound for each shot."
      },
      {
        q: "A designer needs to plan the layout of a website homepage showing where the logo, navigation and hero image will go before any graphics are created. What should they use?",
        options: [
          "Wireframe",
          "Mood board",
          "Storyboard",
          "Script"
        ],
        answerIndex: 0,
        explanation:
          "Wireframes show the structure and layout of a page or app screen without finished graphics."
      },
      {
        q: "Which document is BEST for writing the dialogue, sound cues and stage directions for a radio drama?",
        options: [
          "Storyboard",
          "Script",
          "Mind map",
          "Mood board"
        ],
        answerIndex: 1,
        explanation:
          "Scripts contain dialogue and audio directions and are essential for planning spoken content."
      },
      {
        q: "You want to quickly explore lots of different level ideas for a platform game and group them into easy, medium and hard. Which document would be MOST effective?",
        options: [
          "Mind map",
          "Storyboard",
          "Wireframe",
          "Script"
        ],
        answerIndex: 0,
        explanation:
          "Mind maps are ideal for brainstorming many ideas and grouping them into categories."
      },
      {
        q: "A client wants to see how a user will move through a 5‑screen app, including menus, buttons and basic layout. Which planning tool should you present?",
        options: [
          "Storyboard for a film",
          "Mood board",
          "Wireframe sequence",
          "Script"
        ],
        answerIndex: 2,
        explanation:
          "A series of wireframes can show the structure and navigation between each screen in an app."
      },
      {
        q: "You are planning a short film. Which two documents together would BEST show both the visuals of each shot and the exact dialogue spoken?",
        options: [
          "Mind map and mood board",
          "Storyboard and script",
          "Wireframe and script",
          "Mood board and wireframe"
        ],
        answerIndex: 1,
        explanation:
          "The storyboard shows visual shots and camera movement; the script shows dialogue and sound."
      },
      {
        q: "A games studio wants to agree the overall look and feel of a new racing game, including colour schemes, car styles and environments, before 3D modelling starts. What should they create?",
        options: [
          "Mood board",
          "Wireframe",
          "Asset log",
          "Flowchart"
        ],
        answerIndex: 0,
        explanation:
          "Mood boards are perfect for presenting overall style, colours and reference imagery."
      },
      {
        q: "Which statement BEST describes the main purpose of a storyboard?",
        options: [
          "To list all files used in a project",
          "To show the sequence of shots and actions in a moving image product",
          "To collect images that show a theme",
          "To map out every link on a website"
        ],
        answerIndex: 1,
        explanation:
          "Storyboards plan the order of shots, actions and transitions in moving image products."
      },
      {
        q: "Which document would MOST help a web developer understand where interactive elements like buttons, forms and menus will be placed on a page?",
        options: [
          "Wireframe",
          "Script",
          "Storyboard",
          "Mood board"
        ],
        answerIndex: 0,
        explanation:
          "Wireframes show the placement of key elements and interactive components on screens or pages."
      },
      {
        q: "A designer is planning a new magazine cover and collects fonts, colours and example covers that match the style. What are they MOST likely creating?",
        options: [
          "Wireframe",
          "Script",
          "Storyboard",
          "Mood board"
        ],
        answerIndex: 3,
        explanation:
          "Mood boards are used to explore style choices like fonts, colours and example imagery."
      },
      {
        q: "Which document is BEST for planning the dialogue and sound effects in a TV advert?",
        options: [
          "Storyboard only",
          "Script only",
          "Mood board only",
          "Wireframe only"
        ],
        answerIndex: 1,
        explanation:
          "A script is needed to plan dialogue and audio so that actors and production teams know exactly what to record."
      },
      {
        q: "You need to show how the different sections of a website connect, including the home page, gallery and contact page. Which pre‑production tool is MOST helpful?",
        options: [
          "Wireframe and site map",
          "Mood board",
          "Script",
          "Storyboard"
        ],
        answerIndex: 0,
        explanation:
          "Wireframes show layouts and a site map or linked wireframes show how pages connect."
      },
      {
        q: "Which statement BEST explains the difference between a mood board and a mind map?",
        options: [
          "A mood board uses linked words; a mind map uses only images.",
          "A mood board shows visual style; a mind map organises linked ideas and words.",
          "They are both used only for websites.",
          "They mean the same thing."
        ],
        answerIndex: 1,
        explanation:
          "Mood boards are mainly visual; mind maps use key words and branches to show relationships between ideas."
      },
      {
        q: "A pre‑production document shows frames with rough sketches, arrows for camera movement and notes like 'zoom in on logo'. What is this document?",
        options: [
          "Script",
          "Storyboard",
          "Wireframe",
          "Mind map"
        ],
        answerIndex: 1,
        explanation:
          "This is a storyboard because it uses frames, arrows and notes about camera movement."
      },
      {
        q: "Which document should you use FIRST to explore early ideas before you create detailed storyboards or scripts?",
        options: [
          "Asset log",
          "Mind map",
          "Wireframe",
          "Script"
        ],
        answerIndex: 1,
        explanation:
          "Mind maps are often used at the very start of a project to generate and link ideas quickly."
      },
      {
        q: "A designer is planning the layout of an app’s main menu screen and wants to show where icons and labels will go without focusing on colour or styling yet. What should they produce?",
        options: [
          "Storyboard",
          "Wireframe",
          "Mood board",
          "Script"
        ],
        answerIndex: 1,
        explanation:
          "Wireframes focus on structure and layout, not on final colours or detailed graphics."
      },
      {
        q: "A film director wants to check that the order of scenes makes sense before the script is fully polished. Which pre‑production document would help MOST with this?",
        options: [
          "Mood board",
          "Storyboard",
          "Wireframe",
          "Asset log"
        ],
        answerIndex: 1,
        explanation:
          "A storyboard shows the sequence of scenes and helps the director check the narrative flow."
      },
      {
        q: "Why is it helpful to use MORE THAN ONE type of pre‑production document when planning a media product?",
        options: [
          "Because each document focuses on different aspects like ideas, visuals, layout and dialogue",
          "Because examiners say you must use them all in every project",
          "Because using more documents always makes a product longer",
          "Because it removes the need to talk to the client"
        ],
        answerIndex: 0,
        explanation:
          "Different documents support different planning needs: ideas (mind map), style (mood board), layout (wireframe), visuals (storyboard) and dialogue (script)."
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
  return t ? t.label : "Pre‑Production Documents";
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
