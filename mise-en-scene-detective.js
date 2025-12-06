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
  setTimeout(loadLeaderboardFromSheet, 800);
}

// Score logging
function submitScore(name, score) {
  try {
    const params = new URLSearchParams();
    params.append("action", "submitScore");
    params.append("name", name);
    params.append("topic", "SceneDetective");
    params.append("score", String(score));
    params.append("questionsPlayed", String(SCENE_QUESTIONS.length));
    params.append("timestamp", new Date().toISOString());

    const img = new Image();
    img.src = GAS_URL + "?" + params.toString();
    console.log("Submitting score to:", img.src);
  } catch (err) {
    console.error("Error creating score beacon:", err);
  }
}

// Basic shared leaderboard (top 10 all topics)
function renderLeaderboardFromSheet(response) {
  try {
    const table = response.table;
    const rows = table.rows || [];
    const entries = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].c;
      const name = (r[0] && r[0].v) || "";
      if (!name || name.toLowerCase() === "name") continue;

      const scoreVal = (r[1] && r[1].v) || 0;
      const topicLabel = (r[2] && r[2].v) || "";
      const topicId = (r[3] && r[3].v) || "";

      entries.push({ name, score: scoreVal, topicLabel, topicId });
    }

    if (!entries.length) {
      leaderboardContainer.innerHTML =
        "<p class='leaderboard-note'>No scores yet. Play any iMedia Genius game to be first on the board!</p>";
      return;
    }

    entries.sort((a, b) => b.score - a.score);

    const rowsHtml = entries
      .map((e, i) => {
        const place = i + 1;
        const topic = e.topicLabel || e.topicId || "All Topics";
        return `
          <tr>
            <td>${place}</td>
            <td>${e.name}</td>
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

// Event listeners
startBtn.addEventListener("click", startGame);
nextQuestionBtn.addEventListener("click", onNextQuestion);
restartBtn.addEventListener("click", () => {
  gameOverSection.classList.add("hidden");
  gameSection.classList.add("hidden");
});

// Init
loadLeaderboardFromSheet();
