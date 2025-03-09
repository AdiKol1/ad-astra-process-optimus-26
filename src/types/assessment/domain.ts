import type { AssessmentStep } from './steps';
import type { ValidationError } from './validation';

export interface AssessmentDomain {
  id: string;
  step: AssessmentStep;
  data: AssessmentData;
  validation: AssessmentValidation;
  metrics: AssessmentMetrics;
}

export interface AssessmentData {
  responses: Record<string, any>;
  results: AssessmentResults | null;
  metadata: {
    startTime: string;
    lastUpdated: string;
    completedAt?: string;
    version: string;
  };
}

export interface AssessmentValidation {
  errors: ValidationError[];
  lastValidStep: AssessmentStep;
  isValid: boolean;
}

export interface AssessmentMetrics {
  stepDurations: Record<AssessmentStep, number>;
  totalDuration: number;
  errorCount: number;
  completionRate: number;
}

export interface AssessmentResults {
  score: number;
  recommendations: string[];
  insights: {
    category: string;
    score: number;
    recommendations: string[];
  }[];
}

export type AssessmentEvent =
  | { type: 'START' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SET_STEP'; step: AssessmentStep }
  | { type: 'UPDATE_DATA'; data: Partial<AssessmentData> }
  | { type: 'VALIDATE' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };

export type AssessmentAction = {
  type: string;
  payload?: any;
  timestamp?: string;
  metadata?: Record<string, any>;
}; 