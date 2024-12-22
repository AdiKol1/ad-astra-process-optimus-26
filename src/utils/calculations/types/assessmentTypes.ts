export interface AssessmentInput {
  industry: string;
  teamSize: string[];
  processVolume?: string;
  timeSpent?: string[];
  errorRate?: string;
  toolStack?: string[];
  marketingChallenges?: string[];
  automationLevel?: string;
  marketingBudget?: string;
}

export interface CalculationResults {
  cac: {
    currentCAC: number;
    potentialReduction: number;
    annualSavings: number;
    automationROI: number;
  };
  automation: {
    timeReduction: number;
    errorReduction: number;
    productivity: number;
  };
  annual: {
    savings: number;
    hours: number;
  };
}