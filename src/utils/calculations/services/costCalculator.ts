import { getIndustryStandards } from './industryStandards';
import { getErrorCosts } from './volumeCalculator';

export const calculateCosts = (
  employees: number,
  timeSpent: number,
  processVolume: string,
  errorRate: string,
  industry: string
) => {
  const standards = getIndustryStandards(industry);
  const hourlyRate = 25 * standards.processingTimeMultiplier;
  const annualLaborCost = employees * timeSpent * 52 * hourlyRate;
  
  const errorCosts = getErrorCosts(processVolume, errorRate, standards.costPerError);
  const operationalCosts = calculateOperationalCosts(processVolume, standards);
  
  const currentCosts = annualLaborCost + errorCosts + operationalCosts;
  const projectedCosts = (annualLaborCost * (1 - standards.automationPotential)) +
                        (errorCosts * 0.2) +
                        (operationalCosts * (1 - standards.automationPotential));
  
  return {
    current: currentCosts,
    projected: projectedCosts
  };
};

const calculateOperationalCosts = (
  processVolume: string,
  standards: ReturnType<typeof getIndustryStandards>
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