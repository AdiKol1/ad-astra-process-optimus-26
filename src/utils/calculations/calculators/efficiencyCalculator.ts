import { IndustryConfig } from '../types/calculationTypes';
import { getVolumeMultiplier } from '../helpers/volumeHelpers';

export const calculateEfficiencyScore = (
  timeSpent: number,
  processVolume: string,
  industry: string,
  config: IndustryConfig
): number => {
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * config.automationPotential);
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  const finalGain = Math.round(baseGain * config.savingsMultiplier * volumeMultiplier);
  
  const maxGain = Math.min(45, 45 * config.savingsMultiplier);
  return Math.min(Math.max(finalGain, 15), maxGain);
};

export const calculateErrorReduction = (errorRate: string, config: IndustryConfig): number => {
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + config.automationPotential), 95);
};