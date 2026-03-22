// Scene Detective – interactive mise-en-scène game
// Uses the same leaderboard sheet as iMedia Genius.

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";
const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

const SCENE_QUESTIONS = window.SCENE_QUESTIONS || [];

// DOM
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

const gameSection = document.getElementById("gameSection");
const gameOverSection = document.getElementById("gameOverSection");

const hudScore = document.getElementById("hudScore");
const hudQuestion = document.getElementById("hudQuestion");
const hudTotal = document.getElementById("hudTotal");
const hudStreak = document.getElementById("hudStreak");

const sceneTitleEl = document.getElementById("sceneTitle");
const sceneImageEl = document.getElementById("sceneImage");
const focusBadge = document.getElementById("focusBadge");
const focusText = document.getElementById("focusText");

const questionTextEl = document.getElementById("questionText");
const answersListEl = document.getElementById("answersList");

const explanationPanel = document.getElementById("explanationPanel");
const explanationHeading = document.getElementById("explanationHeading");
const explanationText = document.getElementById("explanationText");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const finalScoreEl = document.getElementById("finalScore");
const finalGradeEl = document.getElementById("finalGrade");
const finalCommentEl = document.getElementById("finalComment");
const finalSummaryEl = document.getElementById("finalSummary");
const restartBtn = document.getElementById("restartBtn");

const leaderboardContainer = document.getElementById("leaderboardContainer");

// STATE
let currentIndex = 0;
let score = 0;
let streak = 0;
let acceptingAnswers = false;

// Utility
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetGame() {
  currentIndex = 0;
  score = 0;
  streak = 0;
  acceptingAnswers = false;

  hudScore.textContent = "0";
  hudStreak.textContent = "0";
  hudQuestion.textContent = "1";
  hudTotal.textContent = SCENE_QUESTIONS.length.toString();

  explanationPanel.classList.add("hidden");
  answersListEl.innerHTML = "";
}

function startGame() {
  const name = (playerNameInput.value || "").trim();
  if (!name) {
    alert("Please enter your initials so we can log your score.");
    return;
  }
  if (!SCENE_QUESTIONS.length) {
    alert("No scene data loaded. Check that mise-en-scene-detective-data.js is included.");
    return;
  }

  resetGame();

  gameOverSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  loadQuestion();
}

function loadQuestion() {
  const question = SCENE_QUESTIONS[currentIndex];
  if (!question) {
    endGame();
    return;
  }

  hudQuestion.textContent = (currentIndex + 1).toString();
  hudTotal.textContent = SCENE_QUESTIONS.length.toString();

  sceneTitleEl.textContent = question.title || "Scene";
  sceneImageEl.src = question.image || "img/placeholder-mise-en-scene.png";
  sceneImageEl.alt = question.title || "Scene still";

  focusText.textContent = question.focus || "Mise-en-scène element";

  questionTextEl.textContent = question.question || "";
  explanationPanel.classList.add("hidden");

  const shuffledAnswers = shuffle(question.answers || []);
  answersListEl.innerHTML = "";

  shuffledAnswers.forEach((ans) => {
    const li = document.createElement("li");
    li.className = "answer-option";
    li.textContent = ans.text;
    li.dataset.correct = ans.correct ? "true" : "false";
    li.dataset.feedback = ans.feedback || "";
    li.addEventListener("click", onAnswerClick);
    answersListEl.appendChild(li);
  });

  acceptingAnswers = true;
}

function onAnswerClick(e) {
  if (!acceptingAnswers) return;
  acceptingAnswers = false;

  const clicked = e.currentTarget;
  const isCorrect = clicked.dataset.correct === "true";

  // lock options
  Array.from(answersListEl.children).forEach((li) => {
    li.classList.add("disabled");
    if (li.dataset.correct === "true") {
      li.classList.add("correct");
    }
  });

  if (isCorrect) {
    clicked.classList.add("correct");
    streak += 1;
    let gained = 100;
    if (streak >= 3) {
      gained += 25;
    }
    score += gained;
    explanationHeading.textContent = "Correct – nice eye!";
    const baseFeedback = clicked.dataset.feedback || "";
    const streakText = streak >= 3 ? " You also earned a streak bonus for consistent answers." : "";
    explanationText.textContent = baseFeedback + streakText;
  } else {
    clicked.classList.add("wrong");
    streak = 0;
    explanationHeading.textContent = "Not quite…";
    const feedback = clicked.dataset.feedback || "";
    explanationText.textContent =
      feedback ||
      "Look again at how props, costume, colour, lighting and framing work together to create meaning.";
  }

  hudScore.textContent = score.toString();
  hudStreak.textContent = streak.toString();

  // Add scene-level explanation if present
  const scene = SCENE_QUESTIONS[currentIndex];
  if (scene && scene.explanation) {
    explanationText.textContent += " " + scene.explanation;
  }

  explanationPanel.classList.remove("hidden");
}

function onNextQuestion() {
  currentIndex += 1;
  if (currentIndex >= SCENE_QUESTIONS.length) {
    endGame();
  } else {
    loadQuestion();
  }
}

function endGame() {
  gameSection.classList.add("hidden");
  gameOverSection.classList.remove("hidden");

  finalScoreEl.textContent = score.toString();

  let grade = "Pass";
  let comment =
    "You can identify some mise-en-scène choices, but you need to be more precise about how they create meaning.";
  let summary =
    "Revisit the scenes you found difficult and focus on one element at a time – props, costume, colour, lighting or framing.";

  if (score >= 900) {
    grade = "Distinction*";
    comment =
      "Outstanding visual analysis. You consistently spotted the most meaningful mise-en-scène details and linked them clearly to audience interpretation.";
    summary =
      "This level of detail is ideal for high-band exam responses when analysing still images or visual conventions in R097.";
  } else if (score >= 700) {
    grade = "Distinction";
    comment =
      "Strong understanding of mise-en-scène. You usually picked the most effective detail and explained how it shaped meaning.";
    summary =
      "Keep practising with new scenes so you can apply this skill to unseen exam images quickly and confidently.";
  } else if (score >= 500) {
    grade = "Merit";
    comment =
      "A good start. You recognised some key details but sometimes missed the element that had the biggest impact on meaning.";
    summary =
      "Try describing what each element suggests – for example, colours, lighting direction or character positioning – before choosing an answer.";
  }

  finalGradeEl.textContent = grade;
  finalCommentEl.textContent = comment;
  finalSummaryEl.textContent = summary;

  submitScore((playerNameInput.value || "Anonymous").trim(), score);
  setTimeout(loadLeaderboardFromFirebase, 800);
}

// Score logging
function submitScore(name, topicKey, scoreValue, questionsPlayed) {
  if (typeof topicKey === 'number' && typeof scoreValue === 'undefined') {
    scoreValue = topicKey;
    topicKey = window.TOPIC_KEY || location.pathname.split('/').pop().replace(/\.html$/i, '');
    questionsPlayed = (typeof currentQuestions !== 'undefined' && Array.isArray(currentQuestions)) ? currentQuestions.length : ((typeof questions !== 'undefined' && Array.isArray(questions)) ? questions.length : Number(questionsPlayed || 0));
  }
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

// Event listeners
startBtn.addEventListener("click", startGame);
nextQuestionBtn.addEventListener("click", onNextQuestion);
restartBtn.addEventListener("click", () => {
  gameOverSection.classList.add("hidden");
  gameSection.classList.add("hidden");
});

// Init
loadLeaderboardFromFirebase();
