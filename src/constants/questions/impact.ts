export const impactQuestions = {
  title: "Business Impact",
  description: "Help us understand the potential value of process optimization for your business.",
  questions: [
    {
      id: "timeWasted",
      type: "select",
      label: "How many hours per week does your team spend on manual, repetitive tasks?",
      description: "This helps calculate potential time savings",
      options: [
        "Less than 10 hours",
        "10-20 hours",
        "20-40 hours",
        "More than 40 hours"
      ],
      required: true
    },
    {
      id: "errorImpact",
      type: "select",
      label: "What is the estimated monthly cost of errors and inefficiencies?",
      description: "Consider rework, customer issues, and lost opportunities",
      options: [
        "Less than $1,000",
        "$1,000 - $5,000",
        "$5,000 - $20,000",
        "More than $20,000",
        "Not sure"
      ],
      required: true
    }
  ]
};