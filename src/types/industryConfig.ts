export interface IndustryConfig {
  hourlyRate: number;
  automationPotential: number;
  errorCostMultiplier: number;
  scalingFactor: number;
  implementationCostBase: number;
}

export type IndustryType = 
  | 'Technology'
  | 'Healthcare'
  | 'Financial'
  | 'Manufacturing'
  | 'Retail'
  | 'Other';

export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  Technology: {
    hourlyRate: 85,
    automationPotential: 0.80,
    errorCostMultiplier: 1.5,
    scalingFactor: 0.85,
    implementationCostBase: 100000
  },
  Healthcare: {
    hourlyRate: 75,
    automationPotential: 0.70,
    errorCostMultiplier: 2.0,
    scalingFactor: 0.80,
    implementationCostBase: 120000
  },
  Financial: {
    hourlyRate: 95,
    automationPotential: 0.75,
    errorCostMultiplier: 2.5,
    scalingFactor: 0.75,
    implementationCostBase: 150000
  },
  Manufacturing: {
    hourlyRate: 65,
    automationPotential: 0.85,
    errorCostMultiplier: 1.8,
    scalingFactor: 0.90,
    implementationCostBase: 80000
  },
  Retail: {
    hourlyRate: 45,
    automationPotential: 0.65,
    errorCostMultiplier: 1.2,
    scalingFactor: 0.95,
    implementationCostBase: 60000
  },
  Other: {
    hourlyRate: 70,
    automationPotential: 0.70,
    errorCostMultiplier: 1.5,
    scalingFactor: 0.85,
    implementationCostBase: 100000
  }
};
