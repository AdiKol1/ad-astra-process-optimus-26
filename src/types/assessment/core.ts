export type QuestionType = 'select' | 'text' | 'email' | 'tel' | 'multiSelect';

export type ProcessComplexity = 
  | 'Simple - Linear flow with few decision points'
  | 'Medium - Some complexity with decision points'
  | 'Complex - Many decision points and variations'
  | 'Very Complex - Multiple integrations and custom logic';

export type Industry = 
  | 'Technology'
  | 'Healthcare'
  | 'Financial Services'
  | 'Real Estate'
  | 'Other';

export type EmployeeRange = 
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

export type TimeSpentRange = 
  | '0-10'
  | '11-20'
  | '20-40'
  | '40+';

export type ProcessVolumeRange = 
  | '0-50'
  | '51-100'
  | '100-500'
  | '500+';

export type ErrorRateRange = 
  | '0-1%'
  | '1-3%'
  | '3-5%'
  | '5%+';

export interface AssessmentResponses {
  industry: Industry;
  employees: EmployeeRange;
  timeSpent: TimeSpentRange;
  processVolume: ProcessVolumeRange;
  errorRate: ErrorRateRange;
  processComplexity: ProcessComplexity;
}

export interface BaseQuestion {
  id: keyof AssessmentResponses;
  type: QuestionType;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: (value: any) => boolean | string | undefined;
  label: string;
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

export interface AssessmentResults {
  costs: {
    current: number;
    projected: number;
  };
  savings: {
    annual: number;
    fiveYear: number;
  };
  efficiency: {
    timeReduction: number;
    errorReduction: number;
    productivity: number;
  };
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
  onNext: () => Promise<void>;
  onBack: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export interface AssessmentFormData {
  name: string;
  email: string;
  company: string;
  responses: AssessmentResponses;
}
