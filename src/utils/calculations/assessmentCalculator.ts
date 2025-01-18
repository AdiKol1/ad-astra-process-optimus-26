import { getIndustryConfig } from './config/industryConfig';
import { calculateEfficiencyScore, calculateErrorReduction } from './calculators/efficiencyCalculator';
import { calculateCosts } from './calculators/costCalculator';
import { calculateSavings } from './calculators/savingsCalculator';
import type { CalculationResults, CalculationInput } from './types/calculationTypes';

const requiredFields = ['industry', 'employees', 'timeSpent', 'processVolume', 'errorRate', 'processComplexity'];
const calculateAssessmentResults = (input: CalculationInput): CalculationResults => {
  const missingFields = requiredFields.filter(field => !input[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  try {
    // Convert string values to numbers if needed
    const employees = typeof input.employees === 'string' 
      ? parseInt(input.employees.split('-')[0], 10) 
      : input.employees;
      
    const timeSpent = typeof input.timeSpent === 'string'
      ? parseFloat(input.timeSpent.split('-')[0])
      : input.timeSpent;

    const processVolume = typeof input.processVolume === 'string' 
      ? parseInt(input.processVolume.split('-')[0], 10) 
      : input.processVolume;

    const errorRate = typeof input.errorRate === 'string'
      ? parseFloat(input.errorRate.replace('%', ''))
      : input.errorRate;

    if (isNaN(employees) || isNaN(timeSpent) || isNaN(processVolume) || isNaN(errorRate)) {
      throw new Error('Invalid numeric values in input');
    }

    console.log('Calculating assessment results with input:', input);
  
    const config = getIndustryConfig(input.industry);
    
    // Calculate costs
    const costs = calculateCosts(
      employees,
      timeSpent,
      processVolume,
      errorRate,
      config
    );
    
    // Calculate savings
    const savings = calculateSavings(
      employees,
      timeSpent,
      processVolume,
      errorRate,
      config
    );
  
    // Calculate efficiency metrics
    const efficiency = {
      timeReduction: Math.round(timeSpent * config.automationPotential),
      errorReduction: calculateErrorReduction(errorRate, config),
      productivity: calculateEfficiencyScore(
        timeSpent,
        processVolume,
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
  } catch (error) {
    throw new Error(`Error calculating assessment results: ${error.message}`);
  }
};

export default calculateAssessmentResults;