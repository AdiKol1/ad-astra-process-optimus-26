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

export interface AssessmentResults {
  assessmentScore: {
    overall: number;
    automationPotential: number;
    sections: Record<string, {
      percentage: number;
    }>;
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
}

export interface AuditState {
  assessmentData: AssessmentData | null;
  results: AssessmentResults | null;
  userInfo: UserInfo | null;
}