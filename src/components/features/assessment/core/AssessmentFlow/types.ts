import type { AssessmentStep } from '@/types/assessment/state';

export const VALID_STEPS = ['initial', 'process', 'technology', 'team', 'results', 'complete'] as const;
export type Step = typeof VALID_STEPS[number];

export const FLOW_STEPS = ['process', 'technology', 'team'] as const;
export type FlowStep = typeof FLOW_STEPS[number];

export interface StepComponentProps {
  step: AssessmentStep;
  onValidationChange: (isValid: boolean) => void;
  onNext: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

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
  initialStep?: Step;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// Type guard for step validation
export function isValidStep(step: string): step is Step {
  return VALID_STEPS.includes(step as Step);
}

// Type guard for flow step
export function isFlowStep(step: string): step is FlowStep {
  return FLOW_STEPS.includes(step as FlowStep);
} 