export const teamQuestions = {
  title: "Team Structure",
  questions: [
    {
      id: "teamSize",
      type: "number",
      label: "Total team size",
      required: true,
      min: 1
    },
    {
      id: "departments",
      type: "multiSelect",
      label: "Which departments are involved?",
      options: [
        "Operations",
        "Finance",
        "HR",
        "Sales",
        "Customer Service",
        "IT",
        "Management"
      ],
      required: true
    }
  ]
};