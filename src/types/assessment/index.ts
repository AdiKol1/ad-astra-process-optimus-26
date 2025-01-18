import { AssessmentResponses, AssessmentState, AssessmentValidation, AssessmentStep } from './core';
import { ProcessMetrics, ProcessResults } from './process';
import { MarketingMetrics, MarketingResults } from './marketing';

export interface AssessmentResponses {
  timeSpent?: string;
  processVolume?: string;
  errorRate?: string;
  complexity?: string;
  processDocumentation?: boolean;
  digitalTools?: boolean;
  standardization?: boolean;
  integration?: boolean;
  userInfo?: {
    name?: string;
    email?: string;
    company?: string;
    industry?: string;
  };
  marketingBudget?: string;
  automationLevel?: string;
  toolStack?: string[];
  metricsTracking?: string[];
  [key: string]: any;
}

export interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  responses: AssessmentResponses;
  completed: boolean;
}

export interface AssessmentValidation {
  // No changes made to this interface
}

export interface AssessmentStep {
  // No changes made to this interface
}

export interface ProcessMetrics {
  // No changes made to this interface
}

export interface ProcessResults {
  // No changes made to this interface
}

export interface MarketingMetrics {
  // No changes made to this interface
}

export interface MarketingResults {
  // No changes made to this interface
}

export interface CACMetrics {
  current: number;
  projected: number;
  potentialReduction: number;
  conversionImprovement: number;
}

export interface AssessmentResults {
  savings: {
    annual: number;
    monthly: number;
  };
  metrics: {
    efficiency: number;
    roi: number;
    automationLevel: number;
    paybackPeriodMonths: number;
  };
  costs: {
    current: number;
    projected: number;
    breakdown: {
      labor: { current: number; projected: number };
      tools: { current: number; projected: number };
      overhead: { current: number; projected: number };
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

export interface AssessmentData {
  qualificationScore?: number;
  automationPotential?: number;
  results?: {
    annual: {
      savings: number;
      hours: number;
    };
    cac: CACMetrics;
  };
  sectionScores?: {
    process: number;
    marketing: number;
  };
  recommendations?: {
    process: string[];
    marketing: string[];
  };
  industryAnalysis?: {
    process: string[];
    marketing: string[];
  };
  userInfo?: AssessmentResponses['userInfo'];
  completedAt?: string;
}

export type {
  AssessmentResponses,
  AssessmentState,
  AssessmentValidation,
  AssessmentStep,
  ProcessMetrics,
  ProcessResults,
  MarketingMetrics,
  MarketingResults,
  AssessmentResults,
};
