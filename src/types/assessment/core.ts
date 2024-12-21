export interface RawAssessmentData {
  responses: Record<string, any>;
  metadata: {
    startedAt: string;
    completedAt?: string;
    currentStep: number;
    totalSteps: number;
  };
}

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  efficiency: number;
}

export interface AutomationMetrics {
  timeReduction: number;
  errorReduction: number;
  productivity: number;
}

export interface EfficiencyMetrics {
  toolMaturity: number;
  processEfficiency: number;
  teamEfficiency: number;
}

export interface ComputedMetrics {
  cac: CACMetrics;
  automation: AutomationMetrics;
  efficiency: EfficiencyMetrics;
}

export interface AssessmentReport {
  scores: {
    overall: number;
    sections: Record<string, { percentage: number }>;
  };
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    timeframe: string;
  }>;
  projections: {
    annual: {
      savings: number;
      hours: number;
    };
    roi: number;
  };
}