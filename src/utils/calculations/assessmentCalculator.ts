import { getIndustryConfig } from './config/industryConfig';
import { calculateEfficiencyScore, calculateErrorReduction } from './calculators/efficiencyCalculator';
import { calculateCosts } from './calculators/costCalculator';
import { calculateSavings } from './calculators/savingsCalculator';
import type { CalculationResults, CalculationInput } from './types/calculationTypes';

export const calculateAssessmentResults = (input: CalculationInput): CalculationResults => {
  console.log('Calculating assessment results with input:', input);
  
  const config = getIndustryConfig(input.industry);
  
  // Calculate costs
  const costs = calculateCosts(
    input.employees,
    input.timeSpent,
    input.processVolume,
    input.errorRate,
    config
  );
  
  // Calculate savings
  const savings = calculateSavings(
    input.employees,
    input.timeSpent,
    input.processVolume,
    input.errorRate,
    config
  );
  
  // Calculate efficiency metrics
  const efficiency = {
    timeReduction: Math.round(input.timeSpent * config.automationPotential),
    errorReduction: calculateErrorReduction(input.errorRate, config),
    productivity: calculateEfficiencyScore(
      input.timeSpent,
      input.processVolume,
      input.industry,
      config
    )
  };
  
  const projectedCosts = {
    labor: costs.labor * (1 - config.automationPotential),
    error: costs.error * 0.2 // 80% error reduction
  };

  return {
    costs: {
      current: costs.total,
      projected: projectedCosts.labor + projectedCosts.error
    },
    savings,
    efficiency
  };
};