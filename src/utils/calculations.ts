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

export const calculateAutomationPotential = (answers: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with answers:', answers);
  
  const employees = Number(answers.employees) || 1;
  const timeSpent = Number(answers.timeSpent) || 20;
  const processVolume = answers.processVolume || "100-500";
  const errorRate = answers.errorRate || "3-5%";
  const industry = answers.industry || "Other";

  // Base metrics with more realistic hourly rate
  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const hourlyRate = 25; // Adjusted to more conservative rate

  // Calculate time savings more realistically
  // If team spends 20 hours/week on manual processes, we can save 40-60% of that time
  const timeSpentOnManual = timeSpent;
  const savingsPercentage = 0.5; // 50% time savings through automation
  const timeReduction = Math.round(timeSpentOnManual * savingsPercentage);

  // Calculate labor costs and savings
  const annualLaborCost = employees * timeSpentOnManual * weeksPerYear * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage;

  // Calculate error-related savings
  const errorCosts = getErrorCosts(processVolume, errorRate);
  const errorSavings = errorCosts * 0.8; // 80% error reduction

  // Calculate operational savings
  const operationalCosts = getOperationalCosts(processVolume);
  const operationalSavings = operationalCosts * 0.4; // 40% operational cost reduction

  // Total annual savings
  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;

  // Calculate productivity gain more realistically
  const productivityGain = getProductivityGain(employees, timeSpent, processVolume, industry);

  const results: CalculationResults = {
    costs: {
      current: annualLaborCost + errorCosts + operationalCosts,
      projected: (annualLaborCost * (1 - savingsPercentage)) + 
                (errorCosts * 0.2) + // 80% reduction in errors
                (operationalCosts * 0.6) // 40% reduction in operational costs
    },
    savings: {
      monthly: Math.round(totalAnnualSavings / 12),
      annual: Math.round(totalAnnualSavings)
    },
    efficiency: {
      timeReduction: timeReduction,
      errorReduction: getErrorReduction(errorRate),
      productivity: productivityGain
    }
  };

  console.log('Calculation results:', results);
  return results;
};

// Helper functions with adjusted calculations
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

const getErrorCosts = (processVolume: string, errorRate: string): number => {
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
  const costPerError = 15;

  return volume * rate * costPerError * 12;
};

const getOperationalCosts = (processVolume: string): number => {
  const volumeMap: Record<string, number> = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return volumeMap[processVolume] || 1500;
};

const getErrorReduction = (errorRate: string): number => {
  const errorRateMap: Record<string, number> = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  };
  return errorRateMap[errorRate] || 85;
};

const getProductivityGain = (employees: number, timeSpent: number, processVolume: string, industry?: string): number => {
  // Base productivity gain calculation
  // If X% of time is spent on manual processes that can be 50% automated,
  // then productivity gain should be around (X * 0.5)%
  const percentageTimeOnManual = (timeSpent / 40) * 100; // 40 hours work week
  const baseGain = (percentageTimeOnManual * 0.5); // 50% of manual time can be saved
  
  // Industry multiplier based on automation potential
  const industryMultiplier = {
    'Healthcare': 1.2, // Healthcare has high automation potential
    'Financial Services': 1.3,
    'Technology': 1.3,
    'Manufacturing': 1.25,
    'Professional Services': 1.2,
    'Other': 1.0
  }[industry || 'Other'] || 1.0;
  
  // Volume multiplier
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  
  // Calculate final productivity gain
  const finalGain = Math.round(baseGain * industryMultiplier * volumeMultiplier);
  
  // Cap at reasonable limits
  return Math.min(Math.max(finalGain, 15), 45); // Min 15%, Max 45%
};