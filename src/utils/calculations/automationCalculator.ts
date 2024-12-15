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

const parseEmployeeCount = (employeeString: string): number => {
  // Handle formats like "6-20 employees"
  if (typeof employeeString === 'string') {
    const match = employeeString.match(/(\d+)(?:-(\d+))?\s*employees?/);
    if (match) {
      // If range (e.g., "6-20"), take the average
      if (match[2]) {
        return Math.round((Number(match[1]) + Number(match[2])) / 2);
      }
      // Single number
      return Number(match[1]);
    }
  }
  // Default to 1 if we can't parse
  return 1;
};

export const calculateAutomationPotential = (answers: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with answers:', answers);
  
  const input = {
    employees: parseEmployeeCount(answers.employees),
    timeSpent: Number(answers.timeSpent) || 20,
    processVolume: answers.processVolume || "100-500",
    errorRate: answers.errorRate || "3-5%",
    industry: (answers.industry as IndustryType) || "Other"
  };

  console.log('Parsed input:', input);

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

  const results = {
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

  console.log('Calculation results:', results);
  return results;
};