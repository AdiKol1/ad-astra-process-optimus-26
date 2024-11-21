export const budgetAndTimelineQuestions = {
  title: "Implementation Timeline",
  questions: [
    {
      id: "timeline",
      type: "multiSelect",
      label: "When would you like to start implementing automation?",
      description: "Select all timeframes you're considering",
      options: [
        "Immediately (within 2 weeks)",
        "Within 1 month",
        "Within 3 months",
        "Within 6 months",
        "Still exploring options"
      ],
      required: true
    }
  ]
};