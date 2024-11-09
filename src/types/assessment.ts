export type AssessmentStep = 'business' | 'processes' | 'goals' | 'results' | 'report';

export interface BusinessInfo {
  industry: string;
  companySize: number;
  revenue: string;
  location?: string;
}

export interface ProcessInfo {
  name: string;
  manualHours: number;
  frequency: string;
  errorRate: number;
  priority: number;
}

export interface FinancialInfo {
  hourlyRate: number;
  operationalCosts: number;
  budget: number;
  timeline: string;
}

export interface GoalsInfo {
  primaryObjectives: string[];
  timeline: string;
  specificTargets: {
    cost: number;
    time: number;
    quality: number;
  };
}

export interface AssessmentData {
  businessInfo: BusinessInfo;
  processes: ProcessInfo[];
  financials: FinancialInfo;
  goals: GoalsInfo;
}