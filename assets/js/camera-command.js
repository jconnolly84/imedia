// Camera Command – interactive shots, angles & movement game
// Uses the same class leaderboard system as the other iMedia Genius games.


const CAMERA_QUESTIONS = window.CAMERA_QUESTIONS || [];

// DOM references
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");

const gameSection = document.getElementById("gameSection");
const gameOverSection = document.getElementById("gameOverSection");

const hudScore = document.getElementById("hudScore");
const hudQuestion = document.getElementById("hudQuestion");
const hudTotal = document.getElementById("hudTotal");
const hudStreak = document.getElementById("hudStreak");
const hudTrack = document.getElementById("hudTrack");

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
let questionOrder = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let acceptingAnswers = false;

// Utility: Fisher–Yates shuffle
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetGame() {
  questionOrder = shuffle(CAMERA_QUESTIONS);
  currentIndex = 0;
  score = 0;
  streak = 0;
  acceptingAnswers = false;

  hudScore.textContent = "0";
  hudStreak.textContent = "0";
  hudQuestion.textContent = "1";
  hudTotal.textContent = questionOrder.length.toString();
  hudTrack.textContent = "Mixed";

  explanationPanel.classList.add("hidden");
  answersListEl.innerHTML = "";
}

function startGame() {
  const name = (playerNameInput.value || "Student").trim() || "Student";

  if (!CAMERA_QUESTIONS.length) {
    alert("No camera data loaded. Check that camera-command-data.js is included.");
    return;
  }

  resetGame();
  gameOverSection.classList.add("hidden");
  gameSection.classList.remove("hidden");

  loadQuestion();
}

function loadQuestion() {
  const question = questionOrder[currentIndex];
  if (!question) {
    endGame();
    return;
  }

  hudQuestion.textContent = (currentIndex + 1).toString();
  hudTotal.textContent = questionOrder.length.toString();
  hudTrack.textContent = question.track || "Mixed";

  sceneTitleEl.textContent = question.title || "Scenario";
  sceneImageEl.src = question.image || "img/camera-placeholder.png";
  sceneImageEl.alt = question.title || "Camera scenario";

  focusText.textContent = question.focus || "Camera technique";
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

  Array.from(answersListEl.children).forEach((li) => {
    li.classList.add("disabled");
    if (li.dataset.correct === "true") {
      li.classList.add("correct");
    }
  });

  const scene = questionOrder[currentIndex];

  if (isCorrect) {
    clicked.classList.add("correct");
    streak += 1;
    let gained = 100;
    if (streak >= 3) {
      gained += 25;
    }
    score += gained;
    explanationHeading.textContent = "Correct – nice camera choice!";
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
      "Re-read the scenario and think about what information the audience needs from the shot, angle or movement.";
  }

  hudScore.textContent = score.toString();
  hudStreak.textContent = streak.toString();

  if (scene && scene.explanation) {
    explanationText.textContent += " " + scene.explanation;
  }

  explanationPanel.classList.remove("hidden");
}

function onNextQuestion() {
  currentIndex += 1;
  if (currentIndex >= questionOrder.length) {
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
    "You have some understanding of shot types, angles and movement, but you need to be more precise about how they affect meaning.";
  let summary =
    "Revisit your revision pack and focus on when each shot or movement is chosen – what does it tell the audience?";

  if (score >= 1200) {
    grade = "Distinction*";
    comment =
      "Excellent work. You consistently chose camera techniques that matched the brief and could explain their effect on meaning and mood.";
    summary =
      "This level of understanding is ideal for high-band exam answers that analyse how camera and lighting create impact.";
  } else if (score >= 900) {
    grade = "Distinction";
    comment =
      "Strong understanding. You usually chose appropriate shots and movements, with only a few slips.";
    summary =
      "Keep practising with new examples so you can quickly pick the best camera choice in exam scenarios.";
  } else if (score >= 700) {
    grade = "Merit";
    comment =
      "A good attempt. You recognised some key camera ideas but sometimes picked options that didn’t fully match the scenario.";
    summary =
      "When revising, ask yourself: what does the director want the audience to feel or notice in this moment? Choose shots that support that goal.";
  }

  finalGradeEl.textContent = grade;
  finalCommentEl.textContent = comment;
  finalSummaryEl.textContent = summary;

  submitScore((playerNameInput.value || "Student").trim(), score);
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
    leaderboardContainer.innerHTML = "<p class='leaderboard-note'>Launch this game from the worksheet app to view your class leaderboard.</p>";
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
