import { CalculationInput, CalculationResults } from '../types/calculationTypes';
import { getIndustryConfig } from '../config/industryConfig';
import { calculateCosts } from '../calculators/costCalculator';
import { calculateEfficiencyScore, calculateErrorReduction } from '../calculators/efficiencyCalculator';

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
  
  // Calculate savings
  const monthlySavings = Math.round((costs.current - costs.projected) / 12);
  const annualSavings = Math.round(costs.current - costs.projected);

  return {
    costs,
    savings: {
      monthly: monthlySavings,
      annual: annualSavings
    },
    efficiency
  };
};