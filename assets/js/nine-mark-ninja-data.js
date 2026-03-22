// 9-Mark Ninja – all scenarios (OCR-style 9-mark questions)

window.NINE_MARK_SCENARIOS = {
  storyboard: {
    id: "storyboard",
    title: "Rollin Café storyboard – 9-mark question",
    imageSrc: "img/rollin-cafe-storyboard.png",
    docLabel: "storyboard",
    userRoleLabel: "director",
    questionText:
      "Figure 1 shows a storyboard for an advert for Rollin Café.<br>Discuss the suitability of this storyboard for use by the director.",
    focusOptions: [
      {
        id: "focus_sb_correct",
        text:
          "Discuss how suitable the storyboard is for the director by suggesting improvements and explaining how they would help when filming the advert.",
        correct: true
      },
      {
        id: "focus_sb_wrong1",
        text:
          "Describe what happens in each frame of the advert and give your personal opinion about whether you like it.",
        correct: false
      },
      {
        id: "focus_sb_wrong2",
        text:
          "Rewrite the storyboard into a finished script and design a brand-new logo for the café.",
        correct: false
      }
    ],
    improvementOptions: [
      { id: "sb_imp1", text: "Add shot numbers and clear titles for each frame.", strong: true },
      { id: "sb_imp2", text: "Use camera shot labels such as WIDE, MID and CLOSE-UP on each frame.", strong: true },
      { id: "sb_imp3", text: "Add arrows such as PAN and TRACK to show camera movement.", strong: true },
      { id: "sb_imp4", text: "Write a short present-tense description of the action under every frame.", strong: true },
      { id: "sb_imp5", text: "Include an estimated duration such as 3s or 5s under each frame.", strong: true },
      { id: "sb_imp6", text: "Use speech bubbles instead of technical information in the frames.", strong: false },
      { id: "sb_imp7", text: "Add extra clip-art coffee beans and decorations around every frame.", strong: false },
      { id: "sb_imp8", text: "Change the name of the café to something more exciting.", strong: false }
    ],
    explanationQuestions: [
      {
        id: "sb_exp1",
        prompt:
          "Why would adding camera shot labels such as WIDE and CLOSE-UP make this storyboard more suitable for the director?",
        options: [
          "It would make the storyboard look more colourful and interesting to customers.",
          "It tells the director exactly how to frame each shot so they can plan camera set-ups more accurately.",
          "It means the actors will automatically know all of their lines without reading a script."
        ],
        correctIndex: 1
      },
      {
        id: "sb_exp2",
        prompt:
          "How does including timings such as 3s or 5s under each frame help the director?",
        options: [
          "It allows the director to plan the overall length and pace of the advert to fit the time slot.",
          "It makes it easier to choose background music for the advert.",
          "It allows the director to change the menu prices shown in the advert."
        ],
        correctIndex: 0
      },
      {
        id: "sb_exp3",
        prompt:
          "Why is adding lots of decorative clip-art around each frame a weak suggestion?",
        options: [
          "It might use too much printer ink and be expensive to photocopy.",
          "It does not help the director understand shots, movement or timing and may distract from important information.",
          "It will make the storyboard too small to fit onto a single page."
        ],
        correctIndex: 1
      }
    ],
    sentenceTiles: [
      {
        id: "sb_s1",
        text:
          "Overall, the storyboard gives a basic idea of the advert but it is missing several key conventions needed by the director.",
        weight: 2
      },
      {
        id: "sb_s2",
        text:
          "One improvement would be to add shot numbers and camera labels such as WIDE or CLOSE-UP to each frame.",
        weight: 3
      },
      {
        id: "sb_s3",
        text:
          "This would help the director and camera operator quickly identify each shot and plan how to frame the action on set.",
        weight: 3
      },
      {
        id: "sb_s4",
        text:
          "Another improvement is to include short, present-tense descriptions of the action under each image.",
        weight: 3
      },
      {
        id: "sb_s5",
        text:
          "Present-tense descriptions make it clear what should be happening on screen at that moment, reducing confusion for the cast and crew.",
        weight: 3
      },
      {
        id: "sb_s6",
        text:
          "Adding timings such as 3s or 5s under each frame would allow the director to control the pace and keep the advert within the time limit.",
        weight: 3
      },
      {
        id: "sb_s7",
        text:
          "It might also be helpful to add arrows showing any camera movements, for example PAN left when the owner speaks outside the shop.",
        weight: 2
      },
      {
        id: "sb_s8",
        text:
          "Changing the café name would not really help the director because it does not affect how the advert is filmed.",
        weight: 1
      },
      {
        id: "sb_s9",
        text:
          "Random decorations such as extra clip-art coffee beans are unlikely to gain marks as they do not support planning for filming.",
        weight: 1
      },
      {
        id: "sb_s10",
        text:
          "In conclusion, by adding clear shot labels, action notes and timings, the storyboard would be much more suitable for the director and would support a professional final advert.",
        weight: 4
      },
      {
        id: "sb_s11",
        text:
          "The storyboard is good because it shows people drinking coffee which is fun.",
        weight: 0
      },
      {
        id: "sb_s12",
        text:
          "I personally like the idea and would definitely visit this café.",
        weight: 0
      }
    ]
  },

  /* ---------- Client brief – Quick Eats app ---------- */
  clientBrief: {
    id: "clientBrief",
    title: "Quick Eats client brief – 9-mark question",
    imageSrc: "img/client-brief.png",
    docLabel: "client brief",
    userRoleLabel: "design team",
    questionText:
      "Figure 1 shows a client brief for the Quick Eats app.<br>Discuss the suitability of this client brief for guiding the work of the design team.",
    focusOptions: [
      {
        id: "cb_focus_correct",
        text:
          "Discuss how suitable the client brief is for guiding the design team by identifying strengths and suggesting improvements with explanations.",
        correct: true
      },
      {
        id: "cb_focus_wrong1",
        text:
          "Rewrite the brief into a full project report and explain why you personally like the idea.",
        correct: false
      },
      {
        id: "cb_focus_wrong2",
        text:
          "Describe every sentence in the client brief without suggesting any changes.",
        correct: false
      }
    ],
    improvementOptions: [
      { id: "cb_imp1", text: "Add a clear deadline and launch date for the app.", strong: true },
      { id: "cb_imp2", text: "Include the budget available for the project.", strong: true },
      {
        id: "cb_imp3",
        text: "Give more detail about the target audience, such as age range and typical lifestyle.",
        strong: true
      },
      {
        id: "cb_imp4",
        text: "List the key platforms and operating systems the app must support.",
        strong: true
      },
      {
        id: "cb_imp5",
        text: "Specify any deliverables, such as app icon, UI screens and promotional graphics.",
        strong: true
      },
      { id: "cb_imp6", text: "Add a detailed history of the company since it opened.", strong: false },
      { id: "cb_imp7", text: "Change the Quick Eats logo to a completely different colour scheme.", strong: false },
      { id: "cb_imp8", text: "Include the favourite takeaway meals of the designer.", strong: false }
    ],
    explanationQuestions: [
      {
        id: "cb_exp1",
        prompt:
          "Why would adding a deadline and launch date make this client brief more suitable for the design team?",
        options: [
          "It allows the team to plan their time and schedule stages such as design, testing and launch.",
          "It makes the brief look more professional to customers.",
          "It means the app will automatically be finished on time without any planning."
        ],
        correctIndex: 0
      },
      {
        id: "cb_exp2",
        prompt: "How does including a clear budget help the design team?",
        options: [
          "It allows them to choose suitable tools, licences and media assets that are affordable.",
          "It tells them what colours to use in the design.",
          "It means they do not need to speak to the client again."
        ],
        correctIndex: 0
      },
      {
        id: "cb_exp3",
        prompt: "Why is providing extra detail about the target audience useful in the client brief?",
        options: [
          "It helps the team design features, layout and language that are appropriate for the intended users.",
          "It allows the team to ignore any constraints.",
          "It means the app will appeal to everyone, not just the target audience."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "cb_s1",
        text:
          "The client brief gives a basic overview of the Quick Eats app but it lacks some key information needed by the design team.",
        weight: 2
      },
      {
        id: "cb_s2",
        text:
          "One improvement would be to include a clear deadline and launch date for the app.",
        weight: 3
      },
      {
        id: "cb_s3",
        text:
          "This would help the design team schedule tasks such as interface design, testing and marketing so the app is ready on time.",
        weight: 3
      },
      { id: "cb_s4", text: "Another useful improvement is to add the overall project budget.", weight: 3 },
      {
        id: "cb_s5",
        text:
          "Knowing the budget allows the team to choose appropriate software, stock images and advertising without overspending.",
        weight: 3
      },
      {
        id: "cb_s6",
        text:
          "The brief could also give more detail about the target audience, such as age range and typical lifestyle.",
        weight: 3
      },
      {
        id: "cb_s7",
        text:
          "This would make it easier to design features and content that appeal specifically to busy adults who order takeaway regularly.",
        weight: 2
      },
      {
        id: "cb_s8",
        text:
          "Including required platforms, such as iOS and Android, would help the team plan technical requirements from the start.",
        weight: 2
      },
      {
        id: "cb_s9",
        text:
          "In conclusion, by adding deadlines, budget, target audience detail and technical requirements, the client brief would be much more suitable for guiding the design team.",
        weight: 4
      },
      {
        id: "cb_s10",
        text: "The brief is good because the logo looks professional and I would probably use the app.",
        weight: 0
      }
    ]
  },

  /* ---------- Mood board – Quick Eats branding ---------- */
  moodBoard: {
    id: "moodBoard",
    title: "Quick Eats mood board – 9-mark question",
    imageSrc: "img/mood-board.png",
    docLabel: "mood board",
    userRoleLabel: "client",
    questionText:
      "Figure 1 shows a mood board for the Quick Eats app branding.<br>Discuss the suitability of this mood board for helping the client visualise the style of the app.",
    focusOptions: [
      {
        id: "mb_focus_correct",
        text:
          "Discuss how suitable the mood board is for helping the client visualise the branding, suggesting improvements and explaining how they would help.",
        correct: true
      },
      {
        id: "mb_focus_wrong1",
        text:
          "Describe every image on the mood board and say which food looks the most appealing to you.",
        correct: false
      },
      {
        id: "mb_focus_wrong2",
        text:
          "Design a completely new app interface without referring to the mood board.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "mb_imp1",
        text:
          "Add short annotations explaining how each image links to the brand values, such as fast or local.",
        strong: true
      },
      {
        id: "mb_imp2",
        text:
          "Include examples of app screens to show how the colour palette will be used in the UI.",
        strong: true
      },
      {
        id: "mb_imp3",
        text: "Show the main typeface and headline style that will be used in the app.",
        strong: true
      },
      {
        id: "mb_imp4",
        text:
          "Make sure the colour palette is clearly labelled and used consistently across images.",
        strong: true
      },
      {
        id: "mb_imp5",
        text: "Add random images of desserts that are not part of the Quick Eats menu.",
        strong: false
      },
      {
        id: "mb_imp6",
        text:
          "Change all of the images to black and white to make the mood board look simpler.",
        strong: false
      },
      {
        id: "mb_imp7",
        text:
          "Cover the mood board with large text saying QUICK EATS on every image.",
        strong: false
      }
    ],
    explanationQuestions: [
      {
        id: "mb_exp1",
        prompt:
          "Why would adding annotations to the images make this mood board more suitable for the client?",
        options: [
          "They explain how each image links to the brand, helping the client understand the design decisions.",
          "They make the mood board longer so it looks like more work was done.",
          "They replace the need for any other pre-production documents."
        ],
        correctIndex: 0
      },
      {
        id: "mb_exp2",
        prompt: "How does including example app screens help the client?",
        options: [
          "It shows how colours, fonts and imagery will actually appear in the interface, making the concept easier to visualise.",
          "It allows the client to edit the app directly from the mood board.",
          "It makes the mood board harder to print."
        ],
        correctIndex: 0
      },
      {
        id: "mb_exp3",
        prompt: "Why is adding lots of unrelated food images a weak suggestion?",
        options: [
          "They make the mood board heavier to carry.",
          "They may confuse the client because they do not match the agreed brand style or menu.",
          "They automatically improve the nutritional value of the food in the app."
        ],
        correctIndex: 1
      }
    ],
    sentenceTiles: [
      {
        id: "mb_s1",
        text:
          "The mood board gives a good first impression of the Quick Eats brand but some details are missing for the client.",
        weight: 2
      },
      {
        id: "mb_s2",
        text:
          "One improvement would be to add annotations explaining why each image was chosen.",
        weight: 3
      },
      {
        id: "mb_s3",
        text:
          "These notes would help the client see how the photos, colours and typography link to ideas such as fast service and fresh food.",
        weight: 3
      },
      {
        id: "mb_s4",
        text:
          "The designer could also include sample app screens showing the interface using the same colour palette and fonts.",
        weight: 3
      },
      {
        id: "mb_s5",
        text:
          "This would make it easier for the client to visualise how the final app will look, not just the general mood.",
        weight: 3
      },
      {
        id: "mb_s6",
        text:
          "Clearly labelling the colour palette and main typeface would help keep branding consistent across all media.",
        weight: 2
      },
      {
        id: "mb_s7",
        text:
          "Adding unrelated images of desserts would not help because they might confuse the client about what the app offers.",
        weight: 1
      },
      {
        id: "mb_s8",
        text:
          "Overall, with annotations, UI examples and clearly labelled brand elements, the mood board would be much more suitable for helping the client visualise the Quick Eats app.",
        weight: 4
      },
      {
        id: "mb_s9",
        text:
          "I like the mood board because the food looks tasty and I would download the app.",
        weight: 0
      }
    ]
  },

  /* ---------- Wireframe – Quick Eats home screen ---------- */
  wireframe: {
    id: "wireframe",
    title: "Quick Eats wireframe – 9-mark question",
    imageSrc: "img/wireframe.png",
    docLabel: "wireframe",
    userRoleLabel: "app developer",
    questionText:
      "Figure 1 shows a wireframe for the Quick Eats app home screen.<br>Discuss the suitability of this wireframe for use by the app developer.",
    focusOptions: [
      {
        id: "wf_focus_correct",
        text:
          "Discuss how suitable the wireframe is for guiding the app developer, suggesting improvements and explaining how they would help when building the screen.",
        correct: true
      },
      {
        id: "wf_focus_wrong1",
        text:
          "Describe how you personally would feel using the app shown in the wireframe.",
        correct: false
      },
      {
        id: "wf_focus_wrong2",
        text:
          "Write full HTML and CSS code for the app instead of commenting on the wireframe.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "wf_imp1",
        text: "Label the navigation menu items clearly, such as Home, Favourites and Orders.",
        strong: true
      },
      {
        id: "wf_imp2",
        text: "Add notes explaining what each button does and which screen it links to.",
        strong: true
      },
      {
        id: "wf_imp3",
        text: "Show examples of content in the hero image area, such as a featured restaurant.",
        strong: true
      },
      {
        id: "wf_imp4",
        text:
          "Include information about responsive behaviour, such as how the layout changes on smaller screens.",
        strong: true
      },
      {
        id: "wf_imp5",
        text:
          "Colour in all the boxes with bright colours to make the wireframe more eye-catching.",
        strong: false
      },
      {
        id: "wf_imp6",
        text: "Remove all labels so the developer can decide everything later.",
        strong: false
      }
    ],
    explanationQuestions: [
      {
        id: "wf_exp1",
        prompt:
          "Why would adding notes about what each button does make this wireframe more suitable for the app developer?",
        options: [
          "It tells the developer exactly which screens need to be created and how the user will navigate between them.",
          "It makes the wireframe more colourful.",
          "It means the developer will not need any other documentation."
        ],
        correctIndex: 0
      },
      {
        id: "wf_exp2",
        prompt: "How does showing example content in the hero image area help?",
        options: [
          "It helps the developer understand what type of data needs to be loaded into that space.",
          "It makes the image more interesting for social media.",
          "It allows the developer to avoid using a database."
        ],
        correctIndex: 0
      },
      {
        id: "wf_exp3",
        prompt: "Why is colouring in all the boxes a weak suggestion?",
        options: [
          "Wireframes are meant to focus on layout and function, so bright colours may distract from structure and are not necessary for the developer.",
          "Developers do not like any colour.",
          "Bright colours automatically improve app performance."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "wf_s1",
        text:
          "The wireframe shows the basic layout of the Quick Eats home screen but it does not yet give the developer all the information needed.",
        weight: 2
      },
      {
        id: "wf_s2",
        text:
          "One improvement would be to label the navigation items clearly, such as Home, Favourites and Orders.",
        weight: 3
      },
      {
        id: "wf_s3",
        text:
          "Clear labels help the developer understand which sections and links must be built.",
        weight: 3
      },
      {
        id: "wf_s4",
        text:
          "Adding notes about what each button does and which screen it links to would also be useful.",
        weight: 3
      },
      {
        id: "wf_s5",
        text:
          "These notes would allow the developer to plan the app's navigation structure and data flow.",
        weight: 3
      },
      {
        id: "wf_s6",
        text:
          "Showing example content in the hero image area would help identify what data needs to be stored, such as restaurant names or offers.",
        weight: 2
      },
      {
        id: "wf_s7",
        text:
          "Colouring everything in bright colours would not improve suitability because it does not add any functional information for the developer.",
        weight: 1
      },
      {
        id: "wf_s8",
        text:
          "Overall, by adding clear labels, navigation notes and example content, this wireframe would be much more suitable for guiding the app developer.",
        weight: 4
      },
      {
        id: "wf_s9",
        text:
          "I think the wireframe is good because the phone shape looks neat.",
        weight: 0
      }
    ]
  },

  /* ---------- Visualisation diagram – Quick Eats poster ---------- */
  visualisation: {
    id: "visualisation",
    title: "Quick Eats visualisation diagram – 9-mark question",
    imageSrc: "img/visualisation-diagram.png",
    docLabel: "visualisation diagram",
    userRoleLabel: "graphic designer",
    questionText:
      "Figure 1 shows a visualisation diagram for a Quick Eats promotional poster.<br>Discuss the suitability of this visualisation diagram for use by the graphic designer.",
    focusOptions: [
      {
        id: "vd_focus_correct",
        text:
          "Discuss how suitable the visualisation diagram is for the graphic designer by suggesting improvements and explaining how they would help when creating the poster.",
        correct: true
      },
      {
        id: "vd_focus_wrong1",
        text:
          "Describe every label and explain why you personally would notice the advert.",
        correct: false
      },
      {
        id: "vd_focus_wrong2",
        text:
          "Write a full essay about healthy eating instead of commenting on the diagram.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "vd_imp1",
        text: "Add the final poster size and orientation, such as A4 portrait.",
        strong: true
      },
      {
        id: "vd_imp2",
        text:
          "Include font names and approximate font sizes for the headings and body text.",
        strong: true
      },
      {
        id: "vd_imp3",
        text:
          "Show the colour values for the main brand colours, for example RGB or hex codes.",
        strong: true
      },
      {
        id: "vd_imp4",
        text: "Indicate safe margins and bleed areas around the edges.",
        strong: true
      },
      {
        id: "vd_imp5",
        text: "Cover the diagram with extra doodles and random icons.",
        strong: false
      },
      {
        id: "vd_imp6",
        text: "Remove the annotations so the designer has more freedom.",
        strong: false
      }
    ],
    explanationQuestions: [
      {
        id: "vd_exp1",
        prompt:
          "Why would adding font names and approximate sizes make this visualisation diagram more suitable for the graphic designer?",
        options: [
          "It gives clear guidance on typography, helping the designer match the client’s expectations.",
          "It makes the diagram more colourful.",
          "It tells the printer which paper to use."
        ],
        correctIndex: 0
      },
      {
        id: "vd_exp2",
        prompt: "How does including colour values help the designer?",
        options: [
          "It allows them to apply the exact brand colours consistently across print and digital versions.",
          "It means they can ignore the logo design.",
          "It makes the poster cheaper to print."
        ],
        correctIndex: 0
      },
      {
        id: "vd_exp3",
        prompt: "Why is removing annotations a weak suggestion?",
        options: [
          "Annotations are needed to explain layout, colours and content, so removing them makes the diagram less useful for the designer.",
          "They take up too much storage space on the computer.",
          "They stop the poster from being shared online."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "vd_s1",
        text:
          "The visualisation diagram shows the basic layout of the Quick Eats poster but some technical details are missing for the graphic designer.",
        weight: 2
      },
      {
        id: "vd_s2",
        text:
          "One improvement would be to state the final poster size and orientation, such as A4 portrait.",
        weight: 3
      },
      {
        id: "vd_s3",
        text:
          "This would help the designer set up the document at the correct dimensions before starting.",
        weight: 3
      },
      {
        id: "vd_s4",
        text:
          "Including font names and approximate sizes for headings and body text would also make the diagram clearer.",
        weight: 3
      },
      {
        id: "vd_s5",
        text:
          "This ensures the designer chooses typography that matches the brand and fits the available space.",
        weight: 3
      },
      {
        id: "vd_s6",
        text:
          "Adding colour values for the red and cream brand colours would support consistent branding across all materials.",
        weight: 2
      },
      {
        id: "vd_s7",
        text:
          "Random doodles or extra icons would not help because they do not add useful information for creating the final poster.",
        weight: 1
      },
      {
        id: "vd_s8",
        text:
          "Overall, by adding size, font and colour details, this visualisation diagram would be much more suitable for the graphic designer.",
        weight: 4
      },
      {
        id: "vd_s9",
        text:
          "I like the design because it makes me feel hungry.",
        weight: 0
      }
    ]
  },

  /* ---------- Asset table – Quick Eats app ---------- */
  assetTable: {
    id: "assetTable",
    title: "Quick Eats asset table – 9-mark question",
    imageSrc: "img/asset-table.png",
    docLabel: "asset table",
    userRoleLabel: "development team",
    questionText:
      "Figure 1 shows an asset table for the Quick Eats app.<br>Discuss the suitability of this asset table for use by the development team.",
    focusOptions: [
      {
        id: "at_focus_correct",
        text:
          "Discuss how suitable the asset table is for helping the development team manage assets, suggesting improvements and explaining how they would help.",
        correct: true
      },
      {
        id: "at_focus_wrong1",
        text:
          "Explain which assets you personally like the look of and which ones you would delete.",
        correct: false
      },
      {
        id: "at_focus_wrong2",
        text:
          "Write a completely new app idea instead of discussing the asset table.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "at_imp1",
        text: "Add file formats for each asset, such as PNG, JPG or OTF.",
        strong: true
      },
      {
        id: "at_imp2",
        text: "Include file locations or paths so the team can find the assets quickly.",
        strong: true
      },
      {
        id: "at_imp3",
        text: "Add a column for copyright or licence information.",
        strong: true
      },
      {
        id: "at_imp4",
        text:
          "Give more detail in the 'Where used' column, such as specific screens.",
        strong: true
      },
      { id: "at_imp5", text: "Remove asset IDs to make the table shorter.", strong: false },
      { id: "at_imp6", text: "Add a column for the favourite asset of each developer.", strong: false }
    ],
    explanationQuestions: [
      {
        id: "at_exp1",
        prompt:
          "Why would adding file formats make this asset table more suitable for the development team?",
        options: [
          "It helps them check that assets are compatible with the software and devices being used.",
          "It makes the table look more complicated for the examiner.",
          "It automatically compresses the files."
        ],
        correctIndex: 0
      },
      {
        id: "at_exp2",
        prompt: "How does including file locations or paths help the team?",
        options: [
          "It saves time because assets can be found quickly without searching multiple folders.",
          "It changes the colour of the assets.",
          "It stops assets from being deleted."
        ],
        correctIndex: 0
      },
      {
        id: "at_exp3",
        prompt: "Why is a copyright or licence column important?",
        options: [
          "It shows which assets are original, purchased or free to use so the team can avoid legal issues.",
          "It makes the table longer which gains automatic marks.",
          "It is only needed for sound files, not images or fonts."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "at_s1",
        text:
          "The asset table lists some key items for the Quick Eats app but it does not provide all the information the development team needs.",
        weight: 2
      },
      {
        id: "at_s2",
        text:
          "One improvement would be to add file formats for each asset, such as PNG for images and OTF for fonts.",
        weight: 3
      },
      {
        id: "at_s3",
        text:
          "This would help the team check that the assets are compatible with the software and devices being used.",
        weight: 3
      },
      {
        id: "at_s4",
        text:
          "Another improvement is to include file locations or paths so that assets can be found quickly during development.",
        weight: 3
      },
      {
        id: "at_s5",
        text:
          "This saves time and reduces the risk of using the wrong version of a file.",
        weight: 2
      },
      {
        id: "at_s6",
        text:
          "Adding a copyright or licence column would show whether each asset is original, purchased or free to use.",
        weight: 3
      },
      {
        id: "at_s7",
        text:
          "This would help the development team avoid legal problems when releasing the app.",
        weight: 2
      },
      {
        id: "at_s8",
        text:
          "Removing asset IDs or adding developers' favourite assets would not make the table more useful.",
        weight: 1
      },
      {
        id: "at_s9",
        text:
          "Overall, by adding formats, locations and copyright information, the asset table would be much more suitable for the development team.",
        weight: 4
      },
      {
        id: "at_s10",
        text:
          "The asset table is good because it includes some nice colours.",
        weight: 0
      }
    ]
  },

  /* ---------- Script – Quick Eats TV advert ---------- */
  script: {
    id: "script",
    title: "Quick Eats script – 9-mark question",
    imageSrc: "img/script.png",
    docLabel: "script",
    userRoleLabel: "production team",
    questionText:
      "Figure 1 shows a script extract for a Quick Eats TV advert.<br>Discuss the suitability of this script for use by the production team.",
    focusOptions: [
      {
        id: "sc_focus_correct",
        text:
          "Discuss how suitable the script is for helping the production team by suggesting improvements and explaining how they would help during filming.",
        correct: true
      },
      {
        id: "sc_focus_wrong1",
        text:
          "Explain whether you personally would order food from Quick Eats after watching the advert.",
        correct: false
      },
      {
        id: "sc_focus_wrong2",
        text:
          "Write a completely different story for the advert without referring to the script.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "sc_imp1",
        text: "Add camera directions such as CLOSE-UP or PAN where needed.",
        strong: true
      },
      {
        id: "sc_imp2",
        text:
          "Include sound effects and music cues, for example upbeat music when the app is used.",
        strong: true
      },
      {
        id: "sc_imp3",
        text:
          "Show timings for each line or section to match the advert duration.",
        strong: true
      },
      {
        id: "sc_imp4",
        text: "Clearly mark voiceover lines and on-screen dialogue.",
        strong: true
      },
      {
        id: "sc_imp5",
        text:
          "Add detailed descriptions of the actor’s clothing unless it is essential to the message.",
        strong: false
      },
      {
        id: "sc_imp6",
        text: "Remove character names and just write the lines.",
        strong: false
      }
    ],
    explanationQuestions: [
      {
        id: "sc_exp1",
        prompt:
          "Why would adding camera directions such as CLOSE-UP make this script more suitable for the production team?",
        options: [
          "It helps the director and camera operator plan how each shot should look to emphasise key moments.",
          "It makes the script longer which always gains more marks.",
          "It tells the actors what to eat between takes."
        ],
        correctIndex: 0
      },
      {
        id: "sc_exp2",
        prompt:
          "How does including sound effects and music cues help during production?",
        options: [
          "It allows the sound team to prepare appropriate audio and ensures it matches the action.",
          "It means no editing will be needed.",
          "It makes the advert automatically more persuasive."
        ],
        correctIndex: 0
      },
      {
        id: "sc_exp3",
        prompt: "Why is removing character names a weak suggestion?",
        options: [
          "Character names show who speaks each line, so removing them would confuse actors and the director.",
          "It would save ink when printing.",
          "It is only a problem in radio adverts."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "sc_s1",
        text:
          "The script sets out the basic action and dialogue for the Quick Eats advert but lacks some detail for the production team.",
        weight: 2
      },
      {
        id: "sc_s2",
        text:
          "One improvement is to add camera directions such as CLOSE-UP on the phone screen when the app is used.",
        weight: 3
      },
      {
        id: "sc_s3",
        text:
          "This would help the director plan shots that clearly show how easy the app is to use.",
        weight: 3
      },
      {
        id: "sc_s4",
        text:
          "Including sound effects and music cues would also make the script more suitable.",
        weight: 3
      },
      {
        id: "sc_s5",
        text:
          "These cues tell the sound team when to add upbeat music or app notification sounds to support the message.",
        weight: 3
      },
      {
        id: "sc_s6",
        text:
          "Adding timings for each section would help keep the advert within the required time slot.",
        weight: 2
      },
      {
        id: "sc_s7",
        text:
          "Removing character names or focusing on unnecessary costume details would not help the production team.",
        weight: 1
      },
      {
        id: "sc_s8",
        text:
          "Overall, by adding camera directions, audio cues and timings, the script would be much more suitable for the production team.",
        weight: 4
      },
      {
        id: "sc_s9",
        text:
          "The script is good because Emma sounds relatable and I also get tired after work.",
        weight: 0
      }
    ]
  },

  /* ---------- Mind map – New adventure game ---------- */
  mindMap: {
    id: "mindMap",
    title: "New adventure game mind map – 9-mark question",
    imageSrc: "img/mind-map.png",
    docLabel: "mind map",
    userRoleLabel: "game designer",
    questionText:
      "Figure 1 shows a mind map for a new adventure game.<br>Discuss the suitability of this mind map for use by the game designer.",
    focusOptions: [
      {
        id: "mm_focus_correct",
        text:
          "Discuss how suitable the mind map is for planning the game concept, suggesting improvements and explaining how they would help the designer.",
        correct: true
      },
      {
        id: "mm_focus_wrong1",
        text:
          "Explain which of the ideas on the mind map you personally like the most.",
        correct: false
      },
      {
        id: "mm_focus_wrong2",
        text:
          "Write a review of your favourite adventure game instead of analysing the mind map.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "mm_imp1",
        text: "Add branches for target audience and platform, such as age range and console type.",
        strong: true
      },
      {
        id: "mm_imp2",
        text:
          "Include more detail under environments, for example specific locations and challenges.",
        strong: true
      },
      {
        id: "mm_imp3",
        text: "Expand the UI branch with ideas for menus, controls and feedback.",
        strong: true
      },
      {
        id: "mm_imp4",
        text: "Correct incomplete words so that all ideas are clear.",
        strong: true
      },
      { id: "mm_imp5", text: "Add random doodles that are not related to the game.", strong: false },
      { id: "mm_imp6", text: "Remove branches to make the mind map smaller.", strong: false }
    ],
    explanationQuestions: [
      {
        id: "mm_exp1",
        prompt:
          "Why would adding a target audience and platform branch make this mind map more suitable for the game designer?",
        options: [
          "It helps the designer plan features, difficulty and style that match the intended players and hardware.",
          "It tells the designer how much the game will cost to buy.",
          "It makes the mind map easier to colour in."
        ],
        correctIndex: 0
      },
      {
        id: "mm_exp2",
        prompt: "How does expanding the environments branch help?",
        options: [
          "It gives the designer more specific locations and challenges to develop into levels.",
          "It makes the page look fuller, even if the ideas are repeated.",
          "It means the story no longer needs to be planned."
        ],
        correctIndex: 0
      },
      {
        id: "mm_exp3",
        prompt: "Why is removing branches a weak suggestion?",
        options: [
          "Fewer branches mean less detail, so the mind map is less useful for planning the game.",
          "It makes the game cheaper to produce.",
          "It prevents the designer from using colour coding."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "mm_s1",
        text:
          "The mind map includes some useful ideas for characters, story and environments but it is not fully developed for the game designer.",
        weight: 2
      },
      {
        id: "mm_s2",
        text:
          "One improvement would be to add branches for the target audience and platform.",
        weight: 3
      },
      {
        id: "mm_s3",
        text:
          "This would help the designer make decisions about difficulty level, controls and visual style.",
        weight: 3
      },
      {
        id: "mm_s4",
        text:
          "Expanding the environments branch with more specific locations and challenges would also be helpful.",
        weight: 3
      },
      {
        id: "mm_s5",
        text:
          "These extra ideas could then be developed into individual game levels or missions.",
        weight: 2
      },
      {
        id: "mm_s6",
        text:
          "The UI branch could be improved by adding ideas for menus, sound and feedback to the player.",
        weight: 2
      },
      {
        id: "mm_s7",
        text:
          "Correcting incomplete words such as 'Mount' would make the mind map clearer to anyone reading it.",
        weight: 2
      },
      {
        id: "mm_s8",
        text:
          "Random doodles or removing branches would not help the designer plan the game in detail.",
        weight: 1
      },
      {
        id: "mm_s9",
        text:
          "Overall, by adding audience, platform and more detailed branches, this mind map would be much more suitable for the game designer.",
        weight: 4
      },
      {
        id: "mm_s10",
        text:
          "The mind map is good because it is hand-drawn and looks creative.",
        weight: 0
      }
    ]
  },

  /* ---------- Gantt chart – Quick Eats project ---------- */
  gantt: {
    id: "gantt",
    title: "Quick Eats Gantt chart – 9-mark question",
    imageSrc: "img/gantt-chart.png",
    docLabel: "Gantt chart",
    userRoleLabel: "project manager",
    questionText:
      "Figure 1 shows a Gantt chart for the Quick Eats app project.<br>Discuss the suitability of this Gantt chart for use by the project manager.",
    focusOptions: [
      {
        id: "ga_focus_correct",
        text:
          "Discuss how suitable the Gantt chart is for helping the project manager schedule the work, suggesting improvements and explaining how they would help.",
        correct: true
      },
      {
        id: "ga_focus_wrong1",
        text:
          "Describe which coloured bars you like the most on the Gantt chart.",
        correct: false
      },
      {
        id: "ga_focus_wrong2",
        text:
          "Rewrite the chart as a full report without referring to tasks or timings.",
        correct: false
      }
    ],
    improvementOptions: [
      {
        id: "ga_imp1",
        text: "Add start and end dates or weeks to the chart axes.",
        strong: true
      },
      {
        id: "ga_imp2",
        text:
          "Include dependencies, for example that wireframes must be finished before final design starts.",
        strong: true
      },
      {
        id: "ga_imp3",
        text:
          "Add a milestone for important checkpoints, such as client review.",
        strong: true
      },
      {
        id: "ga_imp4",
        text:
          "Move contingency time to the end of the schedule rather than in the middle of tasks.",
        strong: true
      },
      {
        id: "ga_imp5",
        text: "Change all bars to the same colour so they look neat.",
        strong: false
      },
      {
        id: "ga_imp6",
        text: "Remove review tasks because they do not create new assets.",
        strong: false
      }
    ],
    explanationQuestions: [
      {
        id: "ga_exp1",
        prompt:
          "Why would adding dependencies make this Gantt chart more suitable for the project manager?",
        options: [
          "They show which tasks must be completed before others can start, helping to avoid delays.",
          "They make the chart look more complicated.",
          "They automatically increase the project budget."
        ],
        correctIndex: 0
      },
      {
        id: "ga_exp2",
        prompt:
          "How does placing contingency time at the end of the schedule help?",
        options: [
          "It gives flexibility if earlier tasks overrun without affecting the final deadline as much.",
          "It means tasks can all start later than planned.",
          "It removes the need for any monitoring during the project."
        ],
        correctIndex: 0
      },
      {
        id: "ga_exp3",
        prompt: "Why is removing review tasks a weak suggestion?",
        options: [
          "Reviews are needed to check quality and get client feedback, so removing them risks problems being found too late.",
          "They are boring for the team.",
          "They do not use any colour so they are not important."
        ],
        correctIndex: 0
      }
    ],
    sentenceTiles: [
      {
        id: "ga_s1",
        text:
          "The Gantt chart shows the main tasks for the Quick Eats project but it is missing some information needed by the project manager.",
        weight: 2
      },
      {
        id: "ga_s2",
        text:
          "One improvement is to add clear start and end dates or week numbers on the timeline.",
        weight: 3
      },
      {
        id: "ga_s3",
        text:
          "This would help the project manager track exactly when each task should happen.",
        weight: 3
      },
      {
        id: "ga_s4",
        text:
          "Including dependencies between tasks, such as completing wireframes before final design, would also be useful.",
        weight: 3
      },
      {
        id: "ga_s5",
        text:
          "These links show which delays will have the biggest impact on the overall schedule.",
        weight: 2
      },
      {
        id: "ga_s6",
        text:
          "Contingency time should be placed towards the end of the project instead of in the middle of tasks.",
        weight: 2
      },
      {
        id: "ga_s7",
        text:
          "This gives the project manager flexibility if earlier tasks overrun.",
        weight: 2
      },
      {
        id: "ga_s8",
        text:
          "Removing review tasks or focusing only on bar colours would not make the chart more useful.",
        weight: 1
      },
      {
        id: "ga_s9",
        text:
          "Overall, by adding dates, dependencies, milestones and sensible contingency, the Gantt chart would be much more suitable for the project manager.",
        weight: 4
      },
      {
        id: "ga_s10",
        text:
          "I like the chart mainly because it uses bright colours.",
        weight: 0
      }
    ]
  }
};
