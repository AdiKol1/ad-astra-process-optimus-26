import { getIndustryStandard } from './industryStandards';
import { getVolumeMultiplier } from './costCalculators';

export const getErrorReduction = (errorRate: string, industry: string): number => {
  const standards = getIndustryStandard(industry);
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};

export const getProductivityGain = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  industry: string
): number => {
  const standards = getIndustryStandard(industry);
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * standards.automationPotential);
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  const finalGain = Math.round(baseGain * standards.savingsMultiplier * volumeMultiplier);
  const maxGain = Math.min(45, 45 * standards.savingsMultiplier);
  return Math.min(Math.max(finalGain, 15), maxGain);
};