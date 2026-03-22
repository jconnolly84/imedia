// colour-critic.js
// Game logic for Colour Critic – uses window.COLOUR_CRITIC_QUESTIONS from colour-critic-data.js

(function () {
  const questions = (window.COLOUR_CRITIC_QUESTIONS || []).slice();

  // === SHARED LEADERBOARD CONFIG (same as iMedia Genius) ===
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbzrw-GfhZm1Lxtm4kUHqUmUV1rzYbBRJ875twjme9SObdLeNu9AwzwerrM70N9YiLTKCg/exec";

  const SHEET_ID = "10HJ2Az6GC8m-QFoibX-X0-izyszocRhzgfizY9bwoGg";

  // We'll log Colour Critic games under a dedicated topic key
  const COLOUR_CRITIC_TOPIC_KEY = "colourCritic";

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
      console.log("Submitting Colour Critic score to:", img.src);
    } catch (err) {
      console.error("Error creating Colour Critic score beacon:", err);
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
        // const timestamp = (r[4] && r[4].v) || "";

        entries.push({ name, score, topicLabel, topicId });
      }

      const leaderboardContainer = document.getElementById("leaderboardContainer");
      if (!leaderboardContainer) return;

      if (!entries.length) {
        leaderboardContainer.innerHTML =
          "<p class='leaderboard-note'>No scores yet. Play a game to be the first on the board!</p>";
        return;
      }

      // Sort by score descending
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
            </tr>
          `;
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
      console.error("Error rendering Colour Critic leaderboard:", err);
      const leaderboardContainer = document.getElementById("leaderboardContainer");
      if (leaderboardContainer) {
        leaderboardContainer.innerHTML =
          "<p class='leaderboard-note'>Couldn't load leaderboard. Check sheet sharing or try again.</p>";
      }
    }
  }

  function loadLeaderboardFromSheet() {
    const leaderboardContainer = document.getElementById("leaderboardContainer");
    if (leaderboardContainer) {
      leaderboardContainer.innerHTML =
        "<p class='leaderboard-note'>Loading leaderboard...</p>";
    }

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



  // Expose leaderboard callback globally for Google Visualization API
  if (typeof window !== "undefined") {
    window.renderLeaderboardFromSheet = renderLeaderboardFromSheet;
  }

  // --- Simple utility helpers ---
  function shuffle(array) {
    // Fisher–Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function calculateGrade(score, maxScore) {
    if (maxScore <= 0) return { grade: "N/A", comment: "No questions loaded." };
    const pct = (score / maxScore) * 100;
    if (pct >= 90) {
      return {
        grade: "A*",
        comment:
          "Outstanding – you are thinking like a top‑band R093 candidate. Your comments on colour, branding and typography would impress an examiner."
      };
    } else if (pct >= 75) {
      return {
        grade: "A",
        comment:
          "Excellent work. You clearly understand how palette, layout and font choice affect audience and purpose."
      };
    } else if (pct >= 60) {
      return {
        grade: "B",
        comment:
          "Secure understanding. With a little more precise exam language you could push into the top band."
      };
    } else if (pct >= 40) {
      return {
        grade: "C",
        comment:
          "Developing. Use the explanations to plug gaps in your knowledge, then replay to see your score rise."
      };
    } else {
      return {
        grade: "D",
        comment:
          "Don’t panic – use this round as a revision map. Re‑read each explanation, then try again to see improvement."
      };
    }
  }

  // Randomise question order for replay value
  shuffle(questions);

  // --- DOM references ---
  const introCard = document.getElementById("introCard");
  const gameCard = document.getElementById("gameCard");
  const gameOverCard = document.getElementById("gameOverCard");

  const playerNameInput = document.getElementById("playerName");
  const startBtn = document.getElementById("startBtn");

  const hudScore = document.getElementById("hudScore");
  const hudQuestion = document.getElementById("hudQuestion");
  const hudTotal = document.getElementById("hudTotal");
  const hudTrack = document.getElementById("hudTrack");
  const hudFocus = document.getElementById("hudFocus");

  const questionImage = document.getElementById("questionImage");
  const briefText = document.getElementById("briefText");
  const questionText = document.getElementById("questionText");
  const answersList = document.getElementById("answersList");

  const explanationPanel = document.getElementById("explanationPanel");
  const explanationHeading = document.getElementById("explanationHeading");
  const explanationText = document.getElementById("explanationText");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");

  const finalScore = document.getElementById("finalScore");
  const finalGrade = document.getElementById("finalGrade");
  const finalComment = document.getElementById("finalComment");
  const finalSummary = document.getElementById("finalSummary");
  const restartBtn = document.getElementById("restartBtn");

  const timerPill = document.getElementById("timerPill");
  const timerBar = document.getElementById("timerBar");
  const timerLabel = document.getElementById("timerLabel");

  // --- Game state ---
  let currentIndex = 0;
  let score = 0;
  let hasAnswered = false;
  let playerName = "";
  let timerId = null;
  const SECONDS_PER_QUESTION = 25;

  // Track strengths by topic so the final feedback can say
  // what the student is strongest / weakest at.
  const trackStats = {};

  if (!questions.length) {
    console.error("No questions found in window.COLOUR_CRITIC_QUESTIONS.");
  }

  hudTotal.textContent = questions.length.toString();

  function showIntro() {
    introCard.classList.remove("hidden");
    gameCard.classList.add("hidden");
    gameOverCard.classList.add("hidden");
    clearTimer();
  }

  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer(onExpire) {
    clearTimer();
    let remaining = SECONDS_PER_QUESTION;
    if (timerLabel) timerLabel.textContent = remaining.toString();
    if (timerBar) {
      timerBar.style.width = "100%";
    }

    timerId = setInterval(() => {
      remaining -= 1;
      if (remaining < 0) {
        clearTimer();
        if (typeof onExpire === "function") onExpire();
        return;
      }
      if (timerLabel) timerLabel.textContent = remaining.toString();

      const pct = (remaining / SECONDS_PER_QUESTION) * 100;
      if (timerBar) {
        timerBar.style.width = pct + "%";
      }
    }, 1000);
  }

  function startGame() {
    if (!questions.length) return;

    playerName = (playerNameInput.value || "Player").trim();
    score = 0;
    currentIndex = 0;
    Object.keys(trackStats).forEach((key) => delete trackStats[key]);

    hudScore.textContent = "0";
    hudQuestion.textContent = "1";

    introCard.classList.add("hidden");
    gameOverCard.classList.add("hidden");
    gameCard.classList.remove("hidden");

    renderQuestion();
  }

  
  function renderQuestion() {
    hasAnswered = false;
    clearTimer();

    explanationPanel.classList.add("hidden");
    explanationHeading.textContent = "Explanation";
    explanationText.textContent = "";
    answersList.innerHTML = "";

    const q = questions[currentIndex];
    if (!q) return;

    hudTrack.textContent = q.track || "";
    hudFocus.textContent = q.focus || "";

    briefText.textContent = q.brief || "";
    questionText.textContent = q.question || "";

    if (q.image) {
      questionImage.src = q.image;
      questionImage.alt = q.focus || "Design example";
      questionImage.classList.remove("hidden");
    } else {
      questionImage.classList.add("hidden");
      questionImage.removeAttribute("src");
    }

    // Shuffle answers so the correct one is not always at the top
    const shuffledAnswers = shuffle((q.answers || []).map((a) => ({ ...a })));

    shuffledAnswers.forEach((answer, idx) => {
      const li = document.createElement("li");
      li.className = "answer-chip";
      li.textContent = answer.text;
      li.dataset.index = idx.toString();
      if (answer.correct) {
        li.dataset.correct = "true";
      }
      li.addEventListener("click", () => handleAnswerClick(li, q, answer));
      answersList.appendChild(li);
    });

    hudQuestion.textContent = (currentIndex + 1).toString();

    // Set button text depending on position in quiz
    if (currentIndex === questions.length - 1) {
      nextQuestionBtn.textContent = "Finish ▶";
    } else {
      nextQuestionBtn.textContent = "Next Question ▶";
    }

    // Start countdown for this question
    if (timerPill) timerPill.classList.remove("hidden");
    startTimer(() => {
      if (!hasAnswered) {
        // Time up without an answer
        const chips = answersList.querySelectorAll(".answer-chip");
        chips.forEach((chip) => {
          chip.classList.add("disabled");
        });

        const correctChip = answersList.querySelector(
          '.answer-chip[data-correct="true"]'
        );
        if (correctChip) {
          correctChip.classList.add("correct");
        }

        hasAnswered = true;
        explanationHeading.textContent = "Time’s up!";
        const extra =
          " In the real R093 exam you must work quickly and confidently – don’t spend too long on one question.";
        explanationText.textContent = (q.explanation || "") + extra;
        explanationPanel.classList.remove("hidden");
      }
    });
  }
function updateTrackStat(track, correct) {
    if (!track) return;
    if (!trackStats[track]) {
      trackStats[track] = { correct: 0, total: 0 };
    }
    trackStats[track].total += 1;
    if (correct) trackStats[track].correct += 1;
  }

  
  function handleAnswerClick(li, question, answer) {
    if (hasAnswered) return;
    hasAnswered = true;
    clearTimer();

    // Disable all chips & mark right/wrong
    const chips = answersList.querySelectorAll(".answer-chip");
    chips.forEach((chip) => {
      chip.classList.add("disabled");
    });

    if (answer.correct) {
      li.classList.add("correct");
      // Small time bonus: + up to 40 extra points for quick answers
      let bonus = 0;
      if (timerLabel) {
        const remaining = parseInt(timerLabel.textContent || "0", 10) || 0;
        bonus = Math.min(40, remaining * 2);
      }
      const base = 100;
      const earned = base + bonus;
      score += earned;
      hudScore.textContent = score.toString();

      explanationHeading.textContent = "Correct!";
      explanationText.textContent =
        (question.feedbackCorrect ||
          question.explanation ||
          "Good decision – this matches the brief and target audience.") +
        (bonus > 0
          ? ` You also earned a ${bonus} point time bonus for a quick decision.`
          : "");
      updateTrackStat(question.track, true);
    } else {
      li.classList.add("wrong");

      // highlight the correct answer chip (based on data attribute)
      const correctChip = answersList.querySelector(
        '.answer-chip[data-correct="true"]'
      );
      if (correctChip) {
        correctChip.classList.add("correct");
      }

      explanationHeading.textContent = "Not quite…";
      explanationText.textContent =
        question.feedbackWrong ||
        question.explanation ||
        "Check the brief, target audience and how colour/typography choices affect the message.";
      updateTrackStat(question.track, false);
    }

    explanationPanel.classList.remove("hidden");
  }
function nextQuestion() {
    if (!hasAnswered) {
      // Optional: prevent skipping without answering
      return;
    }

    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      endGame();
    }
  }

  function buildTrackSummary() {
    const parts = [];
    for (const [track, stats] of Object.entries(trackStats)) {
      if (!stats.total) continue;
      const pct = Math.round((stats.correct / stats.total) * 100);
      let phrase = "";
      if (pct >= 80) {
        phrase = "a real strength";
      } else if (pct >= 60) {
        phrase = "fairly strong";
      } else if (pct >= 40) {
        phrase = "developing";
      } else {
        phrase = "a focus area for revision";
      }
      parts.push(`${track} (${pct}% – ${phrase})`);
    }
    if (!parts.length) return "";
    return "Your topic breakdown: " + parts.join("; ") + ".";
  }

  function endGame() {
    clearTimer();
    gameCard.classList.add("hidden");
    gameOverCard.classList.remove("hidden");

    const maxScore = questions.length * 140; // 100 + up to 40 bonus each
    finalScore.textContent = score.toString();

    const { grade, comment } = calculateGrade(score, maxScore);
    finalGrade.textContent = grade;
    finalComment.textContent = comment;

    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const nameBit = playerName ? `${playerName}, ` : "";
    finalSummary.textContent =
      `${nameBit}you scored ${score} out of ${maxScore} (about ${pct}%). ` +
      "Use this to check how confident you are with design decisions before tackling full exam questions. " +
      buildTrackSummary();

    // Log score to the shared iMedia Genius leaderboard
    try {
      const safeName = (playerName && playerName.trim()) || "Anonymous";
      submitScore(safeName, COLOUR_CRITIC_TOPIC_KEY, score, questions.length);
      // Refresh leaderboard after a short delay to give Apps Script time to log
      setTimeout(loadLeaderboardFromSheet, 900);
    } catch (err) {
      console.error("Error submitting Colour Critic score:", err);
    }
  }

  function restartGame() {
    showIntro();
  }

  // --- Event wiring ---
  document.addEventListener("DOMContentLoaded", () => {
    if (startBtn) startBtn.addEventListener("click", startGame);
    if (nextQuestionBtn) nextQuestionBtn.addEventListener("click", nextQuestion);
    if (restartBtn) restartBtn.addEventListener("click", restartGame);

    // Load the shared leaderboard as soon as the page is ready
    try {
      loadLeaderboardFromSheet();
    } catch (err) {
      console.error("Error loading Colour Critic leaderboard on init:", err);
    }
  });
})();
