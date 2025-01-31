import { AppError, ValidationError as BaseValidationError, handleError } from './base';
import type { AssessmentStep } from '@/types/assessment/state';

/**
 * Assessment-specific validation error
 */
export class AssessmentValidationError extends BaseValidationError {
  constructor(
    message: string,
    fields: Record<string, string>,
    step: AssessmentStep
  ) {
    super(message, fields, {
      code: 'ASSESSMENT_VALIDATION_ERROR',
      metadata: { step }
    });
  }
}

/**
 * Assessment calculation error
 */
export class CalculationError extends AppError {
  constructor(
    message: string,
    metadata: {
      calculationType: string;
      inputData?: any;
      expectedRange?: string;
    }
  ) {
    super(message, {
      code: 'CALCULATION_ERROR',
      severity: 'high',
      metadata: {
        ...metadata,
        requires_immediate_attention: true
      }
    });
  }
}

/**
 * Assessment state error
 */
export class AssessmentStateError extends AppError {
  constructor(
    message: string,
    metadata: {
      currentStep: AssessmentStep;
      expectedStep?: AssessmentStep;
      state?: any;
    }
  ) {
    super(message, {
      code: 'ASSESSMENT_STATE_ERROR',
      severity: 'high',
      metadata
    });
  }
}

/**
 * Handle assessment-specific errors
 */
export function handleAssessmentError(
  error: Error,
  context: string,
  metadata?: Record<string, any>
) {
  // Convert known error types
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error.name === 'ValidationError') {
    appError = new AssessmentValidationError(
      error.message,
      (error as any).fields || {},
      (metadata?.step as AssessmentStep) || 'initial'
    );
  } else if (error.message.includes('calculation')) {
    appError = new CalculationError(error.message, {
      calculationType: metadata?.calculationType || 'unknown',
      inputData: metadata?.inputData
    });
  } else {
    appError = new AppError(error.message, {
      code: 'ASSESSMENT_ERROR',
      severity: 'high',
      metadata: {
        ...metadata,
        originalError: error
      }
    });
  }

  return handleError(appError, context);
}

/**
 * Validate assessment state
 */
export function validateAssessmentState(
  state: any,
  expectedStep?: AssessmentStep
): void {
  const requiredFields = ['currentStep', 'responses'];
  const missingFields = requiredFields.filter(field => !(field in state));

  if (missingFields.length > 0) {
    throw new AssessmentStateError('Invalid assessment state', {
      currentStep: state.currentStep,
      state,
      expectedStep
    });
  }

  if (expectedStep && state.currentStep !== expectedStep) {
    throw new AssessmentStateError('Unexpected assessment step', {
      currentStep: state.currentStep,
      expectedStep,
      state
    });
  }
}
