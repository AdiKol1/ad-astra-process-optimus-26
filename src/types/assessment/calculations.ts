export interface ProcessMetrics {
  timeSpent: number;
  errorRate: number;
  processVolume: number;
  manualProcessCount: number;
  industry: string;
}

export interface ProcessResults {
  score: number;
  teamScore: number;
  recommendations: Array<{
    area: 'process' | 'technology' | 'team';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    effort: string;
  }>;
}

export interface CACMetrics {
  technologyScore: number;
  recommendations: Array<{
    area: 'process' | 'technology' | 'team';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    effort: string;
  }>;
}

export interface ProcessData {
  responses: {
    manualProcesses?: string[];
    teamSize?: number;
    industry?: string;
    marketingSpend?: number;
    customerVolume?: number;
    toolStack?: string[];
  };
}

export interface AssessmentRecommendation {
  area: 'process' | 'technology' | 'team';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  effort: string;
} 