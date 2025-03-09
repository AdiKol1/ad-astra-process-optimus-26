export interface StepMetadata {
  title: string;
  description: string;
  estimatedTime: string;
  requiredFields: string[];
}

export interface StepConfig extends StepMetadata {} 