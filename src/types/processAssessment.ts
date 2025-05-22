export interface ProcessAssessmentResponse {
  timeSpent: string[];
  errorRate: string[];
  processVolume: string;
  industry: string;
}

export interface ProcessMetrics {
  timeSpent: number;
  errorRate: number;
  processVolume: number;
}

export interface ProcessScore {
  score: number;
  metrics: ProcessMetrics;
  recommendations: string[];
}

export type Industry = 
  | 'Healthcare'
  | 'Real Estate'
  | 'Financial Services'
  | 'Other';

export interface IndustryConfig {
  baseErrorRate: number;
  automationPotential: number;
  processingTimeMultiplier: number;
  costPerError: number;
  savingsMultiplier: number;
  maxROI?: number;
} 