export interface IndustryConfig {
  hourlyRate: number;
  processingTimeMultiplier: number;
  errorCostMultiplier: number;
  automationPotential: number;
  implementationCostBase: number;
  costPerError: number;
  savingsMultiplier: number;
  complexityFactor: number;
  processTypes: string[];
}

export type IndustryType = 
  | 'Technology' 
  | 'Real Estate' 
  | 'Healthcare' 
  | 'Financial' 
  | 'Manufacturing' 
  | 'Retail' 
  | 'Other';

export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  Technology: {
    hourlyRate: 75,
    processingTimeMultiplier: 1.2,
    errorCostMultiplier: 500,
    automationPotential: 0.85,
    implementationCostBase: 5000,
    costPerError: 750,
    savingsMultiplier: 1.3,
    complexityFactor: 0.8,
    processTypes: ['Software Development', 'Data Processing', 'System Integration']
  },
  'Real Estate': {
    hourlyRate: 45,
    processingTimeMultiplier: 1.0,
    errorCostMultiplier: 300,
    automationPotential: 0.65,
    implementationCostBase: 3000,
    costPerError: 450,
    savingsMultiplier: 1.1,
    complexityFactor: 0.6,
    processTypes: ['Property Management', 'Document Processing', 'Client Communication']
  },
  Healthcare: {
    hourlyRate: 65,
    processingTimeMultiplier: 1.3,
    errorCostMultiplier: 800,
    automationPotential: 0.70,
    implementationCostBase: 6000,
    costPerError: 1200,
    savingsMultiplier: 1.2,
    complexityFactor: 0.9,
    processTypes: ['Patient Records', 'Insurance Claims', 'Appointment Scheduling']
  },
  Financial: {
    hourlyRate: 85,
    processingTimeMultiplier: 1.4,
    errorCostMultiplier: 1000,
    automationPotential: 0.80,
    implementationCostBase: 7000,
    costPerError: 1500,
    savingsMultiplier: 1.4,
    complexityFactor: 0.85,
    processTypes: ['Transaction Processing', 'Risk Assessment', 'Compliance Reporting']
  },
  Manufacturing: {
    hourlyRate: 55,
    processingTimeMultiplier: 1.1,
    errorCostMultiplier: 600,
    automationPotential: 0.75,
    implementationCostBase: 4000,
    costPerError: 900,
    savingsMultiplier: 1.2,
    complexityFactor: 0.7,
    processTypes: ['Inventory Management', 'Quality Control', 'Production Planning']
  },
  Retail: {
    hourlyRate: 35,
    processingTimeMultiplier: 0.9,
    errorCostMultiplier: 200,
    automationPotential: 0.60,
    implementationCostBase: 2500,
    costPerError: 300,
    savingsMultiplier: 1.0,
    complexityFactor: 0.5,
    processTypes: ['Order Processing', 'Inventory Management', 'Customer Service']
  },
  Other: {
    hourlyRate: 50,
    processingTimeMultiplier: 1.0,
    errorCostMultiplier: 400,
    automationPotential: 0.65,
    implementationCostBase: 4000,
    costPerError: 600,
    savingsMultiplier: 1.1,
    complexityFactor: 0.7,
    processTypes: ['General Administration', 'Document Processing', 'Communication']
  }
};
