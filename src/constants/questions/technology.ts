export const technologyQuestions = {
  title: "Technology Assessment",
  questions: [
    {
      id: "currentSystems",
      type: "multiSelect",
      label: "What systems are you currently using?",
      options: [
        "CRM",
        "ERP",
        "Document Management",
        "Project Management",
        "Accounting Software",
        "Custom Solutions",
        "Spreadsheets",
        "Paper-based"
      ],
      required: true
    },
    {
      id: "integrationNeeds",
      type: "multiSelect",
      label: "Which systems need to be integrated?",
      options: [
        "CRM",
        "ERP",
        "Document Management",
        "Project Management",
        "Accounting Software",
        "Custom Solutions"
      ],
      required: true
    }
  ]
};