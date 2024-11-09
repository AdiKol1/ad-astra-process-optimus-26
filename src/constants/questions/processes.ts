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
      type: "select",
      label: "Estimated error rate in current processes",
      options: ["1-2%", "3-5%", "6-10%", "More than 10%"],
      required: true
    }
  ]
};