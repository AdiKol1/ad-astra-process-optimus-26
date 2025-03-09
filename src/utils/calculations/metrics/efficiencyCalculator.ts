import { INDUSTRY_STANDARDS, IndustryType } from '../industry/industryStandards';
import type { CalculationInput } from '../types/calculationTypes';

export const calculateErrorReduction = (
  errorRate: string,
  industry: IndustryType
): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};

export const calculateVolumeMultiplier = (processVolume: string): number => {
  const multipliers: Record<string, number> = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  };
  return multipliers[processVolume] || 1;
};

export const calculateProductivityGain = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  industry: IndustryType
): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * standards.automationPotential);
  const volumeMultiplier = calculateVolumeMultiplier(processVolume);
  const finalGain = Math.round(baseGain * standards.savingsMultiplier * volumeMultiplier);
  
  const maxGain = Math.min(45, 45 * standards.savingsMultiplier);
  return Math.min(Math.max(finalGain, 15), maxGain);
};

export const calculateEfficiency = (
  input: CalculationInput
) => {
  void input; // Mark 'input' as used. TODO: Implement efficiency calculations.
  return {}; // Placeholder; adjust as needed.
};