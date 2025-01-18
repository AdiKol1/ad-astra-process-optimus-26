export interface ValidationError {
  field: string;
  message: string;
}

export interface AssessmentStepValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export const createDefaultValidation = (): AssessmentStepValidation => ({
  isValid: true,
  errors: []
});
