export interface MarketingMetrics {
  toolStack: string[];
  automationLevel: string;
  marketingBudget: number;
  industry: string;
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

export interface BudgetRange {
  [key: string]: number;
}

export interface MarketingCalculator {
  calculateMarketingMetrics: (data: Record<string, any>) => MarketingMetrics;
  calculateMarketingResults: (metrics: MarketingMetrics) => MarketingResults;
  validateMetrics: (metrics: Partial<MarketingMetrics>) => boolean;
}
