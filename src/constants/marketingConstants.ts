import { MarketingToolScores, ChallengeWeights, BudgetRange } from '@/types/marketing';

export const TOOL_SCORES: MarketingToolScores = {
  'CRM system': {
    score: 20,
    category: 'essential',
    integrationValue: 15
  },
  'Email marketing platform': {
    score: 15,
    category: 'essential',
    integrationValue: 10
  },
  'Analytics tools': {
    score: 20,
    category: 'essential',
    integrationValue: 15
  },
  'Marketing automation platform': {
    score: 25,
    category: 'advanced',
    integrationValue: 20
  },
  'AI/ML tools': {
    score: 20,
    category: 'advanced',
    integrationValue: 20
  },
  'Social media management': {
    score: 10,
    category: 'essential',
    integrationValue: 5
  },
  'Content management system': {
    score: 15,
    category: 'essential',
    integrationValue: 10
  },
  'Spreadsheets/Manual tracking': {
    score: 5,
    category: 'basic',
    integrationValue: 0
  }
};

export const CHALLENGE_WEIGHTS: ChallengeWeights = {
  'Campaign automation': 20,
  'Performance tracking': 15,
  'Budget optimization': 15,
  'Lead generation': 20,
  'Customer segmentation': 15,
  'Content personalization': 25,
  'Multi-channel coordination': 20,
  'Data analysis': 15,
  'ROI measurement': 15
};

export const BUDGET_RANGES: BudgetRange = {
  'Less than $1,000': 1,
  '$1,000 - $5,000': 2,
  '$5,000 - $20,000': 3,
  'More than $20,000': 4
};

// Weights for the overall marketing efficiency calculation
export const METRIC_WEIGHTS = {
  toolMaturity: 0.25,      // 25% - Tool sophistication
  automationLevel: 0.25,   // 25% - Current automation level
  processMaturity: 0.20,   // 20% - Process efficiency
  budgetEfficiency: 0.15,  // 15% - Budget utilization
  integrationLevel: 0.15   // 15% - Tool integration
};

// Automation level ranges and their base scores
export const AUTOMATION_RANGES = {
  '0-25%': 25,
  '26-50%': 50,
  '51-75%': 75,
  '76-100%': 100
};