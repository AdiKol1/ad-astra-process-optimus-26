interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiSelect' | 'multiInput';
  options?: string[];
  fields?: Array<{ id: string; label: string }>;
  required?: boolean;
  weight?: number;
  min?: number;
  max?: number;
  default?: number;
  description?: string;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
}

export const assessmentQuestions: Record<string, Section> = {
  teamStructure: {
    title: "Team Structure & Resource Analysis",
    description: "Let's understand your team composition and resource allocation.",
    questions: [
      {
        id: "teamSize",
        text: "What is your total team size?",
        type: "number",
        required: true,
        min: 1
      },
      {
        id: "departments",
        text: "Which departments are involved?",
        type: "multiSelect",
        options: [
          "Operations",
          "Finance",
          "HR",
          "Sales",
          "Customer Service",
          "IT",
          "Management"
        ],
        required: true
      },
      {
        id: "roleBreakdown",
        text: "Number of team members by role",
        type: "multiInput",
        description: "This helps us calculate more accurate cost savings by role",
        fields: [
          { id: "managers", label: "Managers/Supervisors" },
          { id: "specialists", label: "Specialists/Technical Staff" },
          { id: "operators", label: "Operators/General Staff" }
        ],
        required: true
      },
      {
        id: "hoursPerWeek",
        text: "Average working hours per week",
        type: "number",
        required: true,
        min: 1,
        max: 168,
        default: 40
      },
      {
        id: "hourlyRates",
        text: "Average hourly rates by role (including benefits)",
        type: "multiInput",
        description: "Include base salary, benefits, and overhead costs",
        fields: [
          { id: "managerRate", label: "Manager Rate" },
          { id: "specialistRate", label: "Specialist Rate" },
          { id: "operatorRate", label: "Operator Rate" }
        ],
        required: true
      }
    ]
  },
  processEfficiency: {
    title: "Process Efficiency",
    description: "Let's evaluate your current process efficiency and identify areas for improvement.",
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
          "Approval Workflows",
          "Quality Control"
        ],
        required: true
      },
      {
        id: "processTime",
        text: "On average, how many hours per week do you spend on manual, repetitive tasks?",
        type: "number",
        required: true,
        min: 0
      },
      {
        id: "errorRate",
        text: "What is your current error/rework rate?",
        type: "select",
        options: [
          "Less than 1%",
          "1-2%",
          "3-5%",
          "6-10%",
          "More than 10%",
          "Not tracked"
        ],
        required: true
      },
      {
        id: "bottlenecks",
        text: "What are your main process bottlenecks?",
        type: "multiSelect",
        options: [
          "Manual data entry",
          "Communication delays",
          "Approval processes",
          "Resource allocation",
          "System limitations",
          "Data accuracy",
          "Process complexity"
        ],
        required: true
      }
    ]
  },
  technology: {
    title: "Technology Assessment",
    description: "Let's assess your current technology stack and integration needs.",
    questions: [
      {
        id: "currentSystems",
        text: "What systems are you currently using?",
        type: "multiSelect",
        options: [
          "CRM",
          "ERP",
          "Document Management",
          "Project Management",
          "Accounting Software",
          "Custom Solutions",
          "Spreadsheets",
          "Paper-based"
        ],
        required: true
      },
      {
        id: "integrationNeeds",
        text: "Which systems need to be integrated?",
        type: "multiSelect",
        options: [
          "CRM",
          "ERP",
          "Document Management",
          "Project Management",
          "Accounting Software",
          "Custom Solutions"
        ],
        required: true
      },
      {
        id: "dataAccess",
        text: "How do you currently access and share data across systems?",
        type: "multiSelect",
        options: [
          "Manual data entry",
          "File exports/imports",
          "API integrations",
          "Automated sync",
          "No data sharing"
        ],
        required: true
      }
    ]
  },
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
          "Difficulty tracking process status",
          "Limited real-time visibility",
          "System integration issues",
          "Data accuracy problems"
        ],
        required: true
      },
      {
        id: "priority",
        text: "Which area needs the most immediate improvement?",
        type: "select",
        options: [
          "Speed up processing time",
          "Reduce errors",
          "Free up staff time",
          "Improve tracking/visibility",
          "Reduce operational costs",
          "Enhance data accuracy",
          "Better system integration"
        ],
        required: true
      }
    ]
  },
  goals: {
    title: "Goals and Objectives",
    description: "Let's understand your desired outcomes and success metrics.",
    questions: [
      {
        id: "objectives",
        text: "What are your primary objectives?",
        type: "multiSelect",
        options: [
          "Reduce operational costs",
          "Improve customer satisfaction",
          "Increase team productivity",
          "Better data accuracy",
          "Faster processing times",
          "Enhanced reporting capabilities",
          "System integration",
          "Process standardization"
        ],
        required: true
      },
      {
        id: "expectedOutcomes",
        text: "What specific outcomes are you expecting?",
        type: "multiSelect",
        options: [
          "50%+ time savings",
          "90%+ error reduction",
          "Real-time process visibility",
          "Improved customer experience",
          "Better team collaboration",
          "Cost reduction",
          "Increased scalability",
          "Enhanced compliance"
        ],
        required: true
      },
      {
        id: "timeline",
        text: "What is your desired implementation timeline?",
        type: "select",
        options: [
          "Within 1 month",
          "1-3 months",
          "3-6 months",
          "6+ months"
        ],
        required: true
      }
    ]
  },
  budget: {
    title: "Budget Considerations",
    description: "Help us understand your investment capacity for process improvement.",
    questions: [
      {
        id: "monthlyBudget",
        text: "What is your monthly budget for automation and process improvement?",
        type: "select",
        options: [
          "Up to $500",
          "$501-$1,000",
          "$1,001-$5,000",
          "$5,001-$10,000",
          "$10,001+"
        ],
        required: true
      },
      {
        id: "roi",
        text: "What is your expected ROI timeframe?",
        type: "select",
        options: [
          "Within 3 months",
          "3-6 months",
          "6-12 months",
          "12+ months"
        ],
        required: true
      }
    ]
  }
};