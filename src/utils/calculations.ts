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
  
  const employees = Number(answers.employees) || 0;
  const timeSpent = Number(answers.timeSpent) || 0;
  const processVolume = answers.processVolume || "Less than 100";
  const errorRate = answers.errorRate || "1-2%";
  const industry = answers.industry || "Other";

  // Calculate base metrics
  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const hourlyRate = 35;

  // Calculate time savings
  const baseTimeReduction = Math.min(timeSpent * 0.6, hoursPerWeek * 0.4);
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  const timeReduction = Math.round(baseTimeReduction * volumeMultiplier);

  // Calculate costs and savings
  const annualLaborCost = employees * hoursPerWeek * weeksPerYear * hourlyRate;
  const potentialSavings = {
    labor: annualLaborCost * 0.3,
    errors: getErrorCosts(processVolume, errorRate),
    operational: getOperationalCosts(processVolume)
  };

  const results: CalculationResults = {
    costs: {
      current: annualLaborCost,
      projected: annualLaborCost * 0.7
    },
    savings: {
      monthly: (potentialSavings.labor + potentialSavings.errors + potentialSavings.operational) / 12,
      annual: potentialSavings.labor + potentialSavings.errors + potentialSavings.operational
    },
    efficiency: {
      timeReduction: timeReduction,
      errorReduction: getErrorReduction(errorRate),
      productivity: getProductivityGain(employees, timeSpent, processVolume, industry)
    }
  };

  console.log('Calculation results:', results);
  return results;
};

// Helper functions
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
  const baseGain = Math.min((timeSpent / (employees * 40)) * 100, 40);
  
  const industryMultiplier = {
    'Real Estate': 1.2,
    'Healthcare': 1.1,
    'Financial Services': 1.3,
    'Legal': 1.15,
    'Construction': 1.1,
    'Manufacturing': 1.25,
    'Retail': 1.2,
    'Technology': 1.3,
    'Professional Services': 1.2,
    'Other': 1.0
  }[industry || 'Other'] || 1.0;
  
  const volumeMultiplier = getVolumeMultiplier(processVolume);
  
  return Math.min(Math.round(baseGain * volumeMultiplier * industryMultiplier), 100);
};