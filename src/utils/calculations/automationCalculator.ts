import { INDUSTRY_STANDARDS, IndustryType } from './industry/industryStandards';
import { calculateErrorCosts, calculateOperationalCosts } from './metrics/costCalculator';
import { 
  calculateErrorReduction,
  calculateProductivityGain,
  calculateVolumeMultiplier 
} from './metrics/efficiencyCalculator';

export interface CalculationResults {
  costs: {
    current: number;
    projected: number;
  };
  savings: {
    monthly: number;
    annual: number;
  };
  efficiency: {
    timeReduction: number;
    errorReduction: number;
    productivity: number;
  };
}

export interface CalculationInput {
  employees: number;
  timeSpent: number;
  processVolume: string;
  errorRate: string;
  industry: IndustryType;
}

export const calculateAutomationPotential = (answers: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with answers:', answers);
  
  const input: CalculationInput = {
    employees: Number(answers.employees) || 1,
    timeSpent: Number(answers.timeSpent) || 20,
    processVolume: answers.processVolume || "100-500",
    errorRate: answers.errorRate || "3-5%",
    industry: (answers.industry as IndustryType) || "Other"
  };

  const industryStandards = INDUSTRY_STANDARDS[input.industry];
  
  const timeSpentOnManual = input.timeSpent;
  const savingsPercentage = industryStandards.automationPotential;
  const timeReduction = Math.round(timeSpentOnManual * savingsPercentage);

  const hourlyRate = 25 * industryStandards.processingTimeMultiplier;
  const annualLaborCost = input.employees * timeSpentOnManual * 52 * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage * industryStandards.savingsMultiplier;

  const errorCosts = calculateErrorCosts(input.processVolume, input.errorRate, industryStandards.costPerError);
  const errorSavings = errorCosts * 0.8;

  const operationalCosts = calculateOperationalCosts(input.processVolume, input.industry);
  const operationalSavings = operationalCosts * industryStandards.automationPotential;

  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;

  const productivityGain = calculateProductivityGain(
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
      timeReduction,
      errorReduction: calculateErrorReduction(input.errorRate, input.industry),
      productivity: productivityGain
    }
  };
};