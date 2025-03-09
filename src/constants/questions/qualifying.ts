import { QuestionSection } from '@/types/questions';
import type { BaseQuestion } from '@/types/assessment/core';

export const qualifyingQuestions: QuestionSection = {
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
        { label: "Business Owner/CEO", value: "Business Owner/CEO" },
        { label: "Operations Manager", value: "Operations Manager" },
        { label: "Department Head", value: "Department Head" },
        { label: "Process Manager", value: "Process Manager" },
        { label: "Team Lead", value: "Team Lead" },
        { label: "Other", value: "Other" }
      ],
      required: true
    },
    {
      id: "painPoints",
      type: "multiselect" as BaseQuestion['type'],
      label: "What challenges are impacting your business the most?",
      description: "Select all that apply to understand potential impact areas",
      options: [
        { label: "High operational costs", value: "High operational costs" },
        { label: "Too much manual work", value: "Too much manual work" },
        { label: "Frequent errors or quality issues", value: "Frequent errors or quality issues" },
        { label: "Slow process completion times", value: "Slow process completion times" },
        { label: "Limited visibility into operations", value: "Limited visibility into operations" },
        { label: "Staff overwhelmed with work", value: "Staff overwhelmed with work" },
        { label: "Customer satisfaction issues", value: "Customer satisfaction issues" }
      ],
      required: true
    },
    {
      id: "urgency",
      type: "select" as BaseQuestion['type'],
      label: "How urgent is addressing these challenges?",
      description: "This helps us understand your timeline needs",
      options: [
        { label: "Critical - Needs immediate attention", value: "Critical - Needs immediate attention" },
        { label: "Important - Planning to address within 3 months", value: "Important - Planning to address within 3 months" },
        { label: "Moderate - Looking to solve within 6 months", value: "Moderate - Looking to solve within 6 months" },
        { label: "Planning Phase - Researching options", value: "Planning Phase - Researching options" }
      ],
      required: true
    }
  ]
};
