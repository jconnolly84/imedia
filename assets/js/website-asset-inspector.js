// Website Asset Inspector – arcade edition
// Upgraded from a simple 3‑question quiz to the full iMedia Genius arcade engine.
// Focus: Topic 06 – Website Assets (formats, optimisation, filenames, accessibility).

/* === CONFIG === */
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "websiteAssets";

/* === QUESTION BANK (20 QUESTIONS) === */
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "06 – Website Assets",
    questions: [
      {
        q: "A homepage banner image looks blurry and blocky on a large desktop screen. What is the MOST likely cause?",
        options: [
          "Low‑resolution image has been scaled up",
          "The file has no alt text",
          "The image is saved as PNG instead of JPG",
          "The image file name uses hyphens"
        ],
        answerIndex: 0,
        explanation:
          "If a small, low‑resolution image is stretched to fill a large space it becomes pixelated. Use higher‑resolution assets for large banners."
      },
      {
        q: "On the live Linux server, an image called 'logo.png' does not appear. The HTML references 'Logo.png'. What caused the broken image?",
        options: [
          "The image is not compressed",
          "Case‑sensitive file naming caused a mismatch",
          "The image is in the wrong folder",
          "The file is too large"
        ],
        answerIndex: 1,
        explanation:
          "Linux servers treat 'logo.png' and 'Logo.png' as different files. Always use consistent lower‑case names."
      },
      {
        q: "A gallery page has ten photos that are each 10MB. The page loads very slowly. What is the BEST optimisation?",
        options: [
          "Change the file names to be shorter",
          "Use higher resolution images",
          "Resize the images and compress them to reduce file size",
          "Convert all images to BMP format"
        ],
        answerIndex: 2,
        explanation:
          "Web images should be resized to appropriate dimensions and compressed (e.g. JPG/WEBP) to keep file sizes small and pages fast."
      },
      {
        q: "A site uses a large PNG for a photo‑style image when a compressed JPG would look the same to users. What is the MAIN issue?",
        options: [
          "PNG does not support transparency",
          "PNG files are usually larger, so loading is slower",
          "JPG cannot be used on the web",
          "PNG images are always pixelated"
        ],
        answerIndex: 1,
        explanation:
          "Photo‑style images often work well as JPG/WEBP. Using PNG can create unnecessarily large files and slower load times."
      },
      {
        q: "Which file format is MOST suitable for a simple flat‑colour logo that needs transparency on a website?",
        options: ["JPG", "GIF", "PNG", "BMP"],
        answerIndex: 2,
        explanation:
          "PNG supports transparency and handles flat colours cleanly, making it ideal for logos on the web."
      },
      {
        q: "What is a GOOD example of a descriptive, web‑friendly file name for an image of a school library on the homepage?",
        options: [
          "IMG0001.PNG",
          "photo1.png",
          "SchoolLibFinalFINALv3.png",
          "school-library-homepage-hero.png"
        ],
        answerIndex: 3,
        explanation:
          "Using lower‑case, hyphens and keywords (school, library, homepage, hero) improves organisation and SEO."
      },
      {
        q: "Why is it important to add alt text to images on a website?",
        options: [
          "To make files smaller",
          "To help search engines and screen readers understand the image content",
          "To change the image resolution",
          "To disable right‑click saving"
        ],
        answerIndex: 1,
        explanation:
          "Alt text improves accessibility for visually impaired users and helps search engines understand image content."
      },
      {
        q: "A product image looks crisp on desktop but appears tiny and hard to see on mobile devices. What is the BEST solution?",
        options: [
          "Use responsive images or CSS to scale the image for different screen sizes",
          "Increase the file size",
          "Remove the image completely",
          "Rename the file"
        ],
        answerIndex: 0,
        explanation:
          "Responsive design ensures images resize or swap appropriately for different devices, improving usability."
      },
      {
        q: "A background texture file is 4000×4000 pixels, but it is displayed as a small tile repeating across the page. How could you optimise this asset?",
        options: [
          "Increase the resolution further",
          "Use a much smaller repeating pattern image",
          "Convert it to BMP format",
          "Add more keywords to the file name"
        ],
        answerIndex: 1,
        explanation:
          "A small repeating pattern will load faster and still give the same tiled background effect."
      },
      {
        q: "Which option BEST explains why you might choose WEBP format for website images?",
        options: [
          "It is only used for audio",
          "It provides good quality at smaller file sizes compared to JPG/PNG",
          "It cannot be viewed in browsers",
          "It is required by all exam boards"
        ],
        answerIndex: 1,
        explanation:
          "WEBP is a modern format that can give similar or better quality than JPG/PNG at smaller file sizes."
      },
      {
        q: "A developer compresses images too aggressively and they look blocky and low quality. What has gone wrong?",
        options: [
          "File names are incorrect",
          "The colour depth is too high",
          "The compression level was set too high, reducing quality too much",
          "Alt text was not added"
        ],
        answerIndex: 2,
        explanation:
          "Over‑compressing images reduces quality. Compression should balance smaller file size with acceptable visual quality."
      },
      {
        q: "A page uses large unoptimised images, auto‑playing video and many heavy scripts, causing a poor user experience. Which statement is MOST accurate?",
        options: [
          "Only the alt text needs changing",
          "This can increase bounce rate as users leave slow sites",
          "This has no effect on user behaviour",
          "It will always improve search rankings"
        ],
        answerIndex: 1,
        explanation:
          "Slow, heavy pages can frustrate users and cause them to leave quickly, harming engagement and possibly search ranking."
      },
      {
        q: "A developer uses one large 'sprite sheet' containing many small icons instead of loading each icon as a separate image. What is the MAIN benefit?",
        options: [
          "It makes the icons higher resolution",
          "It reduces the number of HTTP requests, helping the page load faster",
          "It removes the need for alt text",
          "It prevents caching"
        ],
        answerIndex: 1,
        explanation:
          "Sprite sheets bundle many icons into one request, which can improve loading performance."
      },
      {
        q: "Why is it helpful to store website assets in organised folders (e.g. /img, /audio, /css)?",
        options: [
          "So assets are not visible in the browser",
          "To make it easier to manage, update and reference files",
          "To force higher resolution",
          "To automatically compress files"
        ],
        answerIndex: 1,
        explanation:
          "Logical folder structures help teams find files quickly and keep code references tidy."
      },
      {
        q: "Which of the following is a GOOD reason to use lazy loading for images?",
        options: [
          "To make all images load at once",
          "To delay loading off‑screen images until the user scrolls to them",
          "To remove alt text requirements",
          "To increase file size"
        ],
        answerIndex: 1,
        explanation:
          "Lazy loading improves performance by only loading images when they are needed on screen."
      },
      {
        q: "A 'Download' button uses a tiny, poorly contrasted icon that is hard to see against the background. Which TWO issues does this MOST relate to?",
        options: [
          "Resolution and contrast/accessibility",
          "File permissions and caching",
          "Compression and file naming",
          "Folder structure and links"
        ],
        answerIndex: 0,
        explanation:
          "Icons should be high enough resolution and have clear contrast to support usability and accessibility."
      },
      {
        q: "Which statement BEST describes a 'hero image' on a website?",
        options: [
          "A small icon used in navigation",
          "A large, eye‑catching image at the top of a page",
          "A hidden background pattern",
          "Any image with alt text"
        ],
        answerIndex: 1,
        explanation:
          "A hero image is a prominent large image used to grab attention at the top of a page or section."
      },
      {
        q: "A site uses many large video files that autoplay with sound on every page. Why is this usually a bad idea?",
        options: [
          "Videos cannot be used on websites",
          "It can annoy users and use lots of data and bandwidth",
          "It always improves accessibility",
          "Browsers will crash instantly"
        ],
        answerIndex: 1,
        explanation:
          "Autoplaying video with sound can frustrate users and increase data usage, especially on mobile connections."
      },
      {
        q: "Which option is the BEST example of planning assets effectively before building a website?",
        options: [
          "Uploading any images with random names",
          "Creating an asset list with file names, formats, locations and permissions",
          "Only choosing one image format for everything",
          "Ignoring alt text until the site is finished"
        ],
        answerIndex: 1,
        explanation:
          "An asset list or asset log helps track what files are needed, where they are stored and any legal considerations."
      },
      {
        q: "Why is it important to test a website’s images and assets on different devices and browsers?",
        options: [
          "So the CSS file will become smaller",
          "To ensure assets load correctly, look clear and are usable for all users",
          "Because it automatically compresses images",
          "To remove the need for alt text"
        ],
        answerIndex: 1,
        explanation:
          "Testing on multiple devices and browsers checks that images display correctly and that performance and accessibility are acceptable for all users."
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
  return t ? t.label : "Website Assets";
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

  setTimeout(loadLeaderboardFromFirebase, 800);
}

/* === SCORE LOGGING === */
function submitScore(name, topicKey, scoreValue, questionsPlayed) {
  const service = window.imediaGameScores;
  if (!service || typeof service.submitScore !== 'function') return;
  const maxScore = Number(questionsPlayed || 0);
  service.submitScore({
    playerName: String(name || '').trim(),
    topicKey: String(topicKey || window.TOPIC_KEY || '').trim(),
    gameId: String(topicKey || window.TOPIC_KEY || document.body?.dataset?.topicKey || location.pathname.split('/').pop().replace(/\.html$/i, '') || 'game'),
    gameTitle: document.title || 'Game',
    score: Number(scoreValue || 0),
    maxScore,
    questionsPlayed: maxScore
  });
}

function loadLeaderboardFromFirebase() {
  const service = window.imediaGameScores;
  if (!leaderboardContainer) return;
  if (!service || typeof service.loadLeaderboard !== 'function') {
    leaderboardContainer.innerHTML = "<p class='leaderboard-note'>Class leaderboard unavailable right now.</p>";
    return;
  }
  service.loadLeaderboard({
    container: leaderboardContainer,
    topicKey: String(window.TOPIC_KEY || document.body?.dataset?.topicKey || location.pathname.split('/').pop().replace(/\.html$/i, '') || 'game')
  });
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
    alert("Please enter your name to start. Scores save to your class board when launched from the worksheet app.");
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
loadLeaderboardFromFirebase();

if (startBtn) startBtn.addEventListener("click", startGameHandler);
if (restartBtn) restartBtn.addEventListener("click", restartGameHandler);
