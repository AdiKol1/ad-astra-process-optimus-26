import type { BaseQuestion } from '@/types/assessment/core';

export const marketingQuestions = {
  title: "Marketing Assessment",
  description: "Help us understand your marketing operations and needs",
  questions: [
    {
      id: "marketingChallenges",
      type: "multiselect",
      label: "What are your top marketing challenges?",
      description: "Select all challenges that impact your marketing operations",
      options: [
        { label: "Lead generation", value: "lead_generation" },
        { label: "Lead qualification", value: "lead_qualification" },
        { label: "Campaign automation", value: "campaign_automation" },
        { label: "Performance tracking", value: "performance_tracking" },
        { label: "Content creation", value: "content_creation" },
        { label: "Channel management", value: "channel_management" },
        { label: "Budget optimization", value: "budget_optimization" }
      ],
      required: true
    },
    {
      id: "toolStack",
      type: "multiselect",
      label: "Which marketing tools do you currently use?",
      description: "Select all tools currently in use",
      options: [
        { label: "Spreadsheets/Manual tracking", value: "spreadsheets" },
        { label: "Email marketing platform", value: "email_marketing" },
        { label: "CRM system", value: "crm" },
        { label: "Social media management", value: "social_media" },
        { label: "Marketing automation platform", value: "marketing_automation" },
        { label: "Analytics tools", value: "analytics" }
      ],
      required: true
    },
    {
      id: "metricsTracking",
      type: "multiselect",
      label: "Which marketing metrics do you currently track?",
      description: "Select all metrics you regularly monitor",
      options: [
        { label: "Customer Acquisition Cost (CAC)", value: "cac" },
        { label: "Return on Ad Spend (ROAS)", value: "roas" },
        { label: "Conversion rates", value: "conversion_rates" },
        { label: "Lead quality scores", value: "lead_quality" },
        { label: "Customer Lifetime Value (CLV)", value: "clv" },
        { label: "Email engagement rates", value: "email_engagement" },
        { label: "Social media engagement", value: "social_engagement" },
        { label: "Website traffic analytics", value: "website_analytics" }
      ],
      required: true
    },
    {
      id: "automationLevel",
      type: "select",
      label: "What percentage of your marketing tasks are currently automated?",
      description: "Estimate the level of automation in your marketing processes",
      options: [
        { label: "0-25%", value: "0-25" },
        { label: "26-50%", value: "26-50" },
        { label: "51-75%", value: "51-75" },
        { label: "76-100%", value: "76-100" }
      ],
      required: true
    },
    {
      id: "marketingBudget",
      type: "select",
      label: "What is your monthly marketing budget?",
      description: "Select the range that best matches your current spending",
      options: [
        { label: "Less than $1,000", value: "0-1000" },
        { label: "$1,000 - $5,000", value: "1000-5000" },
        { label: "$5,001 - $10,000", value: "5001-10000" },
        { label: "$10,001 - $25,000", value: "10001-25000" },
        { label: "More than $25,000", value: "25000+" }
      ],
      required: true
    }
  ] as BaseQuestion[]
};