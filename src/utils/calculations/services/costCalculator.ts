import { INDUSTRY_STANDARDS } from '../industry/industryStandards';
import type { CalculationInput, CalculationResults } from '../types/calculationTypes';

export const calculateCosts = (input: CalculationInput): CalculationResults['costs'] => {
  console.log('Calculating costs with input:', input);
  
  const standards = INDUSTRY_STANDARDS[input.industry as string] || INDUSTRY_STANDARDS.Other;
  const hourlyRate = 25 * standards.processingTimeMultiplier;
  
  // Calculate current costs
  const annualLaborCost = input.employees * input.timeSpent * 52 * hourlyRate;
  const errorCosts = calculateErrorCosts(input.processVolume, input.errorRate, standards.costPerError);
  const operationalCosts = calculateOperationalCosts(input.processVolume, standards);
  
  const currentCosts = annualLaborCost + errorCosts + operationalCosts;
  
  // Calculate projected costs with automation
  const projectedCosts = (annualLaborCost * (1 - standards.automationPotential)) +
                        (errorCosts * 0.2) + // 80% reduction in errors
                        (operationalCosts * (1 - standards.automationPotential));
  
  return {
    current: currentCosts,
    projected: projectedCosts
  };
};

const calculateErrorCosts = (
  processVolume: string,
  errorRate: string,
  costPerError: number
): number => {
  const volumeMap: Record<string, number> = {
    "Less than 100": 50,
    "100-500": 250,
    "501-1000": 750,
    "1001-5000": 2500,
    "More than 5000": 5000
  };
  
  const errorRateMap: Record<string, number> = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;

  return volume * rate * costPerError * 12;
};

const calculateOperationalCosts = (
  processVolume: string,
  standards: typeof INDUSTRY_STANDARDS.Other
): number => {
  const baseVolumeCosts: Record<string, number> = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return baseVolumeCosts[processVolume] * standards.processingTimeMultiplier || 1500;
};