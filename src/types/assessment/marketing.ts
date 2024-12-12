export interface MarketingMetrics {
  toolMaturity: number;
  automationLevel: number;
  processMaturity: number;
  budgetEfficiency: number;
  integrationLevel: number;
}

export interface MarketingResults {
  cac: {
    current: number;
    projected: number;
    reduction: number;
  };
  automation: {
    level: number;
    potential: number;
    roi: number;
  };
  conversion: {
    current: number;
    projected: number;
    improvement: number;
  };
}

export interface MarketingState {
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
