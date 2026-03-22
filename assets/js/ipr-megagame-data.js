// IPR Gauntlet – Stage & Question Data
// Covers: copyright, trademarks, patents, designs, Creative Commons, permissions & exam skills.

window.IPR_STAGES = [
  {
    id: "whichLaw",
    name: "Stage 1 – Which Law Protects It?",
    intro: "Decide which type of intellectual property law would protect each example.",
    type: "lawType",
    questions: [
      {
        example: "A new logo design for an energy drink brand.",
        answer: "Trademark",
        options: ["Copyright", "Trademark", "Patent", "Design right"]
      },
      {
        example: "The source code for a new video editing app.",
        answer: "Copyright",
        options: ["Copyright", "Trademark", "Patent", "Design right"]
      },
      {
        example: "A unique invention that folds a phone screen without leaving a crease.",
        answer: "Patent",
        options: ["Patent", "Copyright", "Trademark", "Design right"]
      },
      {
        example: "The shape and appearance of a new games console controller.",
        answer: "Design right",
        options: ["Design right", "Copyright", "Patent", "Trademark"]
      },
      {
        example: "A brand name and slogan for a sports streaming service.",
        answer: "Trademark",
        options: ["Trademark", "Copyright", "Patent", "Design right"]
      },
      {
        example: "An original song used in a game trailer.",
        answer: "Copyright",
        options: ["Copyright", "Patent", "Trademark", "Design right"]
      },
      {
        example: "A new type of camera lens that reduces blur in low light.",
        answer: "Patent",
        options: ["Patent", "Copyright", "Trademark", "Design right"]
      }
    ]
  },
  {
    id: "copyrightOrNot",
    name: "Stage 2 – Copyright or Not?",
    intro: "Decide whether the item is protected by copyright and, if so, identify the best description.",
    type: "copyrightCheck",
    questions: [
      {
        statement: "A photo you take of your friends at a concert.",
        answer: "Protected by copyright – you are the creator.",
        options: [
          "Protected by copyright – you are the creator.",
          "Not protected – photos cannot be copyrighted.",
          "Only protected if you register it with a government office.",
          "Only protected if the concert company gives permission."
        ]
      },
      {
        statement: "An idea you have for a new TV game show format.",
        answer: "Not directly protected – ideas alone are not copyrighted.",
        options: [
          "Protected by copyright as soon as you think of it.",
          "Not directly protected – ideas alone are not copyrighted.",
          "Protected by trademark law.",
          "Only protected after 70 years."
        ]
      },
      {
        statement: "A YouTube video you edit and upload yourself.",
        answer: "Protected by copyright when you create it.",
        options: [
          "Protected by copyright when you create it.",
          "Not protected because it is online.",
          "Only protected if it gets over 1,000 views.",
          "Protected by patent law."
        ]
      },
      {
        statement: "A brand new single released by a famous artist.",
        answer: "Protected – copying or sharing without permission is illegal.",
        options: [
          "Protected – copying or sharing without permission is illegal.",
          "Not protected if you bought the CD.",
          "Only protected in the country it was recorded.",
          "Only protected for 5 years."
        ]
      },
      {
        statement: "A UK government fact sheet that is released under open licence.",
        answer: "Protected by Crown copyright but can be reused under licence conditions.",
        options: [
          "Protected by Crown copyright but can be reused under licence conditions.",
          "Not protected because it is from the government.",
          "Protected only if you pay a fee.",
          "Protected by trademark law."
        ]
      }
    ]
  },
  {
    id: "ccLicences",
    name: "Stage 3 – Creative Commons Licence Master",
    intro: "Match each Creative Commons licence or icon to what you are allowed to do with the work.",
    type: "ccLicence",
    questions: [
      {
        question: "CC BY",
        answer: "You can use, share and adapt the work as long as you credit the creator.",
        options: [
          "You can use, share and adapt the work as long as you credit the creator.",
          "You can only use the work for non-commercial projects.",
          "You can use the work but must not change it.",
          "You can only use the work if you pay the creator."
        ]
      },
      {
        question: "CC BY-NC",
        answer: "You can use and adapt the work with credit, but not for commercial use.",
        options: [
          "You can use and adapt the work with credit, but not for commercial use.",
          "You can use the work commercially as long as you share it.",
          "You must not change the work in any way.",
          "You can only use the work for school homework."
        ]
      },
      {
        question: "CC BY-SA",
        answer: "You can adapt the work with credit, but you must share new work under the same licence.",
        options: [
          "You can adapt the work with credit, but you must share new work under the same licence.",
          "You must not change the work or remix it.",
          "You can use the work without credit.",
          "You can only use the work offline."
        ]
      },
      {
        question: "CC BY-ND",
        answer: "You can copy and share the work with credit, but you cannot adapt or change it.",
        options: [
          "You can copy and share the work with credit, but you cannot adapt or change it.",
          "You can remix the work for commercial use.",
          "You can adapt the work but must remove the original creator's name.",
          "You can only view the work, not share it."
        ]
      },
      {
        question: "CC0 (Public Domain dedication)",
        answer: "The creator has waived rights so you can use the work without permission or credit.",
        options: [
          "The creator has waived rights so you can use the work without permission or credit.",
          "You can use the work only after paying a fee.",
          "You must always ask before using the work.",
          "You can use the work, but only for non-commercial projects."
        ]
      }
    ]
  },
  {
    id: "permissions",
    name: "Stage 4 – Can You Use It?",
    intro: "Choose the most legally correct option for using media in each situation.",
    type: "permissions",
    questions: [
      {
        scenario: "You find a high-quality image on a stock photo site with a watermark and price listed.",
        answer: "Buy a licence or find a free alternative before using it.",
        options: [
          "Buy a licence or find a free alternative before using it.",
          "Crop out the watermark and use it anyway.",
          "Use it for school work then upload it to social media.",
          "Change the colours slightly so the watermark disappears."
        ]
      },
      {
        scenario: "You want background music for a commercial advert and find a track labelled CC BY-NC.",
        answer: "You cannot use it because the licence is non-commercial.",
        options: [
          "You cannot use it because the licence is non-commercial.",
          "You can use it if you credit the artist in small text.",
          "You can use it only if the advert is on YouTube.",
          "You can use it if you shorten the track."
        ]
      },
      {
        scenario: "You need icons for a website and find a CC BY icon pack.",
        answer: "You can use and edit the icons as long as you credit the creator.",
        options: [
          "You can use and edit the icons as long as you credit the creator.",
          "You cannot change the icons at all.",
          "You must pay a licence fee before using them.",
          "You can only use them in printed products."
        ]
      },
      {
        scenario: "You want to include a short film clip in a critical review video.",
        answer: "Use a short clip and clearly show it is for criticism or review, crediting the source.",
        options: [
          "Use a short clip and clearly show it is for criticism or review, crediting the source.",
          "Upload the full film because you are reviewing it.",
          "Only use the soundtrack without permission.",
          "Use any length of clip as long as your video is not monetised."
        ]
      },
      {
        scenario: "A friend sends you a full album as MP3 files and says you can use any track in your game.",
        answer: "You still need permission from the copyright owner or must use licensed/royalty-free music.",
        options: [
          "You still need permission from the copyright owner or must use licensed/royalty-free music.",
          "It is fine because your friend already bought the album.",
          "It is fine if you only use 10 seconds of each track.",
          "You can use the tracks if you change the pitch slightly."
        ]
      }
    ]
  },
  {
    id: "fairDealing",
    name: "Stage 5 – Fair Dealing or Infringement?",
    intro: "Decide whether the use of copyright material is fair dealing or copyright infringement.",
    type: "fairDealing",
    questions: [
      {
        statement: "Copying a short paragraph from a book for a non-commercial school essay and adding a reference.",
        answer: "Fair dealing",
        options: ["Fair dealing", "Infringement"]
      },
      {
        statement: "Photocopying an entire textbook and giving copies to all your friends.",
        answer: "Infringement",
        options: ["Fair dealing", "Infringement"]
      },
      {
        statement: "Using a small section of a song in a media studies presentation for class only.",
        answer: "Fair dealing",
        options: ["Fair dealing", "Infringement"]
      },
      {
        statement: "Uploading a full film to a video sharing site without permission.",
        answer: "Infringement",
        options: ["Fair dealing", "Infringement"]
      },
      {
        statement: "Quoting a few lines from a review article in your own blog and clearly crediting the source.",
        answer: "Fair dealing",
        options: ["Fair dealing", "Infringement"]
      },
      {
        statement: "Downloading a cracked version of photo-editing software and using it to create client work.",
        answer: "Infringement",
        options: ["Fair dealing", "Infringement"]
      }
    ]
  },
  {
    id: "iprScenario",
    name: "Stage 6 – IPR Scenario Judgement",
    intro: "Apply your knowledge of IPR to decide what the media producer should do in each situation.",
    type: "iprScenario",
    questions: [
      {
        scenario: "A games company is about to release a new logo that looks very similar to a famous sports brand logo.",
        answer: "Change the logo to avoid trademark infringement.",
        options: [
          "Change the logo to avoid trademark infringement.",
          "Release the logo and see if anyone complains.",
          "Use the logo but change the colours slightly.",
          "Register the logo as a patent."
        ]
      },
      {
        scenario: "A music producer creates a track with a bassline almost identical to a famous song.",
        answer: "Get permission or change the bassline to avoid copyright infringement.",
        options: [
          "Get permission or change the bassline to avoid copyright infringement.",
          "Use the bassline because only the lyrics are protected.",
          "Use the bassline if the track is shorter than 30 seconds.",
          "Upload the track under a different artist name."
        ]
      },
      {
        scenario: "A student wants to reuse an image found on the internet for a poster that will be printed and sold.",
        answer: "Check the licence and obtain permission or use a commercial stock/CC image that allows this.",
        options: [
          "Check the licence and obtain permission or use a commercial stock/CC image that allows this.",
          "Use the image because it is already on the internet.",
          "Use the image if they add a filter.",
          "Print the poster first and apologise later."
        ]
      },
      {
        scenario: "A designer creates an original character design for a game and wants to stop others copying the exact artwork.",
        answer: "Rely on copyright protection for the artwork and keep evidence of creation.",
        options: [
          "Rely on copyright protection for the artwork and keep evidence of creation.",
          "File for a patent on the character.",
          "Register the character as a Crown copyright work.",
          "Give the design away under CC0."
        ]
      },
      {
        scenario: "A company invents a new type of camera lens and wants exclusive rights to manufacture it.",
        answer: "Apply for a patent to protect the invention.",
        options: [
          "Apply for a patent to protect the invention.",
          "Register the lens as a trademark.",
          "Release the design under a CC licence.",
          "Rely only on copyright protection."
        ]
      }
    ]
  },
  {
    id: "eightMarkIPR",
    name: "Stage 7 – 8-Mark Builder: IPR",
    intro: "Choose the strongest exam-style sentence that would gain marks in an 8-mark question about IPR.",
    type: "eightMarkIPR",
    questions: [
      {
        question: "Which opening sentence would be best for an 8-mark answer explaining why producers must consider copyright when creating a music video?",
        answer: 1,
        options: [
          "Copyright is a law that exists in lots of countries.",
          "Producers must consider copyright when creating a music video because every piece of music, footage and image used is likely to be protected, and using it without permission can lead to legal action and financial loss.",
          "Copyright is very important in media.",
          "There are many different types of law like copyright and trademarks."
        ]
      },
      {
        question: "Which point shows good analysis in an 8-mark answer about Creative Commons licences?",
        answer: 2,
        options: [
          "Creative Commons licences are used on the internet.",
          "There are different Creative Commons symbols that mean different things.",
          "Using a suitable Creative Commons licence can save time and money for small producers because they can legally use and adapt existing work, but they still have to follow conditions such as giving credit or avoiding commercial use.",
          "Some Creative Commons licences are better than others."
        ]
      },
      {
        question: "Which concluding sentence would best finish an 8-mark answer comparing copyright and trademarks?",
        answer: 0,
        options: [
          "Overall, copyright protects the creative content of a media product, while trademarks protect the branding such as names and logos, so producers must understand both to avoid copying other companies and to protect their own work.",
          "Copyright and trademarks are both important.",
          "In conclusion, I have talked about copyright and trademarks and why they matter.",
          "To sum up, people should not steal other people's work."
        ]
      }
    ]
  }
];
