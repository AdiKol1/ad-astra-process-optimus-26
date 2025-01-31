export type AssessmentStep = 
  | 'initial'
  | 'process'
  | 'technology'
  | 'team'
  | 'results'
  | 'complete';

export interface AssessmentMetadata {
  startTime: string;
  lastUpdated: string;
  completedAt?: string;
  attempts: number;
  analyticsId: string;
  version: string;
}

export interface ValidationError {
  field: string;
  message: string;
  step?: AssessmentStep;
}

export interface AssessmentResponses {
  // Process section
  timeSpent?: string;
  processVolume?: string;
  errorRate?: string;
  complexity?: string;
  processDocumentation?: boolean;
  
  // Technology section
  digitalTools?: boolean;
  standardization?: boolean;
  integration?: boolean;
  automationLevel?: string;
  toolStack?: string[];
  
  // Team section
  teamSize?: string;
  skillLevel?: string;
  trainingNeeds?: string[];
  
  // User information
  userInfo?: {
    name?: string;
    email?: string;
    company?: string;
    industry?: string;
  };
  
  // Additional fields
  [key: string]: any;
}

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

export interface AssessmentValidation {
  isValid: boolean;
  errors: ValidationError[];
  requiredFields: {
    process: Array<keyof AssessmentResponses>;
    technology: Array<keyof AssessmentResponses>;
    team: Array<keyof AssessmentResponses>;
  };
}

export interface AssessmentState {
  id: string;
  currentStep: AssessmentStep;
  responses: Partial<AssessmentResponses>;
  metadata: AssessmentMetadata;
  isComplete: boolean;
  isLoading: boolean;
  results: AssessmentResults | null;
  error: string | null;
  validationErrors: ValidationError[];
  stepHistory: AssessmentStep[];
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
