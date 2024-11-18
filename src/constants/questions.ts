interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required?: boolean;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
}

export const assessmentQuestions: Record<string, Section> = {
  processEfficiency: {
    title: "Process Efficiency",
    description: "Let's evaluate your current process efficiency and identify areas for improvement.",
    questions: [
      {
        id: "processTime",
        text: "On average, how many hours per week do you spend on manual, repetitive tasks?",
        type: "number",
        required: true
      },
      {
        id: "bottlenecks",
        text: "What are your main process bottlenecks?",
        type: "select",
        options: [
          "Manual data entry",
          "Communication delays",
          "Approval processes",
          "Resource allocation",
          "Other"
        ],
        required: true
      }
    ]
  },
  communication: {
    title: "Communication & Collaboration",
    description: "Assess your team's communication effectiveness and collaboration tools.",
    questions: [
      {
        id: "communicationTools",
        text: "Which communication tools do you currently use?",
        type: "select",
        options: [
          "Email",
          "Slack",
          "Microsoft Teams",
          "Other"
        ],
        required: true
      },
      {
        id: "communicationEffectiveness",
        text: "How would you rate your team's communication effectiveness? (1-10)",
        type: "number",
        required: true
      }
    ]
  },
  automation: {
    title: "Automation Potential",
    description: "Let's identify opportunities for automation in your processes.",
    questions: [
      {
        id: "automationAreas",
        text: "Which areas do you think could benefit most from automation?",
        type: "select",
        options: [
          "Data entry and processing",
          "Report generation",
          "Customer communication",
          "Project management",
          "Other"
        ],
        required: true
      },
      {
        id: "automationReadiness",
        text: "How ready is your team to adopt new automation tools? (1-10)",
        type: "number",
        required: true
      }
    ]
  }
};