export const goalsQuestions = {
  title: "Future Goals",
  questions: [
    {
      id: "objectives",
      type: "multiSelect",
      label: "What are your primary objectives?",
      options: [
        "Reduce operational costs",
        "Improve customer satisfaction",
        "Increase team productivity",
        "Better data accuracy",
        "Faster processing times",
        "Enhanced reporting capabilities"
      ],
      required: true
    },
    {
      id: "expectedOutcomes",
      type: "multiSelect",
      label: "What outcomes are you expecting?",
      options: [
        "50%+ time savings",
        "90%+ error reduction",
        "Real-time process visibility",
        "Improved customer experience",
        "Better team collaboration",
        "Cost reduction"
      ],
      required: true
    }
  ]
};