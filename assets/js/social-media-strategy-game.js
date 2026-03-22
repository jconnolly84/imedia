// Social Media Strategy Arena – arcade edition
// Upgraded from a simple quiz to the full iMedia Genius arcade engine.
// Focus: Topic 05 – Social Media (platform choice, content types, scheduling, engagement, metrics).

/* === CONFIG === */
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const TOPIC_KEY = "socialMedia";

/* === QUESTION BANK (20 QUESTIONS) === */
const TOPICS = {
  [TOPIC_KEY]: {
    id: TOPIC_KEY,
    label: "05 – Social Media",
    questions: [
      {
        q: "A games company wants short, funny clips of gameplay that can go viral with teens. Which platform is the BEST primary focus?",
        options: ["LinkedIn", "TikTok", "Pinterest", "Email newsletter"],
        answerIndex: 1,
        explanation:
          "TikTok is ideal for short-form, vertical video aimed at younger audiences and viral trends."
      },
      {
        q: "A local bakery wants to show daily photos of cakes and behind-the-scenes stories to regular customers. Which platform and feature combo is MOST suitable?",
        options: [
          "Instagram feed posts and Stories",
          "X (Twitter) text-only posts",
          "LinkedIn career updates",
          "Reddit long text threads"
        ],
        answerIndex: 0,
        explanation:
          "Instagram suits visual content like food photos and Stories are great for daily, informal updates."
      },
      {
        q: "A charity wants to share an in-depth video explaining their work, with links to donate and a longer running time. What is the MOST suitable main format?",
        options: [
          "TikTok 10-second meme",
          "Instagram static image only",
          "YouTube long-form video",
          "Snapchat disappearing photo"
        ],
        answerIndex: 2,
        explanation:
          "YouTube works well for longer, detailed videos and allows clear links in descriptions."
      },
      {
        q: "A small clothing brand targets young adults and wants quick feedback using polls and interactive stickers. Which platform feature is BEST?",
        options: [
          "YouTube community posts",
          "Instagram Stories with polls",
          "LinkedIn articles",
          "Pinterest boards"
        ],
        answerIndex: 1,
        explanation:
          "Instagram Stories allow polls, questions and sliders which are perfect for quick feedback from followers."
      },
      {
        q: "A film studio wants an official account to release trailers, posters and announcements to a wide global audience in real time. Which platform is MOST appropriate?",
        options: ["X (Twitter)", "Snapchat", "Discord", "Pinterest"],
        answerIndex: 0,
        explanation:
          "X (Twitter) is commonly used for real-time announcements, trending topics and global conversation."
      },
      {
        q: "A company posts the same promotional image every day at random times. Engagement is dropping. What is the BEST change to improve results?",
        options: [
          "Post even more often with the same image",
          "Use a mix of content types and schedule posts at peak times",
          "Turn off comments completely",
          "Remove all hashtags"
        ],
        answerIndex: 1,
        explanation:
          "Varying content and posting when the audience is most active generally improves engagement."
      },
      {
        q: "A social media manager schedules posts for 7pm when their analytics show most followers are active. Which advantage does this MOST relate to?",
        options: [
          "Legal regulation",
          "Optimising post timing for maximum reach and engagement",
          "File compression",
          "Hardware performance"
        ],
        answerIndex: 1,
        explanation:
          "Scheduling at peak times helps reach more followers and improves engagement rates."
      },
      {
        q: "A campaign aims to increase brand awareness, not immediate sales. Which metric is MOST useful to judge success?",
        options: ["Number of refunds", "Impressions and reach", "CPU usage", "Office attendance"],
        answerIndex: 1,
        explanation:
          "Impressions and reach show how many people saw the content, which is key for awareness campaigns."
      },
      {
        q: "Which metric BEST shows that people are interacting and responding to social media content?",
        options: [
          "Engagement rate (likes, comments, shares)",
          "Screen resolution",
          "Number of devices in school",
          "Colour depth of images"
        ],
        answerIndex: 0,
        explanation:
          "Engagement rate measures likes, comments, shares and clicks, which shows how users are interacting with the content."
      },
      {
        q: "A brand keeps posting formal, text-heavy posts on Instagram. Young followers quickly scroll past. What is the BEST improvement?",
        options: [
          "Use longer paragraphs of text",
          "Switch to more visual content like Reels, photos and short captions",
          "Remove all images",
          "Only post once a year"
        ],
        answerIndex: 1,
        explanation:
          "Instagram is visual; switching to strong images and short video clips is more likely to engage younger followers."
      },
      {
        q: "A school wants to post official exam timetable updates and important announcements for parents. Which platform is MOST appropriate for formal communication?",
        options: ["TikTok", "Official school website and email / app", "Snapchat", "Gaming forums"],
        answerIndex: 1,
        explanation:
          "Official websites and school communication apps/email are more reliable and formal than informal social media platforms."
      },
      {
        q: "A games company is planning a live Q&A with developers, so fans can ask questions in real time. Which feature is MOST suitable?",
        options: [
          "Pre-recorded radio advert",
          "YouTube or Twitch live stream with chat",
          "Printed poster campaign",
          "Static blog article"
        ],
        answerIndex: 1,
        explanation:
          "Live streams with chat allow real-time interaction and questions from the audience."
      },
      {
        q: "A social media post gets a lot of likes, comments and shares but very few people click the link to buy the product. What does this MOST suggest?",
        options: [
          "High engagement but low conversion to sales",
          "High conversion but low engagement",
          "No one saw the post",
          "The platform is offline"
        ],
        answerIndex: 0,
        explanation:
          "Users are engaging with the post but not taking the final step to buy, so conversion is low."
      },
      {
        q: "A campaign uses the same hashtag across Instagram, TikTok and X (Twitter). What is the MAIN advantage of this approach?",
        options: [
          "It prevents comments",
          "It builds a recognisable, trackable tag across multiple platforms",
          "It disables analytics",
          "It automatically translates posts"
        ],
        answerIndex: 1,
        explanation:
          "A consistent hashtag helps users follow the campaign and allows easier tracking of posts across platforms."
      },
      {
        q: "A brand replies to comments, thanks users for sharing and answers questions quickly. What is the MAIN benefit of this behaviour?",
        options: [
          "Reduces the file size of images",
          "Builds community and improves brand loyalty",
          "Stops people from following",
          "Avoids all engagement"
        ],
        answerIndex: 1,
        explanation:
          "Responding to followers builds relationships, trust and a sense of community around the brand."
      },
      {
        q: "A content calendar shows posts planned for the next month: topics, platforms, dates and times. What is the MAIN reason for using this tool?",
        options: [
          "To block followers from commenting",
          "To plan consistent, organised social content",
          "To compress image files",
          "To change the school timetable"
        ],
        answerIndex: 1,
        explanation:
          "A content calendar ensures posts are planned, consistent and aligned with campaign goals."
      },
      {
        q: "A social media manager tests two versions of the same advert: one with a photo, one with a short video. They compare click-through rates. What is this process called?",
        options: ["Compression testing", "A/B testing", "Hardware benchmarking", "Storyboard testing"],
        answerIndex: 1,
        explanation:
          "A/B testing compares two versions of content to see which performs better with the audience."
      },
      {
        q: "A small indie band wants to grow their fanbase by sharing short performance clips, behind-the-scenes footage and responding to comments. Which platform is MOST suitable as a main focus?",
        options: ["LinkedIn", "TikTok or Instagram Reels", "Corporate intranet", "Email only"],
        answerIndex: 1,
        explanation:
          "TikTok and Instagram Reels are strong for music discovery, short video and interacting with fans."
      },
      {
        q: "A campaign is targeted at professionals in the tech industry, promoting a new B2B software service. Which platform is MOST appropriate as the primary channel?",
        options: ["LinkedIn", "Snapchat", "TikTok only", "Pinterest"],
        answerIndex: 0,
        explanation:
          "LinkedIn focuses on professional and B2B networking, making it suitable for a software service aimed at businesses."
      },
      {
        q: "Why is it important to follow platform guidelines and community standards when posting social media content?",
        options: [
          "It guarantees exam marks",
          "It helps avoid content removal, bans and legal issues",
          "It makes images higher resolution",
          "It automatically boosts file compression"
        ],
        answerIndex: 1,
        explanation:
          "Following guidelines reduces the risk of posts being removed or accounts being restricted and ensures content is appropriate."
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
  return t ? t.label : "Social Media";
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
