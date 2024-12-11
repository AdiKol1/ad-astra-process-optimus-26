export interface SectionScore {
  percentage: number;
  score?: number;
}

export interface AssessmentScore {
  overall: number;
  automationPotential: number;
  sections: Record<string, SectionScore>;
}

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  efficiency: number;
}

export interface AnnualResults {
  savings: number;
  hours: number;
}

export interface AssessmentResults {
  annual: AnnualResults;
  cac: CACMetrics;
}

export interface AssessmentData {
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  qualificationScore?: number;
  automationPotential?: number;
  sectionScores?: Record<string, SectionScore>;
  results?: AssessmentResults;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}