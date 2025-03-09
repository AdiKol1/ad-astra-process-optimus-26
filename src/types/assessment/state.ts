import { AssessmentStep } from './steps';

export interface AssessmentResponses {
  name?: string;
  email?: string;
  company?: string;
  responses?: {
    industry?: 'Technology' | 'Healthcare' | 'Financial Services' | 'Real Estate' | 'Other';
    employees?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
    timeSpent?: '0-10' | '11-20' | '20-40' | '40+';
    processVolume?: '0-50' | '51-100' | '100-500' | '500+';
    errorRate?: '0-1%' | '1-3%' | '3-5%' | '5%+';
    processComplexity?: 
      | 'Simple - Linear flow with few decision points'
      | 'Medium - Some complexity with decision points'
      | 'Complex - Many decision points and variations'
      | 'Very Complex - Multiple integrations and custom logic';
    // Technology assessment fields
    digitalTools?: string[];
    automationLevel?: 'None' | 'Basic' | 'Moderate' | 'Advanced';
    toolStack?: string[];
    // Team assessment fields
    teamSize?: number;
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    trainingNeeds?: string[];
    // Social media assessment fields
    platforms?: string[];
    postFrequency?: 'Daily' | 'Several times a week' | 'Weekly' | 'Monthly' | 'Rarely';
    goals?: string[];
    contentType?: string[];
    challenges?: string[];
    analytics?: boolean;
    toolsUsed?: string[];
  };
  team?: {
    teamSize?: string;
    departments?: string[];
    skillLevel?: string;
    changeReadiness?: string;
  };
  socialMedia?: {
    platforms?: string[];
    postFrequency?: string;
    goals?: string[];
    contentType?: string[];
    challenges?: string[];
    analytics?: boolean;
    toolsUsed?: string[];
  };
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
  responses: Partial<AssessmentResponses>;
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
