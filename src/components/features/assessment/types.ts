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

export interface AssessmentState {
  responses: Record<string, any> | null;
  completed: boolean;
  results: any | null;
  error: Error | null;
}

export interface AssessmentContextType {
  assessmentData: AssessmentData;
  state: AssessmentState;
}

export interface ReportHeaderProps {
  userInfo?: AssessmentData['userInfo'];
}

export interface UrgencyBannerProps {
  score?: number;
}

export interface InteractiveReportProps {
  data: {
    assessmentScore: {
      overall: number;
      automationPotential: number;
      sections: Record<string, number>;
    };
    results: {
      annual: {
        savings: number;
        hours: number;
      };
      cac?: number;
    };
    recommendations: any;
    industryAnalysis?: any;
    userInfo?: any;
  };
} 