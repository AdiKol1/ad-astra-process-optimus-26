import { calculateCosts } from './costCalculator';
import { calculateEfficiencyScore, calculateErrorReduction } from './efficiencyCalculator';
import type { CalculationInput, CalculationResults } from '../types/calculationTypes';

export const calculateAssessmentResults = (input: CalculationInput): CalculationResults => {
  console.log('Calculating assessment results with input:', input);
  
  // Calculate costs
  const costs = calculateCosts(
    input.employees,
    input.timeSpent,
    input.processVolume,
    input.errorRate,
    input.industry
  );
  
  // Calculate efficiency metrics
  const efficiency = {
    timeReduction: Math.round(input.timeSpent * 0.6), // Base automation potential
    errorReduction: calculateErrorReduction(input.errorRate, input.industry),
    productivity: calculateEfficiencyScore(
      input.timeSpent,
      input.processVolume,
      input.industry
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