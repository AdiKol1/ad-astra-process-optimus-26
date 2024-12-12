export interface SectionScore {
  score: number;
  percentage: number;
}

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  conversionImprovement: number;
  projectedRevenue: number;
}

export interface AssessmentResults {
  annual: {
    savings: number;
    hours: number;
  };
  cac?: CACMetrics;
}

export interface AssessmentScores {
  overall: SectionScore;
  technology: SectionScore;
  processes: SectionScore;
  challenges: SectionScore;
}

export interface IndustryAnalysis {
  currentCAC: number;
  potentialReduction: number;
  automationROI: number;
  benchmarks: {
    averageAutomation: number;
    topPerformerAutomation: number;
  };
}