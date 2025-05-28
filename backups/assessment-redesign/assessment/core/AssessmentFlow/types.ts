import type { ValidationError } from '@/types/assessment/state';
import type { AssessmentStep } from '@/types/assessment/steps';
import type { StepMetadata } from '@/types/assessment/metadata';

export interface StepComponentProps {
  step: AssessmentStep;
  onComplete: () => void;
  validationErrors: ValidationError[];
  isValid: boolean;
  metadata: StepMetadata;
  isLoading: boolean;
}

export type AssessmentSectionProps = StepComponentProps;

export interface LandingSectionProps extends StepComponentProps {
  // Add any additional props specific to the landing section
  startAssessment?: () => void;
}

export type StepProps = AssessmentSectionProps | LandingSectionProps;

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

export interface StepNavigation {
  canGoNext: boolean;
  canGoBack: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

export interface AssessmentFlowProps {
  initialStep?: ValidStep;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const VALID_STEPS = [
  'initial',
  'process',
  'technology',
  'team',
  'social-media',
  'preview-results',
  'lead-capture',
  'detailed-results',
  'complete'
] as const;

export type ValidStep = typeof VALID_STEPS[number];

// Type guard for step validation
export function isValidStep(step: string): step is ValidStep {
  return VALID_STEPS.includes(step as ValidStep);
}

export const FLOW_STEPS = ['process', 'technology', 'team', 'social-media'] as const;
export type FlowStep = typeof FLOW_STEPS[number];

// Type guard for flow step
export function isFlowStep(step: string): step is FlowStep {
  return FLOW_STEPS.includes(step as FlowStep);
} 