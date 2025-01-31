import { AssessmentStep, ValidationError } from './state';

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

export interface AssessmentSectionProps {
  // Core props
  step: AssessmentStep;
  onValidationChange: (isValid: boolean) => void;
  
  // Data
  initialData?: Record<string, any>;
  validationErrors?: ValidationError[];
  
  // Navigation
  onNext?: () => void;
  onBack?: () => void;
  
  // State
  isLoading?: boolean;
  disabled?: boolean;
}

export interface SectionMetadata {
  id: AssessmentStep;
  title: string;
  description: string;
  requiredFields: string[];
} 