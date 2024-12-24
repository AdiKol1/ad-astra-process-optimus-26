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

export interface AssessmentState {
  currentStep: number;
  totalSteps: number;
  responses: AssessmentResponses;
  completed: boolean;
  isLoading: boolean;
  error?: string | null;
}

export interface AssessmentResponses {
  // Process Assessment
  employees?: string;
  processVolume?: string;
  industry?: string;
  timelineExpectation?: string;
  
  // Process Details
  currentSystems?: string[];
  integrationNeeds?: string[];
  manualProcesses?: string[];
  timeSpent?: number;
  errorRate?: string;
  timeWasted?: string;
  implementationCost?: string;
  
  // Team Information
  teamSize?: number;
  departments?: string[];
  
  // Business Impact
  painPoints?: string[];
  priority?: string;
  objectives?: string[];
  expectedOutcomes?: string[];

  // Marketing Assessment
  toolStack?: string[];
  automationLevel?: string;
  marketingBudget?: string;
  metricsTracking?: string[];
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
