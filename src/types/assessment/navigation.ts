import { AssessmentStep } from './steps';
import type { StepMetadata } from './metadata';

export interface StepValidation {
  isValid: boolean;
  errors: string[];
  attempts: number;
}

export interface StepNavigation {
  currentStep: AssessmentStep;
  canGoNext: boolean;
  canGoBack: boolean;
  currentStepIndex: number;
  totalSteps: number;
  isComplete: boolean;
  timeSpent: number;
}

export interface StepTransition {
  from: AssessmentStep;
  to: AssessmentStep;
  timestamp: number;
  duration?: number;
  validationErrors?: string[];
}

export type ValidStep = AssessmentStep;

export const VALID_STEPS: ValidStep[] = [
  'initial',
  'lead-capture',
  'process',
  'technology',
  'team',
  'social-media',
  'detailed-results',
  'complete'
];

export function isValidStep(step: string): step is ValidStep {
  return VALID_STEPS.includes(step as ValidStep);
}

export function getNextStep(currentStep: ValidStep): ValidStep | null {
  const currentIndex = VALID_STEPS.indexOf(currentStep);
  return currentIndex < VALID_STEPS.length - 1 ? VALID_STEPS[currentIndex + 1] : null;
}

export function getPreviousStep(currentStep: ValidStep): ValidStep | null {
  const currentIndex = VALID_STEPS.indexOf(currentStep);
  return currentIndex > 0 ? VALID_STEPS[currentIndex - 1] : null;
}

export function getStepProgress(currentStep: ValidStep): number {
  const currentIndex = VALID_STEPS.indexOf(currentStep);
  return Math.round(((currentIndex + 1) / VALID_STEPS.length) * 100);
} 