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
      id: "timeSpent",
      type: "multiSelect",
      label: "How many hours per week does your team spend on these manual processes?",
      description: "Select all that apply across different processes",
      options: [
        "Less than 10 hours",
        "10-20 hours",
        "20-40 hours",
        "40-60 hours",
        "More than 60 hours"
      ],
      required: true
    },
    {
      id: "errorRate",
      type: "multiSelect",
      label: "What error rates do you experience in your processes?",
      description: "Select all that apply to your different processes",
      options: [
        "Less than 1% errors",
        "1-5% errors",
        "5-10% errors",
        "More than 10% errors",
        "Not currently tracking errors"
      ],
      required: true
    }
  ]
};