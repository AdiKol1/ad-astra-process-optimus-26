export const challengesQuestions = {
  title: "Current Challenges",
  questions: [
    {
      id: "painPoints",
      type: "multiSelect",
      label: "What are your biggest operational challenges?",
      options: [
        "Too much manual data entry",
        "High error rates",
        "Slow processing times",
        "Staff spending time on repetitive tasks",
        "Difficulty tracking process status",
        "Limited real-time visibility"
      ],
      required: true
    },
    {
      id: "priority",
      type: "select",
      label: "Which area needs the most immediate improvement?",
      options: [
        "Speed up processing time",
        "Reduce errors",
        "Free up staff time",
        "Improve tracking/visibility",
        "Reduce operational costs"
      ],
      required: true
    }
  ]
};