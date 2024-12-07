export interface AuditFormData {
  employees: string;
  processVolume: string;
  industry: string;
  timelineExpectation: string;
}

export interface AssessmentData {
  processDetails: {
    employees: number;
    processVolume: string;
    industry: string;
    timeline: string;
  };
  technology: {
    currentSystems: string[];
    integrationNeeds: string[];
  };
  processes: {
    manualProcesses: string[];
    timeSpent: number;
    errorRate: string;
  };
  team: {
    teamSize: number;
    departments: string[];
  };
  challenges: {
    painPoints: string[];
    priority: string;
  };
  goals: {
    objectives: string[];
    expectedOutcomes: string[];
  };
  results?: {
    annual: {
      savings: number;
      hours: number;
    };
    automationPotential: number;
    roi: number;
  };
}

export interface CACMetrics {
  currentCAC: number;
  potentialReduction: number;
  annualSavings: number;
  automationROI: number;
  efficiency: number;
}
