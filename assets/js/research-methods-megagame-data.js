// Research Methods Adventure – question data

window.RESEARCH_STAGES = [
  {
    id: "primarySecondary",
    name: "Stage 1 – Primary or Secondary?",
    intro: "Decide whether each research method is a primary or secondary source. Tap the correct button before the timer runs out.",
    type: "primarySecondary",
    questions: [
      { label: "Face-to-face interview with a celebrity", category: "primary" },
      { label: "Online survey you design and send out yourself", category: "primary" },
      { label: "Focus group of carefully selected participants", category: "primary" },
      { label: "Questionnaire handed out in school", category: "primary" },
      { label: "Original photographs taken at an event", category: "primary" },
      { label: "News footage filmed at a protest", category: "primary" },
      { label: "First-hand account in a diary", category: "primary" },
      { label: "Poll carried out on a TV show website", category: "primary" },
      { label: "Textbook explaining events from the past", category: "secondary" },
      { label: "Academic journal article written by experts", category: "secondary" },
      { label: "Internet article reviewing a new film", category: "secondary" },
      { label: "Magazine article describing a new games console", category: "secondary" },
      { label: "Newspaper match report about a football game", category: "secondary" },
      { label: "Television documentary analysing a historical event", category: "secondary" }
    ]
  },
  {
    id: "methodMatch",
    name: "Stage 2 – Match the Method",
    intro: "Read the description and pick the research method it describes.",
    type: "methodMatch",
    questions: [
      {
        description: "Carefully selected people from the target audience take part in a planned discussion.",
        answer: "Focus group",
        options: ["Focus group", "Interview", "Poll", "Online survey"]
      },
      {
        description: "A conversation where a journalist asks questions to get someone's original words.",
        answer: "Interview",
        options: ["Interview", "Books and journals", "Newspaper article", "TV advert"]
      },
      {
        description: "Short questions asked through a website or app to gather opinions from a sample of people.",
        answer: "Online survey",
        options: ["Online survey", "Focus group", "Vox Pop", "Diary entry"]
      },
      {
        description: "A short clip where members of the public are asked for their views on the street.",
        answer: "Vox Pop",
        options: ["Vox Pop", "Focus group", "Online survey", "Magazine review"]
      },
      {
        description: "A printed or digital source that analyses and interprets information from other sources, often written by experts.",
        answer: "Books and journals",
        options: ["Books and journals", "Interview", "Poll", "Original photograph"]
      },
      {
        description: "An article that comments on or reviews other information, sometimes including opinion and bias.",
        answer: "Magazines and newspapers",
        options: ["Magazines and newspapers", "Online survey", "Focus group", "Original footage"]
      },
      {
        description: "A website whose contents may be a mixture of primary footage and secondary commentary.",
        answer: "Internet site",
        options: ["Internet site", "Interview", "Poll", "Diary entry"]
      }
    ]
  },
  {
    id: "advDisadv",
    name: "Stage 3 – Advantages & Disadvantages",
    intro: "Decide whether the statement is an advantage or disadvantage of the method shown.",
    type: "advDisadv",
    questions: [
      {
        method: "Focus groups",
        statement: "Participants can bounce ideas off each other and give detailed opinions.",
        kind: "advantage"
      },
      {
        method: "Focus groups",
        statement: "A small number of people may not represent the whole target audience.",
        kind: "disadvantage"
      },
      {
        method: "Online surveys",
        statement: "They can quickly reach large numbers of people at low cost.",
        kind: "advantage"
      },
      {
        method: "Online surveys",
        statement: "People may rush their answers or not take the questions seriously.",
        kind: "disadvantage"
      },
      {
        method: "Books and journals",
        statement: "Often written by experts and peer-reviewed, so the information can be reliable.",
        kind: "advantage"
      },
      {
        method: "Books and journals",
        statement: "They may go out of date and can take a long time to search through.",
        kind: "disadvantage"
      },
      {
        method: "Magazines and newspapers",
        statement: "They can give up-to-date information and examples.",
        kind: "advantage"
      },
      {
        method: "Magazines and newspapers",
        statement: "They may be biased or written to create a particular opinion.",
        kind: "disadvantage"
      }
    ]
  },
  {
    id: "quantQual",
    name: "Stage 4 – Quantitative or Qualitative?",
    intro: "Decide whether the data is quantitative (numbers) or qualitative (descriptive).",
    type: "quantQual",
    questions: [
      {
        statement: "93% of customers said they were satisfied with the new website.",
        kind: "quantitative"
      },
      {
        statement: "The average viewing time of the advert was 27.3 seconds.",
        kind: "quantitative"
      },
      {
        statement: "Many customers described the game as 'addictive and exciting'.",
        kind: "qualitative"
      },
      {
        statement: "Viewers called the new TV show 'boring and too slow'.",
        kind: "qualitative"
      },
      {
        statement: "The cinema sold 1,250 tickets in the first weekend.",
        kind: "quantitative"
      },
      {
        statement: "Players said the controls felt 'clunky and unresponsive'.",
        kind: "qualitative"
      }
    ]
  },
  {
    id: "reliability",
    name: "Stage 5 – Reliability Rumble",
    intro: "Judge how trustworthy each claim is. Think about sample size, bias and how data is collected.",
    type: "reliability",
    questions: [
      {
        statement: "80% of dentists recommend our toothpaste. The survey allowed dentists to tick as many brands as they liked.",
        rating: "questionable"
      },
      {
        statement: "A peer-reviewed journal article summarises several studies on audience behaviour.",
        rating: "reliable"
      },
      {
        statement: "One anonymous comment on a forum says the game is 'the worst ever made'.",
        rating: "unreliable"
      },
      {
        statement: "A survey of 20 people chosen from the same friendship group is used to represent the whole UK population.",
        rating: "unreliable"
      },
      {
        statement: "A national statistics office publishes data collected using clear methods and a very large sample.",
        rating: "reliable"
      },
      {
        statement: "An advert claims 'everyone loves this product' but gives no source for the claim.",
        rating: "questionable"
      }
    ]
  },
  {
    id: "scenario",
    name: "Stage 6 – Scenario Simulator",
    intro: "Choose the most suitable research method for each client brief or production scenario.",
    type: "scenario",
    questions: [
      {
        scenario: "You need detailed opinions from your exact target audience about the layout of a new magazine cover.",
        answer: "Focus group",
        options: ["Focus group", "Books and journals", "Online survey", "TV advert"]
      },
      {
        scenario: "You want quick responses from a large number of people about which social media platform they use most.",
        answer: "Online survey",
        options: ["Online survey", "Interview", "Magazine article", "Original photograph"]
      },
      {
        scenario: "You are writing a documentary script and need expert, reliable background information.",
        answer: "Books and journals",
        options: ["Books and journals", "Vox Pop", "Poll", "TV advert"]
      },
      {
        scenario: "You want real-time reactions from members of the public for a news report.",
        answer: "Vox Pop",
        options: ["Vox Pop", "Focus group", "Online survey", "Newspaper article"]
      },
      {
        scenario: "You are creating a poster and need original images that belong to your company.",
        answer: "Original photographs",
        options: ["Original photographs", "Magazine article", "Books and journals", "Poll"]
      },
      {
        scenario: "You want to quickly find recent reviews and opinions about a new games console.",
        answer: "Internet sites",
        options: ["Internet sites", "Books and journals", "TV documentary", "Questionnaire by post"]
      }
    ]
  },
  {
    id: "eightMark",
    name: "Stage 7 – 8-Mark Builder Practice",
    intro: "Pick the strongest answer a student could use in an 8-mark question about research methods.",
    type: "eightMark",
    questions: [
      {
        question: "Which of these sentences would be the best way to start an 8-mark answer comparing focus groups and online surveys?",
        answer: 1,
        options: [
          "Focus groups and online surveys are things you can use for research.",
          "Both focus groups and online surveys are primary research methods used to gather opinions from a target audience, but they collect data in different ways.",
          "Surveys are done online and focus groups are people in a room.",
          "There are lots of methods like interviews and surveys which are used in media."
        ]
      },
      {
        question: "Which point would gain the most marks in an 8-mark answer about books and journals as secondary research?",
        answer: 2,
        options: [
          "Books can be heavy to carry so they are annoying to use.",
          "Books and academic journals are written by experts, and peer-reviewed journals are checked by other specialists, which increases the reliability of the information.",
          "Some people do not like reading so books are not always useful.",
          "Journals can be found online which is good."
        ]
      },
      {
        question: "Which concluding sentence best shows analysis in an 8-mark question about using online surveys?",
        answer: 0,
        options: [
          "Overall, online surveys are effective when the questions are well designed and the sample is large, but they can be less useful if people rush their answers or the sample is biased.",
          "Online surveys are good and bad in different ways.",
          "Surveys can be used to ask people questions online which is useful.",
          "It is important to think about advantages and disadvantages."
        ]
      }
    ]
  }
];
