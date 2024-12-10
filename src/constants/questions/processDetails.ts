export const processesQuestions = {
  title: "Current Processes",
  questions: [
    {
      id: "manualProcesses",
      type: "multiSelect",
      label: "Which processes are currently manual?",
      description: "Select all processes that are currently done manually",
      options: [
        "Data Entry",
        "Document Processing",
        "Customer Communication",
        "Reporting",
        "Invoice Processing",
        "Scheduling",
        "Approval Workflows",
        "Other"
      ],
      required: true
    },
    {
      id: "processVolume",
      type: "select",
      label: "How many documents/transactions does your team process monthly?",
      description: "This helps us calculate potential optimization impact",
      options: [
        "Less than 100",
        "100-500",
        "501-1000",
        "1001-5000",
        "More than 5000"
      ],
      required: true
    },
    {
      id: "averageHandlingTime",
      type: "select",
      label: "What is the average handling time per item?",
      description: "This helps calculate time savings potential",
      options: [
        "Less than 5 minutes",
        "5-15 minutes",
        "15-30 minutes",
        "More than 30 minutes"
      ],
      required: true
    }
  ]
};