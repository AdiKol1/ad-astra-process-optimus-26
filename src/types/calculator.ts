export interface SectionScore {
  score: number;
  percentage: number;
}

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  efficiency: number;
}

export interface AssessmentResults {
  annual: {
    savings: number;
    hours: number;
  };
  cac?: CACMetrics;
}

export interface AssessmentScores {
  team: SectionScore;
  process: SectionScore;
  automation: SectionScore;
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