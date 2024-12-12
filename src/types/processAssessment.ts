// Time ranges for process assessment
export type TimeRange = 
  | 'LESS_THAN_10'
  | '10_TO_20'
  | '20_TO_40'
  | '40_TO_60'
  | 'MORE_THAN_60';

// Error rate ranges
export type ErrorRange = 
  | 'LESS_THAN_1'
  | '1_TO_5'
  | '5_TO_10'
  | 'MORE_THAN_10'
  | 'NOT_TRACKED';

// Volume ranges that align with calculations
export type VolumeRange = 
  | 'LESS_THAN_100'
  | '100_TO_500'
  | '500_TO_1000'
  | '1000_TO_5000'
  | 'MORE_THAN_5000';

// Manual process types
export type ManualProcessType = 
  | 'DATA_ENTRY'
  | 'DOCUMENT_PROCESSING'
  | 'CUSTOMER_COMMUNICATION'
  | 'REPORTING'
  | 'INVOICE_PROCESSING'
  | 'SCHEDULING'
  | 'APPROVAL_WORKFLOWS'
  | 'OTHER';

// Structured process assessment response
export interface ProcessAssessmentResponse {
  manualProcesses: ManualProcessType[];
  timeSpent: TimeRange[];
  errorRate: ErrorRange[];
  processVolume: VolumeRange;
}

// Range mappings for calculations
export interface RangeMapping<T extends string> {
  displayText: string;
  value: T;
  numericalValue: number;
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
