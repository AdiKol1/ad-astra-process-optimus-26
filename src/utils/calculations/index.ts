import { CalculationResults, CalculationInput } from './types';
import { getIndustryStandard } from './industryStandards';
import { getErrorCosts, getOperationalCosts } from './costCalculators';
import { getErrorReduction, getProductivityGain } from './efficiencyCalculators';

export const calculateAutomationPotential = (input: CalculationInput): CalculationResults => {
  console.log('Calculating automation potential with input:', input);
  
  const industryStandards = getIndustryStandard(input.industry);
  
  // Base metrics with industry-specific adjustments
  const weeksPerYear = 52;
  const hourlyRate = 25 * industryStandards.processingTimeMultiplier;

  // Calculate time savings
  const savingsPercentage = industryStandards.automationPotential;
  const timeReduction = Math.round(input.timeSpent * savingsPercentage);

  // Calculate costs and savings
  const annualLaborCost = input.employees * input.timeSpent * weeksPerYear * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage * industryStandards.savingsMultiplier;
  
  const errorCosts = getErrorCosts(input.processVolume, input.errorRate, input.industry);
  const errorSavings = errorCosts * 0.8;
  
  const operationalCosts = getOperationalCosts(input.processVolume, input.industry);
  const operationalSavings = operationalCosts * industryStandards.automationPotential;

  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;
  const productivityGain = getProductivityGain(
    input.employees,
    input.timeSpent,
    input.processVolume,
    input.industry
  );

  const results: CalculationResults = {
    costs: {
      current: annualLaborCost + errorCosts + operationalCosts,
      projected: (annualLaborCost * (1 - savingsPercentage)) + 
                (errorCosts * 0.2) + 
                (operationalCosts * (1 - industryStandards.automationPotential))
    },
    savings: {
      monthly: Math.round(totalAnnualSavings / 12),
      annual: Math.round(totalAnnualSavings)
    },
    efficiency: {
      timeReduction,
      errorReduction: getErrorReduction(input.errorRate, input.industry),
      productivity: productivityGain
    }
  };

  console.log('Calculation results:', results);
  return results;
};

export * from './types';