import { IndustryConfig } from '../config/industryConfig';
import { getErrorCosts } from '../helpers/volumeHelpers';

export const calculateCosts = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  errorRate: string,
  config: IndustryConfig
) => {
  const hourlyRate = 25 * config.processingTimeMultiplier;
  const annualLaborCost = employees * timeSpent * 52 * hourlyRate;
  const errorCosts = getErrorCosts(processVolume, errorRate, config.costPerError);
  
  return {
    labor: annualLaborCost,
    error: errorCosts,
    total: annualLaborCost + errorCosts
  };
};