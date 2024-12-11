export const marketingQuestions = {
  title: "Marketing Assessment",
  description: "Help us understand your marketing operations and needs",
  questions: [
    {
      id: "marketingChallenges",
      type: "multiSelect",
      label: "What are your top marketing challenges?",
      description: "Select all challenges that impact your marketing operations",
      options: [
        "Lead generation",
        "Lead qualification",
        "Campaign automation",
        "Performance tracking",
        "Content creation",
        "Channel management",
        "Budget optimization"
      ],
      required: true
    },
    {
      id: "toolStack",
      type: "multiSelect",
      label: "Which marketing tools do you currently use?",
      description: "Select all tools currently in use",
      options: [
        "Spreadsheets/Manual tracking",
        "Email marketing platform",
        "CRM system",
        "Social media management",
        "Marketing automation platform",
        "Analytics tools"
      ],
      required: true
    },
    {
      id: "metricsTracking",
      type: "multiSelect",
      label: "Which marketing metrics do you currently track?",
      description: "Select all metrics you regularly monitor",
      options: [
        "Customer Acquisition Cost (CAC)",
        "Return on Ad Spend (ROAS)",
        "Conversion rates",
        "Lead quality scores",
        "Customer Lifetime Value (CLV)",
        "Email engagement rates",
        "Social media engagement",
        "Website traffic analytics"
      ],
      required: true
    },
    {
      id: "automationLevel",
      type: "select",
      label: "What percentage of your marketing tasks are currently automated?",
      description: "Estimate the level of automation in your marketing processes",
      options: [
        "0-25%",
        "26-50%",
        "51-75%",
        "76-100%"
      ],
      required: true
    },
    {
      id: "marketingBudget",
      type: "select",
      label: "What is your monthly marketing budget?",
      description: "Select the range that best matches your current spending",
      options: [
        "Less than $1,000",
        "$1,000 - $5,000",
        "$5,001 - $10,000",
        "$10,001 - $25,000",
        "More than $25,000"
      ],
      required: true
    }
  ]
};