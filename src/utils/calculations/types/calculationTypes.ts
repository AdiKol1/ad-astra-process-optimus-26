export interface CalculationInput {
  employees: number;
  timeSpent: number;
  processVolume: string;
  errorRate: string;
  industry: string;
}

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