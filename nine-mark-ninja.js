// 9‑Mark Ninja core logic

(function () {
  const scenario = window.NINE_MARK_SCENARIO;

  const stageContainer = document.getElementById("stageContainer");
  const stageLabel = document.getElementById("stageLabel");
  const totalScoreEl = document.getElementById("totalScore");
  const skillMeterFill = document.getElementById("skillMeterFill");
  const skillBandLabel = document.getElementById("skillBandLabel");
  const prevStageBtn = document.getElementById("prevStageBtn");
  const nextStageBtn = document.getElementById("nextStageBtn");

  let currentStage = 1; // 1..4
  const maxStage = 4;
  const stageScores = { 1: 0, 2: 0, 3: 0, 4: 0 };

  function renderStage() {
    stageLabel.textContent = String(currentStage);
    switch (currentStage) {
      case 1:
        renderStage1();
        break;
      case 2:
        renderStage2();
        break;
      case 3:
        renderStage3();
        break;
      case 4:
        renderStage4();
        break;
    }
    updateHUD();
    updateNavButtons();
  }

  // Stage 1 – identify the focus
  function renderStage1() {
    const optionsHtml = scenario.focusOptions
      .map(
        (opt, index) => `
      <label class="mcq-option" data-index="${index}">
        <input type="radio" name="focus" value="${index}" style="display:none;" />
        ${opt.text}
      </label>`
      )
      .join("");

    stageContainer.innerHTML = `
      <span class="stage-pill">Stage 1 – What is the question really asking?</span>
      <h2>Identify the focus of this 9‑mark question</h2>
      <p>Select the option that best explains what you should do in your answer.</p>
      <div id="stage1Options">
        ${optionsHtml}
      </div>
      <button type="button" class="btn primary" id="checkStage1Btn">Check answer</button>
      <div id="stage1Feedback" class="nine-feedback"></div>
    `;

    const labels = Array.from(
      stageContainer.querySelectorAll(".mcq-option")
    );
    labels.forEach((label) => {
      label.addEventListener("click", () => {
        labels.forEach((l) => l.classList.remove("selected"));
        label.classList.add("selected");
      });
    });

    document
      .getElementById("checkStage1Btn")
      .addEventListener("click", handleStage1Check);
  }

  function handleStage1Check() {
    const labels = Array.from(
      stageContainer.querySelectorAll(".mcq-option")
    );
    const feedbackEl = document.getElementById("stage1Feedback");
    const selectedIndex = labels.findIndex((l) =>
      l.classList.contains("selected")
    );

    if (selectedIndex === -1) {
      feedbackEl.textContent = "Choose an option first.";
      return;
    }

    let score = 0;
    labels.forEach((label, index) => {
      const opt = scenario.focusOptions[index];
      label.classList.remove("correct", "incorrect");
      if (opt.correct) {
        label.classList.add("correct");
      }
      if (index === selectedIndex && !opt.correct) {
        label.classList.add("incorrect");
      }
    });

    if (scenario.focusOptions[selectedIndex].correct) {
      feedbackEl.innerHTML =
        "Great – you have correctly identified that you must <strong>discuss suitability</strong> by suggesting improvements and explaining how they help the director.";
      score = 10;
    } else {
      feedbackEl.innerHTML =
        "Not quite. A 9‑mark answer must focus on how suitable the product is for the director and suggest improvements with explanations, not just personal opinion or redesigning the whole product.";
      score = 4;
    }

    stageScores[1] = Math.max(stageScores[1], score);
    updateHUD();
    updateNavButtons();
  }

  // Stage 2 – choose strong improvements
  function renderStage2() {
    const pillsHtml = scenario.improvementOptions
      .map(
        (imp) => `
      <button type="button" class="pill" data-id="${imp.id}">
        ${imp.text}
      </button>`
      )
      .join("");

    stageContainer.innerHTML = `
      <span class="stage-pill">Stage 2 – Spot the strongest improvements</span>
      <h2>Select the improvements that would help you reach Level 3</h2>
      <p>Click all the suggestions that would genuinely help a <strong>director</strong> use this storyboard. Avoid weaker or irrelevant ideas.</p>
      <div id="impPills" class="pill-row">
        ${pillsHtml}
      </div>
      <button type="button" class="btn primary" id="checkStage2Btn">Check choices</button>
      <div id="stage2Feedback" class="nine-feedback"></div>
    `;

    const pills = Array.from(stageContainer.querySelectorAll(".pill"));
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pill.classList.toggle("selected");
      });
    });

    document
      .getElementById("checkStage2Btn")
      .addEventListener("click", handleStage2Check);
  }

  function handleStage2Check() {
    const pills = Array.from(stageContainer.querySelectorAll(".pill"));
    const feedbackEl = document.getElementById("stage2Feedback");
    if (!pills.some((p) => p.classList.contains("selected"))) {
      feedbackEl.textContent = "Select at least one suggestion.";
      return;
    }

    let score = 0;
    let strongPicked = 0;
    let strongTotal = 0;
    let weakPicked = 0;

    scenario.improvementOptions.forEach((imp) => {
      const pill = pills.find((p) => p.dataset.id === imp.id);
      if (imp.strong) strongTotal++;
      const selected = pill.classList.contains("selected");
      pill.classList.remove("strong", "weak");
      if (selected && imp.strong) {
        pill.classList.add("strong");
        strongPicked++;
        score += 3;
      } else if (!selected && imp.strong) {
        pill.classList.add("strong");
      } else if (selected && !imp.strong) {
        pill.classList.add("weak");
        weakPicked++;
        score -= 1;
      }
    });

    if (score < 0) score = 0;
    stageScores[2] = Math.max(stageScores[2], score);

    const totalStrong = scenario.improvementOptions.filter(
      (i) => i.strong
    ).length;

    let message = `You selected ${strongPicked} out of ${totalStrong} strong suggestions. `;
    if (weakPicked > 0) {
      message += `You also chose ${weakPicked} weaker/irrelevant ideas – try to focus only on improvements that help the director plan filming.`;
    } else if (strongPicked === totalStrong) {
      message += "Excellent – you have identified all the high‑value improvements.";
    } else {
      message += "Look again at the storyboard and think about what information the director really needs.";
    }

    feedbackEl.textContent = message;
    updateHUD();
    updateNavButtons();
  }

  // Stage 3 – match improvements to explanations
  function renderStage3() {
    const questionsHtml = scenario.explanationQuestions
      .map((q, idx) => {
        const optionsHtml = q.options
          .map(
            (opt, i) => `
            <label class="mcq-option" data-qindex="${idx}" data-index="${i}">
              <input type="radio" name="exp_${idx}" value="${i}" style="display:none;" />
              ${opt}
            </label>`
          )
          .join("");

        return `
          <div class="exp-question">
            <p><strong>Q${idx + 1}.</strong> ${q.prompt}</p>
            <div>${optionsHtml}</div>
          </div>
        `;
      })
      .join("");

    stageContainer.innerHTML = `
      <span class="stage-pill">Stage 3 – Explain like a top‑band answer</span>
      <h2>Match the improvement to the best explanation</h2>
      <p>For each question, choose the explanation that clearly links the suggestion to how it helps the director.</p>
      ${questionsHtml}
      <button type="button" class="btn primary" id="checkStage3Btn">Check answers</button>
      <div id="stage3Feedback" class="nine-feedback"></div>
    `;

    const labels = Array.from(stageContainer.querySelectorAll(".mcq-option"));
    labels.forEach((label) => {
      label.addEventListener("click", () => {
        const qidx = label.dataset.qindex;
        const group = labels.filter((l) => l.dataset.qindex === qidx);
        group.forEach((g) => g.classList.remove("selected"));
        label.classList.add("selected");
      });
    });

    document
      .getElementById("checkStage3Btn")
      .addEventListener("click", handleStage3Check);
  }

  function handleStage3Check() {
    const labels = Array.from(stageContainer.querySelectorAll(".mcq-option"));
    const feedbackEl = document.getElementById("stage3Feedback");

    let total = scenario.explanationQuestions.length;
    let correctCount = 0;
    let unanswered = 0;

    scenario.explanationQuestions.forEach((q, qidx) => {
      const group = labels.filter((l) => Number(l.dataset.qindex) === qidx);
      const selectedIndex = group.findIndex((g) =>
        g.classList.contains("selected")
      );
      if (selectedIndex === -1) {
        unanswered++;
        return;
      }
      group.forEach((g, i) => {
        g.classList.remove("correct", "incorrect");
        if (i === q.correctIndex) g.classList.add("correct");
        if (i === selectedIndex && i !== q.correctIndex) {
          g.classList.add("incorrect");
        }
      });
      if (selectedIndex === q.correctIndex) correctCount++;
    });

    if (unanswered > 0) {
      feedbackEl.textContent =
        "Answer all of the questions before checking.";
      return;
    }

    const score = correctCount * 4; // max 12
    stageScores[3] = Math.max(stageScores[3], score);

    if (correctCount === total) {
      feedbackEl.textContent =
        "Perfect explanations – you are clearly linking each suggestion to how it helps the director.";
    } else if (correctCount >= total - 1) {
      feedbackEl.textContent =
        "Strong explanations overall. Check the ones marked in red and think about which option links more clearly to the director’s needs.";
    } else {
      feedbackEl.textContent =
        "Some explanations are quite general. Remember: a Level 3 answer must say exactly how the improvement makes the storyboard more useful for the director.";
    }

    updateHUD();
    updateNavButtons();
  }

  // Stage 4 – build a 9‑mark style answer from sentence tiles
  function renderStage4() {
    const bankHtml = scenario.sentenceTiles
      .map(
        (s) => `
      <span class="sentence-chip" data-id="${s.id}">
        ${s.text}
      </span>`
      )
      .join("");

    stageContainer.innerHTML = `
      <span class="stage-pill">Stage 4 – Build a Level 3 answer</span>
      <h2>Construct a strong 9‑mark answer</h2>
      <p>Click sentences from the bank to add them to your answer. Aim for around <strong>6–8 sentences</strong> that give a clear judgement, several improvements and explanations.</p>

      <h3>Sentence bank</h3>
      <div id="sentenceBank" class="sentence-bank">
        ${bankHtml}
      </div>

      <h3>Your answer</h3>
      <div id="answerOutput" class="answer-output"></div>

      <button type="button" class="btn primary" id="checkStage4Btn">Check my answer</button>
      <button type="button" class="btn" id="clearStage4Btn" style="margin-left:0.5rem;">Clear answer</button>
      <div id="stage4Feedback" class="nine-feedback"></div>
    `;

    const chips = Array.from(stageContainer.querySelectorAll(".sentence-chip"));
    const answerOutput = document.getElementById("answerOutput");

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const id = chip.dataset.id;
        const alreadyUsed = chip.classList.contains("used");
        if (alreadyUsed) {
          // remove from answer
          chip.classList.remove("used");
          const span = answerOutput.querySelector(
            `.sentence-chip[data-id="${id}"]`
          );
          if (span) span.remove();
        } else {
          chip.classList.add("used");
          const clone = chip.cloneNode(true);
          clone.classList.remove("used");
          answerOutput.appendChild(clone);
          answerOutput.appendChild(document.createTextNode(" "));
        }
      });
    });

    document
      .getElementById("checkStage4Btn")
      .addEventListener("click", handleStage4Check);
    document
      .getElementById("clearStage4Btn")
      .addEventListener("click", () => renderStage4());
  }

  function handleStage4Check() {
    const answerOutput = document.getElementById("answerOutput");
    const feedbackEl = document.getElementById("stage4Feedback");
    const usedIds = Array.from(
      answerOutput.querySelectorAll(".sentence-chip")
    ).map((chip) => chip.dataset.id);

    if (!usedIds.length) {
      feedbackEl.textContent =
        "Build an answer first by clicking on sentences in the bank.";
      return;
    }

    let score = 0;
    let totalWeight = 0;
    let weakCount = 0;

    scenario.sentenceTiles.forEach((s) => {
      totalWeight += Math.max(s.weight, 0);
      if (usedIds.includes(s.id)) {
        score += s.weight;
        if (s.weight === 0) weakCount++;
      }
    });

    if (score < 0) score = 0;
    stageScores[4] = Math.max(stageScores[4], score);

    const percentage = totalWeight ? Math.round((score / totalWeight) * 100) : 0;

    let bandText = "";
    if (percentage >= 75 && weakCount === 0) {
      bandText =
        "This would be close to a Level 3 response: you have a clear overview, several specific improvements and strong explanations.";
    } else if (percentage >= 50) {
      bandText =
        "This answer is around Level 2: you have some good points, but you could remove weaker personal comments and add more detailed explanations.";
    } else {
      bandText =
        "This is closer to Level 1: try to focus less on personal opinion and more on specific improvements plus how they help the director.";
    }

    feedbackEl.innerHTML =
      "Estimated answer strength: <strong>" +
      percentage +
      "%</strong>. " +
      bandText;

    updateHUD();
    updateNavButtons();
  }

  // HUD / skill meter
  function getTotalScore() {
    return stageScores[1] + stageScores[2] + stageScores[3] + stageScores[4];
  }

  function updateHUD() {
    const total = getTotalScore();
    totalScoreEl.textContent = String(total);

    // Rough max: stage1 10, stage2 ~20, stage3 12, stage4 ~20 -> 62
    const percentage = Math.max(0, Math.min(100, Math.round((total / 62) * 100)));
    skillMeterFill.style.width = percentage + "%";

    let bandLabel = "";
    if (percentage >= 75) {
      bandLabel = "Band: Level 3 style answer (high)";
      skillBandLabel.className = "badge badge-l3";
    } else if (percentage >= 45) {
      bandLabel = "Band: Level 2 style answer (adequate)";
      skillBandLabel.className = "badge badge-l2";
    } else {
      bandLabel = "Band: Level 1 style answer (developing)";
      skillBandLabel.className = "badge badge-l1";
    }
    skillBandLabel.textContent = bandLabel;
  }


  function updateNavButtons() {
    if (!nextStageBtn) return;
    if (currentStage >= maxStage) {
      nextStageBtn.style.display = "none";
    } else {
      nextStageBtn.style.display = "inline-block";
    }
  }

  // Navigation
  prevStageBtn.addEventListener("click", () => {
    if (currentStage > 1) {
      currentStage--;
      renderStage();
    }
  });

  nextStageBtn.addEventListener("click", () => {
    if (currentStage < maxStage) {
      currentStage++;
      renderStage();
    }
  });

  // Initialise
  renderStage();
})();
