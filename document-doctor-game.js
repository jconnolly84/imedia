document.addEventListener("DOMContentLoaded", () => {
  const modeSelect = document.getElementById("modeSelect");
  const newGameBtn = document.getElementById("newGameBtn");
  const questionTextEl = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");
  const modeLabelEl = document.getElementById("modeLabel");

  // ---------------------------
  // DATA
  // ---------------------------

  const DOC_TYPE_QUESTIONS = [
    {
      text: "A client wants a single page sketch showing the layout of images and text for a magazine advert. Which pre‑production document is MOST suitable?",
      options: [
        "Mind map",
        "Visualisation diagram",
        "Storyboard",
        "Work plan"
      ],
      correctIndex: 1,
      explanation: "A visualisation diagram is used to plan the layout of a still image such as a poster or magazine advert."
    },
    {
      text: "You need to plan the different shots and audio for a TV advert, frame by frame. Which document should you create?",
      options: [
        "Storyboard",
        "Script",
        "Mood board",
        "Visualisation diagram"
      ],
      correctIndex: 0,
      explanation: "A storyboard shows a sequence of frames, camera shots and audio for moving image products."
    },
    {
      text: "The client has asked for early ideas, colours and inspiration for a new app home screen. Which document would best show this?",
      options: [
        "Mood board",
        "Work plan",
        "Script",
        "Storyboard"
      ],
      correctIndex: 0,
      explanation: "A mood board collects ideas, colours, textures and styles to set the look and feel."
    },
    {
      text: "You are planning tasks, time needed and who will complete each activity for a project. Which document is most appropriate?",
      options: [
        "Work plan",
        "Mind map",
        "Storyboard",
        "Script"
      ],
      correctIndex: 0,
      explanation: "A work plan (or production schedule) outlines tasks, timings, resources and responsibilities."
    },
    {
      text: "The director needs the exact dialogue and stage directions for actors in a drama scene. Which document should they use?",
      options: [
        "Storyboard",
        "Script",
        "Mood board",
        "Visualisation diagram"
      ],
      correctIndex: 1,
      explanation: "A script includes dialogue, directions and technical information for actors and crew."
    },
    {
      text: "You are exploring all ideas for a new school podcast, starting from the central idea and branching out into topics. Which document would be best?",
      options: [
        "Storyboard",
        "Mind map",
        "Work plan",
        "Script"
      ],
      correctIndex: 1,
      explanation: "A mind map is used to generate and organise ideas around a central concept."
    }
  ];

  const COMPONENT_QUESTIONS = [
    {
      text: "Which component is MOST associated with a storyboard?",
      options: [
        "Scene heading (INT/EXT, location, time of day)",
        "Camera shots and movement in each frame",
        "Asset list of fonts and colour codes",
        "Timings and resources for each task"
      ],
      correctIndex: 1,
      explanation: "Storyboards show camera shots, angles and movement for each frame, plus audio notes."
    },
    {
      text: "Which component is MOST associated with a script?",
      options: [
        "Pens, software and equipment needed",
        "Dialogue for each character and directions",
        "Thumbnails of a page layout",
        "Links between related ideas"
      ],
      correctIndex: 1,
      explanation: "Scripts contain dialogue, character names and directions for actors and crew."
    },
    {
      text: "A student has created a mood board. Which of these would be LEAST suitable to include?",
      options: [
        "Images showing possible styles of characters",
        "Colour swatches that match the brand",
        "Short notes about the target audience’s lifestyle",
        "A detailed list of shot types for a trailer"
      ],
      correctIndex: 3,
      explanation: "Shot types belong on a storyboard, not a mood board."
    },
    {
      text: "Which component would you expect to find on a work plan?",
      options: [
        "Actor facial expressions",
        "Estimated duration of tasks",
        "Colour palette options",
        "Page layout sketches"
      ],
      correctIndex: 1,
      explanation: "Work plans include timings/duration of tasks to help schedule the project."
    },
    {
      text: "You are checking a visualisation diagram for a poster. Which feature shows that it has been labelled effectively?",
      options: [
        "Arrows pointing to where text and images will go",
        "A full script of what the voiceover will say",
        "Shot types labelled MS, CU and LS",
        "Every line of dialogue numbered"
      ],
      correctIndex: 0,
      explanation: "Visualisation diagrams use labels and annotations to show where elements are placed."
    },
    {
      text: "Which feature would you expect ONLY on a mind map and not on a work plan?",
      options: [
        "Columns for start and end dates",
        "Central node with branches and sub‑branches",
        "List of required software and equipment",
        "Milestones for each phase of production"
      ],
      correctIndex: 1,
      explanation: "Mind maps use central nodes and branching structure to organise ideas."
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let currentMode = "docType";
  let questionPool = [];
  let currentIndex = 0;
  let score = 0;

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
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function resetFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
  }

  function getQuestionSet(mode) {
    return mode === "components" ? COMPONENT_QUESTIONS : DOC_TYPE_QUESTIONS;
  }

  // ---------------------------
  // RENDERING
  // ---------------------------

  function startGame() {
    currentMode = modeSelect.value || "docType";
    const questions = getQuestionSet(currentMode);
    questionPool = shuffle(questions);
    currentIndex = 0;
    score = 0;

    scoreDisplayEl.textContent = "0";
    questionTotalEl.textContent = questionPool.length.toString();
    modeLabelEl.textContent =
      currentMode === "components"
        ? "Component Question"
        : "Document Type Question";

    renderQuestion();
  }

  function renderQuestion() {
    resetFeedback();
    nextQuestionBtn.disabled = true;

    const q = questionPool[currentIndex];
    questionNumberEl.textContent = (currentIndex + 1).toString();
    questionTextEl.textContent = q.text;

    clearElement(answersContainer);

    q.options.forEach((optionText, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = optionText;
      btn.addEventListener("click", () => handleAnswerClick(index));
      answersContainer.appendChild(btn);
    });
  }

  // ---------------------------
  // ANSWERING
  // ---------------------------

  function handleAnswerClick(selectedIndex) {
    const q = questionPool[currentIndex];
    const buttons = Array.from(
      answersContainer.querySelectorAll(".answer-btn")
    );

    buttons.forEach((btn, index) => {
      btn.disabled = true;
      if (index === q.correctIndex) {
        btn.classList.add("correct");
      }
      if (index === selectedIndex && index !== q.correctIndex) {
        btn.classList.add("wrong");
      }
    });

    if (selectedIndex === q.correctIndex) {
      score++;
      scoreDisplayEl.textContent = score.toString();
      feedbackEl.textContent = "Correct – good understanding of pre‑production documents.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent = "Not quite. " + q.explanation;
      feedbackEl.className = "feedback bad";
    }

    if (currentIndex < questionPool.length - 1) {
      nextQuestionBtn.disabled = false;
    } else {
      nextQuestionBtn.disabled = true;
      feedbackEl.textContent += " You’ve reached the end of this question set.";
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
  questionTotalEl.textContent = getQuestionSet(currentMode).length.toString();
});
