export const assessmentQuestions = {
  business: {
    title: "Business Information",
    questions: [
      {
        id: "industry",
        type: "select",
        label: "What industry are you in?",
        options: ["Real Estate", "Construction", "Legal", "Healthcare", "Other"],
        required: true
      },
      {
        id: "employees",
        type: "number",
        label: "Number of employees involved in manual processes",
        required: true,
        min: 1,
        tooltip: "Include all staff who handle paperwork or manual data entry"
      },
      {
        id: "processVolume",
        type: "select",
        label: "Monthly transaction/document volume",
        options: [
          "Less than 100",
          "100-500",
          "501-1000",
          "1001-5000",
          "More than 5000"
        ]
      }
    ]
  },
  processes: {
    title: "Current Processes",
    questions: [
      {
        id: "manualProcesses",
        type: "multiSelect",
        label: "Which processes are currently manual?",
        options: [
          "Data Entry",
          "Document Processing",
          "Customer Communication",
          "Reporting",
          "Invoice Processing",
          "Scheduling"
        ]
      },
      {
        id: "timeSpent",
        type: "hours",
        label: "Hours spent weekly on these processes",
        required: true,
        min: 1
      },
      {
        id: "errorRate",
        type: "percentage",
        label: "Estimated error rate in current processes",
        options: ["1-2%", "3-5%", "6-10%", "More than 10%"]
      }
    ]
  },
  challenges: {
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
        ]
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
        ]
      }
    ]
  },
  goals: {
    title: "Automation Goals",
    questions: [
      {
        id: "timeline",
        type: "select",
        label: "Desired implementation timeline",
        options: [
          "Within 1 month",
          "1-3 months",
          "3-6 months",
          "6+ months"
        ]
      },
      {
        id: "budget",
        type: "select",
        label: "Monthly budget for automation",
        options: [
          "Up to $500",
          "$501-$1,000",
          "$1,001-$5,000",
          "$5,001+"
        ]
      }
    ]
  }
};
