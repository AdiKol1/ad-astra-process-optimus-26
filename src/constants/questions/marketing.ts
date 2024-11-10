export const marketingQuestions = {
  title: "Marketing Assessment",
  questions: [
    {
      id: "customerAcquisitionCost",
      type: "select",
      label: "What is your current customer acquisition cost (CAC)?",
      options: [
        "Don't track CAC", // Score: 0 - High need, no tracking
        "$500 or more per customer", // Score: 1 - High need, inefficient
        "$200-$499 per customer", // Score: 2 - Medium need
        "$100-$199 per customer", // Score: 3 - Low-medium need
        "Less than $100 per customer" // Score: 4 - Low need, efficient
      ],
      required: true,
      weight: 2.0 // Higher weight as this directly impacts ROI
    },
    {
      id: "marketingROI",
      type: "select",
      label: "How do you currently track and measure your marketing ROI?",
      options: [
        "We don't track marketing ROI", // Score: 0
        "Basic spreadsheet tracking", // Score: 1
        "Multiple disconnected tools", // Score: 2
        "Marketing automation platform", // Score: 3
        "Integrated analytics system" // Score: 4
      ],
      required: true,
      weight: 1.5
    },
    {
      id: "automationLevel",
      type: "select",
      label: "What percentage of your marketing tasks are currently automated?",
      options: [
        "0% - All manual", // Score: 0
        "1-25% - Basic automation", // Score: 1
        "26-50% - Partial automation", // Score: 2
        "51-75% - Significant automation", // Score: 3
        "76-100% - Fully automated" // Score: 4
      ],
      required: true,
      weight: 1.8
    },
    {
      id: "leadConversion",
      type: "select",
      label: "What is your average lead-to-customer conversion rate?",
      options: [
        "Don't track conversion rates", // Score: 0
        "Less than 1%", // Score: 1
        "1-3%", // Score: 2
        "4-7%", // Score: 3
        "8% or higher" // Score: 4
      ],
      required: true,
      weight: 1.7
    },
    {
      id: "leadResponseTime",
      type: "select",
      label: "How long does it take to respond to and qualify new leads?",
      options: [
        "More than 24 hours", // Score: 0
        "12-24 hours", // Score: 1
        "5-12 hours", // Score: 2
        "1-4 hours", // Score: 3
        "Less than 1 hour" // Score: 4
      ],
      required: true,
      weight: 1.3
    },
    {
      id: "marketingChallenges",
      type: "multiSelect",
      label: "What are your top marketing challenges? (Select all that apply)",
      options: [
        "Lead generation", // High priority
        "Lead qualification", // High priority
        "Campaign automation", // Medium priority
        "Performance tracking", // Medium priority
        "Content creation", // Medium priority
        "Channel management", // Low priority
        "Budget optimization" // Low priority
      ],
      required: true,
      weight: 1.4
    },
    {
      id: "audienceSegmentation",
      type: "select",
      label: "How do you currently segment and target your audience?",
      options: [
        "No segmentation", // Score: 0
        "Basic demographic segmentation", // Score: 1
        "Behavioral segmentation", // Score: 2
        "Multi-channel segmentation", // Score: 3
        "AI-driven personalization" // Score: 4
      ],
      required: true,
      weight: 1.2
    },
    {
      id: "toolStack",
      type: "multiSelect",
      label: "Which marketing tools do you currently use? (Select all that apply)",
      options: [
        "Spreadsheets/Manual tracking", // Basic
        "Email marketing platform", // Essential
        "CRM system", // Essential
        "Social media management", // Standard
        "Marketing automation platform", // Advanced
        "Analytics tools", // Advanced
        "AI/ML tools" // Advanced
      ],
      required: true,
      weight: 1.3
    },
    {
      id: "metricsTracking",
      type: "multiSelect",
      label: "Which key marketing metrics do you regularly track? (Select all that apply)",
      options: [
        "Customer Acquisition Cost (CAC)", // Essential
        "Customer Lifetime Value (CLV)", // Essential
        "Return on Ad Spend (ROAS)", // Advanced
        "Lead-to-Customer Rate", // Essential
        "Email Engagement Rates", // Standard
        "Social Media ROI", // Advanced
        "Website Conversion Rate" // Standard
      ],
      required: true,
      weight: 1.6
    },
    {
      id: "growthGoals",
      type: "select",
      label: "What are your marketing growth goals for the next 12 months?",
      options: [
        "Maintain current performance", // Score: 0
        "10-25% growth", // Score: 1
        "26-50% growth", // Score: 2
        "51-100% growth", // Score: 3
        "More than 100% growth" // Score: 4
      ],
      required: true,
      weight: 1.4
    }
  ]
};