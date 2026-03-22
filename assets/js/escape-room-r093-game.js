// Escape Room: R093 – Game Logic (extended question bank + reset)

// Each lock focuses on a different R093 theme.
// Each lock now has its own mini question bank so that each playthrough can feel different.
const locks = [
  {
    id: 1,
    title: "Lock 1 – Client Brief Decoder",
    intro: "You find a locked folder labelled 'Client Brief'. To open it, you must show you understand what the brief is really asking for.",
    type: "mcq",
    questions: [
      {
        question: "A local animal charity wants a short promotional video to encourage 16–25 year olds to adopt rescue pets. Which option best explains the key points you should identify from this client brief?",
        options: [
          "The charity wants any kind of video as long as it mentions animals, and the designer can choose the length and audience.",
          "The brief sets out the charity's aim (promotional video), target audience (16–25 year olds), key message (adopt rescue pets) and any requirements or constraints.",
          "The main focus is only on the technical details like file formats and camera models because that is how the video will be made.",
          "The brief is mainly about legal issues, so the designer only needs to think about risk assessments and contributor release forms."
        ],
        correctIndex: 1,
        explanation: "A good answer picks out purpose, target audience, key messages and any requirements or constraints. In an exam, you would use these to justify later design decisions."
      },
      {
        question: "A college wants a poster to promote an open evening to parents of Year 11 pupils. Which description shows you have correctly interpreted the client brief?",
        options: [
          "The poster can be about any school topic, as long as it looks colourful.",
          "The key purpose is to inform and persuade parents to attend the open evening, using a formal but friendly tone suitable for adults.",
          "The aim is mainly to entertain students with jokes and memes so they share the poster online.",
          "The only important detail is the school logo; the date and time are optional."
        ],
        correctIndex: 1,
        explanation: "You should identify the purpose (inform and persuade), the target audience (parents of Year 11s) and an appropriate tone and content for that audience."
      },
      {
        question: "In a client brief, which combination BEST describes the core things you should look for before planning any ideas?",
        options: [
          "Client name, postcode and favourite colour.",
          "Purpose of the product, target audience and any explicit requirements and constraints.",
          "Only the budget and deadline.",
          "Only the client’s logo and strapline."
        ],
        correctIndex: 1,
        explanation: "For R093 you must be able to pick out the purpose, target audience and clear requirements/constraints as these drive all later design decisions."
      },
      {
        question: "A brief for a social media campaign says 'use an upbeat, informal tone and include user-generated content where possible'. What is this mainly an example of?",
        options: [
          "Technical requirement about file formats.",
          "Stylistic requirement that affects language and content choices.",
          "Legal requirement about copyright.",
          "Distribution requirement about platforms."
        ],
        correctIndex: 1,
        explanation: "The wording relates to style, tone and content – which are key parts of client requirements you must interpret correctly."
      }
    ]
  },
  {
    id: 2,
    title: "Lock 2 – Pre-production Padlock",
    intro: "The next door has sticky notes all over it. This lock checks whether you can match the right pre-production document and planning approach to the task.",
    type: "mcq",
    questions: [
      {
        question: "You are planning the structure and layout of a multi-page website for a new game. Which pre-production document would be the most suitable to show page relationships and navigation?",
        options: [
          "A mood board with colours and textures related to the game world.",
          "A script with all the dialogue between characters on each page.",
          "A sitemap or navigation diagram showing how pages link together.",
          "A storyboard showing every frame of an animated advert."
        ],
        correctIndex: 2,
        explanation: "For website structure and navigation, a sitemap or navigation diagram is most appropriate. Storyboards are better for time-based media such as animations and video."
      },
      {
        question: "A client wants a short drama advert for TV. Which combination of pre-production documents would be MOST useful to plan the look and structure of the advert?",
        options: [
          "Storyboard and script.",
          "Mood board and asset log only.",
          "Gantt chart and risk assessment only.",
          "Call sheet and contact list only."
        ],
        correctIndex: 0,
        explanation: "Storyboards help plan shots and transitions; scripts give dialogue and action – together they plan the content and structure of a video advert."
      },
      {
        question: "Which statement about pre-production documents is MOST accurate for R093?",
        options: [
          "They are optional and only used if there is spare time.",
          "They help visualise, organise and communicate ideas before production starts.",
          "They replace any need for a client brief.",
          "They are only used in games projects."
        ],
        correctIndex: 1,
        explanation: "Pre-production documents (such as mood boards, visualisation diagrams, scripts and sitemaps) are there to plan and communicate ideas clearly before production."
      },
      {
        question: "A producer wants to show what the final magazine front cover will look like, including placement of images, text and logos. Which document is MOST suitable?",
        options: [
          "Risk assessment.",
          "Visualisation diagram/mock-up.",
          "Storyboard.",
          "Audience survey."
        ],
        correctIndex: 1,
        explanation: "A visualisation diagram shows layout, composition, text placement and style for static graphics such as posters and magazine covers."
      }
    ]
  },
  {
    id: 3,
    title: "Lock 3 – Legal Lightning Lock",
    intro: "A warning symbol flashes: 'LEGAL LOCK'. If you get this wrong, your project could be taken down for legal or ethical reasons.",
    type: "mcq",
    questions: [
      {
        question: "A student wants to use a popular song in the background of a YouTube advert for a local café. What should they do to use the track legally?",
        options: [
          "Download the song from a streaming site because it is already public and give the artist a mention in the credits.",
          "Use only 10 seconds of the song, because using a short clip always counts as fair use.",
          "Ask a friend to re-record the song on a keyboard so that permission is no longer needed.",
          "Get permission or a licence from the copyright holder, or use royalty-free music with a suitable licence instead."
        ],
        correctIndex: 3,
        explanation: "Using commercial music normally requires permission or a licence from the copyright holder. Alternatively, royalty-free or Creative Commons music can be used if the licence terms are followed."
      },
      {
        question: "A school is making a promotional video featuring close-up shots of students. Which document should be completed to ensure they have permission to use this footage?",
        options: [
          "Storyboard.",
          "Risk assessment.",
          "Location recce form.",
          "Contributor release form."
        ],
        correctIndex: 3,
        explanation: "Contributor or model release forms record written permission to use someone's image or performance in a media product."
      },
      {
        question: "Which option shows a responsible approach to copyright when using images found online?",
        options: [
          "Use any images that appear in image search because they are public.",
          "Only use images that are labelled for reuse or that you have permission or a licence for.",
          "Change the colours of any image and you no longer need permission.",
          "Screenshot images from streaming sites and crop them."
        ],
        correctIndex: 1,
        explanation: "For R093 you must use images with suitable licences (e.g. Creative Commons) or original content, and follow licence conditions such as attribution."
      },
      {
        question: "A media product includes stereotypes that could offend a particular group of people. Which area of legal/ethical consideration does this relate to MOST?",
        options: [
          "Health and safety regulations.",
          "Defamation law.",
          "Representation and ethical issues about how people are portrayed.",
          "File format choices."
        ],
        correctIndex: 2,
        explanation: "R093 expects you to consider ethical issues such as representation, stereotypes and whether the content is appropriate for the target audience."
      }
    ]
  },
  {
    id: 4,
    title: "Lock 4 – Export Code Breaker",
    intro: "The final lock guards the exit. It displays different output options and asks you to pick the most suitable export settings.",
    type: "mcq",
    questions: [
      {
        question: "You have created a poster for print and also need a smaller version to promote the event on social media. Which option is most appropriate?",
        options: [
          "Export both versions as low-resolution JPEG files to keep the file size as small as possible for all uses.",
          "Export the print poster as a high-resolution PDF or TIFF, and export a web-optimised JPEG or PNG version for social media.",
          "Export everything as a single GIF file, because GIF works for print and online equally well.",
          "Only export a PNG file and use it for both print and social media without changing any settings."
        ],
        correctIndex: 1,
        explanation: "Print outputs usually need high resolution (e.g. 300 dpi) and formats like PDF or TIFF. Online images should be optimised for screen (e.g. JPEG or PNG with suitable dimensions and compression)."
      },
      {
        question: "A client wants a video advert for Instagram Reels and TikTok. Which export settings are MOST suitable?",
        options: [
          "Landscape 1920×1080, very large file size, no compression.",
          "Vertical aspect ratio (such as 1080×1920), MP4 format with suitable compression for mobile viewing.",
          "Square 800×800 GIF with no sound.",
          "Print-ready PDF at 300 dpi."
        ],
        correctIndex: 1,
        explanation: "Short-form vertical video platforms work best with vertical MP4 files encoded and compressed for mobile screens and fast streaming."
      },
      {
        question: "You are exporting audio for a podcast episode. Which format is MOST appropriate for distribution to listeners?",
        options: [
          "Uncompressed WAV file only.",
          "Highly compressed, low-bitrate file that sounds distorted.",
          "MP3 or similar compressed audio at a suitable bitrate for streaming/download.",
          "Print-ready TIFF file."
        ],
        correctIndex: 2,
        explanation: "Podcasts are commonly distributed as compressed audio such as MP3 at a quality that balances file size with clear sound."
      },
      {
        question: "Why is it important to consider the target platform when choosing export settings?",
        options: [
          "It has no real impact; all formats work everywhere.",
          "Different platforms and uses need different resolutions, aspect ratios and file sizes for best quality and performance.",
          "It only affects legal issues, not quality.",
          "It is only important for print products."
        ],
        correctIndex: 1,
        explanation: "R093 emphasises choosing appropriate file formats, resolutions and compression based on how and where the product will be used."
      }
    ]
  }
];

let currentLockIndex = -1;
let attempts = 0;
let selectedOption = null;
let currentQuestionIndex = 0;

// ===== Helpers =====

function getCurrentLock() {
  return locks[currentLockIndex];
}

function setLocksUI() {
  const totalLocks = locks.length;
  const unlockedCount = Math.max(0, currentLockIndex); // locks before current index are unlocked
  const remaining = totalLocks - unlockedCount;
  const locksRemainingEl = document.getElementById("locksRemaining");
  if (locksRemainingEl) {
    locksRemainingEl.textContent = remaining.toString();
  }

  locks.forEach((lock, idx) => {
    const el = document.getElementById(`lock-${lock.id}`);
    if (!el) return;
    el.classList.remove("current", "unlocked");
    if (idx < currentLockIndex) {
      el.classList.add("unlocked");
    } else if (idx === currentLockIndex) {
      el.classList.add("current");
    }
  });
}

function shuffle(array) {
  return array
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.value);
}

function pickRandomQuestionIndex(lock) {
  if (!lock.questions || lock.questions.length === 0) return 0;
  return Math.floor(Math.random() * lock.questions.length);
}

function showPuzzle(lock) {
  const puzzleTitle = document.getElementById("puzzleTitle");
  const puzzleIntro = document.getElementById("puzzleIntro");
  const puzzleQuestion = document.getElementById("puzzleQuestion");
  const mcqOptions = document.getElementById("mcqOptions");
  const inputArea = document.getElementById("inputArea");
  const codeClue = document.getElementById("codeClue");
  const feedback = document.getElementById("puzzleFeedback");
  const explanation = document.getElementById("puzzleExplanation");
  const showExplanationBtn = document.getElementById("showExplanationBtn");

  if (!lock) return;

  puzzleTitle.innerText = lock.title;
  puzzleIntro.innerText = lock.intro;

  // Pick a random question for this lock on each visit
  currentQuestionIndex = pickRandomQuestionIndex(lock);
  const q = lock.questions[currentQuestionIndex];

  puzzleQuestion.innerText = q.question;

  // Reset UI blocks
  feedback.textContent = "";
  feedback.className = "feedback";
  explanation.textContent = "";
  explanation.classList.add("hidden");
  showExplanationBtn.classList.add("hidden");
  selectedOption = null;

  mcqOptions.innerHTML = "";
  mcqOptions.classList.add("hidden");
  inputArea.classList.add("hidden");
  codeClue.classList.add("hidden");

  if (lock.type === "mcq") {
    mcqOptions.classList.remove("hidden");
    const shuffled = q.options.map((opt, idx) => ({ opt, idx }));
    shuffled.sort(() => Math.random() - 0.5);

    shuffled.forEach((entry) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.type = "button";
      btn.innerText = entry.opt;
      btn.addEventListener("click", () => {
        selectedOption = entry.idx;
        Array.from(mcqOptions.children).forEach((child) => {
          child.classList.remove("selected");
        });
        btn.classList.add("selected");
        document.getElementById("submitBtn").disabled = false;
      });
      mcqOptions.appendChild(btn);
    });
  }

  document.getElementById("submitBtn").disabled = true;
}

function handleSubmit() {
  if (currentLockIndex < 0 || currentLockIndex >= locks.length) return;
  const lock = getCurrentLock();
  if (!lock) return;

  const q = lock.questions[currentQuestionIndex];
  const feedback = document.getElementById("puzzleFeedback");
  const explanation = document.getElementById("puzzleExplanation");
  const showExplanationBtn = document.getElementById("showExplanationBtn");

  attempts += 1;
  document.getElementById("attemptsCount").textContent = attempts.toString();

  if (lock.type === "mcq") {
    if (selectedOption === null) {
      feedback.textContent = "Choose an option first.";
      feedback.className = "feedback bad";
      return;
    }

    const isCorrect = selectedOption === q.correctIndex;
    if (isCorrect) {
      feedback.textContent = "Correct! The lock clicks open.";
      feedback.className = "feedback good";

      const lockEl = document.getElementById(`lock-${lock.id}`);
      if (lockEl) {
        lockEl.classList.remove("current");
        lockEl.classList.add("unlocked");
      }

      explanation.textContent = q.explanation;
      explanation.classList.remove("hidden");
      showExplanationBtn.classList.remove("hidden");
      showExplanationBtn.onclick = () => {
        explanation.classList.toggle("hidden");
      };

      // Move to next lock after a short delay, or finish
      setTimeout(() => {
        currentLockIndex++;
        if (currentLockIndex >= locks.length) {
          endGame();
        } else {
          setLocksUI();
          showPuzzle(getCurrentLock());
        }
      }, 900);
    } else {
      feedback.textContent = "Not quite – think about the purpose and context again.";
      feedback.className = "feedback bad";
      explanation.textContent = q.explanation;
      explanation.classList.remove("hidden");
      showExplanationBtn.classList.remove("hidden");
      showExplanationBtn.onclick = () => {
        explanation.classList.toggle("hidden");
      };
    }
  }
}

function endGame() {
  // Show an in-place completion message so we can still reset the game.
  const puzzleTitle = document.getElementById("puzzleTitle");
  const puzzleIntro = document.getElementById("puzzleIntro");
  const puzzleQuestion = document.getElementById("puzzleQuestion");
  const mcqOptions = document.getElementById("mcqOptions");
  const inputArea = document.getElementById("inputArea");
  const codeClue = document.getElementById("codeClue");
  const feedback = document.getElementById("puzzleFeedback");
  const explanation = document.getElementById("puzzleExplanation");
  const showExplanationBtn = document.getElementById("showExplanationBtn");
  const startBtn = document.getElementById("startBtn");
  const submitBtn = document.getElementById("submitBtn");

  puzzleTitle.innerText = "You Escaped!";
  puzzleIntro.innerText =
    "You cracked all the R093 locks and escaped the exam room. Could you escape in fewer attempts next time?";
  puzzleQuestion.innerText = `Total attempts this run: ${attempts}. Use the Reset button if you want to try again with new questions.`;

  mcqOptions.innerHTML = "";
  mcqOptions.classList.add("hidden");
  inputArea.classList.add("hidden");
  codeClue.classList.add("hidden");

  feedback.textContent = "";
  feedback.className = "feedback";
  explanation.textContent = "";
  explanation.classList.add("hidden");
  showExplanationBtn.classList.add("hidden");

  // update locks remaining display to 0
  const locksRemainingEl = document.getElementById("locksRemaining");
  if (locksRemainingEl) {
    locksRemainingEl.textContent = "0";
  }

  // allow user to start again via reset button
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = "Escape complete";
  }
  if (submitBtn) {
    submitBtn.disabled = true;
  }
}

function resetGame() {
  // Reset state
  currentLockIndex = -1;
  attempts = 0;
  selectedOption = null;
  currentQuestionIndex = 0;

  const puzzleTitle = document.getElementById("puzzleTitle");
  const puzzleIntro = document.getElementById("puzzleIntro");
  const puzzleQuestion = document.getElementById("puzzleQuestion");
  const mcqOptions = document.getElementById("mcqOptions");
  const inputArea = document.getElementById("inputArea");
  const codeClue = document.getElementById("codeClue");
  const feedback = document.getElementById("puzzleFeedback");
  const explanation = document.getElementById("puzzleExplanation");
  const showExplanationBtn = document.getElementById("showExplanationBtn");
  const attemptsCount = document.getElementById("attemptsCount");
  const locksRemainingEl = document.getElementById("locksRemaining");
  const startBtn = document.getElementById("startBtn");
  const submitBtn = document.getElementById("submitBtn");

  puzzleTitle.innerText = "Welcome to the Escape Room";
  puzzleIntro.innerText =
    "You are locked in the R093 exam room. To escape, you must unlock four digital padlocks – each one tests a different part of the specification. Get the questions right to crack each code.";
  puzzleQuestion.innerText = "Click \"Start Escape\" to face your first lock.";

  mcqOptions.innerHTML = "";
  mcqOptions.classList.add("hidden");
  inputArea.classList.add("hidden");
  codeClue.classList.add("hidden");

  feedback.textContent = "";
  feedback.className = "feedback";
  explanation.textContent = "";
  explanation.classList.add("hidden");
  showExplanationBtn.classList.add("hidden");

  if (attemptsCount) {
    attemptsCount.textContent = "0";
  }
  if (locksRemainingEl) {
    locksRemainingEl.textContent = locks.length.toString();
  }

  // reset lock icons
  locks.forEach((lock) => {
    const el = document.getElementById(`lock-${lock.id}`);
    if (!el) return;
    el.classList.remove("current", "unlocked");
  });

  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = "Start Escape";
  }
  if (submitBtn) {
    submitBtn.disabled = true;
  }
}

// Wire up

window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");

  // initialise header display
  const locksRemainingEl = document.getElementById("locksRemaining");
  const attemptsCount = document.getElementById("attemptsCount");
  if (locksRemainingEl) locksRemainingEl.textContent = locks.length.toString();
  if (attemptsCount) attemptsCount.textContent = "0";

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      currentLockIndex = 0;
      setLocksUI();
      showPuzzle(getCurrentLock());
      startBtn.disabled = true;
      startBtn.textContent = "Escape in progress...";
      submitBtn.disabled = true;
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmit);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
  }
});
