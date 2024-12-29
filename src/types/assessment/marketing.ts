export type AutomationLevel = '0-25%' | '26-50%' | '51-75%' | '76-100%';

export type BudgetRange = 
  | 'Less than $5,000'
  | '$5,001 - $10,000'
  | '$10,001 - $25,000'
  | '$25,001 - $50,000'
  | 'More than $50,000';

export interface MarketingMetrics {
  toolStack: string[];
  automationLevel: AutomationLevel;
  marketingBudget: number;
  industry: string;
}

export interface ValidationError {
  field?: keyof MarketingMetrics;
  message: string;
}

export interface MarketingResults {
  costs: {
    current: number;
    projected: number;
    breakdown: {
      labor: { current: number; projected: number };
      tools: { current: number; projected: number };
      overhead: { current: number; projected: number };
    };
  };
  savings: {
    monthly: number;
    annual: number;
    breakdown: {
      labor: number;
      tools: number;
      overhead: number;
    };
  };
  metrics: {
    efficiency: number;
    automationLevel: number;
    roi: number;
    paybackPeriodMonths: number;
  };
}

export interface MarketingState {
  currentStep: number;
  totalSteps: number;
  metrics: MarketingMetrics | null;
  results: MarketingResults | null;
  loading: boolean;
  error: string | null;
}

export interface MarketingToolScores {
  [key: string]: {
    score: number;
    category: 'basic' | 'essential' | 'advanced';
    integrationValue: number;
  };
}

export interface ChallengeWeights {
  [key: string]: number;
}

export interface BudgetRangeConfig {
  min: number;
  max: number;
  defaultValue: number;
}

export type BudgetRangeMap = {
  [K in BudgetRange]: BudgetRangeConfig;
};

export interface MarketingCalculator {
  calculateMarketingMetrics: (data: Record<string, any>) => MarketingMetrics;
  calculateMarketingResults: (metrics: MarketingMetrics) => MarketingResults;
  validateMetrics: (metrics: Partial<MarketingMetrics>) => ValidationError[];
}

export interface MarketingDataTransformer {
  transform: (responses: Record<string, any>) => MarketingMetrics;
  validate: (data: Partial<MarketingMetrics>) => ValidationError[];
}
