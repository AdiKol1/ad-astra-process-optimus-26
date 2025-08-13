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
  industry: Industry;
  teamSize: number;
  challenges: string[];
  objectives: string[];
  timeline: string;
  budget: string;
  currentTools: string[];
  manualProcesses: string[];
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

// Assessment Step Types
export enum AssessmentStep {
  Initial = 'initial',
  Process = 'process',
  Technology = 'technology',
  Team = 'team',
  Results = 'results',
  Complete = 'complete'
}

// Industry Types
export enum Industry {
  Technology = 'Technology',
  Healthcare = 'Healthcare',
  Finance = 'Finance',
  Manufacturing = 'Manufacturing',
  Retail = 'Retail',
  Other = 'Other'
}

// Process Volume Types
export enum ProcessVolume {
  VeryLow = '0-25',
  Low = '26-50',
  Medium = '51-75',
  High = '76-100',
  VeryHigh = '100+'
}

// Error Rate Types
export enum ErrorRate {
  VeryLow = '0-5%',
  Low = '6-10%',
  Medium = '11-15%',
  High = '16-20%',
  VeryHigh = '20%+'
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

export interface AuditFormData {
  employees: string;
  processVolume: string;
  industry: string;
  timelineExpectation: string;
}

export type ImpactLevel = 'Low' | 'Medium' | 'High';

export interface AutomationOpportunity {
  process: string;
  potentialSavings: number;
  complexity: ImpactLevel;
  priority: ImpactLevel;
}

export interface ProcessImprovement {
  area: string;
  recommendation: string;
  impact: ImpactLevel;
}

export interface ToolRecommendation {
  name: string;
  purpose: string;
  benefits: string[];
}

export interface Recommendations {
  automationOpportunities: AutomationOpportunity[];
  processImprovements: ProcessImprovement[];
  toolRecommendations: ToolRecommendation[];
}

export interface AssessmentSummary {
  overview: string;
  keyFindings: string[];
  nextSteps: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
}

export function isIndustry(value: unknown): value is Industry {
  return typeof value === 'string' && Object.values(Industry).includes(value as Industry);
}

export function isProcessVolume(value: unknown): value is ProcessVolume {
  return typeof value === 'string' && Object.values(ProcessVolume).includes(value as ProcessVolume);
}

export function isErrorRate(value: unknown): value is ErrorRate {
  return typeof value === 'string' && Object.values(ErrorRate).includes(value as ErrorRate);
}

export function isImpactLevel(value: unknown): value is ImpactLevel {
  return typeof value === 'string' && ['Low', 'Medium', 'High'].includes(value);
}
