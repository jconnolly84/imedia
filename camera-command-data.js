// Camera Command – question bank for shots, angles & movement
// Image placeholders are named for future artwork and stored in /img.

window.CAMERA_QUESTIONS = [
  {
    id: "long_shot_isolation",
    title: "Character alone on the pier",
    track: "Shot Types",
    focus: "Long shot & isolation",
    image: "img/camera-long-shot-pier.png",
    question: "What is the main reason a long shot is effective in this scene?",
    answers: [
      {
        text: "It shows the character small in the frame with lots of empty space, emphasising isolation.",
        correct: true,
        feedback: "A long shot keeps distance between the camera and subject, using space around them to show loneliness or scale."
      },
      {
        text: "It allows us to see every tiny detail of the character's facial expression.",
        correct: false,
        feedback: "That would be better achieved with a close up or extreme close up."
      },
      {
        text: "It makes the audience feel like they are sitting next to the character having a conversation.",
        correct: false,
        feedback: "Mid shots are more commonly used for dialogue and interaction."
      },
      {
        text: "It makes the camera movement look more dramatic and fast.",
        correct: false,
        feedback: "Movement can be dramatic in any shot type – the key feature here is the distance and space."
      }
    ],
    explanation: "Long shots are ideal for showing the environment and using space around the character to communicate emotions like isolation."
  },
  {
    id: "mid_shot_dialogue",
    title: "Two friends talking in a café",
    track: "Shot Types",
    focus: "Mid shot & body language",
    image: "img/camera-mid-shot-cafe.png",
    question: "Why is a mid shot often chosen for dialogue scenes like this one?",
    answers: [
      {
        text: "It shows the characters from roughly the waist up so we can see both facial expressions and body language.",
        correct: true,
        feedback: "Mid shots balance character detail with enough background to understand the setting."
      },
      {
        text: "It hides the background completely so the audience focuses only on the café logo.",
        correct: false,
        feedback: "A mid shot still shows part of the background – it doesn’t remove it."
      },
      {
        text: "It makes the characters look tiny so the café appears huge.",
        correct: false,
        feedback: "That would be closer to a long shot with the camera further away."
      },
      {
        text: "It is only used when a green screen is needed.",
        correct: false,
        feedback: "Shot choice is about storytelling, not whether a green screen is used."
      }
    ],
    explanation: "Mid shots are very common as they allow dialogue, facial expressions and gestures to be seen clearly."
  },
  {
    id: "close_up_emotion",
    title: "Tearful reaction",
    track: "Shot Types",
    focus: "Close up & emotion",
    image: "img/camera-close-up-tear.png",
    question: "How does using a close up here help the audience understand the character?",
    answers: [
      {
        text: "It fills the frame with the character's face so we can clearly see the tear and emotion.",
        correct: true,
        feedback: "Close ups are powerful for reading tiny changes in expression and highlighting key details."
      },
      {
        text: "It makes the background the most important part of the frame.",
        correct: false,
        feedback: "The opposite is true – backgrounds are reduced so we focus on the face."
      },
      {
        text: "It allows the editor to crop the shot easily for social media.",
        correct: false,
        feedback: "Cropping isn’t the main storytelling reason for a close up."
      },
      {
        text: "It shows where the scene is set in a lot of detail.",
        correct: false,
        feedback: "That is the job of an establishing or long shot."
      }
    ],
    explanation: "Close ups direct attention to emotions or important props, strengthening audience connection with the character."
  },
  {
    id: "low_angle_power",
    title: "Villain towering over the camera",
    track: "Camera Angles",
    focus: "Low angle & power",
    image: "img/camera-low-angle-villain.png",
    question: "What does the low angle in this shot communicate about the villain?",
    answers: [
      {
        text: "It makes them appear larger and more powerful, as if they dominate the viewer.",
        correct: true,
        feedback: "Looking up at a character can create a sense of strength, threat or authority."
      },
      {
        text: "It makes them look smaller, weaker and more vulnerable.",
        correct: false,
        feedback: "That effect is usually achieved with a high angle looking down."
      },
      {
        text: "It is mainly used so the ceiling lights are clearly visible.",
        correct: false,
        feedback: "Lighting may be seen, but the key purpose is the sense of power."
      },
      {
        text: "It makes the scene look like CCTV footage.",
        correct: false,
        feedback: "CCTV shots are more often high angles placed above the action."
      }
    ],
    explanation: "Low angles are a classic way to increase a character’s status, often used for villains and heroes."
  },
  {
    id: "high_angle_vulnerable",
    title: "Student alone in the playground",
    track: "Camera Angles",
    focus: "High angle & vulnerability",
    image: "img/camera-high-angle-playground.png",
    question: "Why is a high angle effective for this playground scene?",
    answers: [
      {
        text: "It looks down on the student, making them appear smaller and more vulnerable.",
        correct: true,
        feedback: "High angles can reduce status and make characters seem weak or in danger."
      },
      {
        text: "It makes the student look more powerful than the teacher.",
        correct: false,
        feedback: "Power is usually increased with low angles, not high ones."
      },
      {
        text: "It removes the background completely so only the sky is visible.",
        correct: false,
        feedback: "The background is still present – we see more of the ground and surroundings."
      },
      {
        text: "It shows exactly what the student can see at eye level.",
        correct: false,
        feedback: "That would be achieved with a neutral eye-level shot."
      }
    ],
    explanation: "High angles are often chosen to show weakness, danger or surveillance – like a bully looking down or a CCTV camera."
  },
  {
    id: "ots_conversation",
    title: "Over-the-shoulder conversation",
    track: "Camera Angles",
    focus: "Over the shoulder (OTS)",
    image: "img/camera-ots-conversation.png",
    question: "What is the main storytelling benefit of an over-the-shoulder shot in dialogue?",
    answers: [
      {
        text: "It lets the audience feel as if they are standing with one character, looking at the other during the conversation.",
        correct: true,
        feedback: "OTS shots place the viewer inside the conversation, reinforcing relationships."
      },
      {
        text: "It hides both characters completely so the background is the focus.",
        correct: false,
        feedback: "We still see one character’s shoulder and the other’s face."
      },
      {
        text: "It is only used for action scenes with explosions.",
        correct: false,
        feedback: "OTS shots are common in many genres whenever two people interact."
      },
      {
        text: "It prevents the need for any shot/reverse-shot editing.",
        correct: false,
        feedback: "OTS is often used as part of a shot/reverse-shot sequence, not instead of it."
      }
    ],
    explanation: "Over-the-shoulder framing keeps us connected to both characters and mimics a real conversational viewpoint."
  },
  {
    id: "aerial_establishing",
    title: "Drone shot over a city at night",
    track: "Camera Angles",
    focus: "Aerial establishing shot",
    image: "img/camera-aerial-city.png",
    question: "How is an aerial shot like this typically used in a film or TV drama?",
    answers: [
      {
        text: "As an establishing shot to show the geography of the city before cutting to closer action.",
        correct: true,
        feedback: "Aerial shots are perfect for location and scale, often used in openings and transitions."
      },
      {
        text: "To hide where the story is set so the audience is confused.",
        correct: false,
        feedback: "The goal is usually clarity, not confusion."
      },
      {
        text: "Only as a replacement for close ups when actors are unavailable.",
        correct: false,
        feedback: "Aerials have a different purpose than character-driven close ups."
      },
      {
        text: "To make the camera movement look unprofessional and shaky.",
        correct: false,
        feedback: "Modern drone work aims to be smooth and cinematic."
      }
    ],
    explanation: "Aerial shots are often used at the start of scenes or episodes to orient the audience and impress with scale."
  },
  {
    id: "pan_follow",
    title: "Panning to follow a runner",
    track: "Camera Movement",
    focus: "Pan (tripod movement)",
    image: "img/camera-pan-runner.png",
    question: "What describes a pan in this running scene?",
    answers: [
      {
        text: "The camera stays in one place on the tripod and turns left or right to follow the runner.",
        correct: true,
        feedback: "Panning rotates the camera horizontally without physically moving its position."
      },
      {
        text: "The camera operator runs alongside the runner with a handheld camera.",
        correct: false,
        feedback: "That would be a handheld tracking shot, not a pan."
      },
      {
        text: "The camera tilts up and down to follow the runner’s head.",
        correct: false,
        feedback: "Tilting moves the camera vertically, not side to side."
      },
      {
        text: "The camera zooms in and out but never moves or turns.",
        correct: false,
        feedback: "Zooming changes focal length; panning turns the camera."
      }
    ],
    explanation: "Pans are commonly used to smoothly follow sideways action or reveal more of a scene."
  },
  {
    id: "tilt_reveal",
    title: "Tilting up a skyscraper",
    track: "Camera Movement",
    focus: "Tilt (tripod movement)",
    image: "img/camera-tilt-skyscraper.png",
    question: "How does a tilt shot help in this skyscraper scene?",
    answers: [
      {
        text: "It moves the camera up from the base to the top of the building, revealing its height.",
        correct: true,
        feedback: "Tilting vertically lets the audience appreciate scale and vertical movement."
      },
      {
        text: "It circles all the way around the building in a full 360 degrees.",
        correct: false,
        feedback: "That would require the whole camera position to move, not just tilt."
      },
      {
        text: "It keeps the building completely still while only the background moves.",
        correct: false,
        feedback: "Camera movement changes what part of the subject we see, not just the background."
      },
      {
        text: "It zooms in on the building without any camera movement.",
        correct: false,
        feedback: "Zoom is different – the lens changes focal length."
      }
    ],
    explanation: "Tilts can reveal tall objects or follow characters moving vertically, like looking up a tower."
  },
  {
    id: "tracking_corridor",
    title: "Tracking down a school corridor",
    track: "Camera Movement",
    focus: "Tracking / dolly shot",
    image: "img/camera-track-corridor.png",
    question: "What makes this a tracking (or dolly) shot rather than just a pan?",
    answers: [
      {
        text: "The whole camera physically moves along the corridor, keeping pace with the character.",
        correct: true,
        feedback: "Tracking moves the camera position through space, often on rails or a stabiliser."
      },
      {
        text: "The camera stays still and just turns left and right on the tripod.",
        correct: false,
        feedback: "That would be panning."
      },
      {
        text: "Only the lens moves while the camera body stays fixed.",
        correct: false,
        feedback: "That describes zooming, not tracking."
      },
      {
        text: "The editor adds motion blur in post-production.",
        correct: false,
        feedback: "Motion blur can be added later but doesn’t define tracking itself."
      }
    ],
    explanation: "Tracking is ideal for following characters or moving through locations so the audience feels like they are travelling too."
  },
  {
    id: "zoom_vs_track",
    title: "Zoom or move the camera?",
    track: "Camera Movement",
    focus: "Zoom vs tracking",
    image: "img/camera-zoom-vs-track.png",
    question: "A director wants the audience to feel like they are walking towards a door. Which technique is best?",
    answers: [
      {
        text: "Physically tracking the camera towards the door on a dolly or stabiliser.",
        correct: true,
        feedback: "Tracking changes perspective and feels like real movement through space."
      },
      {
        text: "Zooming in from the same position with the camera on a tripod.",
        correct: false,
        feedback: "Zooming magnifies the image but doesn’t feel like the camera is travelling."
      },
      {
        text: "Tilting the camera up and down quickly.",
        correct: false,
        feedback: "Tilting changes vertical framing, not distance."
      },
      {
        text: "Switching to an aerial drone shot from above.",
        correct: false,
        feedback: "That would radically change the viewpoint rather than moving through the corridor."
      }
    ],
    explanation: "Zoom and tracking feel very different to audiences – tracking is more immersive for moving through environments."
  },
  {
    id: "lighting_high_key",
    title: "Bright studio interview",
    track: "Lighting & Meaning",
    focus: "High key lighting",
    image: "img/camera-high-key-interview.png",
    question: "What does the high key lighting in this studio interview suggest?",
    answers: [
      {
        text: "The scene is open, friendly and low in tension, with few deep shadows.",
        correct: true,
        feedback: "High key lighting uses bright, even light for a positive or neutral mood."
      },
      {
        text: "The scene is dark and mysterious with strong contrast and heavy shadows.",
        correct: false,
        feedback: "That describes low key lighting instead."
      },
      {
        text: "The lighting is only from a single backlight with no fill.",
        correct: false,
        feedback: "High key usually uses multiple lights to reduce contrast."
      },
      {
        text: "It is meant to look like CCTV footage.",
        correct: false,
        feedback: "CCTV can be any lighting style – this neat studio look is more professional broadcast."
      }
    ],
    explanation: "Lighting level strongly affects mood; high key suits news, daytime TV and light entertainment."
  },
  {
    id: "lighting_low_key",
    title: "Shadowy detective office",
    track: "Lighting & Meaning",
    focus: "Low key lighting",
    image: "img/camera-low-key-office.png",
    question: "Why might a crime drama use low key lighting in this detective’s office?",
    answers: [
      {
        text: "To create strong shadows and contrast, suggesting secrecy and tension.",
        correct: true,
        feedback: "Low key lighting supports mystery, danger and serious tone."
      },
      {
        text: "To make everything look bright, cheerful and safe.",
        correct: false,
        feedback: "That’s more typical of high key lighting."
      },
      {
        text: "Because low key lighting always makes the scene easier to see.",
        correct: false,
        feedback: "It can actually make some areas harder to see, which is the point."
      },
      {
        text: "To make the scene look like a daytime TV talk show.",
        correct: false,
        feedback: "Talk shows usually use high key lighting, not low key."
      }
    ],
    explanation: "Low key lighting uses limited sources and deep shadows to support genres like horror, thriller and crime."
  },
  {
    id: "purpose_establishing_shot",
    title: "Opening shot of a school exterior",
    track: "Purpose & Meaning",
    focus: "Establishing shot",
    image: "img/camera-establishing-school.png",
    question: "Why would a director start a scene with this exterior shot of the school?",
    answers: [
      {
        text: "To establish the setting so the audience instantly knows where the next scene takes place.",
        correct: true,
        feedback: "Establishing shots give location context before we cut inside."
      },
      {
        text: "To hide where the characters are so it is a surprise later.",
        correct: false,
        feedback: "The goal is clarity, not hiding the location."
      },
      {
        text: "To focus only on one character’s facial expression.",
        correct: false,
        feedback: "That would be the job of a close up."
      },
      {
        text: "To make the audience think the story is set in a completely different place.",
        correct: false,
        feedback: "That would confuse viewers rather than help them."
      }
    ],
    explanation: "Establishing shots are usually wider and are often placed at the start of scenes or sequences."
  },
  {
    id: "purpose_insert_shot",
    title: "Close up of a ticking clock",
    track: "Purpose & Meaning",
    focus: "Insert / cutaway shot",
    image: "img/camera-close-up-clock.png",
    question: "What is the main purpose of cutting to a close up of the ticking clock in an exam hall scene?",
    answers: [
      {
        text: "To remind the audience about time pressure and increase tension.",
        correct: true,
        feedback: "Insert shots can highlight key props that affect the story, like a clock or a weapon."
      },
      {
        text: "To show that the exam is very easy.",
        correct: false,
        feedback: "A ticking clock usually suggests stress rather than ease."
      },
      {
        text: "To change the location completely to another building.",
        correct: false,
        feedback: "We normally cut back to the main scene after a quick insert."
      },
      {
        text: "To introduce a new main character.",
        correct: false,
        feedback: "Props are important, but they are not characters."
      }
    ],
    explanation: "Cutaways and insert shots draw attention to objects that change the meaning or mood of the main action."
  },
  {
    id: "purpose_handheld",
    title: "Handheld chase through a crowd",
    track: "Camera Movement",
    focus: "Handheld & instability",
    image: "img/camera-handheld-chase.png",
    question: "Why might a director choose handheld camera work for this chase scene?",
    answers: [
      {
        text: "The slight wobble makes the audience feel the chaos and urgency of running.",
        correct: true,
        feedback: "Handheld movement can make scenes feel less stable and more immediate."
      },
      {
        text: "Handheld shots always look smoother than using a tripod.",
        correct: false,
        feedback: "Tripods are usually smoother – handheld is chosen for its roughness."
      },
      {
        text: "It guarantees that the picture will never shake.",
        correct: false,
        feedback: "The opposite is true – some shake is expected."
      },
      {
        text: "It is the only way to film dialogue between two characters.",
        correct: false,
        feedback: "Dialogue is often filmed on tripods or dollies."
      }
    ],
    explanation: "Controlled handheld work is a stylistic choice that can make the audience feel inside the action."
  }
];
