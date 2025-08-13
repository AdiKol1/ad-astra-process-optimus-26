import { AssessmentStep } from './steps';

export interface StepMetrics {
  stepDuration: number;
  totalDuration: number;
  currentStep: AssessmentStep;
  stepCount: number;
  completionPercentage: number;
  validationErrors: number;
  isValid: boolean;
  hasUnsavedChanges: boolean;
} 