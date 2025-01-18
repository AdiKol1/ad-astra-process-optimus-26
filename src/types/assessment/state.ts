import { AssessmentResults, AssessmentResponses } from './core';
import { AssessmentStep } from './steps';

export interface AssessmentMetadata {
  startTime: string;
  lastUpdated: string;
  completionTime?: string;
  attempts: number;
  analyticsId: string;
  version: string;
}

export interface AssessmentState {
  currentStep: AssessmentStep;
  responses: AssessmentResponses;
  metadata: AssessmentMetadata;
  isComplete: boolean;
  isLoading: boolean;
  results?: AssessmentResults;
  lastValidStep?: AssessmentStep;
  stepHistory: AssessmentStep[];
}

export interface ValidationError {
  field: keyof AssessmentResponses | 'step' | 'validation' | 'required';
  message: string;
  step?: AssessmentStep;
}

export type AssessmentAction =
  | { type: 'SET_RESPONSE'; field: keyof AssessmentResponses; value: AssessmentResponses[keyof AssessmentResponses] }
  | { type: 'SET_STEP'; step: AssessmentStep }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'INITIALIZE'; payload: Partial<AssessmentState> }
  | { type: 'COMPLETE_ASSESSMENT'; payload: { completed: boolean; results: AssessmentResults } }
  | { type: 'SET_LAST_VALID_STEP'; step: AssessmentStep }
  | { type: 'ADD_TO_HISTORY'; step: AssessmentStep }
  | { type: 'RESET' };

export interface StepTransition {
  from: AssessmentStep;
  to: AssessmentStep;
  timestamp: string;
  isValid: boolean;
}

export interface StepPerformanceMetrics {
  stepId: AssessmentStep;
  loadTime: number;
  interactionTime?: number;
  validationTime?: number;
  errorCount: number;
}

export interface AssessmentContextValue {
  state: AssessmentState;
  validationErrors: ValidationError[];
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  setResponse: (field: keyof AssessmentResponses, value: AssessmentResponses[keyof AssessmentResponses]) => void;
  setState: React.Dispatch<React.SetStateAction<AssessmentState>>;
  nextStep: () => Promise<void>;
  previousStep: () => void;
  clearValidationErrors: () => void;
  completeAssessment: () => Promise<AssessmentResults>;
  validateRequiredFields: () => void;
  canMoveToStep: (step: AssessmentStep) => boolean;
  getStepMetrics: (step: AssessmentStep) => StepPerformanceMetrics;
  getStepHistory: () => StepTransition[];
}
