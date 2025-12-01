document.addEventListener("DOMContentLoaded", () => {
  const modeSelect = document.getElementById("modeSelect");
  const newGameBtn = document.getElementById("newGameBtn");
  const questionHeadingEl = document.getElementById("questionHeading");
  const scenarioTextEl = document.getElementById("scenarioText");
  const questionTextEl = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const explanationEl = document.getElementById("explanation");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  const QUESTIONS = [
    {
      id: "mobileGameTeens",
      focus: "platform",
      heading: "Choosing a platform – mobile game",
      scenario:
        "A small studio has created a free-to-play mobile game aimed at teenagers aged 13–17. They want as many players as possible to download it.",
      question:
        "Which distribution option is MOST suitable for this game?",
      options: [
        "Release it only on DVD to be sold in game shops.",
        "Upload it to major mobile app stores so it can be downloaded on smartphones and tablets.",
        "Release it only as a boxed PC game in supermarkets.",
        "Only show gameplay clips on TV without a download link."
      ],
      correctIndex: 1,
      explanation:
        "Teenagers mostly play mobile games on phones and tablets, so publishing the game on major app stores gives easy access and wide reach."
    },
    {
      id: "indieFilmRelease",
      focus: "platform",
      heading: "Indie film – how to release",
      scenario:
        "An independent film maker has produced a low-budget documentary. They want to reach a niche audience who are interested in the topic but may not live near a cinema.",
      question:
        "Which distribution method would be MOST effective?",
      options: [
        "Only release the film in a small number of local cinemas for one weekend.",
        "Release the film on a streaming platform or video-on-demand service so people can watch it online.",
        "Only sell the film as a Blu-ray in a single shop.",
        "Play the film once on local radio."
      ],
      correctIndex: 1,
      explanation:
        "Online streaming or video-on-demand allows a niche audience to watch the documentary from anywhere, without needing to visit a cinema."
    },
    {
      id: "schoolPodcast",
      focus: "platform",
      heading: "School podcast distribution",
      scenario:
        "A secondary school media club produces a weekly 10-minute podcast with news and revision tips for students.",
      question:
        "What is the BEST way to distribute the podcast so students can listen easily?",
      options: [
        "Upload it to podcast platforms and the school website so it can be streamed or downloaded on phones.",
        "Only burn the audio to CDs and hand them out.",
        "Print the script and put it on the noticeboard.",
        "Play it once over the school tannoy with no recording kept."
      ],
      correctIndex: 0,
      explanation:
        "Uploading to podcast platforms and the school website allows students to stream or download the episode on their own devices at a convenient time."
    },
    {
      id: "posterPromotion",
      focus: "promotion",
      heading: "Poster and social media promotion",
      scenario:
        "A college is launching an e-sports tournament and has designed an A3 poster. They also want to promote the event online.",
      question:
        "Which option shows effective cross-media promotion for this event?",
      options: [
        "Only print the posters and put them in the staffroom.",
        "Use the poster design as a digital image on social media and link to an online sign-up form.",
        "Create a radio advert with no details shown anywhere else.",
        "Send a single email to one student and ask them to tell everyone."
      ],
      correctIndex: 1,
      explanation:
        "Reusing the poster design on social media and including a link to an online sign-up form combines print and digital promotion and makes it easy for the audience to take action."
    },
    {
      id: "primeTimeFamilyShow",
      focus: "scheduling",
      heading: "Scheduling a family TV show",
      scenario:
        "A TV channel is releasing a new family quiz show aimed at parents and children watching together.",
      question:
        "Which time slot would be MOST suitable?",
      options: [
        "Late at night after 11pm on weekdays.",
        "Early morning on weekdays before school.",
        "Early evening around 7pm at the weekend.",
        "Midday on a weekday during school hours."
      ],
      correctIndex: 2,
      explanation:
        "Early evening at the weekend is when many families are at home and free to watch TV together, so this slot best matches the target audience."
    },
    {
      id: "watershedContent",
      focus: "scheduling",
      heading: "Content and the watershed",
      scenario:
        "A broadcaster wants to show a drama series that includes strong language and some violent scenes.",
      question:
        "What is the MOST appropriate way to schedule this series on a UK TV channel?",
      options: [
        "Show it at 4pm when children are likely to be watching.",
        "Show it before 9pm but only on weekends.",
        "Show it after the 9pm watershed with clear content warnings.",
        "Only show it during school assemblies."
      ],
      correctIndex: 2,
      explanation:
        "In the UK, more adult content should be scheduled after the 9pm watershed, with warnings, to reduce the chance of younger children viewing it."
    },
    {
      id: "socialMediaTrailer",
      focus: "promotion",
      heading: "Using social media to promote a trailer",
      scenario:
        "A film studio has created a 30-second trailer for a superhero film aimed at 12–16 year olds.",
      question:
        "Which promotion strategy is MOST likely to reach this target audience effectively?",
      options: [
        "Only show the trailer in local cinemas during weekday mornings.",
        "Share the trailer on popular social media platforms with hashtags and links to ticket booking.",
        "Print the trailer script in a newspaper.",
        "Send DVDs of the trailer to random addresses."
      ],
      correctIndex: 1,
      explanation:
        "Teenagers are heavy social media users, so sharing the trailer with hashtags and booking links on those platforms helps reach and engage the target audience."
    },
    {
      id: "downloadVsPhysical",
      focus: "platform",
      heading: "Physical vs digital distribution",
      scenario:
        "A band has recorded a new EP and wants fans to be able to access it quickly without waiting for delivery.",
      question:
        "Which distribution method is MOST suitable?",
      options: [
        "Only sell physical CDs by post.",
        "Release the EP on music streaming and download platforms.",
        "Only play the songs once at a live concert.",
        "Print the lyrics in a magazine."
      ],
      correctIndex: 1,
      explanation:
        "Releasing the EP on streaming and download platforms lets fans access the music instantly without needing to wait for a physical product."
    },
    {
      id: "qrCodeFlyer",
      focus: "promotion",
      heading: "Linking print and online content",
      scenario:
        "A game developer hands out printed flyers at a convention and wants people to quickly find the game’s website and trailer.",
      question:
        "Which feature would BEST support this aim?",
      options: [
        "A QR code on the flyer that links directly to the website or trailer.",
        "A long URL printed in small text with no explanation.",
        "Only a picture of the game logo.",
        "Text saying “Search online” with no other details."
      ],
      correctIndex: 0,
      explanation:
        "A QR code lets people quickly scan the flyer with their phone and go straight to the website or trailer, linking print and digital distribution."
    }
  ];

  let currentMode = "mixed";
  let questionPool = [];
  let currentIndex = 0;
  let score = 0;

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
    explanationEl.textContent = "";
    explanationEl.classList.add("hidden");
  }

  function filterQuestionsByMode(mode) {
    if (mode === "platform") {
      return QUESTIONS.filter((q) => q.focus === "platform");
    }
    if (mode === "promotion") {
      return QUESTIONS.filter((q) => q.focus === "promotion");
    }
    if (mode === "scheduling") {
      return QUESTIONS.filter((q) => q.focus === "scheduling");
    }
    return QUESTIONS.slice();
  }

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
    scenarioTextEl.textContent = q.scenario;
    questionTextEl.textContent = q.question;

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
      feedbackEl.textContent =
        "Correct – you’ve chosen a distribution/promotion method that matches the product and audience.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent =
        "Not quite. Think about where this audience spends time and how they access media.";
      feedbackEl.className = "feedback bad";
    }

    explanationEl.textContent = q.explanation;
    explanationEl.classList.remove("hidden");

    if (currentIndex < questionPool.length - 1) {
      nextQuestionBtn.disabled = false;
    } else {
      nextQuestionBtn.disabled = true;
      feedbackEl.textContent += " You’ve reached the end of this set.";
    }
  }

  newGameBtn.addEventListener("click", () => {
    startGame();
  });

  nextQuestionBtn.addEventListener("click", () => {
    if (currentIndex < questionPool.length - 1) {
      currentIndex++;
      renderQuestion();
    }
  });

  questionTotalEl.textContent = filterQuestionsByMode(currentMode).length.toString();
});
