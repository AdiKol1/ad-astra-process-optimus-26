import { AssessmentData, SectionScore } from './assessment';

export interface AssessmentStep {
  id: string;
  data: {
    title: string;
    description?: string;
    questions: Question[];
  };
}

export interface Question {
  id: string;
  type: 'text' | 'select' | 'multiSelect' | 'email' | 'tel';
  label: string;
  text?: string;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: (value: any) => string | undefined;
}

export interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

export interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
}

export interface QuestionSectionProps {
  section: {
    title: string;
    description?: string;
    questions: Question[];
  };
  onAnswer: (questionId: string, answer: any) => void;
  answers: Record<string, any>;
  errors?: Record<string, string>;
}