export interface CalculationResults {
  costs: {
    current: number;
    projected: number;
  };
  savings: {
    monthly: number;
    annual: number;
  };
  efficiency: {
    timeReduction: number;
    errorReduction: number;
    productivity: number;
  };
}

export interface IndustryStandard {
  baseErrorRate: number;
  automationPotential: number;
  processingTimeMultiplier: number;
  costPerError: number;
  savingsMultiplier: number;
}

export interface CalculationInput {
  employees: number;
  timeSpent: number;
  processVolume: string;
  errorRate: string;
  industry: string;
}