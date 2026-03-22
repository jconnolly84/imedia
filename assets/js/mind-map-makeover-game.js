document.addEventListener("DOMContentLoaded", () => {
  const scenarioSelect = document.getElementById("scenarioSelect");
  const newScenarioBtn = document.getElementById("newScenarioBtn");
  const mindmapTextEl = document.getElementById("mindmapText");
  const mindmapNotesEl = document.getElementById("mindmapNotes");
  const scenarioLabelEl = document.getElementById("scenarioLabel");
  const scoreDisplayEl = document.getElementById("scoreDisplay");
  const optionsForm = document.getElementById("optionsForm");
  const checkBtn = document.getElementById("checkBtn");
  const showModelBtn = document.getElementById("showModelBtn");
  const feedbackEl = document.getElementById("feedback");
  const modelAnswerEl = document.getElementById("modelAnswer");

  // ---------------------------
  // DATA
  // ---------------------------

  const SCENARIOS = [
    {
      id: "alooshiPoster",
      label: "Dessert Shop Social Media Mind Map",
      mindmapText: `
                Alooshi Advert Mind Map

                       Alooshi
                         |
         ------------------------------------------------
         |                 |                |          |
     Instagram          Flavours          Prices    Logo?
                          |
            -------------------------------
            |             |             |
          Chocolate     Strawberry     Mint

    Notes:
    - Random words around the page, some not connected.
    - Colours used at random with no legend.
    - No branches for target audience, timescale or platform.
    - Very few sub‑topics, most ideas on the same line.
      `,
      notes: [
        "The student has written some relevant ideas, but there is no clear grouping.",
        "Important areas like audience and deadline are missing completely.",
        "Colour has been used randomly and not to show different branches/sub‑topics."
      ],
      options: [
        {
          text: "The central node shows the client / project name.",
          isIssue: false
        },
        {
          text: "There are no branches for target audience, timescale or client requirements.",
          isIssue: true
        },
        {
          text: "All ideas are connected in a clearly labelled structure with sub‑topics.",
          isIssue: false
        },
        {
          text: "Many ideas are just single words with no further breakdown.",
          isIssue: true
        },
        {
          text: "Colour has been used to separate different categories of information.",
          isIssue: false
        },
        {
          text: "Colour appears random and there is no legend to explain what it means.",
          isIssue: true
        },
        {
          text: "Key sections like platform, content and style could be added as main branches.",
          isIssue: true
        },
        {
          text: "Every branch has detailed annotations explaining what will be included.",
          isIssue: false
        }
      ],
      modelAnswer:
        "Problems: no branches for audience, timescale or requirements, ideas are very shallow (single words), and colour is used randomly with no legend. To improve it, the student should add main branches for audience, platforms, content, style and constraints, then break each one down into sub‑topics with short annotations."
    },
    {
      id: "museumPoster",
      label: "Museum Poster Mind Map",
      mindmapText: `
                 Future Tech Poster

                        Poster
                          |
           -----------------------------------
           |            |            |      |
        Text?        Colours      Images  Dates?

    Extra notes scribbled in the corners:
    - \"blue + orange maybe\"
    - \"robots?\" \"kids\"
    - \"museum logo??\" (circled once)

    There are large empty spaces and some ideas are repeated in different places
    (e.g. 'robots' appears in two separate branches). No arrows or links are used
    to show how the information is connected.
      `,
      notes: [
        "The main topic 'Poster' is too vague – it doesn’t show the exhibition title.",
        "There is very little detail about where the poster will be displayed or who it is for.",
        "Some ideas are repeated instead of being grouped into one clear branch."
      ],
      options: [
        {
          text: "The central node could be improved by using the exhibition name rather than just 'Poster'.",
          isIssue: true
        },
        {
          text: "There is a clear branch for target audience (families with children 8–14) with sub‑topics.",
          isIssue: false
        },
        {
          text: "Key required content like dates, prices and museum logo are only mentioned as small questions.",
          isIssue: true
        },
        {
          text: "The mind map uses arrows and links to show how different ideas connect.",
          isIssue: false
        },
        {
          text: "Important visual ideas such as 'robots' are scattered in different places instead of grouped.",
          isIssue: true
        },
        {
          text: "There is enough space for the designer to add more ideas later.",
          isIssue: false
        }
      ],
      modelAnswer:
        "Problems: central node is vague, there is no clear audience branch, required content is only shown as question marks, and some ideas like 'robots' are repeated rather than grouped. A better mind map would use 'Future Tech Exhibition Poster' as the centre and have clear branches for audience, content, imagery, layout and brand guidelines."
    },
    {
      id: "podcastJingle",
      label: "Podcast Jingle Mind Map",
      mindmapText: `
                 School Podcast Jingle

                        Jingle
                          |
           ------------------------------------
           |          |          |           |
        Music      Voice      Sounds      Length
                     |
                 \"Welcome?\"

    Other notes:
    - small scribble: \"mp3\"
    - tiny text at edge: \"students + parents\"

    The writing is very small and cramped in one corner. There are no examples of
    specific sound effects or how the jingle will reflect the school's image.
      `,
      notes: [
        "The student has included some main branches (music, voice, sounds, length).",
        "Audience and file format are only written in tiny notes at the edge.",
        "There is no detail about style, mood or how to meet the school’s professional image."
      ],
      options: [
        {
          text: "The main branches (music, voice, sounds, length) are a good starting point.",
          isIssue: false
        },
        {
          text: "Audience and file format are not clearly shown as branches.",
          isIssue: true
        },
        {
          text: "There are no examples of specific sound effects or instruments.",
          isIssue: true
        },
        {
          text: "The mind map clearly explains how the jingle will sound friendly and professional.",
          isIssue: false
        },
        {
          text: "Most of the writing is very small and cramped, which makes it hard to read.",
          isIssue: true
        },
        {
          text: "A branch about 'style / mood' could be added with annotations such as 'upbeat' or 'warm'.",
          isIssue: true
        }
      ],
      modelAnswer:
        "Problems: audience and file format are hidden in tiny notes, there are no examples of sound effects, and nothing explains style or mood. The layout is hard to read. Improvements: make audience and format into clear branches, add a 'style/mood' branch with annotations and list example instruments and effects."
    }
  ];

  // ---------------------------
  // STATE
  // ---------------------------

  let currentScenario = SCENARIOS[0];
  let score = 0;

  // ---------------------------
  // HELPERS
  // ---------------------------

  function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function resetFeedback() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    modelAnswerEl.textContent = "";
    modelAnswerEl.classList.add("hidden");
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

  function selectScenarioById(id) {
    return SCENARIOS.find((s) => s.id === id) || SCENARIOS[0];
  }

  function renderScenario(scenario) {
    currentScenario = scenario;
    resetFeedback();
    score = 0;
    scoreDisplayEl.textContent = "0";

    scenarioLabelEl.textContent = scenario.label;

    // Mind map text & notes
    mindmapTextEl.textContent = scenario.mindmapText.trim();
    clearElement(mindmapNotesEl);
    scenario.notes.forEach((note) => {
      const li = document.createElement("li");
      li.textContent = note;
      mindmapNotesEl.appendChild(li);
    });

    // Options
    clearElement(optionsForm);
    scenario.options.forEach((opt, index) => {
      const row = document.createElement("label");
      row.className = "option-row";
      row.dataset.optionIndex = index.toString();

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "option-" + index;

      const span = document.createElement("span");
      span.className = "option-label";
      span.textContent = opt.text;

      row.appendChild(checkbox);
      row.appendChild(span);
      optionsForm.appendChild(row);
    });
  }

  // ---------------------------
  // CHECKING
  // ---------------------------

  function checkAnswers() {
    const rows = Array.from(optionsForm.querySelectorAll(".option-row"));
    if (!rows.length) return;

    let correctIssues = 0;
    let totalIssues = 0;
    let anyChecked = false;

    rows.forEach((row) => {
      row.classList.remove("issue-correct", "issue-missed", "issue-wrong");
    });

    rows.forEach((row) => {
      const index = parseInt(row.dataset.optionIndex || "0", 10);
      const opt = currentScenario.options[index];
      const checkbox = row.querySelector('input[type="checkbox"]');
      const checked = checkbox && checkbox.checked;

      if (checked) anyChecked = true;
      if (opt.isIssue) totalIssues++;

      if (opt.isIssue && checked) {
        correctIssues++;
        row.classList.add("issue-correct");
      } else if (opt.isIssue && !checked) {
        row.classList.add("issue-missed");
      } else if (!opt.isIssue && checked) {
        row.classList.add("issue-wrong");
      }
    });

    score = correctIssues;
    scoreDisplayEl.textContent = `${correctIssues} / ${totalIssues}`;

    if (!anyChecked) {
      feedbackEl.textContent = "Try again – tick every statement that describes a problem with the mind map.";
      feedbackEl.className = "feedback bad";
      return;
    }

    if (correctIssues === totalIssues && totalIssues > 0) {
      feedbackEl.textContent =
        "Excellent – you have identified all the key weaknesses. Explain these clearly in an exam answer for full marks.";
      feedbackEl.className = "feedback good";
    } else if (correctIssues >= Math.ceil(totalIssues * 0.6)) {
      feedbackEl.textContent =
        "Good start – you found most of the important problems. Check the highlighted rows to see what you missed.";
      feedbackEl.className = "feedback good";
    } else {
      feedbackEl.textContent =
        "Keep practising – compare your choices with the model answer to see which weaknesses you missed.";
      feedbackEl.className = "feedback bad";
    }
  }

  function showModel() {
    if (!currentScenario) return;
    modelAnswerEl.textContent = currentScenario.modelAnswer;
    modelAnswerEl.classList.remove("hidden");
  }

  // ---------------------------
  // EVENT LISTENERS
  // ---------------------------

  newScenarioBtn.addEventListener("click", () => {
    const selectedId = scenarioSelect.value;
    const scenario = selectScenarioById(selectedId);
    renderScenario(scenario);
  });

  checkBtn.addEventListener("click", () => {
    checkAnswers();
  });

  showModelBtn.addEventListener("click", () => {
    showModel();
  });

  // Initialise
  populateScenarioSelect();
  scenarioSelect.value = SCENARIOS[0].id;
  renderScenario(SCENARIOS[0]);
});
