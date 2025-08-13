import { AssessmentStep } from './steps';
import { AssessmentResponses, AssessmentResults } from '../assessment';

export interface ValidationError {
  field: string;
  message: string;
  step: AssessmentStep;
  questionId: string;
}

export interface StepPerformanceMetrics {
  stepId: AssessmentStep;
  loadTime: number;
  errorCount: number;
}

export interface StepTransition {
  from: AssessmentStep;
  to: AssessmentStep;
  timestamp: string;
  isValid: boolean;
}

export interface AssessmentState {
  id: string;
  currentStep: AssessmentStep;
  responses: AssessmentResponses;
  metadata: {
    startTime: string;
    lastUpdated: string;
    completedAt?: string;
    attempts: number;
    analyticsId: string;
    version: string;
  };
  isComplete: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  results: AssessmentResults | null;
  error: Error | null;
  validationErrors: ValidationError[];
  stepHistory: AssessmentStep[];
  lastValidStep: AssessmentStep;
}

export const STEP_ORDER: AssessmentStep[] = [
  'initial',
  'lead-capture',
  'process',
  'technology',
  'team',
  'detailed-results',
  'complete'
];

export interface AssessmentMetadata {
  startTime: string;
  lastUpdated: string;
  completedAt?: string;
  attempts: number;
  analyticsId: string;
  version: string;
}

export interface AssessmentValidation {
  isValid: boolean;
  errors: ValidationError[];
  requiredFields: {
    process: Array<keyof AssessmentResponses>;
    technology: Array<keyof AssessmentResponses>;
    team: Array<keyof AssessmentResponses>;
  };
}

export interface AssessmentData extends AssessmentState {
  id: string;
  currentStep: AssessmentStep;
  responses: AssessmentResponses;
  metadata: AssessmentMetadata;
  isComplete: boolean;
  results: AssessmentResults | null;
}

export type AssessmentAction =
  | { type: 'SET_STEP'; step: AssessmentStep }
  | { type: 'UPDATE_RESPONSES'; responses: Partial<AssessmentResponses> }
  | { type: 'SET_RESULTS'; results: AssessmentResults }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_COMPLETE'; isComplete: boolean }
  | { type: 'ADD_VALIDATION_ERROR'; error: ValidationError }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'RESET_ASSESSMENT' };

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

export interface StepComponentProps {
  onComplete: (results?: AssessmentResults) => void;
  validationErrors: ValidationError[];
  isValid: boolean;
  isLoading: boolean;
}
