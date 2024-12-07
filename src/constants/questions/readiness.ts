export const readinessQuestions = {
  title: "Implementation Readiness",
  description: "Let's understand your capacity for process improvement.",
  questions: [
    {
      id: "decisionMaking",
      type: "select",
      label: "What is your role in the decision-making process?",
      description: "This helps us provide relevant next steps",
      options: [
        "Final decision maker",
        "Key influencer",
        "Part of decision-making team",
        "Researching options",
        "Other"
      ],
      required: true
    },
    {
      id: "budget",
      type: "select",
      label: "What is your expected monthly budget for process improvement?",
      description: "This helps us recommend suitable solutions",
      options: [
        "Under $1,000",
        "$1,000 - $5,000",
        "$5,000 - $10,000",
        "Above $10,000",
        "Still determining"
      ],
      required: true
    },
    {
      id: "timeline",
      type: "select",
      label: "When would you like to start implementing improvements?",
      description: "This helps us align with your timeline",
      options: [
        "Immediately",
        "Within 1 month",
        "Within 3 months",
        "Still exploring options"
      ],
      required: true
    }
  ]
};