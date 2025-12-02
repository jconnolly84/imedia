// Data for 9‑Mark Ninja – Rollin Café storyboard scenario

window.NINE_MARK_SCENARIO = {
  id: "rollinCafeStoryboard",
  productName: "Rollin Café",
  questionText:
    "Figure 1 shows a storyboard for an advert for Rollin Café. Discuss the suitability of this storyboard for use by the director.",
  focusOptions: [
    {
      id: "focus_correct",
      text:
        "Explain how well the storyboard works for the director and suggest improvements using media terminology.",
      correct: true
    },
    {
      id: "focus_wrong1",
      text:
        "Describe what happens in the advert and say whether you personally like it or not.",
      correct: false
    },
    {
      id: "focus_wrong2",
      text:
        "Rewrite the storyboard into a finished script and design a new logo for the café.",
      correct: false
    }
  ],

  improvementOptions: [
    {
      id: "imp1",
      text: "Add shot numbers and clear titles for each frame.",
      strong: true,
      reason:
        "Shot numbers help the director and camera crew reference each frame quickly during filming."
    },
    {
      id: "imp2",
      text: "Use camera shot labels (e.g. WIDE, MID, CLOSE‑UP) on each frame.",
      strong: true,
      reason:
        "Camera shot labels tell the director exactly how to frame each shot, reducing confusion on set."
    },
    {
      id: "imp3",
      text: "Add arrows to show camera movement, such as PAN or TRACK.",
      strong: true,
      reason:
        "Movement arrows help the director plan how the camera should move, improving visual flow."
    },
    {
      id: "imp4",
      text: "Write a short description of action under each frame in present tense.",
      strong: true,
      reason:
        "Present tense action makes it clear what should be happening on screen at that moment."
    },
    {
      id: "imp5",
      text: "Include duration/timing for each frame, such as 3s or 5s.",
      strong: true,
      reason:
        "Timings allow the director to plan the pace of the advert and keep it within the time limit."
    },
    {
      id: "imp6",
      text: "Use speech bubbles instead of any technical notes.",
      strong: false,
      reason:
        "Speech bubbles focus on dialogue, not on how the advert will be filmed, so they are less useful for the director."
    },
    {
      id: "imp7",
      text: "Add random clip‑art coffee beans around every frame.",
      strong: false,
      reason:
        "Extra decoration may distract from the key information the director needs for filming."
    },
    {
      id: "imp8",
      text: "Change the café name to something more exciting.",
      strong: false,
      reason:
        "Branding changes are not part of the storyboard’s main purpose, which is to guide filming."
    }
  ],

  explanationQuestions: [
    {
      id: "exp1",
      prompt:
        "Why is adding camera shot labels (e.g. WIDE, MID, CLOSE‑UP) a strong suggestion?",
      options: [
        "It makes the storyboard look more detailed and might impress the examiner.",
        "It tells the director exactly how to frame each shot so they can match the client’s vision.",
        "It means the advert will automatically be more persuasive to customers."
      ],
      correctIndex: 1
    },
    {
      id: "exp2",
      prompt:
        "Why is including timing/duration for each frame helpful for the director?",
      options: [
        "It allows them to plan the overall length and pace of the advert accurately.",
        "It makes the drawings neater and easier to colour in.",
        "It means the actors will know exactly what to say."
      ],
      correctIndex: 0
    },
    {
      id: "exp3",
      prompt:
        "Why might adding random decorative clip‑art around each frame be a weak suggestion?",
      options: [
        "It might use too much printer ink.",
        "It does not help the director understand camera shots, movement or timing and could distract from important details.",
        "It stops the storyboard from fitting on one page."
      ],
      correctIndex: 1
    }
  ],

  sentenceTiles: [
    {
      id: "s1",
      text:
        "Overall, the storyboard gives a basic idea of the advert but it is missing several key conventions needed by a director.",
      weight: 2
    },
    {
      id: "s2",
      text:
        "One improvement would be to add shot numbers and camera labels such as WIDE or CLOSE‑UP to each frame.",
      weight: 3
    },
    {
      id: "s3",
      text:
        "This would help the director and camera operator quickly identify each shot and plan how to frame the action on set.",
      weight: 3
    },
    {
      id: "s4",
      text:
        "Another improvement is to include short, present‑tense descriptions of the action under each image.",
      weight: 3
    },
    {
      id: "s5",
      text:
        "Present‑tense descriptions make it clear what should be happening on screen at that moment, reducing confusion for the cast and crew.",
      weight: 3
    },
    {
      id: "s6",
      text:
        "Adding timings such as 3s or 5s under each frame would allow the director to control the pace and keep the advert within the time limit.",
      weight: 3
    },
    {
      id: "s7",
      text:
        "It might also be helpful to add arrows showing any camera movements, for example PAN left when the owner speaks outside the shop.",
      weight: 2
    },
    {
      id: "s8",
      text:
        "Changing the café name would not really help the director because it does not affect how the advert is filmed.",
      weight: 1
    },
    {
      id: "s9",
      text:
        "Random decorations such as extra clip‑art coffee beans are unlikely to gain marks as they do not support planning for filming.",
      weight: 1
    },
    {
      id: "s10",
      text:
        "In conclusion, by adding clear shot labels, action notes and timings, the storyboard would be much more suitable for the director and would support a professional final advert.",
      weight: 4
    },
    {
      id: "s11",
      text:
        "The storyboard is good because it shows people drinking coffee which is fun.",
      weight: 0
    },
    {
      id: "s12",
      text:
        "I personally like the idea and would definitely visit this café.",
      weight: 0
    }
  ]
};
