export interface MarketingToolInfo {
  score: number;
  category: 'essential' | 'advanced';
  integrationValue: number;
}

export interface MarketingMetrics {
  automationLevel: number;
  toolMaturity: number;
  challengeComplexity: number;
  marketingEfficiency: number;
  budgetEfficiency: number;
  processMaturity: number;
  integrationLevel: number;
}

export interface RecommendedService {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  implementationTimeframe: string;
  estimatedImpact: number;
  prerequisites: string[];
  risks: string[];
}

export interface MarketingScore {
  score: number;
  maxScore: number;
  percentage: number;
  needLevel: 'low' | 'medium' | 'high';
  recommendedServices: RecommendedService[];
  priority: 'low' | 'medium' | 'high';
  metrics: MarketingMetrics;
}

export interface MarketingToolScores {
  [key: string]: MarketingToolInfo;
}

export interface ChallengeWeights {
  [key: string]: number;
}

export interface BudgetRange {
  [key: string]: number;
}