// Pre-production Document Detective – identify the document and its use

document.addEventListener("DOMContentLoaded", () => {
  const startGameBtn = document.getElementById("startGameBtn");
  const nextDocBtn = document.getElementById("nextDocBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");

  const docCounterEl = document.getElementById("docCounter");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  const scenarioTitleEl = document.getElementById("scenarioTitle");
  const scenarioIntroEl = document.getElementById("scenarioIntro");
  const imageCardEl = document.getElementById("imageCard");
  const docImageEl = document.getElementById("docImage");
  const imageCaptionEl = document.getElementById("imageCaption");

  const feedbackEl = document.getElementById("feedback");
  const breakdownEl = document.getElementById("breakdown");

  const docTypeButtonsContainer = document.getElementById("docTypeButtons");
  const docUseButtonsContainer = document.getElementById("docUseButtons");

  const summaryCardEl = document.getElementById("summaryCard");
  const finalScoreEl = document.getElementById("finalScore");
  const readinessTextEl = document.getElementById("readinessText");

  // ---------------------------
  // DATA – documents & uses
  // ---------------------------

  const DOCUMENT_TYPES = [
    { id: "client-brief", label: "Client brief" },
    { id: "mood-board", label: "Mood board" },
    { id: "mind-map", label: "Mind map" },
    { id: "visualisation", label: "Visualisation diagram" },
    { id: "storyboard", label: "Storyboard" },
    { id: "script", label: "Script" },
    { id: "wireframe", label: "Wireframe" },
    { id: "gantt", label: "Gantt chart" },
    { id: "asset-table", label: "Asset table" }
  ];

  // Replace the image file names with your actual image paths
  const DOCUMENTS = [
    {
      id: "visualisation",
      name: "Visualisation diagram",
      image: "img/visualisation-diagram.png",
      caption: "A sketch showing what a final still-image product will look like.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To show what a still image product (such as a poster or cover) will look like before it is created.",
      otherUses: [
        "To show the timings of each task in a project.",
        "To record the dialogue and actions for a moving image product.",
        "To list all the assets and permissions needed for a project."
      ],
      explanation:
        "A visualisation diagram is a pre-production document that shows the layout and appearance of a static product, such as a poster, DVD cover or game package."
    },
    {
      id: "mind-map",
      name: "Mind map",
      image: "img/mind-map.png",
      caption: "A spider diagram with a central theme and connected ideas.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To generate and organise ideas around a central theme or brief.",
      otherUses: [
        "To show the order of shots in a video.",
        "To plan navigation for a website or app.",
        "To show the exact dates and durations of project tasks."
      ],
      explanation:
        "A mind map (or spider diagram) is used to expand and organise ideas, often early in the planning stage."
    },
    {
      id: "client-brief",
      name: "Client brief",
      image: "img/client-brief.png",
      caption: "A written document from the client outlining what they want.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To outline the requirements, constraints and purpose agreed between the client and the creator.",
      otherUses: [
        "To record every shot and camera angle in a scene.",
        "To track the progress of tasks over time.",
        "To list all fonts, images and sounds used in the final product."
      ],
      explanation:
        "A client brief sets out what needs to be produced, why, who it is for and any constraints such as deadlines and budget."
    },
    {
      id: "script",
      name: "Script",
      image: "img/script.png",
      caption: "Dialogue, actions and camera directions laid out in order.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To show dialogue, actions and directions for a moving image or audio product.",
      otherUses: [
        "To show the layout of a website page.",
        "To list the assets used in a project.",
        "To collect visual examples of style and colour."
      ],
      explanation:
        "A script is used for TV, film, radio or games cut-scenes and includes dialogue, actions, sound effects and sometimes basic camera directions."
    },
    {
      id: "wireframe",
      name: "Wireframe",
      image: "img/wireframe.png",
      caption: "Boxes and labels showing where elements will appear on a screen.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To plan the layout and basic navigation of a website or app screen.",
      otherUses: [
        "To display tasks and timings across a project.",
        "To show the order of scenes in a video.",
        "To summarise the requirements from the client."
      ],
      explanation:
        "Wireframes show where items such as images, text and buttons will be positioned and how users will move between screens."
    },
    {
      id: "gantt",
      name: "Gantt chart",
      image: "img/gantt-chart.png",
      caption: "A bar chart showing tasks plotted against dates.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To plan and track project tasks and timings over a period of time.",
      otherUses: [
        "To show the visual style of a product.",
        "To capture questions and feedback from the client.",
        "To list audio and graphic assets used in the final product."
      ],
      explanation:
        "A Gantt chart is a project management tool showing tasks, durations, dependencies and deadlines."
    },
    {
      id: "storyboard",
      name: "Storyboard",
      image: "img/storyboard.png",
      caption: "A sequence of frames with sketches and notes underneath.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To show the sequence of shots, actions and timings for a video, animation or advert.",
      otherUses: [
        "To list file locations and permissions for assets.",
        "To show the mood and colour scheme of a product.",
        "To describe how user data will be stored securely."
      ],
      explanation:
        "Storyboards are used to plan moving image products by showing each shot in order with notes on what happens."
    },
    {
      id: "mood-board",
      name: "Mood board",
      image: "img/mood-board.png",
      caption: "A collage of images, colours and textures.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To collect and present ideas about style, colour and mood for a product.",
      otherUses: [
        "To show the exact layout of a final poster.",
        "To schedule tasks and deadlines.",
        "To record the spoken dialogue for a scene."
      ],
      explanation:
        "Mood boards help the client and designer agree on the overall look and feel before detailed designs are made."
    },
    {
      id: "asset-table",
      name: "Asset table",
      image: "img/asset-table.png",
      caption: "A table listing assets, locations and copyright details.",
      useQuestion: "What is this document mainly used for?",
      correctUse:
        "To list all assets needed in a project along with their sources, locations and permissions.",
      otherUses: [
        "To plan the camera shots in a TV advert.",
        "To map ideas around a central topic.",
        "To show the wireframe layout of a website."
      ],
      explanation:
        "An asset table (or asset log) keeps track of each asset, where it comes from and any copyright information."
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let shuffledDocs = [];
  let currentIndex = -1;
  let currentStage = 0; // 0 = not started, 1 = doc type, 2 = use
  let score = 0;
  let currentDoc = null;

  // ---------------------------
  // Helpers
  // ---------------------------

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function resetFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    breakdownEl.textContent = "";
    breakdownEl.classList.add("hidden");
  }

  function updateScore(delta) {
    score += delta;
    if (score < 0) score = 0;
    scoreDisplayEl.textContent = String(score);
  }

  function setDocCounter() {
    const total = shuffledDocs.length;
    const pos = currentIndex + 1 > 0 ? currentIndex + 1 : 0;
    docCounterEl.textContent = `${pos} / ${total}`;
  }

  function clearButtons(container) {
    container.innerHTML = "";
  }

  function setButtonsDisabled(container, disabled) {
    Array.from(container.querySelectorAll("button")).forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  // ---------------------------
  // Build static doc-type buttons (same every question)
  // ---------------------------

  function buildDocTypeButtons() {
    clearButtons(docTypeButtonsContainer);
    DOCUMENT_TYPES.forEach((type) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn option-btn";
      btn.textContent = type.label;
      btn.dataset.docTypeId = type.id;
      btn.addEventListener("click", () => handleDocTypeClick(type.id, btn));
      docTypeButtonsContainer.appendChild(btn);
    });
  }

  function buildUseButtonsForDoc(doc) {
    clearButtons(docUseButtonsContainer);

    const options = [
      { text: doc.correctUse, correct: true },
      ...doc.otherUses.map((text) => ({ text, correct: false }))
    ];
    shuffleInPlace(options);

    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn option-btn";
      btn.textContent = opt.text;
      btn.dataset.correct = opt.correct ? "true" : "false";
      btn.addEventListener("click", () => handleUseClick(btn));
      docUseButtonsContainer.appendChild(btn);
    });
  }

  // ---------------------------
  // Game flow
  // ---------------------------

  function startGame() {
    score = 0;
    currentIndex = -1;
    currentStage = 0;
    shuffledDocs = DOCUMENTS.slice();
    shuffleInPlace(shuffledDocs);
    updateScore(0);
    summaryCardEl.classList.add("hidden");
    imageCardEl.classList.remove("hidden");
    nextDocBtn.disabled = true;
    scenarioIntroEl.textContent =
      "First, choose the document type. Then, choose the best description of what it is used for.";

    goToNextDocument();
  }

  function goToNextDocument() {
    currentIndex++;
    if (currentIndex >= shuffledDocs.length) {
      showSummary();
      return;
    }

    currentStage = 1;
    resetFeedback();
    nextDocBtn.disabled = true;

    currentDoc = shuffledDocs[currentIndex];
    setDocCounter();

    scenarioTitleEl.innerHTML = `Document ${currentIndex + 1}: <strong>What do you notice?</strong>`;
    docImageEl.src = currentDoc.image;
    docImageEl.alt = currentDoc.name;
    imageCaptionEl.textContent = "Look carefully at the layout, labels and structure.";

    // Reset buttons
    Array.from(docTypeButtonsContainer.querySelectorAll("button")).forEach(
      (btn) => {
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
      }
    );

    buildUseButtonsForDoc(currentDoc);
    setButtonsDisabled(docUseButtonsContainer, true);
  }

  function handleDocTypeClick(chosenId, buttonEl) {
    if (currentStage !== 1) return;

    const isCorrect = chosenId === currentDoc.id;
    const allButtons = docTypeButtonsContainer.querySelectorAll("button");

    allButtons.forEach((btn) => {
      btn.disabled = true;
      const thisId = btn.dataset.docTypeId;
      if (thisId === currentDoc.id) {
        btn.classList.add("correct");
      }
      if (btn === buttonEl && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

    if (isCorrect) {
      feedbackEl.textContent =
        "Nice! You’ve identified the right pre-production document.";
      feedbackEl.classList.add("good");
      updateScore(100);
    } else {
      feedbackEl.textContent =
        `Not quite – this one is a ${currentDoc.name.toLowerCase()}.`;
      feedbackEl.classList.add("bad");
    }

    breakdownEl.textContent =
      "Quick fact: " + currentDoc.explanation + "\n\nNow choose what it is used for.";
    breakdownEl.classList.remove("hidden");

    currentStage = 2;
    setButtonsDisabled(docUseButtonsContainer, false);
  }

  function handleUseClick(buttonEl) {
    if (currentStage !== 2) return;

    const isCorrect = buttonEl.dataset.correct === "true";
    const allButtons = docUseButtonsContainer.querySelectorAll("button");

    allButtons.forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.correct === "true") {
        btn.classList.add("correct");
      }
      if (btn === buttonEl && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

    if (isCorrect) {
      feedbackEl.textContent =
        "Spot on – you’ve matched the document to its main purpose.";
      feedbackEl.classList.remove("bad");
      feedbackEl.classList.add("good");
      updateScore(100);
    } else {
      feedbackEl.textContent =
        "Close, but the best answer is the one that matches how this document is mainly used.";
      feedbackEl.classList.remove("good");
      feedbackEl.classList.add("bad");
    }

    breakdownEl.textContent =
      currentDoc.explanation +
      "\n\nRemember this: " +
      currentDoc.correctUse;
    breakdownEl.classList.remove("hidden");

    nextDocBtn.disabled = false;
    currentStage = 3; // finished this document
  }

  function showSummary() {
    summaryCardEl.classList.remove("hidden");
    finalScoreEl.textContent = `Final score: ${score}`;

    let msg = "";
    if (score >= 1600) {
      msg =
        "Excellent – you really know your pre-production toolkit. You’re ready to apply the right document in exam questions.";
    } else if (score >= 1200) {
      msg =
        "Good work – you can recognise most documents. Revise any you’re unsure about and try again.";
    } else if (score >= 800) {
      msg =
        "Developing – you’ve remembered some of the documents, but you need more practice matching them to their uses.";
    } else {
      msg =
        "Keep practising – focus on the name, layout and purpose of each document so you can pick the right one quickly in the exam.";
    }

    readinessTextEl.textContent = msg;
  }

  // ---------------------------
  // Wire up buttons
  // ---------------------------

  buildDocTypeButtons();

  startGameBtn.addEventListener("click", startGame);
  nextDocBtn.addEventListener("click", goToNextDocument);
  playAgainBtn.addEventListener("click", startGame);
});
