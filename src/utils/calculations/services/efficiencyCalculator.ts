import { INDUSTRY_STANDARDS } from '../industry/industryStandards';
import type { CalculationInput, CalculationResults } from '../types/calculationTypes';

export const calculateEfficiency = (
  input: CalculationInput
): CalculationResults['efficiency'] => {
  console.log('Calculating efficiency metrics with input:', input);
  
  const standards = INDUSTRY_STANDARDS[input.industry] || INDUSTRY_STANDARDS.Other;
  
  // Calculate time reduction
  const timeReduction = Math.round(input.timeSpent * standards.automationPotential);
  
  // Calculate error reduction
  const errorReduction = calculateErrorReduction(input.errorRate, standards);
  
  // Calculate productivity gain
  const productivity = calculateProductivityGain(
    input.employees,
    input.timeSpent,
    input.processVolume,
    standards
  );
  
  return {
    timeReduction,
    errorReduction,
    productivity
  };
};

const calculateErrorReduction = (
  errorRate: string,
  standards: typeof INDUSTRY_STANDARDS.Other
): number => {
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};

const calculateProductivityGain = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  standards: typeof INDUSTRY_STANDARDS.Other
): number => {
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * standards.automationPotential);
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  const finalGain = Math.round(baseGain * standards.savingsMultiplier * volumeMultiplier);
  
  const maxGain = Math.min(45, 45 * standards.savingsMultiplier);
  return Math.min(Math.max(finalGain, 15), maxGain);
};

const getVolumeMultiplier = (processVolume: string): number => {
  const multipliers: Record<string, number> = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  };
  return multipliers[processVolume] || 1;
};