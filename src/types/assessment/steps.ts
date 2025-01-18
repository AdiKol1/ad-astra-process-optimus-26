/**
 * Represents the possible steps in the assessment flow.
 * This type ensures type safety when handling assessment navigation.
 */
export type AssessmentStep =
  | 'initial'      // Initial welcome screen
  | 'lead-capture' // Lead information capture
  | 'process'      // Process assessment
  | 'marketing'    // Marketing assessment
  | 'review'       // Review answers
  | 'complete';    // Assessment complete

/**
 * Configuration for each step in the assessment
 */
export interface StepConfig {
  id: AssessmentStep;
  title: string;
  description?: string;
  isOptional?: boolean;
  requiredFields?: string[];
  nextStep?: AssessmentStep;
  prevStep?: AssessmentStep;
}

/**
 * Step validation result
 */
export interface StepValidation {
  isValid: boolean;
  errors: string[];
  missingFields: string[];
}

/**
 * Maps each step to its configuration
 */
export const STEP_CONFIG: Record<AssessmentStep, StepConfig> = {
  initial: {
    id: 'initial',
    title: 'Welcome to the Assessment',
    nextStep: 'lead-capture'
  },
  'lead-capture': {
    id: 'lead-capture',
    title: 'Your Information',
    description: 'Tell us about yourself and your business',
    requiredFields: ['name', 'email', 'company'],
    prevStep: 'initial',
    nextStep: 'process'
  },
  process: {
    id: 'process',
    title: 'Process Assessment',
    description: 'Evaluate your current business processes',
    prevStep: 'lead-capture',
    nextStep: 'marketing'
  },
  marketing: {
    id: 'marketing',
    title: 'Marketing Assessment',
    description: 'Evaluate your marketing effectiveness',
    prevStep: 'process',
    nextStep: 'review'
  },
  review: {
    id: 'review',
    title: 'Review',
    description: 'Review your answers before submission',
    prevStep: 'marketing',
    nextStep: 'complete'
  },
  complete: {
    id: 'complete',
    title: 'Assessment Complete',
    description: 'Thank you for completing the assessment',
    prevStep: 'review'
  }
};
