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
  const employees = Number(answers.employees) || 0;
  const timeSpent = Number(answers.timeSpent) || 0;
  const processVolume = answers.processVolume || "Less than 100";
  const errorRate = answers.errorRate || "1-2%";

  // Calculate current costs with more conservative estimates
  const laborCosts = calculateLaborCosts(employees, timeSpent);
  const errorCosts = calculateErrorCosts(processVolume, errorRate);
  const operationalCosts = calculateOperationalCosts(processVolume);

  // Calculate potential savings with more realistic reduction percentages
  const potentialSavings = {
    labor: laborCosts * 0.3, // Reduced from 0.6 to 0.3 (30% savings)
    errors: errorCosts * 0.5, // Reduced from 0.8 to 0.5 (50% reduction)
    operational: operationalCosts * 0.2 // Reduced from 0.4 to 0.2 (20% savings)
  };

  return {
    costs: {
      current: laborCosts + errorCosts + operationalCosts,
      projected: calculateProjectedCosts(potentialSavings)
    },
    savings: {
      monthly: calculateMonthlySavings(potentialSavings),
      annual: calculateAnnualSavings(potentialSavings)
    },
    efficiency: {
      timeReduction: calculateTimeReduction(timeSpent),
      errorReduction: calculateErrorReduction(errorRate),
      productivity: calculateProductivityGain(employees, timeSpent)
    }
  };
};

const calculateLaborCosts = (employees: number, timeSpent: number): number => {
  const averageHourlyRate = 25; // Reduced from 35 to 25
  return employees * timeSpent * 52 * averageHourlyRate;
};

const calculateErrorCosts = (processVolume: string, errorRate: string): number => {
  const volumeMap: Record<string, number> = {
    "Less than 100": 50,
    "100-500": 250, // Reduced from 300
    "501-1000": 750,
    "1001-5000": 2500, // Reduced from 3000
    "More than 5000": 5000 // Reduced from 7500
  };
  
  const errorRateMap: Record<string, number> = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12 // Reduced from 0.15
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;
  const costPerError = 15; // Reduced from 25

  return volume * rate * costPerError * 12;
};

const calculateOperationalCosts = (processVolume: string): number => {
  const volumeMap: Record<string, number> = {
    "Less than 100": 500, // Reduced from 1000
    "100-500": 1500, // Reduced from 2500
    "501-1000": 3000, // Reduced from 5000
    "1001-5000": 6000, // Reduced from 10000
    "More than 5000": 12000 // Reduced from 20000
  };

  return volumeMap[processVolume] || 1500;
};

const calculateTimeReduction = (timeSpent: number): number => {
  return Math.min(timeSpent * 0.3, 20); // Reduced from 0.6 to 0.3, max 20 hours
};

const calculateProjectedCosts = (savings: Record<string, number>): number => {
  return Object.values(savings).reduce((total, value) => total - value, 0);
};

const calculateMonthlySavings = (savings: Record<string, number>): number => {
  return Object.values(savings).reduce((total, value) => total + value, 0) / 12;
};

const calculateAnnualSavings = (savings: Record<string, number>): number => {
  return Object.values(savings).reduce((total, value) => total + value, 0);
};

const calculateErrorReduction = (errorRate: string): number => {
  const errorRateMap: Record<string, number> = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  };
  return errorRateMap[errorRate] || 85;
};

const calculateProductivityGain = (employees: number, timeSpent: number): number => {
  return Math.min((timeSpent * 0.3) / (employees * 40) * 100, 100);
};
