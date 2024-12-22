import { IndustryConfig } from '../types/calculationTypes';

export const INDUSTRY_STANDARDS: Record<string, IndustryConfig> = {
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.65,
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 1.2
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.75,
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.3
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.6,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0
  }
};

export const getIndustryConfig = (industry: string): IndustryConfig => {
  return INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
};