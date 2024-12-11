import { INDUSTRY_STANDARDS } from '../constants/industryStandards';
import { getVolumeMultiplier } from './volumeHelpers';

export const getProductivityGain = (
  employees: number, 
  timeSpent: number, 
  processVolume: string, 
  industry: string
): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * standards.automationPotential);
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  const finalGain = Math.round(baseGain * standards.savingsMultiplier * volumeMultiplier);
  
  const maxGain = Math.min(45, 45 * standards.savingsMultiplier);
  return Math.min(Math.max(finalGain, 15), maxGain);
};