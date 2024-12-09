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

const INDUSTRY_STANDARDS = {
  'Healthcare': {
    baseErrorRate: 0.08, // 8% due to strict documentation requirements
    automationPotential: 0.65, // 65% of tasks can be automated
    processingTimeMultiplier: 1.3, // 30% longer due to compliance checks
    costPerError: 75, // Higher cost due to potential patient impact
    savingsMultiplier: 1.2
  },
  'Financial Services': {
    baseErrorRate: 0.05, // 5% due to regulated processes
    automationPotential: 0.75, // 75% of tasks can be automated
    processingTimeMultiplier: 1.2, // 20% longer due to compliance
    costPerError: 100, // High cost due to financial impact
    savingsMultiplier: 1.3
  },
  'Technology': {
    baseErrorRate: 0.03, // 3% due to existing automation
    automationPotential: 0.8, // 80% of tasks can be automated
    processingTimeMultiplier: 1.0, // Standard processing time
    costPerError: 50,
    savingsMultiplier: 1.3
  },
  'Manufacturing': {
    baseErrorRate: 0.06, // 6% due to complex processes
    automationPotential: 0.7, // 70% of tasks can be automated
    processingTimeMultiplier: 1.15, // 15% longer due to quality checks
    costPerError: 85, // High cost due to material waste
    savingsMultiplier: 1.25
  },
  'Professional Services': {
    baseErrorRate: 0.04, // 4% standard rate
    automationPotential: 0.6, // 60% of tasks can be automated
    processingTimeMultiplier: 1.1,
    costPerError: 60,
    savingsMultiplier: 1.2
  },
  'Legal': {
    baseErrorRate: 0.02, // 2% due to high scrutiny
    automationPotential: 0.55, // 55% of tasks can be automated
    processingTimeMultiplier: 1.4, // 40% longer due to legal review
    costPerError: 150, // Very high cost due to legal implications
    savingsMultiplier: 1.15
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.6,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0
  }
};

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

  // Calculate error-related savings based on industry standards
  const errorCosts = getErrorCosts(processVolume, errorRate, industryStandards.costPerError);
  const errorSavings = errorCosts * 0.8; // 80% error reduction

  // Calculate operational savings
  const operationalCosts = getOperationalCosts(processVolume, industry);
  const operationalSavings = operationalCosts * industryStandards.automationPotential;

  // Total annual savings
  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;

  // Calculate productivity gain with industry considerations
  const productivityGain = getProductivityGain(employees, timeSpent, processVolume, industry);

  const results: CalculationResults = {
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

  console.log('Calculation results:', results);
  return results;
};

// Helper functions with industry-specific calculations
const getVolumeMultiplier = (processVolume: string): number => {
  const multipliers: Record<string, number> = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  };
  return multipliers[processVolume] || 1;
};

const getErrorCosts = (processVolume: string, errorRate: string, costPerError: number): number => {
  const volumeMap: Record<string, number> = {
    "Less than 100": 50,
    "100-500": 250,
    "501-1000": 750,
    "1001-5000": 2500,
    "More than 5000": 5000
  };
  
  const errorRateMap: Record<string, number> = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;

  return volume * rate * costPerError * 12;
};

const getOperationalCosts = (processVolume: string, industry: string): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  const baseVolumeCosts: Record<string, number> = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return baseVolumeCosts[processVolume] * standards.processingTimeMultiplier || 1500;
};

const getErrorReduction = (errorRate: string, industry: string): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};

const getProductivityGain = (employees: number, timeSpent: number, processVolume: string, industry: string): number => {
  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  
  // Base productivity gain calculation based on industry standards
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * standards.automationPotential);
  
  // Volume multiplier
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  
  // Calculate final productivity gain with industry considerations
  const finalGain = Math.round(baseGain * standards.savingsMultiplier * volumeMultiplier);
  
  // Cap at reasonable limits based on industry
  const maxGain = Math.min(45, 45 * standards.savingsMultiplier);
  return Math.min(Math.max(finalGain, 15), maxGain);
};
