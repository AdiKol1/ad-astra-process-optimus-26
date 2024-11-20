export const processDetailsQuestions = {
  title: "Process Details",
  questions: [
    {
      id: "employees",
      type: "number",
      label: "Number of employees involved in manual processes",
      required: true,
      min: 1,
      tooltip: "Include all staff who handle paperwork or manual data entry"
    },
    {
      id: "processVolume",
      type: "multiSelect",
      label: "What is your monthly transaction/document volume?",
      options: [
        "Less than 1,000 items",
        "1,000-5,000 items",
        "5,000-10,000 items",
        "10,000-50,000 items",
        "More than 50,000 items",
        "Varies by process"
      ],
      required: true,
      description: "Select all that apply across your different processes"
    }
  ]
};