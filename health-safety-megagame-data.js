// Health & Safety Gauntlet – Stage & Question Data
// Covers: hazards, risk levels, control measures, location & equipment safety, paperwork and 8‑mark style answers.

window.HEALTH_SAFETY_STAGES = [
  {
    id: "identifyHazard",
    name: "Stage 1 – Spot the Hazard",
    intro: "Read each situation and pick the main health and safety hazard.",
    type: "hazardIdentify",
    questions: [
      {
        scenario: "Loose camera and power cables are running across the middle of a classroom floor during filming.",
        answer: "Trip hazard from trailing cables",
        options: [
          "Trip hazard from trailing cables",
          "Noise hazard",
          "Electrical fire from lighting rig",
          "Radiation from screens"
        ]
      },
      {
        scenario: "A student is working at a computer all day using a chair that is too low with no back support.",
        answer: "Poor posture / RSI / back strain",
        options: [
          "Poor posture / RSI / back strain",
          "Trip hazard",
          "Weather hazard",
          "Drowning risk"
        ]
      },
      {
        scenario: "You are filming outside on a very bright sunny day and the actors are having to stare towards the sun.",
        answer: "Glare and eye strain from bright sunlight",
        options: [
          "Glare and eye strain from bright sunlight",
          "Noise from the road",
          "Fire hazard",
          "Manual handling"
        ]
      },
      {
        scenario: "A student climbs on a chair to fix a light above head height rather than using proper equipment.",
        answer: "Working at height / falling hazard",
        options: [
          "Working at height / falling hazard",
          "Noise hazard",
          "Radiation hazard",
          "Weather hazard"
        ]
      },
      {
        scenario: "The production team have placed drinks next to computers and extension leads.",
        answer: "Electrical hazard from liquids near equipment",
        options: [
          "Electrical hazard from liquids near equipment",
          "Sun glare",
          "Manual handling",
          "Trip hazard only"
        ]
      },
      {
        scenario: "Heavy camera bags are being carried up several flights of stairs by one person.",
        answer: "Manual handling / lifting injury",
        options: [
          "Manual handling / lifting injury",
          "Glare hazard",
          "Noise hazard",
          "Fire hazard"
        ]
      }
    ]
  },
  {
    id: "controlMeasures",
    name: "Stage 2 – Choose the Control Measure",
    intro: "Pick the best control measure to reduce the risk in each situation.",
    type: "controlMeasure",
    questions: [
      {
        scenario: "Trip hazard from trailing camera cables across a corridor.",
        answer: "Use cable covers or tape cables down and route them away from walkways.",
        options: [
          "Use cable covers or tape cables down and route them away from walkways.",
          "Tell people to walk more carefully.",
          "Turn the lights off so nobody sees the cables.",
          "Ask everyone to jump over the cables."
        ]
      },
      {
        scenario: "Back strain from using a poorly adjusted chair at a computer for long periods.",
        answer: "Adjust chair and screen height, use correct posture and schedule regular breaks.",
        options: [
          "Adjust chair and screen height, use correct posture and schedule regular breaks.",
          "Stand up all day instead of sitting.",
          "Turn the monitor off every hour.",
          "Lower the resolution of the monitor."
        ]
      },
      {
        scenario: "Filming outdoors on uneven, muddy ground with heavy tripods.",
        answer: "Wear suitable footwear, check the ground during a recce and only set up equipment on stable surfaces.",
        options: [
          "Wear suitable footwear, check the ground during a recce and only set up equipment on stable surfaces.",
          "Carry more equipment to balance your weight.",
          "Ignore the mud and film quickly.",
          "Ask the actors to level the ground themselves."
        ]
      },
      {
        scenario: "Risk of electric shock from damaged power cables on lights.",
        answer: "Test equipment before use, replace damaged cables and keep liquids away from sockets.",
        options: [
          "Test equipment before use, replace damaged cables and keep liquids away from sockets.",
          "Wrap damaged cables in paper to hide them.",
          "Put the cables under a rug.",
          "Ask students not to touch the lights."
        ]
      },
      {
        scenario: "Risk of members of the public walking into a filming area in a busy park.",
        answer: "Use signage, barriers or cones and have a crew member act as a marshal.",
        options: [
          "Use signage, barriers or cones and have a crew member act as a marshal.",
          "Shout at people if they walk into shot.",
          "Film only at lunchtime when it is busy.",
          "Ask the actors to block the path."
        ]
      }
    ]
  },
  {
    id: "riskLevel",
    name: "Stage 3 – Risk Level: Low, Medium or High?",
    intro: "Decide how risky each situation is after control measures have been considered.",
    type: "riskLevel",
    questions: [
      {
        scenario: "Students work at computers for one lesson (one hour) with adjustable chairs and regular breaks.",
        answer: "Low",
        options: ["Low", "Medium", "High"]
      },
      {
        scenario: "A student carries a heavy camera bag up several flights of stairs alone with no breaks.",
        answer: "High",
        options: ["Low", "Medium", "High"]
      },
      {
        scenario: "Filming a short scene in a quiet corridor with cables taped down and warning signs displayed.",
        answer: "Low",
        options: ["Low", "Medium", "High"]
      },
      {
        scenario: "Shooting on a roadside pavement with no barriers and cars passing close by.",
        answer: "High",
        options: ["Low", "Medium", "High"]
      },
      {
        scenario: "Recording sound in a park on a dry day, away from water but with members of the public nearby.",
        answer: "Medium",
        options: ["Low", "Medium", "High"]
      }
    ]
  },
  {
    id: "locationSafety",
    name: "Stage 4 – On Location",
    intro: "Pick the safest plan for each filming location scenario.",
    type: "locationSafety",
    questions: [
      {
        scenario: "You want to film in a busy shopping centre interior for a college advert.",
        answer: "Contact the centre management and get written permission and rules before filming.",
        options: [
          "Contact the centre management and get written permission and rules before filming.",
          "Turn up with cameras and film quickly without asking.",
          "Hide the camera in a bag so security cannot see it.",
          "Ask one shop if it is okay and assume that covers the whole centre."
        ]
      },
      {
        scenario: "The script includes a scene next to a canal path with water close by.",
        answer: "Carry out a recce, keep actors away from the edge, supervise students and avoid bad weather.",
        options: [
          "Carry out a recce, keep actors away from the edge, supervise students and avoid bad weather.",
          "Let actors improvise near the edge to make it look realistic.",
          "Ask actors who can swim to stand nearest the water.",
          "Film at night so fewer people are around."
        ]
      },
      {
        scenario: "You are filming on a public pavement next to a road.",
        answer: "Use hi‑vis vests, stay well back from the curb and assign a spotter to watch for traffic.",
        options: [
          "Use hi‑vis vests, stay well back from the curb and assign a spotter to watch for traffic.",
          "Stand in the road for a better angle.",
          "Ask drivers to slow down by waving at them.",
          "Film only when it is raining so fewer people are outside."
        ]
      },
      {
        scenario: "A scene requires filming in a classroom after school with only one student and one member of staff.",
        answer: "Follow the school’s lone‑working policy and ensure staff are never left alone with a single student without procedures.",
        options: [
          "Follow the school’s lone‑working policy and ensure staff are never left alone with a single student without procedures.",
          "Ignore the policy because it is after school.",
          "Ask the student to work alone and send the teacher away.",
          "Lock the classroom door and film the scene in secret."
        ]
      }
    ]
  },
  {
    id: "equipmentSafety",
    name: "Stage 5 – Equipment & Workstation Safety",
    intro: "Match each situation to the safest way to use equipment or set up a workstation.",
    type: "equipmentSafety",
    questions: [
      {
        scenario: "Setting up a tall lighting stand for an interview.",
        answer: "Spread the tripod legs fully, add sandbags if needed and keep cables tidy and away from walkways.",
        options: [
          "Spread the tripod legs fully, add sandbags if needed and keep cables tidy and away from walkways.",
          "Extend the stand as high as possible with legs close together to save space.",
          "Balance the light on a chair to make it taller.",
          "Ask an actor to hold the light during the whole shoot."
        ]
      },
      {
        scenario: "Working at a computer for several lessons while editing a film.",
        answer: "Adjust chair and monitor, keep wrists straight when using mouse/keyboard and take regular breaks.",
        options: [
          "Adjust chair and monitor, keep wrists straight when using mouse/keyboard and take regular breaks.",
          "Lean forward towards the screen so you can see better.",
          "Rest wrists on the sharp edge of the desk.",
          "Turn the brightness to maximum and work without breaks."
        ]
      },
      {
        scenario: "Transporting expensive cameras and tripods between locations.",
        answer: "Use proper camera bags, lift with bent knees and share heavy loads between team members.",
        options: [
          "Use proper camera bags, lift with bent knees and share heavy loads between team members.",
          "Carry as much equipment as possible in one go to save time.",
          "Drag tripods along the floor behind you.",
          "Stack everything on top of one open box."
        ]
      },
      {
        scenario: "Recording audio using a long microphone cable across a classroom.",
        answer: "Route the cable around the edge of the room or tape it down securely along the floor.",
        options: [
          "Route the cable around the edge of the room or tape it down securely along the floor.",
          "Stretch the cable tightly across the middle of the room so it is off the ground.",
          "Let the cable coil in a pile near the actor’s feet.",
          "Ask students not to move while recording."
        ]
      }
    ]
  },
  {
    id: "paperworkStage",
    name: "Stage 6 – Paperwork & Permissions",
    intro: "Choose which document or permission is needed for each situation.",
    type: "paperwork",
    questions: [
      {
        scenario: "You want to check a new location for hazards before filming.",
        answer: "Location recce form",
        options: [
          "Location recce form",
          "Call sheet",
          "Storyboard",
          "Music cue sheet"
        ]
      },
      {
        scenario: "You need to record hazards, who might be harmed and control measures for a shoot.",
        answer: "Risk assessment",
        options: [
          "Risk assessment",
          "Storyboard",
          "Shot list",
          "Editing log"
        ]
      },
      {
        scenario: "You are filming in a café and want permission from the owner to use the location in your video.",
        answer: "Location permission / consent form",
        options: [
          "Location permission / consent form",
          "Recce form only",
          "Call sheet",
          "Talent release for the crew"
        ]
      },
      {
        scenario: "You need to show who must be on set, at what time and with what equipment.",
        answer: "Call sheet / production schedule",
        options: [
          "Call sheet / production schedule",
          "Risk assessment",
          "Mind map",
          "Copyright notice"
        ]
      },
      {
        scenario: "You are using a copyrighted music track and want to prove you have permission.",
        answer: "Licence agreement / evidence of permission from the copyright holder",
        options: [
          "Licence agreement / evidence of permission from the copyright holder",
          "Risk assessment",
          "Location recce form",
          "Casting list"
        ]
      }
    ]
  },
  {
    id: "eightMarkHAndS",
    name: "Stage 7 – 8‑Mark Builder: Health & Safety",
    intro: "Pick the sentence that would gain the most marks in an 8‑mark exam answer about health and safety in pre‑production.",
    type: "eightMark",
    questions: [
      {
        question: "Which opening sentence would gain the most marks when explaining why risk assessments are important when planning a media product?",
        answer: 1,
        options: [
          "Risk assessments are pieces of paper that you have to fill in before you film.",
          "Risk assessments identify potential hazards, who could be harmed and how serious the harm could be, so that control measures can be put in place before production, reducing accidents and helping the producer meet legal responsibilities.",
          "Risk assessments are useful because teachers like to see them.",
          "Risk assessments are just a list of equipment you plan to use."
        ]
      },
      {
        question: "Which sentence best explains why getting permission to film on location is important?",
        answer: 2,
        options: [
          "If you ask for permission you are being polite to the owner.",
          "Permission is only needed if the owner is watching the filming.",
          "Securing written permission from a location owner shows that they agree to the filming, which reduces the risk of being asked to stop mid‑shoot and proves that the producer has considered legal and safety responsibilities for people on the site.",
          "Permission is not important because you can always film quickly and leave."
        ]
      },
      {
        question: "Which concluding sentence would best finish an 8‑mark answer discussing health and safety when filming on location?",
        answer: 0,
        options: [
          "Overall, completing recce forms, detailed risk assessments and gaining permissions before filming means hazards are identified early, control measures such as barriers or supervision can be planned and the cast and crew can work safely while still achieving the client’s requirements.",
          "In conclusion, filming on location is fun but you should try not to have accidents.",
          "Health and safety is important because people do not like getting injured.",
          "To sum up, paperwork is done before filming and then you can focus on getting good shots."
        ]
      }
    ]
  }
];
