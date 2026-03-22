// Exam Styles Showdown – 3-stage training game (rewritten with linked scenarios)
// Stage 1: spot the question style
// Stage 2: build a describe answer (with smarter marking)
// Stage 3: choose the best points for an extended answer

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // DOM elements
  // ---------------------------
  const topicSelect = document.getElementById("topicSelect");
  const startGameBtn = document.getElementById("startGameBtn");
  const stageIndicatorEl = document.getElementById("stageIndicator");
  const questionFocusEl = document.getElementById("questionFocus");
  const questionTextEl = document.getElementById("questionText");
  const subPromptEl = document.getElementById("subPrompt");
  const scoreDisplayEl = document.getElementById("scoreDisplay");

  const identifyRoundEl = document.getElementById("identifyRound");
  const describeRoundEl = document.getElementById("describeRound");
  const extendRoundEl = document.getElementById("extendRound");

  const styleButtons = Array.from(document.querySelectorAll(".style-btn"));
  const describeAnswerEl = document.getElementById("describeAnswer");
  const submitDescribeBtn = document.getElementById("submitDescribeBtn");
  const extendOptionsEl = document.getElementById("extendOptions");
  const submitExtendBtn = document.getElementById("submitExtendBtn");

  const feedbackEl = document.getElementById("feedback");
  const breakdownEl = document.getElementById("markingBreakdown");
  const nextStageBtn = document.getElementById("nextStageBtn");

  const summaryCardEl = document.getElementById("summaryCard");
  const finalScoreEl = document.getElementById("finalScore");
  const examReadinessEl = document.getElementById("examReadiness");
  const playAgainBtn = document.getElementById("playAgainBtn");

  // ---------------------------
  // DATA – topics, scenarios & stages
  // ---------------------------

  const QUESTION_SETS = {
    preproduction: {
      name: "Pre-production & planning",
      scenarios: [
        {
          intro: "You are planning a digital poster for a new sci-fi film.",
          stage1: {
            question:
              "Give one reason why a client brief is created before starting work on the digital poster. (1 mark)",
            style: "identify",
            explanation:
              "This is a short, single-mark question asking for one clear purpose of the brief, not a detailed paragraph."
          },
          stage2: {
            question:
              "Describe two pieces of information that should be included in the client brief for this digital poster. (3 marks)",
            maxMarks: 3,
            keywords: ["target", "purpose", "deadline", "budget", "format"],
            synonyms: {
              target: ["target audience", "who it is aimed at", "audience"],
              purpose: ["aim", "objective", "what it is for"],
              deadline: ["timescale", "time scale", "hand-in date"],
              budget: ["cost", "money available"],
              format: ["size", "dimensions", "file type"]
            },
            goodPhrases: [
              "meet the client's needs",
              "fits the target audience",
              "realistic timescale",
              "within the budget"
            ],
            explanation:
              "You gain marks for naming important parts of the brief and saying why they matter, such as helping the designer meet the audience and deadline."
          },
          stage3: {
            question:
              "The client wants the poster to appeal to teenagers who enjoy sci-fi films. Discuss how information from the client brief and audience research will influence the choices you make when designing the poster. (8 marks)",
            bestPoints: [
              "use research about teenagers to choose suitable colours, fonts and images",
              "follow requirements in the brief such as size, format and key information",
              "audience research helps decide which sci-fi elements will attract the target group",
              "using the brief and research together ensures the design meets the client’s purpose"
            ],
            distractors: [
              "ignore the brief and design whatever you like",
              "copy another film poster without checking copyright",
              "focus only on special effects software",
              "spend most of the time changing the logo colours over and over"
            ],
            explanation:
              "High-mark answers link the brief and the audience research to specific design choices, not just list random features of a poster."
          }
        },
        {
          intro: "You are creating a storyboard for a short TV advert.",
          stage1: {
            question:
              "Give one reason why a storyboard is useful when planning the TV advert. (1 mark)",
            style: "identify",
            explanation:
              "This question expects one clear benefit of using a storyboard during planning."
          },
          stage2: {
            question:
              "Describe two ways a storyboard can help the production team when filming the advert. (3 marks)",
            maxMarks: 3,
            keywords: ["shots", "sequence", "timing", "camera", "review"],
            synonyms: {
              shots: ["scenes", "frames"],
              sequence: ["order"],
              timing: ["duration", "how long", "timings"],
              camera: ["camera angles", "camera movement"],
              review: ["check", "preview", "spot problems"]
            },
            goodPhrases: [
              "see the order of shots",
              "check timings",
              "share ideas with the client",
              "spot problems early"
            ],
            explanation:
              "Marks come from describing how the storyboard supports planning, such as showing the order of shots and timings so the team can film efficiently."
          },
          stage3: {
            question:
              "The client is worried that the advert will not clearly show the product’s main features. Discuss how careful planning of the storyboard could help produce an effective advert. (8 marks)",
            bestPoints: [
              "choose shots that clearly show the product and its features",
              "use annotations on the storyboard to explain key actions and dialogue",
              "plan timings so important messages are on screen long enough",
              "review the storyboard with the client to check it meets the brief"
            ],
            distractors: [
              "focus only on background music choices",
              "ignore the client once the first draft storyboard is made",
              "add as many random camera movements as possible",
              "leave planning until filming day"
            ],
            explanation:
              "Stronger answers explain how storyboard planning leads to clearer communication of the product’s features and a more effective final advert."
          }
        },
        {
          intro: "You are producing a visualisation diagram for a game package cover.",
          stage1: {
            question:
              "Give one reason why a visualisation diagram is created before making the final game package cover. (1 mark)",
            style: "identify",
            explanation:
              "This single-mark question needs one clear purpose of the visualisation diagram."
          },
          stage2: {
            question:
              "Describe two elements you would include on the visualisation diagram for the game package cover. (3 marks)",
            maxMarks: 3,
            keywords: ["images", "text", "colour", "layout", "logo"],
            synonyms: {
              images: ["pictures", "artwork", "graphics"],
              text: ["title", "writing", "headings"],
              colour: ["colour scheme", "colours"],
              layout: ["arrangement", "positioning", "composition"],
              logo: ["branding", "brand logo"]
            },
            goodPhrases: [
              "match the brief",
              "target audience",
              "stands out on the shelf",
              "easy to read"
            ],
            explanation:
              "You earn marks for naming suitable elements and describing how they will be used on the cover, such as images, text and layout choices."
          },
          stage3: {
            question:
              "Discuss how the choices you make for the visualisation diagram will help the final game package cover attract the target audience. (8 marks)",
            bestPoints: [
              "use colours and images that appeal to the chosen age group",
              "place title and key information where it is easy to see",
              "ensure branding is clear so the game is recognisable",
              "link design decisions to information in the client brief"
            ],
            distractors: [
              "ignore the target audience and design for yourself",
              "use as many fonts as possible to make it look busy",
              "leave space planning until after printing",
              "focus only on the back cover and ignore the front"
            ],
            explanation:
              "High-band answers link design choices on the diagram directly to attracting the target audience and meeting the brief."
          }
        }
      ]
    },
    copyright: {
      name: "Copyright & legislation",
      scenarios: [
        {
          intro: "You are making a school website that will use images found online.",
          stage1: {
            question:
              "Give one consequence of using someone else’s image on the website without permission. (1 mark)",
            style: "identify",
            explanation:
              "Here you only need to name one clear consequence, such as legal action or the image being taken down."
          },
          stage2: {
            question:
              "Describe two ways you can make sure images used on the school website follow copyright law. (3 marks)",
            maxMarks: 3,
            keywords: ["permission", "licence", "credit", "copyright-free", "original"],
            synonyms: {
              permission: ["ask the owner", "get permission"],
              licence: ["licence agreement", "terms of use", "Creative Commons"],
              credit: ["acknowledge", "give credit"],
              "copyright-free": ["royalty-free", "free to use"],
              original: ["your own", "create it yourself"]
            },
            goodPhrases: [
              "check the licence",
              "get permission from the owner",
              "use royalty-free or Creative Commons resources"
            ],
            explanation:
              "You gain marks for describing practical steps that follow copyright law, not just saying 'follow the rules'."
          },
          stage3: {
            question:
              "Discuss how copyright law affects the choices you make when selecting images for the school website. (8 marks)",
            bestPoints: [
              "must check licences or permissions before using images",
              "may need to use royalty-free or Creative Commons images",
              "risk of the school facing complaints or legal action if images are used wrongly",
              "might decide to create original images to avoid copyright issues"
            ],
            distractors: [
              "copyright does not apply on school projects",
              "it is always safe if the image is found on social media",
              "you can ignore licences because it is educational",
              "copyright only applies to printed work"
            ],
            explanation:
              "Better answers consider both what you are allowed to do and how copyright limits or changes your design choices."
          }
        },
        {
          intro:
            "You are designing a promotional video that includes interviews with students.",
          stage1: {
            question:
              "Give one reason why the media company must follow the Data Protection Act when storing the students’ personal details. (1 mark)",
            style: "identify",
            explanation:
              "This question wants one clear reason linked to keeping personal data safe and used fairly."
          },
          stage2: {
            question:
              "Describe two ways the Data Protection Act affects how the students’ personal data should be stored. (3 marks)",
            maxMarks: 3,
            keywords: ["secure", "encrypted", "access", "accurate", "up to date"],
            synonyms: {
              secure: ["safe", "locked", "protected"],
              encrypted: ["scrambled", "encoded"],
              access: ["only authorised staff", "limited access", "restricted"],
              accurate: ["correct"],
              "up to date": ["kept up to date", "updated"]
            },
            goodPhrases: [
              "kept secure",
              "only authorised staff can see it",
              "kept accurate and up to date"
            ],
            explanation:
              "Marks come from describing what must be done with the data, such as keeping it secure and limiting who can access it."
          },
          stage3: {
            question:
              "Discuss how the Data Protection Act could affect the way a media company collects and uses personal data in this project. (8 marks)",
            bestPoints: [
              "must get consent before collecting personal data",
              "can only use data for the stated purpose",
              "must store data securely and limit access",
              "must not keep data longer than necessary"
            ],
            distractors: [
              "can share data with any third party for profit",
              "no need to tell people how their data will be used",
              "can collect any data they like even if not needed",
              "the law only applies to paper records"
            ],
            explanation:
              "High-mark answers cover several principles of the Act and link them directly to how the company runs the project."
          }
        }
      ]
    }
  };

  // ---------------------------
  // STATE
  // ---------------------------

  let currentTopicKey = "preproduction";
  let currentStage = 0; // 0 = not started, 1 = identify, 2 = describe, 3 = extend, 4 = finished
  let score = 0;

  let currentScenario = null;
  let currentIdentifyQuestion = null;
  let currentDescribeQuestion = null;
  let currentExtendQuestion = null;

  // ---------------------------
  // Helper functions
  // ---------------------------

  function resetUI() {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    breakdownEl.textContent = "";
    breakdownEl.classList.add("hidden");
    nextStageBtn.disabled = true;
    summaryCardEl.classList.add("hidden");
  }

  function updateScore(delta) {
    score += delta;
    if (score < 0) score = 0;
    scoreDisplayEl.textContent = String(score);
  }

  function setStageIndicator(stageNumber) {
    stageIndicatorEl.textContent = `Stage ${stageNumber} of 3`;
  }

  function cleanTextForAnalysis(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenise(text) {
    if (!text) return [];
    return text.split(" ").filter(Boolean);
  }

  function includesAny(text, terms) {
    return terms.some((t) => text.includes(t));
  }

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // ---------------------------
  // Stage 1 – Identify style
  // ---------------------------

  function startIdentifyStage() {
    currentStage = 1;
    resetUI();
    setStageIndicator(1);

    const topic = QUESTION_SETS[currentTopicKey];
    const scenarios = topic.scenarios;
    currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    currentIdentifyQuestion = currentScenario.stage1;

    questionFocusEl.innerHTML = `Topic: <strong>${topic.name}</strong> – ${currentScenario.intro}`;
    questionTextEl.textContent = currentIdentifyQuestion.question;
    subPromptEl.textContent =
      "Look at the command word and how many marks there are. What type of question is this?";

    identifyRoundEl.classList.remove("hidden");
    describeRoundEl.classList.add("hidden");
    extendRoundEl.classList.add("hidden");

    // Reset style buttons
    styleButtons.forEach((btn) => {
      btn.classList.remove("good", "bad", "correct", "wrong");
      btn.disabled = false;
    });
  }

  function handleStyleButtonClick(chosenStyle) {
    const correctStyle = currentIdentifyQuestion.style;

    styleButtons.forEach((btn) => {
      btn.disabled = true;
      const thisStyle = btn.dataset.style;
      if (thisStyle === correctStyle) {
        btn.classList.add("correct");
      }
      if (thisStyle === chosenStyle && thisStyle !== correctStyle) {
        btn.classList.add("wrong");
      }
    });

    if (chosenStyle === correctStyle) {
      feedbackEl.textContent =
        "Correct – you've matched the command word and marks to the right exam style.";
      feedbackEl.classList.add("good");
      updateScore(100);
    } else {
      feedbackEl.textContent =
        "Not quite. Think about how many marks there are and how short the answer should be.";
      feedbackEl.classList.add("bad");
    }

    // Explanation AFTER the choice – but without naming the command word
    breakdownEl.textContent = currentIdentifyQuestion.explanation;
    breakdownEl.classList.remove("hidden");

    nextStageBtn.disabled = false;
    nextStageBtn.textContent = "Stage 2 – build a describe answer";
  }

  // ---------------------------
  // Stage 2 – Describe answer (smarter marking)
  // ---------------------------

  function startDescribeStage() {
    if (!currentScenario) {
      // Safety: if someone somehow jumps straight to stage 2
      startIdentifyStage();
      return;
    }

    currentStage = 2;
    resetUI();
    setStageIndicator(2);

    const topic = QUESTION_SETS[currentTopicKey];
    currentDescribeQuestion = currentScenario.stage2;

    questionFocusEl.innerHTML =
      "Stage 2: <strong>Describe</strong> question practice – " + topic.name;
    questionTextEl.textContent = currentDescribeQuestion.question;
    subPromptEl.textContent =
      "Use the same scenario as before. Aim for one clear point per mark and include key terms from the question.";

    identifyRoundEl.classList.add("hidden");
    describeRoundEl.classList.remove("hidden");
    extendRoundEl.classList.add("hidden");

    describeAnswerEl.value = "";
  }

  function analyseDescribeAnswer(question, rawAnswer) {
    const cleaned = cleanTextForAnalysis(rawAnswer);
    const tokens = tokenise(cleaned);
    const tokenSet = new Set(tokens);

    const hits = [];
    const missed = [];

    // Keyword + synonym + phrase matching
    Object.entries(question.keywords).forEach(([index, keyword]) => {
      const kw = String(keyword);
      const baseForms = [kw];
      const synonyms =
        question.synonyms && question.synonyms[kw] ? question.synonyms[kw] : [];
      const searchTerms = baseForms.concat(synonyms);

      let matched = false;
      for (const term of searchTerms) {
        const termClean = term.toLowerCase();
        if (termClean.includes(" ")) {
          if (cleaned.includes(termClean)) {
            matched = true;
            break;
          }
        } else if (tokenSet.has(termClean)) {
          matched = true;
          break;
        }
      }

      if (matched) {
        hits.push(kw);
      } else {
        missed.push(kw);
      }
    });

    // Phrase bonuses
    const phraseMatches = [];
    if (question.goodPhrases && question.goodPhrases.length) {
      question.goodPhrases.forEach((phrase) => {
        const ph = phrase.toLowerCase();
        if (cleaned.includes(ph)) {
          phraseMatches.push(phrase);
        }
      });
    }

    // Basic waffle detection – lots of words but no key ideas
    const wordCount = tokens.length;
    const hasWaffle = wordCount > 60 && hits.length === 0;

    // Convert to marks
    const rawMarks = Math.min(question.maxMarks || 3, hits.length);
    const phraseBonus = phraseMatches.length ? 1 : 0;
    let finalMarks = Math.min(
      question.maxMarks || 3,
      rawMarks + phraseBonus
    );

    // Ensure at least 1 mark if they clearly wrote something on-topic
    if (finalMarks === 0 && wordCount > 0 && includesAny(cleaned, tokens.slice(0, 5))) {
      finalMarks = 1;
    }

    return {
      marks: finalMarks,
      maxMarks: question.maxMarks || 3,
      hits,
      missed,
      phraseMatches,
      hasWaffle,
      wordCount
    };
  }

  async function handleDescribeSubmit() {
    const answer = describeAnswerEl.value.trim();
    if (!answer) {
      alert("Write at least one short point before checking your answer.");
      return;
    }

    const analysis = analyseDescribeAnswer(currentDescribeQuestion, answer);
    const { marks, maxMarks, hits, missed, phraseMatches, hasWaffle, wordCount } =
      analysis;

    updateScore(marks * 50); // up to 150 points

    let fb = "";
    if (marks === maxMarks) {
      fb =
        "Excellent – you've included enough key ideas for full marks on this describe question.";
      if (phraseMatches.length) {
        fb += " Your phrasing also shows good exam technique.";
      }
      feedbackEl.classList.add("good");
    } else if (marks === maxMarks - 1) {
      fb =
        "Good – you're close to full marks. Add one more clear, different point to reach the top band.";
      feedbackEl.classList.add("good");
    } else if (marks >= 1) {
      fb =
        "You picked up some marks, but you still missed a few key ideas. Try to give one short point for each mark.";
      feedbackEl.classList.add("bad");
    } else {
      fb =
        "At the moment your answer isn't picking up the main ideas. Focus less on writing lots and more on including the key points the question is asking for.";
      feedbackEl.classList.add("bad");
    }

    if (hasWaffle) {
      fb +=
        " You've written quite a lot but missed the main keywords – this is classic exam 'waffle'.";
    }

    feedbackEl.textContent = fb;

    // Build marking breakdown
    let breakdown = `Marks awarded: ${marks} / ${maxMarks}.\n\n`;
    breakdown += `Key ideas you included: ${
      hits.length ? hits.join(", ") : "none clearly detected"
    }.\n`;
    breakdown += `Key ideas you missed: ${
      missed.length ? missed.join(", ") : "none – great coverage!"
    }.\n`;
    if (phraseMatches.length) {
      breakdown += `Useful exam phrases spotted: ${phraseMatches.join(", ")}.\n`;
    }
    breakdown += `Word count: ~${wordCount} words. Remember, quality beats quantity.`;
    breakdown += `\n\nExam tip: ${currentDescribeQuestion.explanation}`;

    breakdownEl.textContent = breakdown;
    breakdownEl.classList.remove("hidden");

    nextStageBtn.disabled = false;
    nextStageBtn.textContent = "Stage 3 – plan an extended answer";

    // Optional AI hook
    if (window.AI_MARKING_ENDPOINT) {
      sendToAIMarker(
        currentDescribeQuestion.question,
        answer,
        marks,
        maxMarks
      );
    }
  }

  // ---------------------------
  // Optional AI marking hook
  // ---------------------------

  async function sendToAIMarker(questionText, studentAnswer, marks, maxMarks) {
    try {
      const resp = await fetch(window.AI_MARKING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          answer: studentAnswer,
          teacherMarks: marks,
          teacherMax: maxMarks,
          task: "imedia_r093_describe_feedback"
        })
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (data && data.comment) {
        breakdownEl.textContent += `\n\nAI marker comment: ${data.comment}`;
      }
    } catch (err) {
      console.warn("AI marking failed:", err);
    }
  }

  // ---------------------------
  // Stage 3 – Extended answer
  // ---------------------------

  function startExtendStage() {
    if (!currentScenario) {
      startIdentifyStage();
      return;
    }

    currentStage = 3;
    resetUI();
    setStageIndicator(3);

    const topic = QUESTION_SETS[currentTopicKey];
    currentExtendQuestion = currentScenario.stage3;

    questionFocusEl.innerHTML =
      "Stage 3: <strong>Extended</strong> question planning – " + topic.name;
    questionTextEl.textContent = currentExtendQuestion.question;
    subPromptEl.textContent =
      "Choose several strong points that clearly link back to the brief, audience and purpose. Avoid weak or off-topic ideas.";

    identifyRoundEl.classList.add("hidden");
    describeRoundEl.classList.add("hidden");
    extendRoundEl.classList.remove("hidden");

    // Build options
    extendOptionsEl.innerHTML = "";
    const allPoints = [
      ...currentExtendQuestion.bestPoints.map((text) => ({ text, type: "best" })),
      ...currentExtendQuestion.distractors.map((text) => ({
        text,
        type: "distract"
      }))
    ];

    shuffleInPlace(allPoints);

    allPoints.forEach((pt, index) => {
      const div = document.createElement("div");
      div.className = "extend-option";
      div.dataset.type = pt.type;
      div.dataset.index = String(index);
      div.textContent = pt.text;
      div.addEventListener("click", () => {
        div.classList.toggle("selected");
      });
      extendOptionsEl.appendChild(div);
    });
  }

  function handleExtendSubmit() {
    const selected = Array.from(
      extendOptionsEl.querySelectorAll(".extend-option.selected")
    );
    if (!selected.length) {
      alert(
        "Select at least one point you think would help score high marks."
      );
      return;
    }

    const totalBest = currentExtendQuestion.bestPoints.length;
    let correctCount = 0;
    let distractCount = 0;

    selected.forEach((el) => {
      if (el.dataset.type === "best") correctCount++;
      else distractCount++;
    });

    let fb = "";
    let pts = 0;

    if (correctCount === totalBest && distractCount === 0) {
      fb =
        "Brilliant – you selected all of the key points and avoided the weak ones. That's top-band planning.";
      pts = 500;
      feedbackEl.classList.add("good");
    } else if (
      correctCount >= Math.ceil(totalBest * 0.75) &&
      distractCount <= 1
    ) {
      fb =
        "Strong selection – you're close to a top-band answer. Try to cut any weaker points and sharpen the best ones.";
      pts = 350;
      feedbackEl.classList.add("good");
    } else if (correctCount >= 1) {
      fb =
        "You've chosen some relevant ideas, but a high-mark answer would need more of the strong points and fewer weak ones.";
      pts = 200;
      feedbackEl.classList.add("bad");
    } else {
      fb =
        "Most of your choices are weak or off-topic. Focus on points that clearly link to the brief, audience and purpose.";
      pts = 50;
      feedbackEl.classList.add("bad");
    }

    updateScore(pts);
    feedbackEl.textContent = fb;

    let breakdown = "Stronger points for this question:\n";
    breakdown += "- " + currentExtendQuestion.bestPoints.join("\n- ") + "\n\n";
    breakdown +=
      "Weaker / off-topic ideas:\n- " +
      currentExtendQuestion.distractors.join("\n- ") +
      "\n\n";
    breakdown += `Exam tip: ${currentExtendQuestion.explanation}`;

    breakdownEl.textContent = breakdown;
    breakdownEl.classList.remove("hidden");

    nextStageBtn.disabled = false;
    nextStageBtn.textContent = "Show exam style summary";
  }

  // ---------------------------
  // End of game summary
  // ---------------------------

  function showSummary() {
    currentStage = 4;
    summaryCardEl.classList.remove("hidden");
    finalScoreEl.textContent = `Final score: ${score}`;

    let msg = "";
    if (score >= 800) {
      msg =
        "Exam Ready: you're confidently handling different question styles. Keep practising with full past paper questions.";
    } else if (score >= 500) {
      msg =
        "Nearly there: you understand the styles. Focus on giving one clear point per mark and linking extended answers back to the brief.";
    } else if (score >= 300) {
      msg =
        "Developing: you are starting to recognise the differences between question types. Spend a bit more time on describe and extended questions.";
    } else {
      msg =
        "Keep training: concentrate on command words and marks first, then build answers with one short, clear point per mark.";
    }
    examReadinessEl.textContent = msg;
  }

  // ---------------------------
  // Event wiring
  // ---------------------------

  topicSelect.addEventListener("change", () => {
    currentTopicKey = topicSelect.value || "preproduction";
  });

  startGameBtn.addEventListener("click", () => {
    score = 0;
    updateScore(0);
    currentTopicKey = topicSelect.value || "preproduction";
    startIdentifyStage();
  });

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStage !== 1) return;
      handleStyleButtonClick(btn.dataset.style);
    });
  });

  submitDescribeBtn.addEventListener("click", () => {
    if (currentStage !== 2) return;
    handleDescribeSubmit();
  });

  submitExtendBtn.addEventListener("click", () => {
    if (currentStage !== 3) return;
    handleExtendSubmit();
  });

  nextStageBtn.addEventListener("click", () => {
    if (currentStage === 1) {
      startDescribeStage();
    } else if (currentStage === 2) {
      startExtendStage();
    } else if (currentStage === 3) {
      showSummary();
    }
  });

  playAgainBtn.addEventListener("click", () => {
    score = 0;
    updateScore(0);
    summaryCardEl.classList.add("hidden");
    startIdentifyStage();
  });
});
