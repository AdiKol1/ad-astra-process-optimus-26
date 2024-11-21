export const marketingQuestions = {
  title: "Marketing Assessment",
  questions: [
    {
      id: "marketingChallenges",
      type: "multiSelect",
      label: "What are your top marketing challenges?",
      options: [
        "Lead generation",
        "Lead qualification",
        "Campaign automation",
        "Performance tracking",
        "Content creation",
        "Channel management",
        "Budget optimization"
      ],
      required: true
    },
    {
      id: "toolStack",
      type: "multiSelect",
      label: "Which marketing tools do you currently use?",
      options: [
        "Spreadsheets/Manual tracking",
        "Email marketing platform",
        "CRM system",
        "Social media management",
        "Marketing automation platform",
        "Analytics tools"
      ],
      required: true
    }
  ]
};