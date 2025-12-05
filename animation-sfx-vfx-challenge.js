// Animation, SFX & VFX Challenge – arcade edition
// Standalone game that reuses the iMedia Genius arcade engine patterns
// but is locked to a single topic: Animation, SFX & VFX.

// === CONFIG ===
// Apps Script endpoint (write-only: logs scores into your sheet)
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

// Google Sheet ID (read-only: public "Anyone with link can view")
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "animationSfxVfx";

// === QUESTION BANK (20 QUESTIONS) ===
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "04 – Animation, SFX & VFX",
    questions: [
      {
        q: "A blockbuster uses computer‑generated explosions and creatures. What technique is mainly being used?",
        options: ["SFX", "VFX", "CGI", "Stop‑motion", "Motion Graphics"],
        answerIndex: 2,
        explanation:
          "CGI (Computer‑Generated Imagery) creates digital models and effects such as explosions and monsters."
      },
      {
        q: "A physical model of a spaceship is built, lit and filmed in camera on a miniature set. Which technique is this?",
        options: ["SFX", "VFX", "CGI", "Stop‑motion", "Motion Graphics"],
        answerIndex: 0,
        explanation:
          "SFX (special effects) are practical effects created physically on set, such as models and pyrotechnics."
      },
      {
        q: "Clay characters are moved slightly between photographed frames to create movement. What technique is this?",
        options: ["SFX", "VFX", "CGI", "Stop‑motion", "Motion Graphics"],
        answerIndex: 3,
        explanation:
          "Stop‑motion involves moving models frame by frame and capturing each position as a still image."
      },
      {
        q: "Animated text and shapes slide on in sync with a voiceover in a YouTube explainer video. What is this called?",
        options: ["CGI", "SFX", "VFX", "Motion Graphics", "Stop‑motion"],
        answerIndex: 3,
        explanation:
          "Motion graphics are animated graphic design elements such as text, icons and shapes."
      },
      {
        q: "An actor wears a green tracking suit and dots on their face so a digital creature can be added later. Which technique is this part of?",
        options: ["SFX", "VFX with motion capture", "Stop‑motion", "Live TV studio", "Colour grading"],
        answerIndex: 1,
        explanation:
          "Motion‑capture data is used in VFX to drive a CGI character so it matches the actor’s performance."
      },
      {
        q: "A car crash is created by building a real car rig and filming the stunt for real on set. Which technique is this?",
        options: ["CGI", "VFX", "SFX / practical effects", "Motion Graphics", "Stop‑motion"],
        answerIndex: 2,
        explanation:
          "Practical SFX use real stunts, rigs and props that are physically filmed on location or in a studio."
      },
      {
        q: "A fantasy city skyline is created entirely inside 3D software and composited behind actors filmed on a green screen. What technique is this mainly?",
        options: ["SFX only", "VFX using CGI set extension", "Stop‑motion", "Live broadcast", "Sound design"],
        answerIndex: 1,
        explanation:
          "VFX combines live‑action footage with CGI elements such as digital environments or set extensions."
      },
      {
        q: "In a superhero film, sparks and smoke are added digitally to make a fight scene feel more intense. Which technique is this?",
        options: ["SFX", "VFX", "Stop‑motion", "Colour grading only", "Location scouting"],
        answerIndex: 1,
        explanation:
          "VFX adds or enhances visual elements digitally in post‑production, such as sparks, smoke and energy blasts."
      },
      {
        q: "A title sequence uses animated shapes, icons and typography to introduce each actor’s name. What is this?",
        options: ["SFX", "CGI creature work", "Motion Graphics", "Stop‑motion", "Location VFX"],
        answerIndex: 2,
        explanation:
          "Motion graphics are perfect for title sequences that rely on animated text and design rather than characters."
      },
      {
        q: "A monster is built as a latex costume with prosthetic makeup, then filmed directly in camera. Which technique does this use?",
        options: ["SFX and prosthetics", "VFX only", "CGI only", "Stop‑motion", "Motion Graphics"],
        answerIndex: 0,
        explanation:
          "SFX includes prosthetics, latex suits and makeup applied physically to performers and filmed on set."
      },
      {
        q: "A director wants actors to appear in a different country without travelling. They film on a green screen and add the country in later. What is this process?",
        options: ["SFX", "VFX compositing", "Stop‑motion", "Motion Graphics", "File compression"],
        answerIndex: 1,
        explanation:
          "VFX compositing replaces green screen backgrounds with digital plates or photos of real locations."
      },
      {
        q: "A children’s TV ident shows colourful shapes bouncing in time with music and forming the channel logo. Which technique is being used?",
        options: ["CGI creature work", "Motion Graphics", "Stop‑motion", "SFX explosions", "VFX set extension"],
        answerIndex: 1,
        explanation:
          "Motion graphics are often used for TV branding idents where logos and shapes animate to music."
      },
      {
        q: "Plasticine models are used to create a short advert. The animator nudges each model and takes a new photo for every frame. This is:",
        options: ["CGI simulation", "Stop‑motion animation", "Motion Graphics", "SFX prosthetics", "Live‑streaming"],
        answerIndex: 1,
        explanation:
          "Stop‑motion animation uses physical models moved between still photographs to create the illusion of motion."
      },
      {
        q: "A CGI dragon is animated in 3D software and then placed into live‑action footage of a real city. Which two areas of production does this mostly involve?",
        options: [
          "SFX and costume design",
          "VFX and CGI animation",
          "Stop‑motion and motion graphics",
          "Lighting and sound only",
          "Editing and colour grading only"
        ],
        answerIndex: 1,
        explanation:
          "The digital dragon is created using CGI and integrated into the live‑action plates using VFX compositing."
      },
      {
        q: "Which of these jobs would MOST likely work in a VFX studio?",
        options: ["Foley artist", "Newsreader", "Compositor", "Location scout", "Radio presenter"],
        answerIndex: 2,
        explanation:
          "Compositors combine multiple layers (live‑action, CGI, mattes) into a final seamless shot for VFX."
      },
      {
        q: "During a storm scene, rain and wind machines are used on set to soak the actors for real. Which technique is this?",
        options: ["VFX only", "CGI only", "SFX using practical rigs", "Motion Graphics", "Stop‑motion"],
        answerIndex: 2,
        explanation:
          "SFX can involve rain machines, wind machines and other practical rigs that affect the scene physically."
      },
      {
        q: "A director wants a character to shrink to the size of an ant. The actor is filmed against green screen and the background is scaled up digitally. What is this?",
        options: ["SFX stunt", "VFX scale manipulation", "Stop‑motion", "Live broadcast", "Motion Graphics"],
        answerIndex: 1,
        explanation:
          "VFX can change the apparent scale of actors by compositing them into enlarged or shrunken environments."
      },
      {
        q: "In post‑production, colour grading is used to make VFX shots match the rest of the film. Why is this important?",
        options: [
          "It hides the soundtrack",
          "It helps CGI and live‑action footage blend together",
          "It removes all SFX",
          "It increases file size only",
          "It stops motion blur"
        ],
        answerIndex: 1,
        explanation:
          "Matching colour and contrast helps CGI elements sit naturally in the same world as the live‑action footage."
      },
      {
        q: "Which option best sums up the difference between SFX and VFX?",
        options: [
          "SFX are physical effects created on set; VFX are added digitally in post‑production",
          "SFX are only sound; VFX are only video",
          "SFX are for games; VFX are for films",
          "There is no difference",
          "SFX are cheaper and never dangerous"
        ],
        answerIndex: 0,
        explanation:
          "SFX happen physically during filming, whereas VFX are digital changes made after filming."
      },
      {
        q: "Why might a production choose VFX instead of SFX for a dangerous explosion?",
        options: [
          "To avoid using any cameras",
          "Because digital explosions are safer and easier to control",
          "Because explosions cannot be animated",
          "Because VFX never take time to render",
          "Because health and safety is not important"
        ],
        answerIndex: 1,
        explanation:
          "VFX can simulate large dangerous events safely in software without putting cast or crew at risk."
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
  return t ? t.label : "Animation, SFX & VFX";
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

// === SCORE LOGGING (fire-and-forget GET via Apps Script) ===
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

// === LEADERBOARD FROM PUBLIC SHEET (Google Visualization API) ===
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

// === TABS & STATIC TEXT ===
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

// === START / RESTART HANDLERS ===
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
