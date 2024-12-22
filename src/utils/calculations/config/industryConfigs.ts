export interface IndustryConfig {
  name: string;
  errorRate: number;
  automationPotential: number;
  processingTimeMultiplier: number;
  costPerError: number;
  savingsMultiplier: number;
  maxROI: number;
  marketingMultiplier: number;
  manualPenalty: number;
  baseCAC: number;
}

export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  'Real Estate': {
    name: 'Real Estate',
    errorRate: 0.06,
    automationPotential: 0.45,
    processingTimeMultiplier: 1.2,
    costPerError: 45,
    savingsMultiplier: 0.90,
    maxROI: 2.0,
    marketingMultiplier: 1.2,
    manualPenalty: 1.3,
    baseCAC: 1200
  },
  'Healthcare': {
    name: 'Healthcare',
    errorRate: 0.08,
    automationPotential: 0.55,
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 1.1,
    maxROI: 2.5,
    marketingMultiplier: 1.1,
    manualPenalty: 1.2,
    baseCAC: 1500
  },
  'Financial Services': {
    name: 'Financial Services',
    errorRate: 0.05,
    automationPotential: 0.65,
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.2,
    maxROI: 3.0,
    marketingMultiplier: 1.3,
    manualPenalty: 1.1,
    baseCAC: 1400
  },
  'Other': {
    name: 'Other',
    errorRate: 0.05,
    automationPotential: 0.5,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0,
    maxROI: 2.2,
    marketingMultiplier: 1.0,
    manualPenalty: 1.0,
    baseCAC: 1000
  }
};

export const getIndustryConfig = (industry: string): IndustryConfig => {
  return INDUSTRY_CONFIGS[industry] || INDUSTRY_CONFIGS['Other'];
};