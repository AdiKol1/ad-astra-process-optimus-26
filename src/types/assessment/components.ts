import { AssessmentStep } from './steps';
import type { ValidationError } from './validation';
import type { AssessmentResults } from './state';
import type { StepMetadata } from './metadata';

// Base component props
export interface BaseQuestionProps {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: (value: any) => string | undefined;
}

export interface BaseSectionProps {
  title: string;
  description: string;
  questions: BaseQuestionProps[];
}

// Core component props
export interface StepComponentProps {
  step: AssessmentStep;
  onComplete: (results?: AssessmentResults) => void;
  validationErrors: ValidationError[];
  isValid: boolean;
  isLoading: boolean;
  metadata: StepMetadata;
  onNext: () => void;
  onBack: () => void;
  onValidationChange: (isValid: boolean) => void;
  responses?: Record<string, any>;
}

export interface SectionMetadata {
  id: AssessmentStep;
  title: string;
  description: string;
  requiredFields: string[];
}

// Section-specific props
export interface LandingSectionProps extends StepComponentProps {
  startAssessment?: () => void;
}

export type AssessmentSectionProps = StepComponentProps;

// Navigation props
export interface StepNavigation {
  canGoNext: boolean;
  canGoBack: boolean;
  currentStepIndex: number;
  totalSteps: number;
  isComplete: boolean;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  currentStep: AssessmentStep;
  metadata: StepMetadata;
}

// Flow props
export interface AssessmentFlowProps {
  initialStep?: AssessmentStep;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// Results props
export interface ReportHeaderProps {
  userInfo?: {
    companyName?: string;
    industry?: string;
    teamSize?: number;
  };
}

export interface UrgencyBannerProps {
  score?: number;
}

export interface InteractiveReportProps {
  data: {
    assessmentScore: {
      overall: number;
      automationPotential: number;
      sections: Record<string, number>;
    };
    results: {
      annual: {
        savings: number;
        hours: number;
      };
      cac?: number;
    };
    recommendations: any;
    industryAnalysis?: any;
    userInfo?: any;
  };
} 