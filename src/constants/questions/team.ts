export const teamQuestions = {
  title: "Team Information",
  questions: [
    {
      id: "teamSize",
      type: "multiSelect",
      label: "How many people are involved in these processes?",
      description: "Select all that apply if you have different team sizes across processes",
      options: [
        "1-5 people",
        "6-20 people",
        "21-50 people",
        "More than 50 people"
      ],
      required: true
    }
  ]
};