document.addEventListener("DOMContentLoaded", () => {
  const briefSelect = document.getElementById("briefSelect");
  const newRoundBtn = document.getElementById("newRoundBtn");
  const briefTextEl = document.getElementById("briefText");
  const briefKeyPointsEl = document.getElementById("briefKeyPoints");
  const questionTextEl = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  // ---------------------------
  // DATA: BRIEFS & QUESTIONS
  // ---------------------------

  const BRIEFS = [
    {
      id: "alooshiSocial",
      label: "Alooshi Social Media Advert",
      briefText: `
Alooshi is a small, family-run dessert business based in a busy city centre. They specialise in milkshakes, waffles and cookie dough aimed at teenagers and young adults.

The client wants a short social media video advert to promote a new "Summer Shakes" range on TikTok and Instagram. The advert should last 20–30 seconds, use upbeat copyright-free music and clearly show the brand colours (pink and cream).

The video must appeal to 13–19 year olds who use social media daily. The client ethos focuses on fun, inclusivity and affordability. The advert needs to be completed within four weeks, in time for the start of the school summer holidays.
      `,
      keyPoints: [
        "Business: Alooshi – small, family-run dessert shop.",
        "Audience: teenagers and young adults (13–19).",
        "Product: social media video advert for TikTok and Instagram.",
        "Purpose: promote the new 'Summer Shakes' range.",
        "Constraints: 20–30 seconds, copyright-free music, brand colours, 4-week deadline."
      ],
      questions: [
        {
          text: "Who is the primary target audience for this advert?",
          options: [
            "Parents with young children aged 3–8",
            "Teenagers and young adults aged 13–19",
            "Local business owners aged 25–40",
            "Retired people looking for daytime deals"
          ],
          correctIndex: 1,
          explanation: "The brief clearly states the advert must appeal to 13–19 year olds."
        },
        {
          text: "What is the main purpose of the video advert?",
          options: [
            "To recruit new staff for the dessert shop",
            "To inform customers about food allergies",
            "To promote the new 'Summer Shakes' range",
            "To explain the history of the business"
          ],
          correctIndex: 2,
          explanation: "The brief says the advert is to promote the new 'Summer Shakes' range."
        },
        {
          text: "Which TWO platforms are mentioned in the brief?",
          options: [
            "TikTok and Instagram",
            "Facebook and Twitter/X",
            "YouTube and Twitch",
            "Snapchat and WhatsApp Status"
          ],
          correctIndex: 0,
          explanation: "The brief specifically mentions TikTok and Instagram."
        },
        {
          text: "What is one time-related constraint in the brief?",
          options: [
            "The advert can only be posted at weekends",
            "The advert must be completed within four weeks",
            "The video must be live for exactly 24 hours",
            "The project must pause during school holidays"
          ],
          correctIndex: 1,
          explanation: "The brief states the advert needs to be completed within four weeks."
        }
      ]
    },
    {
      id: "museumPoster",
      label: "City Museum Poster",
      briefText: `
A city museum is launching a new interactive exhibition called "Future Tech". The exhibition is aimed at families with children aged 8–14 who are interested in science and technology.

The client has requested an A3 full-colour poster to be displayed around local schools and community centres. The poster should include the exhibition title, dates, ticket price information and the museum logo.

The design must be bright, engaging and suitable for printing at high quality. It should fit with the museum's professional image and follow their brand colours of blue and orange. The poster must be completed by the end of next month.
      `,
      keyPoints: [
        "Client: city museum.",
        "Audience: families with children aged 8–14 interested in science and technology.",
        "Product: A3 full-colour poster for schools and community centres.",
        "Content: title, dates, ticket prices, museum logo.",
        "Constraints: blue/orange brand colours, professional style, print ready, deadline end of next month."
      ],
      questions: [
        {
          text: "Where will the poster mainly be displayed?",
          options: [
            "On social media platforms",
            "Around local schools and community centres",
            "On the side of buses",
            "Inside the exhibition only"
          ],
          correctIndex: 1,
          explanation: "The brief states the poster is to be displayed around local schools and community centres."
        },
        {
          text: "Which of these MUST be included on the poster?",
          options: [
            "A full script of the exhibition audio guide",
            "The designer's name and contact details",
            "The exhibition title, dates, ticket prices and museum logo",
            "A QR code linking to the museum website only"
          ],
          correctIndex: 2,
          explanation: "The brief specifically lists title, dates, ticket prices and the museum logo."
        },
        {
          text: "What does the brief say about the visual style?",
          options: [
            "It should be dark and mysterious.",
            "It must be bright, engaging and suitable for printing.",
            "It must only use black and white.",
            "It should look like a handwritten scrapbook."
          ],
          correctIndex: 1,
          explanation: "The brief mentions bright, engaging and high-quality printed design."
        }
      ]
    },
    {
      id: "podcastIntro",
      label: "School Podcast Intro Jingle",
      briefText: `
A secondary school is starting a new weekly podcast produced by the media studies club. The podcast will share school news, student interviews and revision tips for GCSE subjects.

The client wants a 10–15 second audio jingle to play at the start of every episode. It should include the spoken phrase "Welcome to Garnet High Weekly" and use upbeat, copyright-free background music.

The target audience is students aged 11–16, as well as parents who may listen with them. The jingle should sound friendly and professional and must be provided as a high-quality MP3 file.
      `,
      keyPoints: [
        "Client: secondary school media studies club.",
        "Audience: students aged 11–16 and their parents.",
        "Product: 10–15 second audio jingle.",
        "Content: spoken phrase plus upbeat copyright-free music.",
        "Constraint: exported as a high-quality MP3 file."
      ],
      questions: [
        {
          text: "What type of media product is being created?",
          options: [
            "A video advert for social media",
            "An audio jingle for a podcast",
            "A printed flyer for open evening",
            "A web banner advert"
          ],
          correctIndex: 1,
          explanation: "The brief clearly states they want a 10–15 second audio jingle."
        },
        {
          text: "Which line of dialogue MUST be included?",
          options: [
            "\"Welcome to Garnet High Weekly\"",
            "\"Thanks for listening, see you next time\"",
            "\"Subscribe to our channel\"",
            "\"Follow us on all social media\""
          ],
          correctIndex: 0,
          explanation: "The exact phrase 'Welcome to Garnet High Weekly' is required in the brief."
        },
        {
          text: "What file format does the client require for the final jingle?",
          options: [
            "WAV",
            "AAC",
            "MP4",
            "MP3"
          ],
          correctIndex: 3,
          explanation: "The brief states the jingle must be provided as a high-quality MP3 file."
        }
      ]
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let currentBrief = null;
  let currentQuestionIndex = 0;
  let score = 0;

  // ---------------------------
  // HELPERS
  // ---------------------------

  function clearElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function resetFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
  }

  function selectBriefById(id) {
    return BRIEFS.find((b) => b.id === id) || BRIEFS[0];
  }

  // ---------------------------
  // RENDERING
  // ---------------------------

  function populateBriefSelect() {
    clearElement(briefSelect);
    BRIEFS.forEach((brief) => {
      const opt = document.createElement("option");
      opt.value = brief.id;
      opt.textContent = brief.label;
      briefSelect.appendChild(opt);
    });
  }

  function renderBrief(brief) {
    currentBrief = brief;
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplayEl.textContent = "0";

    // Brief text
    briefTextEl.textContent = "";
    const trimmed = brief.briefText.trim().replace(/\s+\n/g, "\n");
    briefTextEl.textContent = trimmed;

    // Key points
    clearElement(briefKeyPointsEl);
    brief.keyPoints.forEach((kp) => {
      const li = document.createElement("li");
      li.textContent = kp;
      briefKeyPointsEl.appendChild(li);
    });

    // Questions
    questionTotalEl.textContent = brief.questions.length.toString();
    renderQuestion();
  }

  function renderQuestion() {
    resetFeedback();

    const q = currentBrief.questions[currentQuestionIndex];
    questionNumberEl.textContent = (currentQuestionIndex + 1).toString();
    questionTextEl.textContent = q.text;

    clearElement(answersContainer);
    q.options.forEach((optText, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = optText;
      btn.addEventListener("click", () => handleAnswerClick(index));
      answersContainer.appendChild(btn);
    });

    // Next button state
    nextQuestionBtn.disabled = true;
  }

  // ---------------------------
  // ANSWERING LOGIC
  // ---------------------------

  function handleAnswerClick(selectedIndex) {
    const q = currentBrief.questions[currentQuestionIndex];
    const buttons = Array.from(answersContainer.querySelectorAll(".answer-btn"));

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
      feedbackEl.textContent = "Correct – nice detective work!";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent = "Not quite. " + q.explanation;
      feedbackEl.className = "feedback bad";
    }

    nextQuestionBtn.disabled = currentQuestionIndex >= currentBrief.questions.length - 1;
  }

  // ---------------------------
  // EVENT HANDLERS
  // ---------------------------

  newRoundBtn.addEventListener("click", () => {
    const selectedId = briefSelect.value;
    const brief = selectBriefById(selectedId);
    renderBrief(brief);
  });

  nextQuestionBtn.addEventListener("click", () => {
    if (!currentBrief) return;
    if (currentQuestionIndex < currentBrief.questions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    }
  });

  // Initialise UI
  populateBriefSelect();
  const initialBrief = selectBriefById(BRIEFS[0].id);
  renderBrief(initialBrief);
});
