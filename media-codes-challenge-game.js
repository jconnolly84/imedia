document.addEventListener("DOMContentLoaded", () => {
  const modeSelect = document.getElementById("modeSelect");
  const newGameBtn = document.getElementById("newGameBtn");
  const questionHeadingEl = document.getElementById("questionHeading");
  const questionTextEl = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  // ---------------------------
  // DATA
  // ---------------------------

  const QUESTIONS = [
    {
      id: "lowAngleHero",
      focus: "type",
      heading: "Identify the code type",
      scenario:
        "In a film poster, the main character is shown from a low-angle shot, looking down at the camera with strong lighting behind them.",
      question: "Which option best describes the MAIN media code being used?",
      options: [
        "Symbolic code – body language and costume",
        "Technical code – camera angle",
        "Written code – typography and captions",
        "Audio code – sound effects and music"
      ],
      correctIndex: 1,
      explanation:
        "The question focuses on the low-angle shot, which is a technical code related to camera angle."
    },
    {
      id: "darkLightingHorror",
      focus: "effect",
      heading: "Explain the effect",
      scenario:
        "A horror trailer uses low-key lighting with lots of shadows and only small areas of light on the characters’ faces.",
      question: "What is the MOST likely effect of this lighting on the audience?",
      options: [
        "It makes the scene look bright and cheerful.",
        "It creates tension and makes the audience feel uneasy.",
        "It helps the audience clearly see every detail in the background.",
        "It makes the trailer feel like a comedy."
      ],
      correctIndex: 1,
      explanation:
        "Low-key lighting and shadows are used to create tension, mystery and fear – typical for horror."
    },
    {
      id: "nonDiegeticMusic",
      focus: "type",
      heading: "Identify the code type",
      scenario:
        "During a sports advert, upbeat music plays over slow-motion shots of players scoring goals. The characters cannot hear the music.",
      question: "Which statement best describes the music in this advert?",
      options: [
        "Diegetic sound because it is part of the scene.",
        "Non-diegetic sound added for the audience.",
        "Ambient sound recorded on location.",
        "Dialogue recorded in a voiceover booth."
      ],
      correctIndex: 1,
      explanation:
        "The music has been added over the top and is only for the audience, so it is non-diegetic sound."
    },
    {
      id: "costumeSymbolic",
      focus: "type",
      heading: "Identify the code type",
      scenario:
        "In a teen drama, a character wears a school blazer, messy tie and headphones around their neck.",
      question: "Which media code is MOSTLY being used to communicate information about the character?",
      options: [
        "Technical code – editing pace",
        "Symbolic code – costume and props",
        "Written code – titles and captions",
        "Technical code – camera movement"
      ],
      correctIndex: 1,
      explanation:
        "Costume and props (blazer, tie, headphones) are symbolic codes showing personality, age and status."
    },
    {
      id: "boldTitlePoster",
      focus: "type",
      heading: "Identify the code type",
      scenario:
        "A film poster uses a large, bold red title across the top with a sharp, jagged font.",
      question: "What is the MAIN type of code used in the title?",
      options: [
        "Symbolic code",
        "Technical code",
        "Written code",
        "Audio code"
      ],
      correctIndex: 2,
      explanation:
        "The title text is a written code – the choice of font, size and colour all help communicate genre and tone."
    },
    {
      id: "slowMotionEffect",
      focus: "effect",
      heading: "Explain the effect",
      scenario:
        "A music video shows the main character walking through a crowd in slow motion while everything else moves at normal speed.",
      question: "What effect is this MOST likely to have on the audience?",
      options: [
        "Makes the character stand out and seem important or isolated.",
        "Makes the video feel rushed and chaotic.",
        "Makes the lyrics harder to understand.",
        "Has no effect on the way the audience sees the character."
      ],
      correctIndex: 0,
      explanation:
        "Slow motion is a technical code in editing that draws attention to the character and can show importance or isolation."
    },
    {
      id: "closeUpTears",
      focus: "effect",
      heading: "Explain the effect",
      scenario:
        "A charity advert uses a close-up of a person’s face with tears in their eyes as they talk about their experience.",
      question: "Why might the director have chosen this close-up shot?",
      options: [
        "To show the location clearly in the background.",
        "To create an emotional connection and encourage empathy from the audience.",
        "To hide the character’s facial expressions.",
        "To show the character’s full body language."
      ],
      correctIndex: 1,
      explanation:
        "Close-ups highlight facial expression, which helps create an emotional connection and encourages empathy."
    },
    {
      id: "jumpCutEnergy",
      focus: "effect",
      heading: "Explain the effect",
      scenario:
        "In a product advert, the editing uses lots of quick jump cuts between different shots of the product being used.",
      question: "What is the MOST likely effect of this editing style?",
      options: [
        "It slows down the pace and makes the advert feel calm.",
        "It creates a fast, energetic feeling that grabs the audience’s attention.",
        "It makes the product hard to see at all.",
        "It has no effect on how the audience feels."
      ],
      correctIndex: 1,
      explanation:
        "Fast-paced editing and jump cuts create energy and excitement, which help hold the audience’s attention."
    },
    {
      id: "colourConnotation",
      focus: "effect",
      heading: "Explain the effect",
      scenario:
        "A health app advert uses a lot of green and white in its colour scheme, including the logo and background.",
      question: "What is the MOST likely reason for using these colours?",
      options: [
        "Green and white are cheaper to print.",
        "These colours often connote health, freshness and cleanliness.",
        "They make the text impossible to read.",
        "They always mean danger and warning signs."
      ],
      correctIndex: 1,
      explanation:
        "Green and white commonly connote health, nature and cleanliness, which fits a health app brand."
    },
    {
      id: "establishingShot",
      focus: "type",
      heading: "Identify the code type",
      scenario:
        "A TV drama episode opens with a wide shot of the city skyline showing the setting before cutting to characters inside a school.",
      question: "Which type of camera shot is being used at the start?",
      options: [
        "Close-up",
        "Point-of-view shot",
        "Establishing shot / extreme long shot",
        "Two-shot"
      ],
      correctIndex: 2,
      explanation:
        "A wide shot of the location at the start is an establishing shot (often an extreme long shot) that sets the scene."
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let currentMode = "mixed";
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
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function resetFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
  }

  function filterQuestionsByMode(mode) {
    if (mode === "type") {
      return QUESTIONS.filter((q) => q.focus === "type");
    }
    if (mode === "effect") {
      return QUESTIONS.filter((q) => q.focus === "effect");
    }
    return QUESTIONS.slice();
  }

  // ---------------------------
  // RENDERING
  // ---------------------------

  function startGame() {
    currentMode = modeSelect.value || "mixed";
    questionPool = shuffle(filterQuestionsByMode(currentMode));
    currentIndex = 0;
    score = 0;

    scoreDisplayEl.textContent = "0";
    questionTotalEl.textContent = questionPool.length.toString();

    renderQuestion();
  }

  function renderQuestion() {
    resetFeedback();
    nextQuestionBtn.disabled = true;

    const q = questionPool[currentIndex];
    questionNumberEl.textContent = (currentIndex + 1).toString();
    questionHeadingEl.textContent = q.heading;
    questionTextEl.textContent = `${q.scenario}\n\n${q.question}`;

    clearElement(answersContainer);

    q.options.forEach((optText, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = optText;
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
      feedbackEl.textContent = "Correct – you’ve identified the code/effect accurately.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent = "Not quite. " + q.explanation;
      feedbackEl.className = "feedback bad";
    }

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
  questionTotalEl.textContent = filterQuestionsByMode(currentMode).length.toString();
});
