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
        "There is no separate column or clear section for sound / audio directions, so the sound engineer cannot quickly find their instructions.",
        "Scene headings should never be written in capital letters because that makes the script look too formal for the crew.",
        "There are too many lines of dialogue in the scene, which will automatically make the advert run over its time limit.",
        "Camera shots should be written in a different language so that only the camera operator can understand them."
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
        "Add character names (e.g. PERSON A, PERSON B, VOICEOVER) before each line of dialogue so the performers can clearly see which lines belong to them.",
        "Remove the scene heading from the top so the director has to work out the setting from the dialogue instead.",
        "Change all the text to capital letters so that the entire script looks more dramatic on the page.",
        "Delete the voiceover line completely and hope the advert still makes sense without the call to action."
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
        "Write the movement in brackets on its own line, for example: (SAM walks nervously down the corridor, looking unsure).",
        "Remove the description of how SAM feels so that the actor can guess the emotion without any guidance.",
        "Write the directions in a different colour pen to show they are separate from the rest of the script.",
        "Put the directions in the middle of another character’s dialogue so that the lines feel more crowded."
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
        "Label them clearly as SFX and MUSIC, for example: (MUSIC: upbeat theme, fades in), (SFX: door opens loudly as the host enters).",
        "Delete the music from the script so the sound engineer can improvise their own background track later.",
        "Write all the audio in capital letters only and hope the sound engineer can guess what type of sound each line is.",
        "Move the sound effects into the host’s dialogue line so everything appears on a single line of the script."
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
        "Because it helps the team plan how long each scene should last so the finished advert fits the required total duration.",
        "Because it makes the script look more colourful and visually interesting for the advertising client.",
        "Because timings are legally required on every single type of script, including school plays and podcasts.",
        "Because it means the advert does not need editing at all once it has been filmed on location."
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
        "Label lines that are spoken over the footage as VOICEOVER and label interview speech with the interviewee’s name so the editor can organise the audio correctly.",
        "Remove the interview line completely so that the documentary only contains the narrator’s opinion.",
        "Write both lines in capital letters to show that they are equally important, without explaining who is speaking.",
        "Put all the narration into brackets so it looks like a stage direction rather than spoken audio."
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
        "Separate camera directions from dialogue, for example with a VIDEO column for camera shots and an AUDIO column for speech so each team member can scan their part easily.",
        "Remove all camera directions and only leave dialogue, leaving the camera operator to guess which shots to use on the day.",
        "Write the camera directions in the middle of every sentence so they interrupt the dialogue and make it harder to read.",
        "Change the bedroom setting to a kitchen because different locations always improve script layout problems."
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
  let currentOptions = [];

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

    // Build a shuffled set of answer options so the correct one is not always first
    currentOptions = shuffle(
      q.options.map((text, originalIndex) => ({
        text,
        isCorrect: originalIndex === q.correctIndex
      }))
    );

    currentOptions.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => handleAnswerClick(index));
      answersContainer.appendChild(btn);
    });
  }

  function handleAnswerClick(selectedIndex) {
    const q = questionPool[currentIndex];
    const buttons = Array.from(
      answersContainer.querySelectorAll(".answer-btn")
    );

    const selectedOption = currentOptions[selectedIndex];
    const isCorrect = selectedOption && selectedOption.isCorrect;

    buttons.forEach((btn, index) => {
      btn.disabled = true;
      if (currentOptions[index].isCorrect) {
        btn.classList.add("correct");
      }
      if (index === selectedIndex && !currentOptions[index].isCorrect) {
        btn.classList.add("wrong");
      }
    });

    if (isCorrect) {
      score++;
      scoreDisplayEl.textContent = score.toString();
      feedbackEl.textContent =
        "Correct – you’ve made the right fix for this script.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent =
        "Not quite. Check the explanation for how this script should be written.";
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
