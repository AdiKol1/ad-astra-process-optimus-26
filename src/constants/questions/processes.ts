export const processesQuestions = {
  title: "Current Processes",
  questions: [
    {
      id: "manualProcesses",
      type: "multiSelect",
      label: "Which processes are currently manual?",
      options: [
        "Data Entry",
        "Document Processing",
        "Customer Communication",
        "Reporting",
        "Invoice Processing",
        "Scheduling"
      ],
      required: true
    },
    {
      id: "timeSpent",
      type: "number",
      label: "Hours spent weekly on these processes",
      required: true,
      min: 1
    },
    {
      id: "errorRate",
      type: "multiSelect",
      label: "What error rates do you experience in your processes?",
      options: [
        "Less than 1% errors",
        "1-5% errors",
        "5-10% errors",
        "More than 10% errors",
        "Not currently tracking errors"
      ],
      required: true,
      description: "Select all that apply to your different processes"
    }
  ]
};