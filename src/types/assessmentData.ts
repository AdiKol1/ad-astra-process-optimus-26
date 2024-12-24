export interface AssessmentResponse {
  industry?: string;
  teamSize?: string[];
  processVolume?: string;
  timelineExpectation?: string;
  marketingChallenges?: string[];
  toolStack?: string[];
  metricsTracking?: string[];
  automationLevel?: string;
  name?: string;
  email?: string;
  phone?: string;
}

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

export interface AssessmentState {
  responses: AssessmentResponse;
  currentStep: number;
  totalSteps: number;
  completed?: boolean;
  qualificationScore?: number;
  automationPotential?: number;
  sectionScores?: Record<string, { percentage: number }>;
  results?: {
    annual: {
      savings: number;
      hours: number;
    };
  };
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}