import { CoreQuestionSection, BaseQuestion } from '@/types/assessment/questions';

export const qualifyingQuestions: CoreQuestionSection = {
  id: 'qualifying',
  title: "Process Assessment",
  description: "Let's understand your current situation and where you want to go.",
  questions: [
    {
      id: "role",
      type: "select" as BaseQuestion['type'],
      label: "What best describes your role?",
      description: "This helps us tailor recommendations to your perspective",
      options: [
        "Business Owner/CEO",
        "Operations Manager",
        "Department Head",
        "Process Manager",
        "Team Lead",
        "Other"
      ],
      required: true
    },
    {
      id: "painPoints",
      type: "multiSelect" as BaseQuestion['type'],
      label: "What challenges are impacting your business the most?",
      description: "Select all that apply to understand potential impact areas",
      options: [
        "High operational costs",
        "Too much manual work",
        "Frequent errors or quality issues",
        "Slow process completion times",
        "Limited visibility into operations",
        "Staff overwhelmed with work",
        "Customer satisfaction issues"
      ],
      required: true
    },
    {
      id: "urgency",
      type: "select" as BaseQuestion['type'],
      label: "How urgent is addressing these challenges?",
      description: "This helps us understand your timeline needs",
      options: [
        "Critical - Needs immediate attention",
        "Important - Planning to address within 3 months",
        "Moderate - Looking to solve within 6 months",
        "Planning Phase - Researching options"
      ],
      required: true
    }
  ]
};
