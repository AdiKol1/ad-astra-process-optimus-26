import type { StepMetadata } from './metadata';

export type AssessmentStep = 
  | 'initial'
  | 'lead-capture'
  | 'process'
  | 'technology'
  | 'team'
  | 'social-media'
  | 'detailed-results'
  | 'complete';

export const STEP_ORDER: AssessmentStep[] = [
  'initial',
  'lead-capture',
  'process',
  'technology',
  'team',
  'social-media',
  'detailed-results',
  'complete'
];

/**
 * Configuration for each step in the assessment
 */
export interface StepConfig {
  title: string;
  description: string;
  estimatedTime: string;
  requiredFields: string[];
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
export const STEP_CONFIG: Record<AssessmentStep, StepMetadata> = {
  'initial': {
    title: 'Welcome to Process Assessment',
    description: 'Evaluate and optimize your business processes',
    estimatedTime: '2-3 minutes',
    requiredFields: []
  },
  'lead-capture': {
    title: 'Your Information',
    description: 'Tell us about yourself and your business',
    estimatedTime: '3-4 minutes',
    requiredFields: ['name', 'email', 'company']
  },
  'process': {
    title: 'Process Assessment',
    description: 'Evaluate your current business processes',
    estimatedTime: '5-7 minutes',
    requiredFields: ['processVolume', 'timeSpent', 'errorRate']
  },
  'technology': {
    title: 'Technology Assessment',
    description: 'Evaluate your current technology stack',
    estimatedTime: '5-7 minutes',
    requiredFields: ['digitalTools', 'automationLevel', 'toolStack']
  },
  'team': {
    title: 'Team Assessment',
    description: 'Evaluate your team capabilities',
    estimatedTime: '5-7 minutes',
    requiredFields: ['teamSize', 'skillLevel', 'trainingNeeds']
  },
  'social-media': {
    title: 'Social Media Assessment',
    description: 'Evaluate your social media presence and strategy',
    estimatedTime: '5-7 minutes',
    requiredFields: ['platforms', 'postFrequency', 'goals']
  },
  'detailed-results': {
    title: 'Assessment Results',
    description: 'Review your detailed assessment results',
    estimatedTime: '5-7 minutes',
    requiredFields: []
  },
  'complete': {
    title: 'Assessment Complete',
    description: 'Thank you for completing the assessment',
    estimatedTime: '1-2 minutes',
    requiredFields: []
  }
};

export function getNextStep(currentStep: AssessmentStep): AssessmentStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : null;
}

export function getPreviousStep(currentStep: AssessmentStep): AssessmentStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : null;
}

export function getStepProgress(currentStep: AssessmentStep): number {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / STEP_ORDER.length) * 100);
}

export function isValidStep(step: string): step is AssessmentStep {
  return STEP_ORDER.includes(step as AssessmentStep);
}

export function canMoveToStep(currentStep: AssessmentStep, targetStep: AssessmentStep): boolean {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const targetIndex = STEP_ORDER.indexOf(targetStep);
  
  if (targetIndex < currentIndex) return true;
  if (targetIndex > currentIndex + 1) return false;
  
  return true;
}
