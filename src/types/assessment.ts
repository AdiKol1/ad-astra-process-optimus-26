import { Dispatch } from 'react';
import type { AssessmentRecommendation } from './assessment/calculations';

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

export interface ValidationError {
  field: string;
  message: string;
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
  step: AssessmentStep
  data: StepData
  isValid: Record<AssessmentStep, boolean>
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
  manualProcesses: string[];
  teamSize: number;
  industry: Industry;
  marketingSpend: number;
  customerVolume: number;
  toolStack: string[];
  
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
  efficiency: number;
  costSavings: number;
  timeReduction: number;
  recommendations: Recommendation[];
  summary: string;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
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
  step: AssessmentStep;
  completed: boolean;
  responses: Record<string, any>;
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  results: AssessmentResults | null;
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

// Core Interfaces
export interface AssessmentState {
  step: AssessmentStep;
  completed: boolean;
  responses: Record<string, any>;
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  results: AssessmentResults | null;
}

export interface AssessmentResponses {
  industry: Industry;
  teamSize: number;
  processVolume: ProcessVolume;
  errorRate: ErrorRate;
  automationLevel: string;
  currentTools: string[];
  manualProcesses: string[];
  challenges: string[];
  objectives: string[];
  timeline: string;
  budget: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AssessmentMetrics {
  efficiency: EfficiencyMetrics;
  cost: CostMetrics;
  roi: ROIMetrics;
}

export interface EfficiencyMetrics {
  current: number;
  potential: number;
  improvement: number;
  automationScore: number;
}

export interface CostMetrics {
  current: number;
  projected: number;
  savings: number;
  paybackPeriod: number;
}

export interface ROIMetrics {
  oneYear: number;
  threeYear: number;
  fiveYear: number;
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

// Configuration Types
export interface IndustryConfig {
  automationPotential: number;
  savingsMultiplier: number;
  processComplexity: number;
  riskFactor: number;
}

export interface ProcessConfig {
  baseEfficiency: number;
  automationImpact: number;
  costMultiplier: number;
}

// Context Types
export interface AssessmentContextType {
  state: AssessmentState;
  dispatch: Dispatch<AssessmentAction>;
}

export type AssessmentAction =
  | { type: 'SET_STEP'; payload: AssessmentStep }
  | { type: 'UPDATE_RESPONSES'; payload: Record<string, any> }
  | { type: 'SET_VALIDATION_ERRORS'; payload: Record<string, string[]> }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'SET_RESULTS'; payload: AssessmentResults }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'COMPLETE_ASSESSMENT' }
  | { type: 'RESET_ASSESSMENT' };

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
}

// Monitoring Types
export interface AssessmentEvent {
  type: string;
  step?: AssessmentStep;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  errorCount: number;
}

// Type Guards
export function isIndustry(value: unknown): value is Industry {
  return typeof value === 'string' && Object.values(Industry).includes(value as Industry);
}

export function isProcessVolume(value: unknown): value is ProcessVolume {
  return typeof value === 'string' && Object.values(ProcessVolume).includes(value as ProcessVolume);
}

export function isErrorRate(value: unknown): value is ErrorRate {
  return typeof value === 'string' && Object.values(ErrorRate).includes(value as ErrorRate);
}

export function isAssessmentStep(value: unknown): value is AssessmentStep {
  return typeof value === 'string' && Object.values(AssessmentStep).includes(value as AssessmentStep);
}

export function isImpactLevel(value: unknown): value is ImpactLevel {
  return typeof value === 'string' && ['Low', 'Medium', 'High'].includes(value);
}

export const STEPS = [
  AssessmentStep.Initial,
  AssessmentStep.Process,
  AssessmentStep.Technology,
  AssessmentStep.Team,
  AssessmentStep.Results,
  AssessmentStep.Complete
] as const;
