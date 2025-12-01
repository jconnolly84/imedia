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
      id: "kidsApp",
      focus: "demographics",
      heading: "Educational app audience",
      scenario:
        "A bright, colourful tablet app helps children aged 6–8 practise spellings with simple games and rewards. It has no online chat and includes a child-friendly privacy policy.",
      question:
        "Which audience description is MOST appropriate for this app?",
      options: [
        "Adults aged 30–50 who enjoy crime podcasts on their commute.",
        "Teenagers aged 15–19 who want realistic war shooters.",
        "Children aged 6–8 in primary school, supported by parents and teachers.",
        "Retired adults aged 65+ who enjoy gardening shows."
      ],
      correctIndex: 2,
      explanation:
        "The content, safety settings and learning focus clearly match primary-aged children (around 6–8) who are practising basic skills with support from adults."
    },
    {
      id: "fitnessInsta",
      focus: "interests",
      heading: "Social media fitness series",
      scenario:
        "A series of 60‑second workout videos is posted on Instagram and TikTok. They use upbeat music and text overlays like 'Leg day in 60 seconds'.",
      question:
        "Which audience is MOST likely to be targeted by this content?",
      options: [
        "Young adults and older teenagers who use social media daily and want quick home workouts.",
        "Primary school children who do not have phones yet.",
        "People who only listen to radio in the car.",
        "Viewers who prefer long documentary films about history."
      ],
      correctIndex: 0,
      explanation:
        "Short, vertical fitness videos on Instagram and TikTok are aimed at social‑media users who want quick, on‑trend workout ideas – typically older teens and young adults."
    },
    {
      id: "retroMagazine",
      focus: "interests",
      heading: "Retro gaming magazine",
      scenario:
        "A printed monthly magazine reviews classic games from the 80s and 90s, includes interviews with original developers and adverts for retro consoles.",
      question:
        "Which target audience is MOST suitable?",
      options: [
        "Adults aged 30–45 who grew up with older game consoles and enjoy retro gaming as a hobby.",
        "Children aged 7–9 who only play mobile puzzle games.",
        "People who dislike technology and never play games.",
        "Teenagers aged 13–16 who only play mobile rhythm games."
      ],
      correctIndex: 0,
      explanation:
        "The focus on games from the 80s and 90s, plus the print format, suits adults who have nostalgia for those consoles and follow retro gaming as a hobby."
    },
    {
      id: "commuterPodcast",
      focus: "platform",
      heading: "Commuter news podcast",
      scenario:
        "A 15‑minute daily podcast summarises news and weather. It is designed for people travelling to work or college.",
      question:
        "Which audience description BEST matches this product?",
      options: [
        "People who travel to work or college, often listening on headphones during their commute.",
        "Children who only watch cartoons before school.",
        "Gamers who only play on home consoles at weekends.",
        "Retired people who do not travel regularly."
      ],
      correctIndex: 0,
      explanation:
        "The short, regular format suits commuters who listen on phones or other devices while travelling to work or college."
    },
    {
      id: "horrorGameRating",
      focus: "demographics",
      heading: "PEGI rating and audience",
      scenario:
        "A horror game includes jump scares and realistic violence. It receives a PEGI 16 rating.",
      question:
        "Which audience is the game legally suitable for?",
      options: [
        "Players aged 3 and above.",
        "Players aged 7 and above.",
        "Players aged 12 and above.",
        "Players aged 16 and above."
      ],
      correctIndex: 3,
      explanation:
        "A PEGI 16 rating means the game is only suitable for players aged 16 and over due to the level of violence and fear."
    },
    {
      id: "schoolRevisionSite",
      focus: "platform",
      heading: "Revision website design",
      scenario:
        "A revision website includes short videos, interactive quizzes and downloadable worksheets for GCSE students. It is mobile‑friendly and works on school computers.",
      question:
        "Which description BEST matches the intended audience?",
      options: [
        "Students aged 14–16 preparing for GCSEs, accessing the site on phones and school computers.",
        "Adults aged 30–50 looking for home‑improvement tips.",
        "Children aged 5–6 just learning to read.",
        "Professional filmmakers editing cinema releases."
      ],
      correctIndex: 0,
      explanation:
        "The content and level (GCSE) plus the device access (phones and school computers) clearly match students aged around 14–16."
    },
    {
      id: "luxuryBrand",
      focus: "demographics",
      heading: "Luxury brand advert",
      scenario:
        "A glossy magazine advert shows expensive watches with a formal, black‑and‑white design. It appears in a business and finance magazine.",
      question:
        "Which audience description is MOST appropriate?",
      options: [
        "High‑income professionals aged 30–60 who are interested in business and luxury brands.",
        "Young children who like cartoons and bright colours.",
        "Teenagers looking for budget gaming accessories.",
        "People who dislike magazines."
      ],
      correctIndex: 0,
      explanation:
        "The placement in a business/finance magazine and high‑price product indicate an audience of wealthier adults interested in luxury items."
    },
    {
      id: "esportsStream",
      focus: "platform",
      heading: "eSports live stream",
      scenario:
        "A college runs a live eSports tournament and streams it on Twitch and YouTube with live chat enabled.",
      question:
        "Which audience description BEST fits the main target group?",
      options: [
        "Gamers aged 16–24 who already watch eSports and use live‑streaming platforms.",
        "Children aged 5–8 who do not have internet access.",
        "People who only read printed newspapers.",
        "Retired adults who prefer gardening programmes."
      ],
      correctIndex: 0,
      explanation:
        "Twitch and YouTube live streams mainly attract gamers in their teens and early twenties who are familiar with eSports culture."
    },
    {
      id: "familyCinema",
      focus: "interests",
      heading: "Family cinema poster",
      scenario:
        "A cinema poster shows animated animal characters, bright colours and a U certificate. It includes the slogan 'Perfect for the whole family'.",
      question:
        "Which audience description BEST matches this film?",
      options: [
        "Families with young children looking for a film that everyone can watch together.",
        "Adults who only enjoy violent thrillers.",
        "Teenagers wanting an 18‑rated horror film.",
        "Niche fans of black‑and‑white experimental cinema."
      ],
      correctIndex: 0,
      explanation:
        "The U rating, animated style and family‑friendly slogan clearly target families with younger children who can all watch together."
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
    if (mode === "demographics") {
      return QUESTIONS.filter((q) => q.focus === "demographics");
    }
    if (mode === "interests") {
      return QUESTIONS.filter((q) => q.focus === "interests");
    }
    if (mode === "platform") {
      return QUESTIONS.filter((q) => q.focus === "platform");
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
        "Correct – your audience description matches the product.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent =
        "Not quite. Check the age, interests and how the audience would access this product.";
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
