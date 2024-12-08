import { getIndustryStandard } from './industryStandards';

export const calculateErrorReduction = (errorRate: string, industry: string): number => {
  const standards = getIndustryStandard(industry);
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};

export const calculateProductivityGain = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  industry: string
): number => {
  const standards = getIndustryStandard(industry);
  const volumeMultiplier = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  }[processVolume] || 1;
  
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * standards.automationPotential);
  const finalGain = Math.round(baseGain * standards.savingsMultiplier * volumeMultiplier);
  
  return Math.min(Math.max(finalGain, 15), 45);
};