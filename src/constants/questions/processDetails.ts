export const processDetailsQuestions = {
  title: "Process Details",
  questions: [
    {
      id: "processVolume",
      type: "multiSelect",
      label: "What is your monthly transaction/document volume?",
      description: "Select all volumes that apply across your different processes",
      options: [
        "Less than 1,000 items",
        "1,000-5,000 items",
        "5,000-10,000 items",
        "10,000-50,000 items",
        "50,000-100,000 items",
        "More than 100,000 items",
        "Varies significantly by process"
      ],
      required: true
    }
  ]
};