export interface AssessmentResults {
  scores: {
    processScore: number;
    technologyScore: number;
    teamScore: number;
    totalScore: number;
  };
  recommendations: {
    area: 'process' | 'technology' | 'team';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    effort: string;
  }[];
  calculatedAt: string;
}

export interface AssessmentData {
  userInfo?: {
    companyName?: string;
    industry?: string;
    teamSize?: number;
  };
  score?: number;
  qualificationScore?: number;
  automationPotential?: number;
  sectionScores?: Record<string, number>;
  results?: {
    annual?: {
      savings: number;
      hours: number;
    };
    cac?: number;
  };
  recommendations?: {
    recommendations?: Array<{
      title: string;
      description: string;
      impact: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  industryAnalysis?: {
    benchmarks?: Record<string, string>;
    trends?: Array<{
      title: string;
      impact: string;
    }>;
  };
} 