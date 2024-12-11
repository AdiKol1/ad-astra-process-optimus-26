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

export const METRIC_WEIGHTS = {
  toolMaturity: 0.25,
  automationLevel: 0.20,
  challengeComplexity: 0.15,
  budgetEfficiency: 0.15,
  processMaturity: 0.15,
  integrationLevel: 0.10
};