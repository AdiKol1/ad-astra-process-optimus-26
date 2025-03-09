import { AssessmentState, ValidationError } from '@/types/assessment/state';
import { CoreQuestionSection, BaseQuestion, QuestionValue } from '@/types/assessment/questions';
import { logger } from '@/utils/logger';

export const validateAssessmentState = (state: AssessmentState): void => {
  if (!state) {
    throw new Error('Assessment state is required');
  }

  if (typeof state.currentStep !== 'number') {
    throw new Error('Current step must be a number');
  }

  if (!state.responses) {
    throw new Error('Responses object is required');
  }

  if (!state.metadata) {
    throw new Error('Metadata is required');
  }
};

export const validateStepResponses = (
  responses: Record<string, any>,
  requiredFields: string[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    const value = responses[field];
    if (value === undefined || value === null || value === '') {
      errors.push({
        questionId: field,
        message: `This field is required`
      });
    }
  }

  return errors;
};

export const validateResponse = (
  questionId: string,
  value: any,
  options?: string[],
  required: boolean = false
): ValidationError | null => {
  // Check required field
  if (required && (value === undefined || value === null || value === '')) {
    return {
      questionId,
      message: 'This field is required'
    };
  }

  // If value is provided, validate against options
  if (value !== undefined && value !== null && value !== '' && options?.length) {
    if (!options.includes(value)) {
      return {
        questionId,
        message: 'Please select a valid option'
      };
    }
  }

  return null;
};

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateStep = (
  stepData: CoreQuestionSection,
  responses: Record<string, any>
): ValidationResult => {
  try {
    const errors: ValidationError[] = [];

    if (!stepData || !Array.isArray(stepData.questions)) {
      logger.error('Invalid step data in validation:', {
        component: 'validateStep',
        stepData
      });
      return {
        isValid: false,
        errors: [{
          questionId: 'step',
          message: 'Invalid step configuration'
        }]
      };
    }

    // Validate each question
    stepData.questions.forEach(question => {
      const value = responses[question.id];
      
      // Check required fields
      if (question.required && (value === undefined || value === null || value === '')) {
        errors.push({
          questionId: question.id,
          message: `${question.label} is required`
        });
        return;
      }

      // If value is provided, validate against options for select type
      if (question.type === 'select' && value !== undefined && value !== null && value !== '') {
        if (!question.options?.includes(value)) {
          errors.push({
            questionId: question.id,
            message: `Please select a valid option for ${question.label}`
          });
        }
      }

      // Add custom validation for specific fields
      switch (question.id) {
        case 'errorRate':
          if (value && !value.endsWith('%')) {
            errors.push({
              questionId: question.id,
              message: 'Error rate must include % symbol'
            });
          }
          break;
        case 'processVolume':
          if (value && !/^\d+-\d+$|^\d+\+$/.test(value)) {
            errors.push({
              questionId: question.id,
              message: 'Invalid process volume format'
            });
          }
          break;
        // Add more field-specific validations as needed
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (err) {
    logger.error('Error validating step:', {
      component: 'validateStep',
      error: err
    });
    return {
      isValid: false,
      errors: [{
        questionId: 'validation',
        message: 'An error occurred during validation'
      }]
    };
  }
};

export const validateAssessment = (
  steps: CoreQuestionSection[],
  responses: Record<string, any>
): ValidationResult => {
  try {
    let allErrors: ValidationError[] = [];

    if (!Array.isArray(steps)) {
      throw new Error('Steps must be an array');
    }

    // Validate each step
    steps.forEach((step, index) => {
      const stepValidation = validateStep(step, responses);
      if (!stepValidation.isValid) {
        allErrors = [...allErrors, ...stepValidation.errors.map(error => ({
          ...error,
          message: `Step ${index + 1}: ${error.message}`
        }))];
      }
    });

    // Validate required fields are present
    const requiredFields = [
      'industry',
      'employees',
      'timeSpent',
      'processVolume',
      'errorRate',
      'processComplexity'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = responses[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      allErrors.push({
        questionId: 'required',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  } catch (err) {
    logger.error('Error in assessment validation:', err);
    return {
      isValid: false,
      errors: [{
        questionId: 'validation',
        message: err instanceof Error ? err.message : 'Assessment validation failed'
      }]
    };
  }
};

export function validateQuestionResponse(question: BaseQuestion, value: QuestionValue): ValidationResult {
  const errors: string[] = [];

  // Required field validation
  if (question.required) {
    if (value === null || value === undefined || value === '') {
      errors.push('This field is required');
    }
    if (Array.isArray(value) && value.length === 0) {
      errors.push('Please select at least one option');
    }
  }

  // Type-specific validation
  switch (question.type) {
    case 'email':
      if (value && typeof value === 'string' && !value.includes('@')) {
        errors.push('Please enter a valid email address');
      }
      break;
    case 'select':
      if (value && !question.options?.includes(value as string)) {
        errors.push('Please select a valid option');
      }
      break;
    case 'multiSelect':
      if (Array.isArray(value)) {
        const invalidOptions = value.filter(v => !question.options?.includes(v));
        if (invalidOptions.length > 0) {
          errors.push('One or more selected options are invalid');
        }
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
