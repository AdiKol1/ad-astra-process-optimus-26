import type { AssessmentData } from '@/types/assessment';

export const calculateROI = (data: AssessmentData) => {
  // Basic ROI calculation
  const currentCosts = calculateCurrentCosts(data);
  const potentialSavings = calculatePotentialSavings(currentCosts);
  const implementationCost = estimateImplementationCost(data.processes.length);
  
  return {
    currentCosts,
    potentialSavings,
    implementationCost,
    roi: ((potentialSavings - implementationCost) / implementationCost) * 100,
    paybackPeriod: implementationCost / (potentialSavings / 12),
  };
};

const calculateCurrentCosts = (data: AssessmentData) => {
  return data.processes.reduce((total, process) => {
    return total + (process.manualHours * data.financials.hourlyRate * 52);
  }, 0);
};

const calculatePotentialSavings = (currentCosts: number) => {
  return currentCosts * 0.6; // Assume 60% efficiency gain
};

const estimateImplementationCost = (processCount: number) => {
  return processCount * 5000; // Base cost per process
};

export const calculateAutomationPotential = (answers) => {
  // Implementation of calculation logic
  const {
    employees,
    processVolume,
    timeSpent,
    errorRate
  } = answers;

  // Calculate current costs
  const laborCosts = calculateLaborCosts(employees, timeSpent);
  const errorCosts = calculateErrorCosts(processVolume, errorRate);
  const operationalCosts = calculateOperationalCosts(processVolume);

  // Calculate potential savings
  const potentialSavings = {
    labor: laborCosts * 0.6, // 60% reduction in labor costs
    errors: errorCosts * 0.8, // 80% reduction in errors
    operational: operationalCosts * 0.4 // 40% reduction in operational costs
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

const calculateLaborCosts = (employees: number, timeSpent: number) => {
  const averageHourlyRate = 35; // USD per hour
  return employees * timeSpent * 52 * averageHourlyRate;
};

const calculateErrorCosts = (processVolume: string, errorRate: string) => {
  const volumeMap = {
    "Less than 100": 50,
    "100-500": 300,
    "501-1000": 750,
    "1001-5000": 3000,
    "More than 5000": 7500
  };
  
  const errorRateMap = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.15
  };

  const volume = volumeMap[processVolume] || 300;
  const rate = errorRateMap[errorRate] || 0.04;
  const costPerError = 25; // USD

  return volume * rate * costPerError * 12;
};

const calculateOperationalCosts = (processVolume: string) => {
  const volumeMap = {
    "Less than 100": 1000,
    "100-500": 2500,
    "501-1000": 5000,
    "1001-5000": 10000,
    "More than 5000": 20000
  };

  return volumeMap[processVolume] || 2500;
};

const calculateProjectedCosts = (savings: any) => {
  return Object.values(savings).reduce((total: number, value: number) => total - value, 0);
};

const calculateMonthlySavings = (savings: any) => {
  return Object.values(savings).reduce((total: number, value: number) => total + value, 0) / 12;
};

const calculateAnnualSavings = (savings: any) => {
  return Object.values(savings).reduce((total: number, value: number) => total + value, 0);
};

const calculateTimeReduction = (timeSpent: number) => {
  return Math.min(timeSpent * 0.6, 40);
};

const calculateErrorReduction = (errorRate: string) => {
  const errorRateMap = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  };
  return errorRateMap[errorRate] || 85;
};

const calculateProductivityGain = (employees: number, timeSpent: number) => {
  return Math.min((timeSpent * 0.6) / (employees * 40) * 100, 100);
};
