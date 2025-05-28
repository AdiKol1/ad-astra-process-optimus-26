// Assessment Types
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'scale';
  options?: string[];
  required?: boolean;
  dependsOn?: {
    questionId: string;
    value: string | string[];
  };
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentConfig {
  id: string;
  title: string;
  description: string;
  sections: AssessmentSection[];
  estimatedTime?: number;
}

export interface AssessmentResponse {
  questionId: string;
  value: string | string[] | number | boolean;
}

export interface AssessmentResult {
  assessmentId: string;
  userId?: string;
  responses: AssessmentResponse[];
  score?: number;
  recommendations?: string[];
  completedAt: string;
}

export interface ProcessAssessmentProps {
  config: AssessmentConfig;
  onComplete?: (result: AssessmentResult) => void;
  initialData?: Partial<AssessmentResult>;
}

export interface ReportProps {
  result: AssessmentResult;
  config: AssessmentConfig;
  showActions?: boolean;
}

export interface AssessmentErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
} 