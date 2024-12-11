export interface AssessmentScore {
  overall: number;
  automationPotential: number;
  sections: Record<string, { percentage: number }>;
}

export interface CACResults {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
}

export interface AnnualResults {
  savings: number;
  hours: number;
}

export interface AssessmentResults {
  assessmentScore: AssessmentScore;
  results: {
    annual: AnnualResults;
    cac?: CACResults;
  };
}