export interface AuditFormData {
  employees: string;
  processVolume: string;
  industry: string;
  timelineExpectation: string;
}

export interface MarketingMetrics {
  toolMaturity: number;
  automationLevel: number;
  efficiency: number;
  overallScore: number;
}

export interface AssessmentData {
  qualificationScore: number;
  automationPotential: number;
  results: {
    process: {
      annual: {
        savings: number;
        hours: number;
      };
      metrics: {
        efficiency: number;
        savings: number;
        roi: number;
      };
    };
    cac: {
      current: number;
      projected: number;
      reduction: number;
      potentialReduction: number;
      conversionImprovement: number;
    };
  };
  sectionScores: {
    process: number;
    marketing: number;
  };
  recommendations: {
    process: string[];
    marketing: string[];
  };
  industryAnalysis: {
    process: {
      efficiency: number;
      savings: number;
      roi: number;
    };
    marketing: {
      cac: number;
      conversionRate: number;
      automationLevel: number;
    };
  };
  userInfo?: {
    industry?: string;
    role?: string;
  };
  completedAt: string;
}

export interface CACMetrics {
  currentCAC: number;           // Raw CAC value
  potentialReduction: number;   // Decimal (0-1)
  annualSavings: number;        // Dollar value
  automationROI: number;        // Percentage (0-300)
  projectedRevenue: number;     // Dollar value
  conversionImprovement: number; // Percentage (0-100)
}

import type { AssessmentRecommendation } from './assessment/calculations';

export type Step = 'initial' | 'process' | 'technology' | 'team' | 'results' | 'complete'

export const STEPS: Step[] = ['initial', 'process', 'technology', 'team', 'results', 'complete']

export interface ValidationError {
  field: string
  message: string
}

export interface StepData {
  process?: {
    timeSpent?: number
    processVolume?: number
    errorRate?: number
  }
  technology?: {
    digitalTools?: string[]
    automationLevel?: number
    toolStack?: string[]
  }
  team?: {
    teamSize?: number
    skillLevel?: number
    trainingNeeds?: string[]
  }
}

export interface Assessment {
  id: string
  step: Step
  data: StepData
  isValid: Record<Step, boolean>
  isComplete: boolean
  startedAt: string
  lastUpdated: string
}

export interface StepProps {
  data: unknown
  onChange: (data: unknown) => void
  onComplete: () => void
  onBack: () => void
  isValid: boolean
  isSubmitting: boolean
}

export interface AssessmentResponses {
  // Process Assessment
  manualProcesses: string[];  // Required, no longer optional
  teamSize: number;           // Required, no longer optional
  industry: string;           // Required, no longer optional
  marketingSpend: number;     // Required for CAC
  customerVolume: number;     // Required for CAC
  toolStack: string[];       // Required for tech score
  
  // Technology Assessment
  currentTech: string[];
  integrationNeeds: string[];
  techChallenges: string[];
  
  // Team Assessment
  teamStructure: string;
  teamSkills: string[];
  trainingNeeds: string[];
}

export interface AssessmentResults {
  scores: {
    processScore: number;
    technologyScore: number;
    teamScore: number;
    totalScore: number;
  };
  recommendations: AssessmentRecommendation[];
  calculatedAt: string;
}

export interface ResultsVisualizationProps {
  scores: {
    process: number;
    technology: number;
    team: number;
  };
}

export interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface SectionScore {
  score: number;
  confidence: number;
  efficiency?: number;
  toolMaturity?: number;
  automationLevel?: number;
  areas: Array<{
    name: string;
    score: number;
    insights: string[];
  }>;
}

export interface AssessmentState {
  step: Step;
  responses: Partial<AssessmentResponses>;  // Partial during form filling
  results: AssessmentResults | null;
  loading: boolean;
  error: string | null;
  validationErrors: ValidationError[];
}

export interface AssessmentValidation {
  isValid: boolean;
  errors: ValidationError[];
  requiredFields: {
    process: Array<keyof AssessmentResponses>;
    technology: Array<keyof AssessmentResponses>;
    team: Array<keyof AssessmentResponses>;
  };
}
