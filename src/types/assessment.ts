export interface SectionScore {
  score: number;
  confidence: number;
  areas: {
    name: string;
    score: number;
    insights: string[];
  }[];
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  effort: number;
  timeframe: string;
}

export interface IndustryBenchmark {
  metric: string;
  value: number;
  industry: string;
  percentile: number;
}

export interface PotentialSavings {
  annual: number;
  threeYear: number;
  breakdown: {
    category: string;
    amount: number;
    description: string;
  }[];
}

export interface AssessmentResponse {
  responses: Record<string, any>;
  currentStep: number;
  completed: boolean;
}

export interface ProcessDetails {
  employees: number;
  processVolume: string;
  industry: string;
  timeline: string;
}

export interface Technology {
  currentSystems: string[];
  integrationNeeds: string[];
}

export interface Processes {
  manualProcesses: string[];
  timeSpent: number;
  errorRate: string;
}

export interface Team {
  teamSize: number;
  departments: string[];
}

export interface Challenges {
  painPoints: string[];
  priority: string;
}

export interface Goals {
  objectives: string[];
  expectedOutcomes: string[];
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

export interface AssessmentData {
  processDetails: ProcessDetails;
  technology: Technology;
  processes: Processes;
  team: Team;
  challenges: Challenges;
  goals: Goals;
}

export interface AuditFormData {
  name: string;
  email: string;
  phone: string;
  employees: string;
  processVolume: string;
  industry: string;
  timelineExpectation: string;
  message?: string;
}

export interface AssessmentResults {
  assessmentScore: {
    overall: number;
    automationPotential: number;
    sections: Record<string, {
      percentage: number;
    }>;
  };
  results: {
    annual: {
      savings: number;
      hours: number;
    };
    cac?: CACMetrics;
  };
  recommendations: {
    recommendations: Array<{
      title: string;
      description: string;
      impact: string;
      timeframe: string;
      benefits: string[];
    }>;
  };
  industryAnalysis?: {
    benchmarks: {
      averageProcessingTime: string;
      errorRates: string;
      automationLevel: string;
      costSavings: string;
    };
    opportunities: string[];
    risks: string[];
    trends: string[];
  };
  userInfo?: UserInfo;
}

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
}
