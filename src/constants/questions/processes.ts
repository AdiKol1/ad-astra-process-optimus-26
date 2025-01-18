import { AssessmentStep } from '@/types/assessment/core';

export const processesQuestions: AssessmentStep = {
  id: 'processes',
  title: "Current Processes",
  description: "Help us understand your current manual processes",
  questions: [
    {
      id: "manualProcesses",
      type: "multiSelect",
      text: "Which processes are currently manual?",
      description: "Select all processes that are currently done manually",
      options: [
        "Data Entry",
        "Document Processing",
        "Customer Communication",
        "Reporting",
        "Invoice Processing",
        "Scheduling",
        "Approval Workflows",
        "Other"
      ],
      required: true
    },
    {
      id: "timeSpent",
      type: "multiSelect",
      text: "How many hours per week does your team spend on these manual processes?",
      description: "Select all that apply across different processes",
      options: [
        "Less than 10 hours",
        "10-20 hours",
        "20-40 hours",
        "40-60 hours",
        "More than 60 hours"
      ],
      required: true
    },
    {
      id: "bottlenecks",
      type: "multiSelect",
      text: "What are your biggest process bottlenecks?",
      description: "Select all that apply to your current workflow",
      options: [
        "Manual Data Entry",
        "Document Review/Approval",
        "Communication Delays",
        "Data Accuracy Issues",
        "System Integration Problems",
        "Resource Constraints",
        "Other"
      ],
      required: true
    }
  ]
};