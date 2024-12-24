import { getIndustryStandards } from './constants/industryDefaults';
import { parseEmployeeCount } from './helpers/employeeParser';
import type { CalculationResults } from './types/calculationTypes';

export const calculateAutomationPotential = (answers: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with answers:', answers);
  
  const input = {
    employees: parseEmployeeCount(answers.employees),
    timeSpent: Number(answers.timeSpent) || 20,
    processVolume: answers.processVolume || "100-500",
    errorRate: answers.errorRate || "3-5%",
    industry: answers.industry || "Other"
  };

  console.log('Parsed input:', input);

  const industryStandards = getIndustryStandards(input.industry);
  
  const timeSpentOnManual = input.timeSpent;
  const savingsPercentage = industryStandards.automationPotential;
  const timeReduction = Math.round(timeSpentOnManual * savingsPercentage);

  const hourlyRate = 25 * industryStandards.processingTimeMultiplier;
  const annualLaborCost = input.employees * timeSpentOnManual * 52 * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage * industryStandards.savingsMultiplier;

  // Calculate total savings with safe defaults
  const totalAnnualSavings = laborSavings;

  const results: CalculationResults = {
    costs: {
      current: annualLaborCost,
      projected: (annualLaborCost * (1 - savingsPercentage))
    },
    savings: {
      monthly: Math.round(totalAnnualSavings / 12),
      annual: Math.round(totalAnnualSavings)
    },
    efficiency: {
      timeReduction,
      errorReduction: Math.round(industryStandards.baseErrorRate * 100),
      productivity: Math.round(savingsPercentage * 100)
    }
  };

  console.log('Calculation results:', results);
  return results;
};