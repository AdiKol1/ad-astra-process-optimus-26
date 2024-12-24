import { CalculationResults } from '../types';
import { INDUSTRY_STANDARDS } from '../industry/industryStandards';
import { getErrorCosts, getOperationalCosts } from '../industry/volumeCalculator';
import { getErrorReduction, getProductivityGain } from '../efficiency/efficiencyCalculator';

export const calculateAutomationPotential = (answers: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with answers:', answers);
  
  const employees = Number(answers.employees) || 1;
  const timeSpent = Number(answers.timeSpent) || 20;
  const processVolume = answers.processVolume || "100-500";
  const errorRate = answers.errorRate || "3-5%";
  const industry = answers.industry || "Other";

  const industryStandards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  
  // Base metrics with industry-specific adjustments
  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const hourlyRate = 25 * industryStandards.processingTimeMultiplier;

  // Calculate time savings based on industry automation potential
  const timeSpentOnManual = timeSpent;
  const savingsPercentage = industryStandards.automationPotential;
  const timeReduction = Math.round(timeSpentOnManual * savingsPercentage);

  // Calculate labor costs and savings with industry multiplier
  const annualLaborCost = employees * timeSpentOnManual * weeksPerYear * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage * industryStandards.savingsMultiplier;

  // Calculate error-related savings
  const errorCosts = getErrorCosts(processVolume, errorRate, industryStandards.costPerError);
  const errorSavings = errorCosts * 0.8; // 80% error reduction

  // Calculate operational savings
  const operationalCosts = getOperationalCosts(processVolume, industry);
  const operationalSavings = operationalCosts * industryStandards.automationPotential;

  // Calculate productivity gain
  const productivityGain = getProductivityGain(employees, timeSpent, processVolume, industry);

  // Total annual savings
  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;

  return {
    costs: {
      current: annualLaborCost + errorCosts + operationalCosts,
      projected: (annualLaborCost * (1 - savingsPercentage)) + 
                (errorCosts * 0.2) + // 80% reduction in errors
                (operationalCosts * (1 - industryStandards.automationPotential))
    },
    savings: {
      monthly: Math.round(totalAnnualSavings / 12),
      annual: Math.round(totalAnnualSavings)
    },
    efficiency: {
      timeReduction: timeReduction,
      errorReduction: getErrorReduction(errorRate, industry),
      productivity: productivityGain
    }
  };
};