import { AssessmentStep } from '@/types/assessment/core';

export const teamQuestions: AssessmentStep = {
  id: 'team',
  title: "Team Assessment",
  description: "Help us understand your team structure and industry context.",
  questions: [
    {
      id: "industry",
      type: "select",
      text: "What industry are you in?",
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
      type: "select",
      text: "How many people are involved in your core business processes?",
      description: "This helps us understand the scale of your operations",
      options: [
        "1-5 employees",
        "6-20 employees",
        "21-50 employees",
        "51-200 employees",
        "201+ employees"
      ],
      required: true
    },
    {
      id: "role",
      type: "select",
      text: "What is your role in the organization?",
      description: "This helps us tailor our recommendations to your perspective",
      options: [
        "Executive/C-Level",
        "Director/Manager",
        "Team Lead",
        "Individual Contributor",
        "Consultant",
        "Other"
      ],
      required: true
    }
  ]
};
