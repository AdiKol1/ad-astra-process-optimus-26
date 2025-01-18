import { z } from 'zod';

// Core Domain Types
export const IndustrySchema = z.enum([
  'Technology',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'Other'
]);
export type Industry = z.infer<typeof IndustrySchema>;

export const EmployeeRangeSchema = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
]);
export type EmployeeRange = z.infer<typeof EmployeeRangeSchema>;

export const ProcessComplexitySchema = z.enum([
  'Simple',
  'Medium',
  'Complex',
  'Very Complex'
]);
export type ProcessComplexity = z.infer<typeof ProcessComplexitySchema>;

// Assessment Step Types
export type StepId = 'process' | 'details' | 'review' | 'report';

export interface Step {
  id: StepId;
  title: string;
  isComplete: boolean;
  isValid: boolean;
  canNavigateTo: boolean;
}

// Assessment Events
export type AssessmentEvent =
  | { type: 'STEP_COMPLETED'; stepId: StepId }
  | { type: 'VALIDATION_FAILED'; stepId: StepId; errors: ValidationError[] }
  | { type: 'STATE_SAVED' }
  | { type: 'STATE_LOADED' }
  | { type: 'ERROR_OCCURRED'; error: Error };

// Assessment State
export type AssessmentStatus = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'saving' }
  | { status: 'validating', stepId: StepId }
  | { status: 'submitting' }
  | { status: 'completed' }
  | { status: 'error', error: Error };

export interface ValidationError {
  field: string;
  message: string;
}

export interface AssessmentData {
  id: string;
  currentStep: StepId;
  steps: Record<StepId, Step>;
  answers: Partial<ProcessData>;
  validation: ValidationError[];
  lastUpdated: string;
  version: number;
}

export interface ProcessData {
  industry: Industry;
  employees: EmployeeRange;
  processComplexity: ProcessComplexity;
  timeSpent: string;
  processVolume: string;
  errorRate: string;
}

// Storage Interface
export interface StorageStrategy {
  save(data: AssessmentData): Promise<void>;
  load(id: string): Promise<AssessmentData | null>;
  clear(id: string): Promise<void>;
}

// Network Interface
export interface NetworkStrategy {
  submit(data: AssessmentData): Promise<void>;
  validate(data: Partial<AssessmentData>): Promise<ValidationError[]>;
}

// Analytics Interface
export interface AnalyticsStrategy {
  trackEvent(event: string, properties?: Record<string, unknown>): void;
  trackError(error: Error): void;
}
