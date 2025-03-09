import { QuestionSection } from '@/types/questions';
import type { BaseQuestion } from '@/types/assessment/core';

export const teamQuestions: QuestionSection = {
  id: 'team',
  title: "Team Assessment",
  description: "Help us understand your team structure and industry context.",
  questions: [
    {
      id: "industry",
      type: "select" as BaseQuestion['type'],
      label: "What industry are you in?",
      description: "This helps us provide industry-specific insights and recommendations",
      options: [
        { label: "Real Estate", value: "Real Estate" },
        { label: "Healthcare", value: "Healthcare" },
        { label: "Financial Services", value: "Financial Services" },
        { label: "Legal", value: "Legal" },
        { label: "Construction", value: "Construction" },
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Retail", value: "Retail" },
        { label: "Technology", value: "Technology" },
        { label: "Professional Services", value: "Professional Services" },
        { label: "Other", value: "Other" }
      ],
      required: true
    },
    {
      id: "teamSize",
      type: "select" as BaseQuestion['type'],
      label: "How many people are involved in your core business processes?",
      description: "This helps us understand the scale of your operations",
      options: [
        { label: "1-5 employees", value: "1-5 employees" },
        { label: "6-20 employees", value: "6-20 employees" },
        { label: "21-50 employees", value: "21-50 employees" },
        { label: "51-200 employees", value: "51-200 employees" },
        { label: "201+ employees", value: "201+ employees" }
      ],
      required: true
    },
    {
      id: "role",
      type: "select" as BaseQuestion['type'],
      label: "What is your role in the organization?",
      description: "This helps us tailor our recommendations to your perspective",
      options: [
        { label: "Executive/C-Level", value: "Executive/C-Level" },
        { label: "Director/Manager", value: "Director/Manager" },
        { label: "Team Lead", value: "Team Lead" },
        { label: "Individual Contributor", value: "Individual Contributor" },
        { label: "Consultant", value: "Consultant" },
        { label: "Other", value: "Other" }
      ],
      required: true
    }
  ]
};
