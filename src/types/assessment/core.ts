import { ProcessMetrics, ProcessResults } from './process';
import { MarketingMetrics, MarketingResults } from './marketing';

export interface AssessmentResponses {
  // Process-related responses
  industry?: string;
  timeSpent?: number;
  processVolume?: string;
  errorRate?: string;
  manualProcesses?: string[];
  
  // Marketing-related responses
  marketingBudget?: string;
  toolStack?: string[];
  automationLevel?: string;
  marketingChallenges?: string[];
  metricsTracking?: string[];
  
  // General responses
  teamSize?: number;
  timeline?: string;
  budget?: string;
}

export interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  responses: AssessmentResponses;
  completed: boolean;
  process: {
    metrics: ProcessMetrics | null;
    results: ProcessResults | null;
  };
  marketing: {
    metrics: MarketingMetrics | null;
    results: MarketingResults | null;
  };
}

export interface AssessmentValidation {
  validateStep: (step: number, responses: Partial<AssessmentResponses>) => boolean;
  validateResponses: (responses: AssessmentResponses) => boolean;
}

export type AssessmentStep = {
  id: number;
  title: string;
  description: string;
  questions: {
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    validation?: (value: any) => boolean;
  }[];
};
