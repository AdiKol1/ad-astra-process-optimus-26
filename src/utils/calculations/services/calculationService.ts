import { calculateCosts } from './costCalculator';
import { calculateEfficiencyScore, calculateErrorReduction } from './efficiencyCalculator';
import type { CalculationInput, CalculationResults } from '../types/calculationTypes';

export const calculateAssessmentResults = (input: CalculationInput): CalculationResults => {
  console.log('Calculating assessment results with input:', input);
  
  // Validate and normalize input
  const normalizedInput = {
    employees: Math.max(1, Math.min(10000, input.employees)),
    timeSpent: Math.max(1, Math.min(168, input.timeSpent)), // Max hours per week
    processVolume: input.processVolume,
    errorRate: input.errorRate,
    industry: input.industry
  };
  
  // Calculate costs with validated input
  const costs = calculateCosts(
    normalizedInput.employees,
    normalizedInput.timeSpent,
    normalizedInput.processVolume,
    normalizedInput.errorRate,
    normalizedInput.industry
  );
  
  // Calculate efficiency metrics with bounds
  const efficiency = {
    timeReduction: Math.min(normalizedInput.timeSpent * 0.8, // Max 80% time reduction
      Math.round(normalizedInput.timeSpent * 0.6)), // Base automation potential
    errorReduction: Math.min(95, // Max 95% error reduction
      calculateErrorReduction(normalizedInput.errorRate, normalizedInput.industry)),
    productivity: Math.min(85, // Max 85% productivity gain
      calculateEfficiencyScore(
        normalizedInput.timeSpent,
        normalizedInput.processVolume,
        normalizedInput.industry
      ))
  };
  
  // Calculate savings with realistic bounds
  const monthlySavings = Math.round((costs.current - costs.projected) / 12);
  const annualSavings = Math.round(costs.current - costs.projected);

  // Ensure no negative values in results
  const results: CalculationResults = {
    costs: {
      current: Math.max(0, costs.current),
      projected: Math.max(0, costs.projected)
    },
    savings: {
      monthly: Math.max(0, monthlySavings),
      annual: Math.max(0, annualSavings)
    },
    efficiency: {
      timeReduction: Math.max(0, efficiency.timeReduction),
      errorReduction: Math.max(0, efficiency.errorReduction),
      productivity: Math.max(0, efficiency.productivity)
    }
  };

  console.log('Calculation results:', results);
  return results;
};