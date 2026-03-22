document.addEventListener("DOMContentLoaded", () => {
  const scenarioSelect = document.getElementById("scenarioSelect");
  const newRoundBtn = document.getElementById("newRoundBtn");
  const briefTextEl = document.getElementById("briefText");
  const briefFocusEl = document.getElementById("briefFocus");
  const scenarioLabelEl = document.getElementById("scenarioLabel");
  const perfectCountEl = document.getElementById("perfectCount");
  const stepsContainer = document.getElementById("stepsContainer");
  const checkBtn = document.getElementById("checkBtn");
  const feedbackEl = document.getElementById("feedback");

  // ---------------------------
  // DATA
  // ---------------------------

  const SCENARIOS = [
    {
      id: "socialMediaVideo",
      label: "Social Media Video Advert",
      brief: `
A small dessert shop wants a 20–30 second social media video advert for TikTok and Instagram.
The advert will promote a new product range to teenagers.

Before filming starts, the production team must complete several planning and pre‑production tasks.
      `,
      focusPoints: [
        "Client needs and target audience.",
        "Planning content and visuals before filming.",
        "Organising resources and schedule."
      ],
      // Correct order: index 0 is first step, etc.
      steps: [
        "Meet with the client to agree aims, audience and key messages.",
        "Research similar social media adverts and gather inspiration.",
        "Create a mood board to explore overall look and feel.",
        "Write a script or narration for the voiceover and on‑screen text.",
        "Produce a storyboard showing each shot and any audio.",
        "Create a work plan with tasks, timings and responsibilities.",
        "Prepare a location recce and risk assessment for the shoot."
      ]
    },
    {
      id: "posterCampaign",
      label: "Poster Campaign",
      brief: `
A city museum is launching a new ‘Future Tech’ exhibition and wants an A3 poster
to display in local schools and community centres.

The designer needs to follow the client’s brand guidelines and meet the print deadline.
      `,
      focusPoints: [
        "Understanding the client brief and brand guidelines.",
        "Planning the layout and content of the poster.",
        "Checking that the design is suitable for high‑quality printing."
      ],
      steps: [
        "Read and discuss the client brief to confirm purpose, audience and deadline.",
        "Research other museum posters and collect examples of strong designs.",
        "Create a mind map of content ideas, images and key messages.",
        "Produce a visualisation diagram showing the layout of the A3 poster.",
        "Check brand guidelines to apply correct colours, fonts and logo rules.",
        "Create an asset list of required images, logos and text content.",
        "Export a test version of the design and review it with the client before final print."
      ]
    },
    {
      id: "podcastEpisode",
      label: "School Podcast Episode",
      brief: `
A secondary school is starting a weekly podcast aimed at students and parents.
The media club will produce a 10‑minute pilot episode including news, interviews and revision tips.

They must plan the content and sound carefully before recording.
      `,
      focusPoints: [
        "Structuring the episode into clear sections.",
        "Planning script, questions and timings.",
        "Preparing technical resources and recording schedule."
      ],
      steps: [
        "Agree the purpose and target audience for the podcast episode.",
        "Plan the running order (segments such as news, interview, revision tip).",
        "Write a script or bullet points for the presenter and interview questions.",
        "Create a simple storyboard or outline for any intro/outro music and jingles.",
        "List required equipment and software (microphones, mixer, DAW).",
        "Create a work plan with dates and times for recording and editing.",
        "Book a quiet room and check sound levels before recording day."
      ]
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let currentScenario = SCENARIOS[0];
  let orderIndexes = []; // array of indexes into currentScenario.steps
  let perfectRounds = 0;

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

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function selectScenarioById(id) {
    return SCENARIOS.find((s) => s.id === id) || SCENARIOS[0];
  }

  // ---------------------------
  // RENDERING
  // ---------------------------

  function populateScenarioSelect() {
    clearElement(scenarioSelect);
    SCENARIOS.forEach((sc) => {
      const opt = document.createElement("option");
      opt.value = sc.id;
      opt.textContent = sc.label;
      scenarioSelect.appendChild(opt);
    });
  }

  function renderScenario(scenario) {
    currentScenario = scenario;
    resetFeedback();

    scenarioLabelEl.textContent = scenario.label;

    // Brief
    briefTextEl.textContent = scenario.brief.trim();
    clearElement(briefFocusEl);
    scenario.focusPoints.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      briefFocusEl.appendChild(li);
    });

    // Steps
    const indices = currentScenario.steps.map((_, idx) => idx);
    // Shuffle for the race
    orderIndexes = shuffle(indices);

    renderSteps();
  }

  function renderSteps() {
    clearElement(stepsContainer);
    orderIndexes.forEach((stepIndex, displayIndex) => {
      const row = document.createElement("div");
      row.className = "step-row";
      row.dataset.stepIndex = stepIndex.toString();

      const indexLabel = document.createElement("div");
      indexLabel.className = "step-index";
      indexLabel.textContent = (displayIndex + 1).toString() + ".";

      const text = document.createElement("div");
      text.className = "step-text";
      text.textContent = currentScenario.steps[stepIndex];

      const controls = document.createElement("div");
      controls.className = "step-controls";

      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.className = "btn-icon";
      upBtn.textContent = "▲";
      upBtn.title = "Move up";
      upBtn.addEventListener("click", () => moveStep(displayIndex, -1));

      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.className = "btn-icon";
      downBtn.textContent = "▼";
      downBtn.title = "Move down";
      downBtn.addEventListener("click", () => moveStep(displayIndex, 1));

      controls.appendChild(upBtn);
      controls.appendChild(downBtn);

      row.appendChild(indexLabel);
      row.appendChild(text);
      row.appendChild(controls);
      stepsContainer.appendChild(row);
    });
  }

  // ---------------------------
  // ORDER LOGIC
  // ---------------------------

  function moveStep(currentPos, direction) {
    const newPos = currentPos + direction;
    if (newPos < 0 || newPos >= orderIndexes.length) return;

    const newOrder = orderIndexes.slice();
    const temp = newOrder[currentPos];
    newOrder[currentPos] = newOrder[newPos];
    newOrder[newPos] = temp;
    orderIndexes = newOrder;
    renderSteps();
  }

  function checkOrder() {
    resetFeedback();

    const rows = Array.from(stepsContainer.querySelectorAll(".step-row"));
    if (!rows.length) return;

    let correctCount = 0;
    rows.forEach((row, position) => {
      row.classList.remove("correct", "wrong");
      const stepIndex = parseInt(row.dataset.stepIndex || "0", 10);
      const shouldIndex = position; // correct index at this position
      if (stepIndex === shouldIndex) {
        correctCount++;
        row.classList.add("correct");
      } else {
        row.classList.add("wrong");
      }
    });

    const total = currentScenario.steps.length;

    if (correctCount === total) {
      perfectRounds++;
      perfectCountEl.textContent = perfectRounds.toString();
      feedbackEl.textContent =
        "Perfect – your pre‑production is in the ideal order. Ready to move into production!";
      feedbackEl.className = "feedback good";
    } else if (correctCount >= Math.ceil(total * 0.6)) {
      feedbackEl.textContent =
        `Almost there – ${correctCount} of ${total} steps are in the right place. Check the red rows and adjust.`;
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent =
        `Keep working – only ${correctCount} of ${total} steps are correctly placed. Think about what must happen before and after each task.`;
      feedbackEl.className = "feedback bad";
    }
  }

  // ---------------------------
  // EVENTS
  // ---------------------------

  newRoundBtn.addEventListener("click", () => {
    const selectedId = scenarioSelect.value;
    const scenario = selectScenarioById(selectedId);
    renderScenario(scenario);
  });

  checkBtn.addEventListener("click", () => {
    checkOrder();
  });

  // ---------------------------
  // INITIALISE
  // ---------------------------

  populateScenarioSelect();
  scenarioSelect.value = SCENARIOS[0].id;
  renderScenario(SCENARIOS[0]);
});
