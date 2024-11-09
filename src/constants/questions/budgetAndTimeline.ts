export const budgetAndTimelineQuestions = {
  title: "Budget & Timeline",
  questions: [
    {
      id: "budget",
      type: "select",
      label: "Monthly budget for automation",
      options: [
        "Up to $500",
        "$501-$1,000",
        "$1,001-$5,000",
        "$5,001+"
      ],
      required: true
    },
    {
      id: "timeline",
      type: "select",
      label: "Desired implementation timeline",
      options: [
        "Within 1 month",
        "1-3 months",
        "3-6 months",
        "6+ months"
      ],
      required: true
    }
  ]
};