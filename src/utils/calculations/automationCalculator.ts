import { INDUSTRY_STANDARDS } from './constants/industryStandards';
import { getErrorCosts, getVolumeMultiplier } from './helpers/volumeHelpers';
import { getOperationalCosts, getErrorReduction } from './helpers/costHelpers';
import { getProductivityGain } from './helpers/productivityHelpers';
import type { CalculationResults, CalculationInput } from './types/baseTypes';

export const calculateAutomationPotential = (answers: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with answers:', answers);
  
  const input: CalculationInput = {
    employees: Number(answers.employees) || 1,
    timeSpent: Number(answers.timeSpent) || 20,
    processVolume: answers.processVolume || "100-500",
    errorRate: answers.errorRate || "3-5%",
    industry: answers.industry || "Other"
  };

  const industryStandards = INDUSTRY_STANDARDS[input.industry] || INDUSTRY_STANDARDS.Other;
  
  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const hourlyRate = 25 * industryStandards.processingTimeMultiplier;

  const timeSpentOnManual = input.timeSpent;
  const savingsPercentage = industryStandards.automationPotential;
  const timeReduction = Math.round(timeSpentOnManual * savingsPercentage);

  const annualLaborCost = input.employees * timeSpentOnManual * weeksPerYear * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage * industryStandards.savingsMultiplier;

  const errorCosts = getErrorCosts(input.processVolume, input.errorRate, industryStandards.costPerError);
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

  return {
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
      timeReduction: timeReduction,
      errorReduction: getErrorReduction(input.errorRate, input.industry),
      productivity: productivityGain
    }
  };
};