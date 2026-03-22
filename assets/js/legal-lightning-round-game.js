document.addEventListener("DOMContentLoaded", () => {
  const topicSelect = document.getElementById("topicSelect");
  const startBtn = document.getElementById("startBtn");
  const questionHeadingEl = document.getElementById("questionHeading");
  const questionTextEl = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");
  const timerLabelEl = document.getElementById("timerLabel");
  const timerBarEl = document.getElementById("timerBar");

  // ---------------------------
  // DATA
  // ---------------------------

  const QUESTIONS = [
    // Copyright & IP
    {
      id: "copyrightLogo",
      topic: "copyright",
      text: "A student wants to use a well-known company logo in a poster they will publish online. What is the MAIN legal issue?",
      options: [
        "It may infringe copyright or trademark owned by the company.",
        "It will always be classed as defamation.",
        "It is illegal to show any logo on the internet.",
        "There is no legal issue as long as the poster looks professional."
      ],
      correctIndex: 0,
      explanation: "Logos are usually protected by copyright and trademark, so using them without permission may infringe the company's rights."
    },
    {
      id: "copyrightMusic",
      topic: "copyright",
      text: "A YouTuber adds a chart song to the background of their video without permission. Which law is MOST likely to be broken?",
      options: [
        "Data Protection Act / GDPR",
        "Copyright law",
        "Computer Misuse Act",
        "Health and Safety at Work Act"
      ],
      correctIndex: 1,
      explanation: "Music tracks are protected by copyright, so using them without permission can infringe copyright."
    },
    {
      id: "creativeCommons",
      topic: "copyright",
      text: "What is one advantage of using Creative Commons-licensed images in a school project?",
      options: [
        "They can be used with no need to credit the creator.",
        "They are not protected by copyright at all.",
        "They are often free to use as long as you follow the licence conditions.",
        "They are always higher quality than copyrighted images."
      ],
      correctIndex: 2,
      explanation: "Creative Commons licences allow reuse under certain conditions, often free of charge."
    },

    // Data & Privacy
    {
      id: "gdprEmailList",
      topic: "data",
      text: "A company collects email addresses to send marketing newsletters. Under data protection laws, what must they do?",
      options: [
        "Share the email list with other companies.",
        "Keep the data secret from the users.",
        "Gain consent and explain how the data will be used.",
        "Store the email addresses on any public website."
      ],
      correctIndex: 2,
      explanation: "GDPR / data protection laws require lawful bases such as consent and clear information about how data will be used."
    },
    {
      id: "personalData",
      topic: "data",
      text: "Which of these is classed as personal data under data protection laws?",
      options: [
        "A completely fictional character name.",
        "An anonymous comment with no username.",
        "A student’s full name and school email address.",
        "The title of a film."
      ],
      correctIndex: 2,
      explanation: "Personal data is any information that can identify a living individual, such as a name plus school email."
    },
    {
      id: "photoConsent",
      topic: "data",
      text: "A school wants to use student photos on its website. What is the safest approach?",
      options: [
        "Upload all photos without telling parents.",
        "Get consent from students or parents before publishing the photos.",
        "Only blur the background of every image.",
        "Use any photos taken in lessons without restrictions."
      ],
      correctIndex: 1,
      explanation: "Using identifiable images online raises privacy concerns, so consent is important."
    },

    // Classification & Regulation
    {
      id: "bbfcFilm",
      topic: "classification",
      text: "Which organisation sets age ratings such as 12A, 15 and 18 for films in the UK?",
      options: [
        "PEGI",
        "ASA",
        "BBFC",
        "Ofcom"
      ],
      correctIndex: 2,
      explanation: "The BBFC (British Board of Film Classification) sets age ratings for films in the UK."
    },
    {
      id: "pegiGames",
      topic: "classification",
      text: "A game box shows a PEGI 16 symbol. What does this mean?",
      options: [
        "Only 16 copies of the game can be sold.",
        "It is suitable for all ages.",
        "It is not suitable for players under 16 years old.",
        "It can only be played online."
      ],
      correctIndex: 2,
      explanation: "PEGI 16 indicates the content is not suitable for players younger than 16."
    },
    {
      id: "asaAdverts",
      topic: "classification",
      text: "A social media advert makes false claims about a product. Which UK body can investigate this?",
      options: [
        "ASA",
        "PEGI",
        "BBFC",
        "ICO"
      ],
      correctIndex: 0,
      explanation: "The ASA (Advertising Standards Authority) regulates adverts in the UK."
    },
    {
      id: "ofcomBroadcast",
      topic: "classification",
      text: "What does Ofcom mainly regulate in the UK?",
      options: [
        "Film age ratings and cinema screenings.",
        "Video game difficulty levels.",
        "Broadcast TV, radio and some on-demand services.",
        "Only printed newspaper content."
      ],
      correctIndex: 2,
      explanation: "Ofcom regulates TV, radio and some on-demand/broadcast services."
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  const QUESTION_TIME_SECONDS = 15;

  let questionPool = [];
  let currentIndex = 0;
  let score = 0;
  let timeLeft = QUESTION_TIME_SECONDS;
  let timerId = null;
  let roundActive = false;
  let answeredThisQuestion = false;

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

  function filterQuestionsByTopic(topic) {
    if (topic === "all") return QUESTIONS.slice();
    return QUESTIONS.filter((q) => q.topic === topic);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    timeLeft = QUESTION_TIME_SECONDS;
    updateTimerUI();

    timerId = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        timeLeft = 0;
        updateTimerUI();
        handleTimeUp();
      } else {
        updateTimerUI();
      }
    }, 1000);
  }

  function updateTimerUI() {
    timerLabelEl.textContent =
      timeLeft > 0 ? `Timer: ${timeLeft}s` : "Time up!";
    const percent = (timeLeft / QUESTION_TIME_SECONDS) * 100;
    timerBarEl.style.width = `${percent}%`;
  }

  // ---------------------------
  // ROUND CONTROL
  // ---------------------------

  function startRound() {
    const topic = topicSelect.value || "all";
    const pool = filterQuestionsByTopic(topic);
    if (!pool.length) {
      alert("No questions available for this topic yet.");
      return;
    }

    questionPool = shuffle(pool);
    currentIndex = 0;
    score = 0;
    roundActive = true;
    scoreDisplayEl.textContent = "0";
    questionTotalEl.textContent = questionPool.length.toString();
    questionNumberEl.textContent = "1";
    nextQuestionBtn.disabled = true;

    renderQuestion();
    startTimer();
  }

  function endRound() {
    roundActive = false;
    stopTimer();
    clearElement(answersContainer);
    questionHeadingEl.textContent = "Round finished!";
    questionTextEl.textContent = `You scored ${score} out of ${questionPool.length}. Try another topic or play again to beat your score.`;
    timerBarEl.style.width = "0%";
    timerLabelEl.textContent = "Timer: –";
    nextQuestionBtn.disabled = true;
  }

  // ---------------------------
  // RENDERING
  // ---------------------------

  function renderQuestion() {
    if (!roundActive) return;

    resetFeedback();
    clearElement(answersContainer);
    answeredThisQuestion = false;
    nextQuestionBtn.disabled = true;

    const q = questionPool[currentIndex];
    questionHeadingEl.textContent = "Legal Question";
    questionTextEl.textContent = q.text;
    questionNumberEl.textContent = (currentIndex + 1).toString();

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
    if (!roundActive || answeredThisQuestion) return;
    answeredThisQuestion = true;
    stopTimer();

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
      feedbackEl.textContent = "Correct – nice legal knowledge!";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent = "Not quite. " + q.explanation;
      feedbackEl.className = "feedback bad";
    }

    if (currentIndex < questionPool.length - 1) {
      nextQuestionBtn.disabled = false;
    } else {
      // End of questions
      setTimeout(() => {
        endRound();
      }, 1000);
    }
  }

  function handleTimeUp() {
    if (!roundActive || answeredThisQuestion) return;
    answeredThisQuestion = true;
    stopTimer();

    const q = questionPool[currentIndex];
    const buttons = Array.from(
      answersContainer.querySelectorAll(".answer-btn")
    );

    buttons.forEach((btn, index) => {
      btn.disabled = true;
      if (index === q.correctIndex) {
        btn.classList.add("correct");
      }
    });

    feedbackEl.textContent =
      "Time's up! " + q.explanation;
    feedbackEl.className = "feedback bad";

    if (currentIndex < questionPool.length - 1) {
      nextQuestionBtn.disabled = false;
    } else {
      setTimeout(() => {
        endRound();
      }, 1000);
    }
  }

  // ---------------------------
  // EVENTS
  // ---------------------------

  startBtn.addEventListener("click", () => {
    startRound();
  });

  nextQuestionBtn.addEventListener("click", () => {
    if (!roundActive) return;
    if (currentIndex < questionPool.length - 1) {
      currentIndex++;
      renderQuestion();
      startTimer();
    }
  });

  // Initial UI
  timerLabelEl.textContent = "Timer: –";
  timerBarEl.style.width = "0%";
});
