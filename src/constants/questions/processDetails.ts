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
      type: "select",
      label: "Monthly transaction/document volume",
      options: [
        "Less than 100",
        "100-500",
        "501-1000",
        "1001-5000",
        "More than 5000"
      ],
      required: true
    }
  ]
};