import { IndustryConfig } from '../config/industryConfig';
import { calculateCosts } from './costCalculator';

export const calculateSavings = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  errorRate: string,
  config: IndustryConfig
) => {
  const costs = calculateCosts(employees, timeSpent, processVolume, errorRate, config);
  const savingsPercentage = config.automationPotential;
  
  const annualSavings = costs.total * savingsPercentage * config.savingsMultiplier;
  
  return {
    monthly: Math.round(annualSavings / 12),
    annual: Math.round(annualSavings)
  };
};