export const teamQuestions = {
  title: "Team Assessment",
  description: "Help us understand your team structure and industry context.",
  questions: [
    {
      id: "industry",
      label: "What industry are you in?",
      type: "select",
      description: "This helps us provide industry-specific insights and recommendations",
      options: [
        "Real Estate",
        "Healthcare",
        "Financial Services",
        "Legal",
        "Construction",
        "Manufacturing",
        "Retail",
        "Technology",
        "Professional Services",
        "Other"
      ],
      required: true
    },
    {
      id: "teamSize",
      label: "How many people are involved in your core business processes?",
      type: "multiSelect",
      description: "Select all that apply to understand your team composition",
      options: [
        "1-5 employees",
        "6-20 employees",
        "21-50 employees",
        "51-200 employees",
        "201+ employees"
      ],
      required: true
    }
  ]
};