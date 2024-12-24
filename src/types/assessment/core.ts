export type QuestionType = 'select' | 'text' | 'email' | 'tel' | 'multiSelect';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: (value: any) => boolean | string | undefined;
  label?: string;
  text?: string;
}

export type Question = BaseQuestion;

export interface StepData {
  id: string;
  data: {
    title: string;
    description?: string;
    questions: Question[];
  };
}

export interface AssessmentFormData {
  name: string;
  email: string;
  company: string;
  employees: string;
  processVolume: string;
  industry: string;
  timelineExpectation: string;
  responses: Record<string, any>;
}

export interface AssessmentStep {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  isComplete?: boolean;
  isActive?: boolean;
}

export interface AssessmentStepProps {
  step: AssessmentStep;
  onNext: () => void;
  onBack: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}
