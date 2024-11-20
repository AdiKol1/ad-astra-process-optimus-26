interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiSelect';
  options?: string[];
  required?: boolean;
  description?: string;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
}

export const assessmentQuestions: Record<string, Section> = {
  challenges: {
    title: "Current Challenges",
    description: "Help us understand your key operational challenges.",
    questions: [
      {
        id: "painPoints",
        text: "What are your biggest operational challenges?",
        type: "multiSelect",
        options: [
          "Too much manual data entry",
          "High error rates",
          "Slow processing times",
          "Staff spending time on repetitive tasks",
          "Limited visibility into processes"
        ],
        required: true
      }
    ]
  },
  processes: {
    title: "Current Processes",
    description: "Tell us about your manual processes.",
    questions: [
      {
        id: "manualProcesses",
        text: "Which processes are currently manual?",
        type: "multiSelect",
        options: [
          "Data Entry",
          "Document Processing",
          "Customer Communication",
          "Reporting",
          "Invoice Processing",
          "Scheduling",
          "Approval Workflows"
        ],
        required: true
      },
      {
        id: "timeSpent",
        text: "How many hours per week does your team spend on these manual processes?",
        type: "select",
        options: [
          "Less than 10 hours",
          "10-20 hours",
          "20-40 hours",
          "More than 40 hours"
        ],
        required: true
      }
    ]
  },
  goals: {
    title: "Goals & Timeline",
    description: "Help us understand your automation goals.",
    questions: [
      {
        id: "objectives",
        text: "What are your primary objectives for automation?",
        type: "multiSelect",
        options: [
          "Reduce operational costs",
          "Improve customer satisfaction",
          "Increase team productivity",
          "Better data accuracy",
          "Faster processing times"
        ],
        required: true
      },
      {
        id: "timeline",
        text: "When would you like to start implementing automation?",
        type: "select",
        options: [
          "As soon as possible",
          "Within 1 month",
          "Within 3 months",
          "Still exploring options"
        ],
        required: true
      }
    ]
  }
};