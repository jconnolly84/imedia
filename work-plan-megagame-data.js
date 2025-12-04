// Work Plan Detective – Stage & Question Data
// Covers: tasks, sequencing, milestones, contingencies and realistic timings.

window.WORK_PLAN_STAGES = [
  {
    id: "spotIssue",
    name: "Stage 1 – Spot the Issue",
    intro: "Read each work plan and choose the main problem. Think about order, milestones, contingency and realism.",
    type: "identifyIssue",
    questions: [
      {
        scenario: "The work plan for a short promo video has tasks in this order: Film scenes → Export final video → Plan shots → Edit footage.",
        answer: "Tasks are in the wrong order.",
        options: [
          "Tasks are in the wrong order.",
          "No contingency time has been added.",
          "Too many milestones have been used.",
          "The tasks are all pre-production tasks."
        ]
      },
      {
        scenario: "A work plan includes these tasks: Plan ideas, Write script, Film scenes, Edit footage. There are no milestones at all.",
        answer: "No milestones to check progress against the deadline.",
        options: [
          "No milestones to check progress against the deadline.",
          "Too many overlapping tasks at the same time.",
          "Tasks are not labelled clearly enough.",
          "The work plan uses the wrong file types."
        ]
      },
      {
        scenario: "A client needs a video in 2 weeks. The work plan shows 13 days of tasks and no extra time.",
        answer: "No contingency time to allow for delays or problems.",
        options: [
          "No contingency time to allow for delays or problems.",
          "Too many milestones have been added.",
          "The project finishes too early before the deadline.",
          "The work plan is completely unrelated to the client brief."
        ]
      }
    ]
  },
  {
    id: "fixSequence",
    name: "Stage 2 – Fix the Sequence",
    intro: "Choose the option that puts tasks into the most logical order for a media work plan.",
    type: "reorder",
    questions: [
      {
        scenario: "Which order is the most suitable for creating a magazine advert?",
        answer: "Confirm brief → Research → Sketch ideas → Create digital advert → Get client feedback.",
        options: [
          "Confirm brief → Research → Sketch ideas → Create digital advert → Get client feedback.",
          "Sketch ideas → Create digital advert → Research → Get client feedback → Confirm brief.",
          "Create digital advert → Confirm brief → Get client feedback → Research → Sketch ideas.",
          "Research → Get client feedback → Confirm brief → Sketch ideas → Create digital advert."
        ]
      },
      {
        scenario: "Which order is the most suitable for planning and filming a short documentary?",
        answer: "Confirm brief → Create work plan → Write script → Film footage → Edit footage.",
        options: [
          "Confirm brief → Create work plan → Write script → Film footage → Edit footage.",
          "Write script → Edit footage → Create work plan → Film footage → Confirm brief.",
          "Film footage → Confirm brief → Edit footage → Write script → Create work plan.",
          "Create work plan → Confirm brief → Film footage → Write script → Edit footage."
        ]
      }
    ]
  },
  {
    id: "timeAndContingency",
    name: "Stage 3 – Time & Contingency",
    intro: "Decide which work plan best uses realistic durations and contingency time.",
    type: "timings",
    questions: [
      {
        scenario: "A project has a 4‑week deadline. Which option shows the best use of contingency time?",
        answer: "Plan 3 weeks of tasks and leave 1 week as contingency.",
        options: [
          "Plan 3 weeks of tasks and leave 1 week as contingency.",
          "Plan 4 weeks of tasks with no contingency.",
          "Plan 2 weeks of tasks and ignore the final 2 weeks.",
          "Use the whole 4 weeks as contingency time."
        ]
      },
      {
        scenario: "Which work plan shows realistic timing for a complex animation project?",
        answer: "Allow more time for production and editing, plus a small amount of contingency.",
        options: [
          "Allow more time for production and editing, plus a small amount of contingency.",
          "Use all the time on planning and only one day for production.",
          "Spend equal time on every task without thinking about difficulty.",
          "Leave most of the time as contingency and rush all tasks at the end."
        ]
      }
    ]
  }
];
