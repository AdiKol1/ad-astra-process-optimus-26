import type { AssessmentStep } from './steps';

export interface ValidationError {
  field: string;
  message: string;
  step: AssessmentStep;
  questionId: string;
}

export interface AssessmentStepValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export const createDefaultValidation = (): AssessmentStepValidation => ({
  isValid: true,
  errors: []
});
