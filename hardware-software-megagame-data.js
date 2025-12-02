// Hardware & Software Gauntlet – Stage & Question Data
// Covers: hardware vs software, devices, digitising, dedicated apps, and exam-style responses.

window.HARDWARE_SOFTWARE_STAGES = [
  {
    id: "hardwareOrSoftware",
    name: "Stage 1 – Hardware or Software?",
    intro: "Decide whether each item is hardware (physical device) or software (program/application).",
    type: "hardwareOrSoftware",
    questions: [
      { item: "Mouse", answer: "Hardware", options: ["Hardware", "Software"] },
      { item: "Keyboard", answer: "Hardware", options: ["Hardware", "Software"] },
      { item: "Word processor", answer: "Software", options: ["Hardware", "Software"] },
      { item: "Digital camera", answer: "Hardware", options: ["Hardware", "Software"] },
      { item: "Image editing package", answer: "Software", options: ["Hardware", "Software"] },
      { item: "Scanner", answer: "Hardware", options: ["Hardware", "Software"] },
      { item: "Presentation software", answer: "Software", options: ["Hardware", "Software"] },
      { item: "Graphics tablet", answer: "Hardware", options: ["Hardware", "Software"] },
      { item: "Mind-mapping app", answer: "Software", options: ["Hardware", "Software"] },
      { item: "Touchscreen tablet", answer: "Hardware", options: ["Hardware", "Software"] }
    ]
  },
  {
    id: "hardwareScenario",
    name: "Stage 2 – Pick the Hardware",
    intro: "Choose the most suitable hardware device for each pre-production task.",
    type: "hardwareScenario",
    questions: [
      {
        scenario: "You want to type and edit a script quickly, including moving and deleting lines of dialogue.",
        answer: "Keyboard and mouse",
        options: [
          "Keyboard and mouse",
          "Graphics tablet and stylus",
          "Scanner",
          "Digital camera"
        ]
      },
      {
        scenario: "You need to sketch a visualisation diagram directly onto the computer with pressure-sensitive drawing.",
        answer: "Graphics tablet and stylus",
        options: [
          "Graphics tablet and stylus",
          "Mouse only",
          "Microphone",
          "Printer"
        ]
      },
      {
        scenario: "You are recording a voice-over track that will be added to a storyboard animatic.",
        answer: "Microphone",
        options: [
          "Microphone",
          "Scanner",
          "Digital camera",
          "Speakers"
        ]
      },
      {
        scenario: "You must show your storyboard and visualisation diagram to the whole class at once.",
        answer: "Projector / large display",
        options: [
          "Projector / large display",
          "Graphics tablet",
          "Scanner",
          "Printer"
        ]
      },
      {
        scenario: "You want to capture textures from real-world objects (like fabric and leaves) to use in a mood board.",
        answer: "Digital camera",
        options: [
          "Digital camera",
          "Graphics tablet",
          "Scanner",
          "Webcam only"
        ]
      }
    ]
  },
  {
    id: "digitiseDocs",
    name: "Stage 3 – Digitise It! Camera or Scanner",
    intro: "Choose whether a digital camera or a scanner is better for turning each item into a digital file.",
    type: "digitiseScenario",
    questions: [
      {
        scenario: "A neatly drawn A4 storyboard with clear boxes and text.",
        answer: "Scanner",
        options: ["Scanner", "Digital camera"]
      },
      {
        scenario: "A huge wall-sized mood board with 3D objects and textured materials stuck on.",
        answer: "Digital camera",
        options: ["Digital camera", "Scanner"]
      },
      {
        scenario: "A single-page script printed on A4 paper.",
        answer: "Scanner",
        options: ["Scanner", "Digital camera"]
      },
      {
        scenario: "A group mind map drawn across a large sheet that does not fit on the scanner.",
        answer: "Digital camera",
        options: ["Digital camera", "Scanner"]
      },
      {
        scenario: "A hand-drawn logo design that needs to be imported cleanly for editing.",
        answer: "Scanner",
        options: ["Scanner", "Digital camera"]
      }
    ]
  },
  {
    id: "softwareScenario",
    name: "Stage 4 – Choose the Software",
    intro: "Pick the most suitable software for each media or pre-production task.",
    type: "softwareScenario",
    questions: [
      {
        scenario: "You are writing and editing the script for a short film, including scene headings and dialogue.",
        answer: "Word processing software",
        options: [
          "Word processing software",
          "Image editing software",
          "Presentation software",
          "Mind-mapping software"
        ]
      },
      {
        scenario: "You want to create a layout for a printed poster with images and text boxes in precise positions.",
        answer: "Desktop publishing (DTP) software",
        options: [
          "Desktop publishing (DTP) software",
          "Database software",
          "Audio editing software",
          "Web browser"
        ]
      },
      {
        scenario: "You need to adjust brightness, contrast and colour levels on photos for a mood board.",
        answer: "Image editing software",
        options: [
          "Image editing software",
          "Spreadsheet software",
          "Word processing software",
          "Presentation software"
        ]
      },
      {
        scenario: "You are planning the structure of a website, showing how pages link together.",
        answer: "Wireframing / diagramming software",
        options: [
          "Wireframing / diagramming software",
          "Audio editing software",
          "Image viewer",
          "Email client"
        ]
      },
      {
        scenario: "You are presenting your visualisation diagram and storyboard to a client on screen.",
        answer: "Presentation software",
        options: [
          "Presentation software",
          "Image editing software",
          "Word processing software",
          "Web design software"
        ]
      }
    ]
  },
  {
    id: "dedicatedApps",
    name: "Stage 5 – Dedicated Applications",
    intro: "Match each scenario to the most suitable specialised or dedicated application.",
    type: "dedicatedApps",
    questions: [
      {
        scenario: "You are brainstorming ideas for a new game and want to show how topics link together in a spider diagram.",
        answer: "Mind-mapping software (e.g. XMind, Coggle)",
        options: [
          "Mind-mapping software (e.g. XMind, Coggle)",
          "Storyboard software (e.g. Storyboarder)",
          "Video editing software",
          "Web browser"
        ]
      },
      {
        scenario: "You need to plan each shot of a TV advert, including camera angles and notes for each frame.",
        answer: "Storyboard software",
        options: [
          "Storyboard software",
          "Mind-mapping software",
          "Audio editing software",
          "DTP software"
        ]
      },
      {
        scenario: "You want to create an interactive prototype of a mobile app to show how screens link together.",
        answer: "Wireframing / prototyping software",
        options: [
          "Wireframing / prototyping software",
          "Spreadsheet software",
          "Database software",
          "Image viewer"
        ]
      },
      {
        scenario: "You are timing tasks and allocating resources for a project that has many overlapping activities.",
        answer: "Project management software (e.g. Gantt chart tools)",
        options: [
          "Project management software (e.g. Gantt chart tools)",
          "Presentation software",
          "Screen recording software",
          "Mind-mapping software"
        ]
      }
    ]
  },
  {
    id: "hardwareSoftwareCombo",
    name: "Stage 6 – Hardware + Software Combo",
    intro: "Choose the best combination of hardware and software for each pre-production task.",
    type: "hardwareSoftwareCombo",
    questions: [
      {
        scenario: "You are creating a neat digital version of a storyboard that was originally sketched on paper.",
        answer: "Scan the storyboard with a scanner, then refine it using storyboard or image editing software.",
        options: [
          "Scan the storyboard with a scanner, then refine it using storyboard or image editing software.",
          "Photograph the storyboard and paste the photo straight into a word processor with no changes.",
          "Type the storyboard description into a spreadsheet instead of using any images.",
          "Record a voice note describing the storyboard instead of digitising the drawings."
        ]
      },
      {
        scenario: "You are building a mood board that combines edited photos and textures with text labels.",
        answer: "Capture photos with a digital camera, edit them in image editing software, then arrange them in DTP or presentation software.",
        options: [
          "Capture photos with a digital camera, edit them in image editing software, then arrange them in DTP or presentation software.",
          "Draw everything by hand and never digitise it.",
          "Only type a list of ideas in a word processor with no images.",
          "Use a microphone to read out the mood board ideas without any visuals."
        ]
      },
      {
        scenario: "You want to plan out the branching choices in an interactive story game.",
        answer: "Use a mouse and keyboard with mind-mapping or flowchart software to show the different paths.",
        options: [
          "Use a mouse and keyboard with mind-mapping or flowchart software to show the different paths.",
          "Only use a camera to photograph handwritten notes.",
          "Create a playlist of songs in audio software instead of a plan.",
          "Record the whole game in a single paragraph of a word processor with no structure."
        ]
      },
      {
        scenario: "You are preparing a visualisation diagram for a mobile app home screen to present to a client.",
        answer: "Use a graphics tablet or mouse with presentation or DTP software to lay out icons, text and colour schemes.",
        options: [
          "Use a graphics tablet or mouse with presentation or DTP software to lay out icons, text and colour schemes.",
          "Record a voice memo explaining the idea with no visuals.",
          "Only write a bullet-point list in a word processor.",
          "Use audio editing software to mix background music instead."
        ]
      }
    ]
  },
  {
    id: "eightMarkHardware",
    name: "Stage 7 – 8-Mark Builder: Hardware & Software",
    intro: "Pick the exam-style sentence that would gain the most marks in an 8-mark answer about hardware and software in pre-production.",
    type: "eightMarkHardware",
    questions: [
      {
        question: "Which opening sentence would gain the most marks in an 8-mark answer explaining why the choice of hardware and software is important when planning a new media product?",
        answer: 1,
        options: [
          "Hardware and software are both used when making media products.",
          "Choosing appropriate hardware and software is vital in pre-production because it affects how accurately documents can be created, edited and shared, which in turn impacts the quality and efficiency of the final media product.",
          "Computers use lots of hardware like mice and keyboards that are useful.",
          "Software can sometimes crash so you need to pick a good one."
        ]
      },
      {
        question: "Which sentence best explains how specialist hardware can support a graphic designer in pre-production?",
        answer: 2,
        options: [
          "Graphic designers sometimes use different types of computers.",
          "Using cheaper hardware always makes the project quicker and easier.",
          "A graphics tablet with a pressure-sensitive stylus allows the designer to sketch concepts and visualisation diagrams more naturally and accurately than with a mouse, which leads to more detailed and expressive designs.",
          "A designer only needs a keyboard to create all of their pre-production documents."
        ]
      },
      {
        question: "Which concluding sentence would best finish an 8-mark answer about choosing software for creating scripts, storyboards and mood boards?",
        answer: 0,
        options: [
          "Overall, using a word processor for scripts, dedicated storyboard software for shot planning and image editing plus DTP tools for mood boards allows each pre-production document to be created in the most efficient and professional way, making it easier for the client and production team to understand the final idea.",
          "In conclusion, there are many different software packages that can be used in pre-production.",
          "Software is useful because it lets you type, draw and save files on a computer.",
          "To sum up, pre-production is important so you should pick some software for it."
        ]
      }
    ]
  }
];
