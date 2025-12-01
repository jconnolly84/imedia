document.addEventListener("DOMContentLoaded", () => {
  const modeSelect = document.getElementById("modeSelect");
  const newGameBtn = document.getElementById("newGameBtn");
  const questionMarksEl = document.getElementById("questionMarks");
  const scenarioTextEl = document.getElementById("scenarioText");
  const stepLabelEl = document.getElementById("stepLabel");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const modelAnswerEl = document.getElementById("modelAnswer");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  // ---------------------------
  // DATA
  // ---------------------------

  const QUESTIONS = [
    {
      id: "workPlanSchedule",
      marksLabel: "2 marks – Explain one way a work plan helps keep a project on schedule.",
      scenario:
        "A team is creating a short promotional video for a local sports club. They have written a work plan.",
      pointQuestion: "Step 1 – Choose the best POINT:",
      points: [
        "A work plan shows what fonts you should use in the video.",
        "A work plan lists tasks with start and end dates.",
        "A work plan automatically edits the video for you.",
        "A work plan is a colourful poster for the club."
      ],
      correctPointIndex: 1,
      reasonQuestion: "Step 2 – Choose the best REASON to turn it into an explain answer:",
      reasons: [
        "So the team can see deadlines and check if they are running late, helping them stay on schedule.",
        "Because it makes the video look more exciting to the audience.",
        "So that the club can post it on social media.",
        "Because it is easier than using storyboards."
      ],
      correctReasonIndex: 0,
      modelAnswer:
        "A work plan lists tasks with start and end dates so the team can see deadlines and check if they are running late, which helps keep the project on schedule."
    },
    {
      id: "moodBoardBenefit",
      marksLabel: "2 marks – Explain one benefit of creating a mood board before designing a poster.",
      scenario:
        "A designer is planning an A3 poster to advertise a new music festival. They start by creating a mood board.",
      pointQuestion: "Step 1 – Choose the best POINT:",
      points: [
        "A mood board is a type of social media advert.",
        "A mood board shows ideas for colours, images and styles.",
        "A mood board is used to write the final text.",
        "A mood board is a finished version of the poster."
      ],
      correctPointIndex: 1,
      reasonQuestion: "Step 2 – Choose the best REASON:",
      reasons: [
        "So the poster can be printed in A3 size.",
        "So the designer can explore different looks and agree the style with the client before starting the final design.",
        "So the festival can be held outdoors.",
        "So the poster will always be in black and white."
      ],
      correctReasonIndex: 1,
      modelAnswer:
        "A mood board shows ideas for colours, images and styles so the designer can explore different looks and agree the style with the client before creating the final poster."
    },
    {
      id: "fileFormatExplain",
      marksLabel: "2 marks – Explain one reason why exporting a web banner as a JPEG file is suitable.",
      scenario:
        "A student designs a web banner advert for a game and exports it as a JPEG image file.",
      pointQuestion: "Step 1 – Choose the best POINT:",
      points: [
        "JPEG can use lossy compression to reduce file size.",
        "JPEG is an audio file format for podcasts.",
        "JPEG cannot be viewed on a web browser.",
        "JPEG always uses transparent backgrounds."
      ],
      correctPointIndex: 0,
      reasonQuestion: "Step 2 – Choose the best REASON:",
      reasons: [
        "So the banner can take up more storage space.",
        "So the banner can be edited in a word processor.",
        "So the file size is smaller and the banner loads quickly on a website.",
        "So the colours are always black and white."
      ],
      correctReasonIndex: 2,
      modelAnswer:
        "JPEG can use lossy compression to reduce file size, so the web banner file is smaller and will load more quickly on the website."
    },
    {
      id: "targetAudienceExplain",
      marksLabel: "3 marks – Explain one way a bright colour scheme can appeal to a teenage target audience.",
      scenario:
        "A social media advert for a dessert shop uses bright pastel colours and animated text aimed at teenagers aged 13–17.",
      pointQuestion: "Step 1 – Choose the best POINT:",
      points: [
        "Bright colours match the fun style teenagers see on social media.",
        "Bright colours are illegal in adverts.",
        "Bright colours are only suitable for older adults.",
        "Bright colours always mean danger."
      ],
      correctPointIndex: 0,
      reasonQuestion: "Step 2 – Choose the best REASON:",
      reasons: [
        "So the advert looks boring and serious.",
        "So the advert feels familiar and eye-catching for teenagers, which makes them more likely to notice and remember the shop.",
        "So the shop can close earlier.",
        "So the advert can be printed in black and white."
      ],
      correctReasonIndex: 1,
      modelAnswer:
        "Bright pastel colours match the fun style teenagers see on social media, so the advert feels familiar and eye-catching, making them more likely to notice and remember the dessert shop."
    },
    {
      id: "copyrightExplain",
      marksLabel: "2 marks – Explain one reason why a student should not use a copyrighted song in their video without permission.",
      scenario:
        "A student wants to add a popular chart song to the background of a video they will upload publicly.",
      pointQuestion: "Step 1 – Choose the best POINT:",
      points: [
        "Using a chart song without permission could infringe copyright.",
        "Using music in a video is always illegal.",
        "Copyright only applies to images, not music.",
        "Copyright law does not apply on the internet."
      ],
      correctPointIndex: 0,
      reasonQuestion: "Step 2 – Choose the best REASON:",
      reasons: [
        "So the video will always go viral.",
        "Because the copyright owner could ask for the video to be removed or take legal action, which could cause problems for the student or school.",
        "So the video will automatically be on TV.",
        "Because the sound quality will always be poor."
      ],
      correctReasonIndex: 1,
      modelAnswer:
        "Using a chart song without permission could infringe copyright because the owner could ask for the video to be removed or take legal action, which could cause problems for the student or school."
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let currentMode = "guided";
  let questionPool = [];
  let currentIndex = 0;
  let score = 0;
  let step = 1; // 1 = point, 2 = reason
  let selectedPointIndex = null;

  // ---------------------------
  // HELPERS
  // ---------------------------

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function resetFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    modelAnswerEl.textContent = "";
    modelAnswerEl.classList.add("hidden");
  }

  // ---------------------------
  // GAME LOGIC
  // ---------------------------

  function startGame() {
    currentMode = modeSelect.value || "guided";
    questionPool = shuffle(QUESTIONS);
    currentIndex = 0;
    score = 0;
    scoreDisplayEl.textContent = "0";
    questionTotalEl.textContent = questionPool.length.toString();
    step = 1;
    renderQuestion();
  }

  function renderQuestion() {
    resetFeedback();
    nextQuestionBtn.disabled = true;
    selectedPointIndex = null;
    step = 1;

    const q = questionPool[currentIndex];
    questionNumberEl.textContent = (currentIndex + 1).toString();
    questionMarksEl.textContent = q.marksLabel;
    scenarioTextEl.textContent = `${q.scenario}\n\n${q.pointQuestion}`;
    stepLabelEl.textContent = "Step 1 – Choose the best point";

    clearElement(answersContainer);

    q.points.forEach((text, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = text;
      btn.addEventListener("click", () => handlePointClick(index));
      answersContainer.appendChild(btn);
    });
  }

  function handlePointClick(index) {
    if (step !== 1) return;

    const q = questionPool[currentIndex];
    const buttons = Array.from(
      answersContainer.querySelectorAll(".answer-btn")
    );

    if (index === q.correctPointIndex) {
      // correct point
      selectedPointIndex = index;
      score++;
      scoreDisplayEl.textContent = score.toString();

      feedbackEl.textContent =
        "Good point – now add a reason to turn it into an explain answer.";
      feedbackEl.className = "feedback good";

      // In guided mode, highlight correct and dim others; in challenge mode limit the feedback a bit
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === index) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
        }
      });

      // Move to step 2
      step = 2;
      renderReasonStep();
    } else {
      // wrong point
      buttons[index].classList.add("wrong");
      buttons[index].disabled = true;

      if (currentMode === "guided") {
        feedbackEl.textContent =
          "That point is weak or off-topic. Try another that directly answers the question.";
      } else {
        feedbackEl.textContent = "Not the best point – think about what the question is asking.";
      }
      feedbackEl.className = "feedback bad";
    }
  }

  function renderReasonStep() {
    const q = questionPool[currentIndex];
    scenarioTextEl.textContent = `${q.scenario}\n\n${q.reasonQuestion}`;
    stepLabelEl.textContent = "Step 2 – Choose the best reason";

    clearElement(answersContainer);

    q.reasons.forEach((text, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = text;
      btn.addEventListener("click", () => handleReasonClick(index));
      answersContainer.appendChild(btn);
    });
  }

  function handleReasonClick(index) {
    if (step !== 2) return;

    const q = questionPool[currentIndex];
    const buttons = Array.from(
      answersContainer.querySelectorAll(".answer-btn")
    );

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctReasonIndex) {
        btn.classList.add("correct");
      }
      if (idx === index && idx !== q.correctReasonIndex) {
        btn.classList.add("wrong");
      }
    });

    if (index === q.correctReasonIndex) {
      score++;
      scoreDisplayEl.textContent = score.toString();
      feedbackEl.textContent =
        "Nice – that completes a strong explain answer with point + reason.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent =
        "Not quite. Check how clearly the reason links back to the question and impact on the project or audience.";
      feedbackEl.className = "feedback bad";
    }

    modelAnswerEl.textContent = "Model answer: " + q.modelAnswer;
    modelAnswerEl.classList.remove("hidden");

    if (currentIndex < questionPool.length - 1) {
      nextQuestionBtn.disabled = false;
    } else {
      nextQuestionBtn.disabled = true;
      feedbackEl.textContent += " You’ve reached the end of this set.";
    }
  }

  // ---------------------------
  // EVENTS
  // ---------------------------

  newGameBtn.addEventListener("click", () => {
    startGame();
  });

  nextQuestionBtn.addEventListener("click", () => {
    if (currentIndex < questionPool.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  });

  // Initial state
  questionTotalEl.textContent = QUESTIONS.length.toString();
});
