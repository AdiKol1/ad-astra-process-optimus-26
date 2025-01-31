// Core assessment types
export interface AssessmentMetrics {
  timeSpent: string;
  processVolume: string;
  errorRate: string;
  complexity: string;
}

export interface AutomationFactors {
  processDocumentation: boolean;
  digitalTools: boolean;
  standardization: boolean;
  integration: boolean;
}

export interface UserInfo {
  name?: string;
  email?: string;
  company?: string;
  industry?: string;
}

export interface BusinessMetrics {
  marketingBudget: string;
  automationLevel: string;
  toolStack: string[];
  metricsTracking: string[];
}

export interface AssessmentResponses extends AssessmentMetrics, AutomationFactors, BusinessMetrics {
  userInfo?: UserInfo;
}

export interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  responses: AssessmentResponses;
  completed: boolean;
}

export interface AssessmentValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  requiredFields: Record<string, string[]>;
}

export interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  validations?: string[];
}

// Navigation types
export interface NavigationButtonsProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

// Process assessment types
export interface ProcessMetrics {
  efficiency: number;
  automation: number;
  quality: number;
  cost: number;
}

export interface ProcessResults {
  metrics: ProcessMetrics;
  recommendations: string[];
  savings: {
    time: number;
    cost: number;
  };
}

// Marketing assessment types
export interface MarketingMetrics {
  cac: number;
  roi: number;
  conversion: number;
  reach: number;
}

export interface MarketingResults {
  metrics: MarketingMetrics;
  recommendations: string[];
  improvements: {
    efficiency: number;
    cost: number;
  };
}

export interface CACMetrics {
  current: number;
  projected: number;
  potentialReduction: number;
  conversionImprovement: number;
}

export interface AssessmentResults {
  savings: {
    annual: number;
    monthly: number;
  };
  metrics: {
    efficiency: number;
    roi: number;
    automationLevel: number;
    paybackPeriodMonths: number;
  };
  costs: {
    current: number;
    projected: number;
    breakdown: {
      labor: { current: number; projected: number };
      tools: { current: number; projected: number };
      overhead: { current: number; projected: number };
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
}

export interface AssessmentData {
  qualificationScore?: number;
  automationPotential?: number;
  results?: {
    annual: {
      savings: number;
      hours: number;
    };
    cac: CACMetrics;
  };
  sectionScores?: {
    process: number;
    marketing: number;
  };
  recommendations?: {
    process: string[];
    marketing: string[];
  };
  industryAnalysis?: {
    process: string[];
    marketing: string[];
  };
  userInfo?: UserInfo;
  completedAt?: string;
}

// Visualization types
export interface ResultsVisualizationProps {
  scores: {
    process: number;
    technology: number;
    team: number;
  };
}
