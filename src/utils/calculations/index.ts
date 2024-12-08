import { CalculationResults, CalculationInput } from './types';
import { getIndustryStandard } from './industryStandards';
import { calculateLaborCosts, calculateErrorCosts, calculateOperationalCosts } from './costCalculators';
import { calculateErrorReduction, calculateProductivityGain } from './efficiencyCalculators';

export const calculateAutomationPotential = (input: CalculationInput): CalculationResults => {
  console.log('Calculating automation potential with input:', input);
  
  const standards = getIndustryStandard(input.industry);
  const hourlyRate = 25 * standards.processingTimeMultiplier;

  // Calculate time savings
  const savingsPercentage = standards.automationPotential;
  const timeReduction = Math.round(input.timeSpent * savingsPercentage);

  // Calculate costs and savings
  const laborCosts = calculateLaborCosts(input.employees, input.timeSpent, hourlyRate);
  const laborSavings = laborCosts * savingsPercentage * standards.savingsMultiplier;
  
  const errorCosts = calculateErrorCosts(input.processVolume, input.errorRate, input.industry);
  const errorSavings = errorCosts * 0.8;
  
  const operationalCosts = calculateOperationalCosts(input.processVolume, input.industry);
  const operationalSavings = operationalCosts * standards.automationPotential;

  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;

  return {
    costs: {
      current: laborCosts + errorCosts + operationalCosts,
      projected: (laborCosts * (1 - savingsPercentage)) + 
                (errorCosts * 0.2) + 
                (operationalCosts * (1 - standards.automationPotential))
    },
    savings: {
      monthly: Math.round(totalAnnualSavings / 12),
      annual: Math.round(totalAnnualSavings)
    },
    efficiency: {
      timeReduction,
      errorReduction: calculateErrorReduction(input.errorRate, input.industry),
      productivity: calculateProductivityGain(
        input.employees,
        input.timeSpent,
        input.processVolume,
        input.industry
      )
    }
  };
};

export * from './types';