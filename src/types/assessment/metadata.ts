export interface StepMetadata {
  title: string;
  description: string;
  estimatedTime: string;
  requiredFields: string[];
}

export type StepConfig = StepMetadata;