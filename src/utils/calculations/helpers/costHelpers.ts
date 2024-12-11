import { INDUSTRY_STANDARDS } from '../constants/industryStandards';

export const getOperationalCosts = (processVolume: string, industry: string): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  const baseVolumeCosts: Record<string, number> = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return baseVolumeCosts[processVolume] * standards.processingTimeMultiplier || 1500;
};

export const getErrorReduction = (errorRate: string, industry: string): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};