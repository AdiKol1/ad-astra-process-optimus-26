export interface IndustryConfig {
  hourlyRate: number;
  processingTimeMultiplier: number;
  errorCostMultiplier: number;
  automationPotential: number;
  implementationCostBase: number;
}

export type IndustryType = 
  | 'Technology' 
  | 'Real Estate' 
  | 'Healthcare' 
  | 'Finance' 
  | 'Manufacturing' 
  | 'Retail' 
  | 'Other';

export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  Technology: {
    hourlyRate: 75,
    processingTimeMultiplier: 1.2,
    errorCostMultiplier: 500,
    automationPotential: 0.85,
    implementationCostBase: 5000
  },
  'Real Estate': {
    hourlyRate: 45,
    processingTimeMultiplier: 1.0,
    errorCostMultiplier: 300,
    automationPotential: 0.65,
    implementationCostBase: 3000
  },
  Healthcare: {
    hourlyRate: 65,
    processingTimeMultiplier: 1.3,
    errorCostMultiplier: 800,
    automationPotential: 0.70,
    implementationCostBase: 6000
  },
  Finance: {
    hourlyRate: 85,
    processingTimeMultiplier: 1.4,
    errorCostMultiplier: 1000,
    automationPotential: 0.80,
    implementationCostBase: 7000
  },
  Manufacturing: {
    hourlyRate: 55,
    processingTimeMultiplier: 1.1,
    errorCostMultiplier: 600,
    automationPotential: 0.75,
    implementationCostBase: 4500
  },
  Retail: {
    hourlyRate: 35,
    processingTimeMultiplier: 0.9,
    errorCostMultiplier: 200,
    automationPotential: 0.60,
    implementationCostBase: 2500
  },
  Other: {
    hourlyRate: 50,
    processingTimeMultiplier: 1.0,
    errorCostMultiplier: 400,
    automationPotential: 0.70,
    implementationCostBase: 4000
  }
};
