export interface SectionScore {
  score: number;
  percentage: number;
}

export interface AssessmentResults {
  annual: {
    savings: number;
    hours: number;
  };
  cac: {
    currentCAC: number;
    potentialReduction: number;
    annualSavings: number;
    automationROI: number;
    efficiency: number;
  };
  metrics: {
    toolMaturity: number;
    automationLevel: number;
    efficiency: number;
    overallScore: number;
  };
  marketing: {
    conversion: {
      rate: number;
      improvement: number;
      projectedRevenue: number;
    };
    automation: {
      potential: number;
      coverage: number;
      impact: number;
    };
  };
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