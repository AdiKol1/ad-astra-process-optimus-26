import { monitor } from '@/utils/monitoring/monitor';
import { assessmentMonitor } from '@/utils/monitoring/assessmentMonitor';
import { logger } from '@/utils/logger';

/**
 * Business-critical error types for the assessment flow
 */
export class CalculationError extends Error {
  constructor(
    message: string,
    public readonly metadata: {
      calculationType: string;
      inputData?: any;
      expectedRange?: string;
    }
  ) {
    super(message);
    this.name = 'CalculationError';
  }
}

export class DataValidationError extends Error {
  constructor(
    message: string,
    public readonly metadata: {
      section: string;
      fieldName: string;
      value: any;
      constraints: string[];
    }
  ) {
    super(message);
    this.name = 'DataValidationError';
  }
}

export class BusinessLogicError extends Error {
  constructor(
    message: string,
    public readonly metadata: {
      rule: string;
      impact: 'high' | 'medium' | 'low';
      affectedMetrics: string[];
    }
  ) {
    super(message);
    this.name = 'BusinessLogicError';
  }
}

/**
 * Error handler specifically for assessment-related errors
 */
export function handleAssessmentError(error: Error): void {
  // Log the error
  logger.error('Assessment error occurred:', error);

  // Track the error with appropriate metadata
  if (error instanceof CalculationError) {
    monitor.trackError(error, {
      type: 'calculation_error',
      ...error.metadata,
      severity: 'high',
      requires_immediate_attention: true
    });

    // Track impact on business metrics
    assessmentMonitor.trackDataQuality('calculations', {
      passed: false,
      errors: [error.message]
    });
  } 
  else if (error instanceof DataValidationError) {
    monitor.trackError(error, {
      type: 'validation_error',
      ...error.metadata,
      severity: 'medium'
    });

    // Track data quality impact
    assessmentMonitor.trackDataQuality(error.metadata.section, {
      passed: false,
      errors: [`${error.metadata.fieldName}: ${error.message}`]
    });
  }
  else if (error instanceof BusinessLogicError) {
    monitor.trackError(error, {
      type: 'business_logic_error',
      ...error.metadata,
      severity: error.metadata.impact
    });

    // Track business impact
    assessmentMonitor.trackBusinessMetrics({
      currentStep: -1,  // Indicate error state
      totalSteps: -1,
      responses: {},
      completed: false
    }, {
      error_type: 'business_logic',
      affected_metrics: error.metadata.affectedMetrics
    });
  }
  else {
    // Handle unknown errors
    monitor.trackError(error, {
      type: 'unknown_assessment_error',
      severity: 'high'
    });
  }
}

/**
 * Validation functions for critical business data
 */
export function validateCalculationInput(
  calculationType: string,
  input: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (calculationType) {
    case 'roi':
      if (!input.marketingBudget || isNaN(parseFloat(input.marketingBudget))) {
        errors.push('Invalid marketing budget value');
      }
      if (!input.timelineExpectation) {
        errors.push('Missing timeline expectation');
      }
      break;

    case 'cac':
      if (!input.customerCount || isNaN(parseInt(input.customerCount))) {
        errors.push('Invalid customer count');
      }
      if (!input.acquisitionCost || isNaN(parseFloat(input.acquisitionCost))) {
        errors.push('Invalid acquisition cost');
      }
      break;

    case 'savings':
      if (!input.processVolume || isNaN(parseInt(input.processVolume))) {
        errors.push('Invalid process volume');
      }
      if (!input.currentCost || isNaN(parseFloat(input.currentCost))) {
        errors.push('Invalid current cost');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate business logic rules
 */
export function validateBusinessRules(
  data: any,
  rules: Array<{
    rule: string;
    validator: (data: any) => boolean;
    impact: 'high' | 'medium' | 'low';
    affectedMetrics: string[];
  }>
): void {
  for (const { rule, validator, impact, affectedMetrics } of rules) {
    if (!validator(data)) {
      throw new BusinessLogicError(
        `Business rule violation: ${rule}`,
        {
          rule,
          impact,
          affectedMetrics
        }
      );
    }
  }
}
