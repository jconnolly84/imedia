document.addEventListener("DOMContentLoaded", () => {
  const modeSelect = document.getElementById("modeSelect");
  const newGameBtn = document.getElementById("newGameBtn");
  const questionHeadingEl = document.getElementById("questionHeading");
  const scenarioTextEl = document.getElementById("scenarioText");
  const scriptExtractEl = document.getElementById("scriptExtract");
  const questionTextEl = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const feedbackEl = document.getElementById("feedback");
  const explanationEl = document.getElementById("explanation");
  const questionNumberEl = document.getElementById("questionNumber");
  const questionTotalEl = document.getElementById("questionTotal");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  // ---------------------------
  // DATA
  // ---------------------------

  const QUESTIONS = [
    {
      id: "layoutColumns",
      focus: "layout",
      heading: "Script layout – missing column",
      scenario:
        "A TV advert script for a new sports drink will be used by the camera operator and sound engineer during filming.",
      script: `Scene 1 – EXT. FOOTBALL PITCH – DAY

[CAMERA: Wide shot of players running]
Narrator: Our new sports drink keeps you going for longer.
[CAMERA: Close up of bottle being opened]
Narrator: Packed with vitamins and electrolytes.`,
      question:
        "What is the MAIN layout problem with this script if it is going to be used on set?",
      options: [
        "There is no separate column or clear section for sound / audio directions.",
        "Scene headings should never be written in capital letters.",
        "There are too many lines of dialogue in the scene.",
        "Camera shots should be written in a different language."
      ],
      correctIndex: 0,
      explanation:
        "A production script often uses separate columns or clearly labelled sections for VIDEO (camera) and AUDIO (dialogue, music, SFX) so each team member can quickly see their instructions."
    },
    {
      id: "speakerLabels",
      focus: "layout",
      heading: "Script layout – speaker names",
      scenario:
        "A radio advert script includes two characters and a voiceover.",
      script: `Scene 1 – RADIO ADVERT

Hi, have you tried the new City Fitness app?
No, what’s that?
It helps you track your workouts and stay motivated!
Voiceover: Download City Fitness now from your app store.`,
      question:
        "What is the BEST improvement to make this script easier to use in production?",
      options: [
        "Add character names (e.g. PERSON A, PERSON B, VOICEOVER) before each line of dialogue.",
        "Remove the scene heading from the top.",
        "Change all the text to capital letters.",
        "Delete the voiceover line completely."
      ],
      correctIndex: 0,
      explanation:
        "Scripts should clearly label who is speaking each line so performers and the director know which dialogue belongs to which character or voiceover."
    },
    {
      id: "directionBrackets",
      focus: "directions",
      heading: "Directions – how to show action",
      scenario:
        "A school drama club is writing a script for a short scene.",
      script: `INT. SCHOOL CORRIDOR – DAY

SAM walks down the corridor. He looks nervous.
SAM: I’m not sure about this…
A teacher appears at the end of the corridor.
TEACHER: Are you ready for your exam, Sam?`,
      question:
        "How could the directions for SAM’s movement be written more clearly using script conventions?",
      options: [
        "Write the movement in brackets on its own line, e.g. (SAM walks nervously down the corridor).",
        "Remove the description of how SAM feels.",
        "Write the directions in a different colour.",
        "Put the directions in the middle of another character’s dialogue."
      ],
      correctIndex: 0,
      explanation:
        "Directions such as movement, facial expression or camera action are usually placed in brackets or a separate action line so they are clearly different from spoken dialogue."
    },
    {
      id: "sfxLabel",
      focus: "audio",
      heading: "Audio – sound effects",
      scenario:
        "A script for a podcast intro includes sound effects and background music.",
      script: `PODCAST INTRO

Music plays quietly.
Door opens.
Host: Welcome to the Tech Talk podcast!`,
      question:
        "What is the BEST way to improve how the sound effects and music are written?",
      options: [
        "Label them clearly as SFX and MUSIC, for example: (MUSIC: upbeat theme, fades in), (SFX: door opens).",
        "Delete the music from the script.",
        "Write all the audio in capital letters only.",
        "Move the sound effects into the host’s dialogue line."
      ],
      correctIndex: 0,
      explanation:
        "Scripts should clearly label audio elements such as MUSIC and SFX so the sound engineer knows exactly what to add and when."
    },
    {
      id: "timingsAdvert",
      focus: "layout",
      heading: "Timings in an advert script",
      scenario:
        "A 30-second TV advert script is being checked before filming.",
      script: `SCENE 1 – EXT. PARK – DAY (00:00–00:10)
[Wide shot of friends running with the product]

SCENE 2 – INT. KITCHEN – DAY (00:10–00:20)
[Close up of product being poured]

SCENE 3 – PACK SHOT (00:20–00:30)
[Product on screen with logo and slogan]`,
      question:
        "Why is including timings in an advert script like this useful?",
      options: [
        "Because it helps the team plan how long each scene should last to fit the total advert duration.",
        "Because it makes the script look more colourful.",
        "Because timings are legally required for all scripts.",
        "Because it means the advert does not need editing."
      ],
      correctIndex: 0,
      explanation:
        "Approximate timings help the production team plan the length of each scene so the final advert fits the required total duration (e.g. 30 seconds)."
    },
    {
      id: "voiceoverLabel",
      focus: "audio",
      heading: "Audio – voiceover",
      scenario:
        "A documentary script includes interviews and a narrator reading facts over archive footage.",
      script: `INT. ARCHIVE FOOTAGE – FACTORY – 1980s

Narrator: In the 1980s, thousands of workers were employed here.

Interview: It was a tough job but we were proud of what we made.`,
      question:
        "What change would make it clearer which parts are voiceover and which are interviews?",
      options: [
        "Label lines that are spoken over the footage as VOICEOVER and label interview speech with the interviewee’s name.",
        "Remove the interview line completely.",
        "Write both lines in capital letters.",
        "Put all the narration into brackets."
      ],
      correctIndex: 0,
      explanation:
        "Scripts should clearly label VOICEOVER (spoken over other footage) and identify interview speakers so the editor knows which audio goes where."
    },
    {
      id: "cameraVsDialogue",
      focus: "directions",
      heading: "Camera vs dialogue",
      scenario:
        "A script for a short film has all camera shots mixed into the same lines as the dialogue.",
      script: `INT. BEDROOM – NIGHT

[CAMERA: Close up of phone buzzing] ALEX: I can’t believe this is happening…
[CAMERA: Over-the-shoulder shot of messages on screen]`,
      question:
        "What is the BEST improvement for this script layout?",
      options: [
        "Separate camera directions from dialogue, for example with a VIDEO column for camera shots and an AUDIO column for speech.",
        "Remove all camera directions and only leave dialogue.",
        "Write the camera directions in the middle of every sentence.",
        "Change the bedroom setting to a kitchen."
      ],
      correctIndex: 0,
      explanation:
        "Separating VIDEO (camera/action) and AUDIO (dialogue/sound) makes the script easier to follow for the camera operator and actors."
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
    explanationEl.textContent = "";
    explanationEl.classList.add("hidden");
  }

  function filterQuestionsByMode(mode) {
    if (mode === "layout") {
      return QUESTIONS.filter((q) => q.focus === "layout");
    }
    if (mode === "directions") {
      return QUESTIONS.filter((q) => q.focus === "directions");
    }
    if (mode === "audio") {
      return QUESTIONS.filter((q) => q.focus === "audio");
    }
    return QUESTIONS.slice();
  }

  // ---------------------------
  // GAME LOGIC
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
    scenarioTextEl.textContent = q.scenario;
    scriptExtractEl.textContent = q.script;
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
      feedbackEl.textContent = "Correct – you’ve made the right fix for this script.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent = "Not quite. Check the explanation for how this script should be written.";
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

  // Initial display
  questionTotalEl.textContent = filterQuestionsByMode(currentMode).length.toString();
});
