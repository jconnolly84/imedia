document.addEventListener("DOMContentLoaded", () => {
  const cardPool = document.getElementById("cardPool");
  const bucketsContainer = document.getElementById("buckets");
  const roundSelect = document.getElementById("roundSelect");
  const newRoundBtn = document.getElementById("newRoundBtn");
  const checkBtn = document.getElementById("checkBtn");
  const showAnswersBtn = document.getElementById("showAnswersBtn");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const feedback = document.getElementById("feedback");

  // ---------------------------
  // DATA SETS
  // ---------------------------

  const ROUNDS = {
    traditionalNew: {
      id: "traditionalNew",
      label: "Traditional vs New Media",
      buckets: [
        {
          id: "traditional",
          label: "Traditional Media",
          subtitle: "Print, broadcast & outdoor"
        },
        {
          id: "new",
          label: "New / Digital Media",
          subtitle: "Online, social & interactive"
        }
      ],
      items: [
        { text: "Newspaper", bucketId: "traditional" },
        { text: "Radio advert", bucketId: "traditional" },
        { text: "TV advert", bucketId: "traditional" },
        { text: "Cinema trailer", bucketId: "traditional" },
        { text: "Billboard poster", bucketId: "traditional" },
        { text: "Magazine article", bucketId: "traditional" },
        { text: "Website banner advert", bucketId: "new" },
        { text: "Instagram story", bucketId: "new" },
        { text: "TikTok campaign", bucketId: "new" },
        { text: "YouTube pre-roll advert", bucketId: "new" },
        { text: "Mobile game app", bucketId: "new" },
        { text: "On-demand streaming advert", bucketId: "new" }
      ]
    },

    sectors: {
      id: "sectors",
      label: "Media Sectors & Products",
      buckets: [
        { id: "movingImage", label: "Moving Image", subtitle: "Film, TV, animation" },
        { id: "audio", label: "Audio", subtitle: "Radio, podcasts, music" },
        { id: "publishing", label: "Publishing / Print", subtitle: "Newspapers, magazines, books" },
        { id: "interactive", label: "Interactive", subtitle: "Websites, apps, multimedia" },
        { id: "games", label: "Games", subtitle: "Console, PC & mobile games" }
      ],
      items: [
        { text: "Feature film", bucketId: "movingImage" },
        { text: "TV drama episode", bucketId: "movingImage" },
        { text: "Animated explainer video", bucketId: "movingImage" },
        { text: "Radio news bulletin", bucketId: "audio" },
        { text: "Podcast episode", bucketId: "audio" },
        { text: "Music track on Spotify", bucketId: "audio" },
        { text: "Newspaper front page", bucketId: "publishing" },
        { text: "Magazine cover", bucketId: "publishing" },
        { text: "Graphic novel", bucketId: "publishing" },
        { text: "Interactive website", bucketId: "interactive" },
        { text: "E-learning module", bucketId: "interactive" },
        { text: "Mobile banking app", bucketId: "interactive" },
        { text: "Open-world console game", bucketId: "games" },
        { text: "Mobile puzzle game", bucketId: "games" },
        { text: "VR game experience", bucketId: "games" }
      ]
    },

    jobRoles: {
      id: "jobRoles",
      label: "Job Roles (Creative / Technical / Senior)",
      buckets: [
        { id: "creative", label: "Creative", subtitle: "Ideas, visuals & storytelling" },
        { id: "technical", label: "Technical", subtitle: "Technology & production" },
        { id: "senior", label: "Senior / Management", subtitle: "Leadership & decisions" }
      ],
      items: [
        { text: "Graphic designer", bucketId: "creative" },
        { text: "Scriptwriter", bucketId: "creative" },
        { text: "Storyboard artist", bucketId: "creative" },
        { text: "Camera operator", bucketId: "technical" },
        { text: "Sound engineer", bucketId: "technical" },
        { text: "Video editor", bucketId: "technical" },
        { text: "Web developer", bucketId: "technical" },
        { text: "Director", bucketId: "senior" },
        { text: "Producer", bucketId: "senior" },
        { text: "Creative director", bucketId: "senior" },
        { text: "Production manager", bucketId: "senior" }
      ]
    }
  };

  // ---------------------------
  // STATE
  // ---------------------------

  let currentRound = ROUNDS.traditionalNew;
  let tokenState = []; // {id, bucketIdCorrect, bucketIdPlaced}

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

  // ---------------------------
  // RENDER FUNCTIONS
  // ---------------------------

  function renderRound(round) {
    currentRound = round;
    feedback.textContent = "";
    feedback.className = "feedback";
    scoreDisplay.textContent = "0 / " + round.items.length.toString();

    // Reset state
    tokenState = round.items.map((item, index) => ({
      id: "token-" + index,
      text: item.text,
      bucketIdCorrect: item.bucketId,
      bucketIdPlaced: "pool"
    }));

    // Render buckets
    clearElement(bucketsContainer);
    round.buckets.forEach((bucket) => {
      const bucketEl = document.createElement("div");
      bucketEl.className = "bucket";
      bucketEl.dataset.bucketId = bucket.id;
      bucketEl.setAttribute("data-drop-target", "true");

      const header = document.createElement("div");
      header.className = "bucket-header";

      const title = document.createElement("div");
      title.className = "bucket-title";
      title.textContent = bucket.label;

      const subtitle = document.createElement("div");
      subtitle.className = "bucket-subtitle";
      subtitle.textContent = bucket.subtitle || "";

      header.appendChild(title);
      header.appendChild(subtitle);

      const content = document.createElement("div");
      content.className = "bucket-content";
      content.dataset.bucketContent = bucket.id;

      bucketEl.appendChild(header);
      bucketEl.appendChild(content);

      // Attach dragover/drop listeners directly to each bucket
      bucketEl.addEventListener("dragover", handleBucketDragOver);
      bucketEl.addEventListener("drop", handleBucketDrop);

      bucketsContainer.appendChild(bucketEl);
    });

    // Render tokens in pool
    clearElement(cardPool);
    shuffle(tokenState).forEach((token) => {
      const tokenEl = createTokenElement(token);
      cardPool.appendChild(tokenEl);
    });
  }

  function createTokenElement(token) {
    const el = document.createElement("div");
    el.className = "token";
    el.textContent = token.text;
    el.draggable = true;
    el.dataset.tokenId = token.id;

    el.addEventListener("dragstart", handleDragStart);
    el.addEventListener("dragend", handleDragEnd);
    return el;
  }

  // ---------------------------
  // DRAG & DROP HANDLERS
  // ---------------------------

  function handleDragStart(e) {
    const tokenId = e.target.dataset.tokenId;
    e.dataTransfer.setData("text/plain", tokenId);

    // highlight buckets
    document.querySelectorAll(".bucket").forEach((bucket) => {
      bucket.classList.add("drop-target");
    });
  }

  function handleDragEnd() {
    document.querySelectorAll(".bucket").forEach((bucket) => {
      bucket.classList.remove("drop-target");
    });
  }

  function handleBucketDragOver(e) {
    if (this.getAttribute("data-drop-target") === "true") {
      e.preventDefault();
    }
  }

  function handleBucketDrop(e) {
    e.preventDefault();
    const bucketId = this.dataset.bucketId;
    const tokenId = e.dataTransfer.getData("text/plain");
    if (!bucketId || !tokenId) return;

    const token = tokenState.find((t) => t.id === tokenId);
    if (!token) return;

    token.bucketIdPlaced = bucketId;

    // Move DOM element
    const tokenEl = document.querySelector(`.token[data-token-id="${tokenId}"]`);
    const content = this.querySelector(".bucket-content");
    if (tokenEl && content) {
      content.appendChild(tokenEl);
    }
  }

  // Allow dropping into the card pool to "reset"
  cardPool.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cardPool.addEventListener("drop", (e) => {
    e.preventDefault();
    const tokenId = e.dataTransfer.getData("text/plain");
    const token = tokenState.find((t) => t.id === tokenId);
    if (!token) return;
    token.bucketIdPlaced = "pool";

    const tokenEl = document.querySelector(`.token[data-token-id="${tokenId}"]`);
    if (tokenEl) {
      cardPool.appendChild(tokenEl);
    }
  });

  // ---------------------------
  // SCORING
  // ---------------------------

  function checkAnswers() {
    let correct = 0;
    const total = tokenState.length;

    // Clear previous styling
    document.querySelectorAll(".token").forEach((el) => {
      el.classList.remove("correct", "wrong");
    });

    tokenState.forEach((token) => {
      const isCorrect = token.bucketIdPlaced === token.bucketIdCorrect;
      const tokenEl = document.querySelector(`.token[data-token-id="${token.id}"]`);

      if (isCorrect) {
        correct++;
        if (tokenEl) tokenEl.classList.add("correct");
      } else if (token.bucketIdPlaced !== "pool") {
        if (tokenEl) tokenEl.classList.add("wrong");
      }
    });

    scoreDisplay.textContent = `${correct} / ${total}`;

    const percentage = (correct / total) * 100;
    if (percentage === 100) {
      feedback.textContent = "Perfect! You’ve completely nailed this round.";
      feedback.className = "feedback good";
    } else if (percentage >= 70) {
      feedback.textContent = "Great job – just a few to tweak. Check any red tokens.";
      feedback.className = "feedback good";
    } else {
      feedback.textContent = "Keep going – revisit the R093 notes on this topic and try another round.";
      feedback.className = "feedback bad";
    }
  }

  function showCorrectBuckets() {
    tokenState.forEach((token) => {
      const tokenEl = document.querySelector(`.token[data-token-id="${token.id}"]`);
      if (!tokenEl) return;

      const correctBucketContent = document.querySelector(
        `.bucket-content[data-bucket-content="${token.bucketIdCorrect}"]`
      );
      if (correctBucketContent) {
        correctBucketContent.appendChild(tokenEl);
        token.bucketIdPlaced = token.bucketIdCorrect;
      }
    });

    checkAnswers();
  }

  // ---------------------------
  // EVENT LISTENERS
  // ---------------------------

  newRoundBtn.addEventListener("click", () => {
    const roundId = roundSelect.value;
    const round = ROUNDS[roundId] || ROUNDS.traditionalNew;
    renderRound(round);
  });

  checkBtn.addEventListener("click", () => {
    checkAnswers();
  });

  showAnswersBtn.addEventListener("click", () => {
    showCorrectBuckets();
  });

  // initial render
  renderRound(currentRound);
});
