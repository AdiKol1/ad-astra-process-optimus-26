import { IndustryStandard } from '../types/calculationTypes';

export const INDUSTRY_STANDARDS: Record<string, IndustryStandard> = {
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.70,
    processingTimeMultiplier: 1.4,
    costPerError: 150,
    savingsMultiplier: 1.3,
    regulatoryComplexity: 0.8,
    dataSecurityRequirement: 0.9
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.80,
    processingTimeMultiplier: 1.3,
    costPerError: 200,
    savingsMultiplier: 1.4,
    regulatoryComplexity: 0.7,
    dataSecurityRequirement: 0.9
  },
  'Technology': {
    baseErrorRate: 0.03,
    automationPotential: 0.85,
    processingTimeMultiplier: 1.1,
    costPerError: 75,
    savingsMultiplier: 1.5,
    regulatoryComplexity: 0.4,
    dataSecurityRequirement: 0.7
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.65,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.1,
    regulatoryComplexity: 0.5,
    dataSecurityRequirement: 0.6
  }
};