import { CalculationResults } from '../types';

const INDUSTRY_STANDARDS = {
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.65,
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 1.2
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.75,
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.3
  },
  'Technology': {
    baseErrorRate: 0.03,
    automationPotential: 0.8,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.3
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.6,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0
  }
};

export const calculateAutomationPotential = (input: Record<string, any>): CalculationResults => {
  console.log('Calculating automation potential with input:', input);
  
  const employees = Number(input.employees) || 1;
  const timeSpent = Number(input.timeSpent) || 20;
  const processVolume = input.processVolume || "100-500";
  const errorRate = input.errorRate || "3-5%";
  const industry = input.industry || "Other";

  const standards = INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
  
  // Base metrics with industry-specific adjustments
  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const hourlyRate = 25 * standards.processingTimeMultiplier;

  // Calculate time savings
  const timeSpentOnManual = timeSpent;
  const savingsPercentage = standards.automationPotential;
  const timeReduction = Math.round(timeSpentOnManual * savingsPercentage);

  // Calculate labor costs and savings
  const annualLaborCost = employees * timeSpentOnManual * weeksPerYear * hourlyRate;
  const laborSavings = annualLaborCost * savingsPercentage * standards.savingsMultiplier;

  // Calculate error-related savings
  const errorCosts = calculateErrorCosts(processVolume, errorRate, standards.costPerError);
  const errorSavings = errorCosts * 0.8; // 80% error reduction

  // Calculate operational savings
  const operationalCosts = calculateOperationalCosts(processVolume, standards.processingTimeMultiplier);
  const operationalSavings = operationalCosts * standards.automationPotential;

  // Total annual savings
  const totalAnnualSavings = laborSavings + errorSavings + operationalSavings;

  // Calculate productivity gain
  const productivityGain = calculateProductivityGain(
    timeSpent,
    standards.automationPotential,
    processVolume
  );

  const results: CalculationResults = {
    costs: {
      current: annualLaborCost + errorCosts + operationalCosts,
      projected: (annualLaborCost * (1 - savingsPercentage)) + 
                (errorCosts * 0.2) + 
                (operationalCosts * (1 - standards.automationPotential))
    },
    savings: {
      monthly: Math.round(totalAnnualSavings / 12),
      annual: Math.round(totalAnnualSavings)
    },
    efficiency: {
      timeReduction,
      errorReduction: calculateErrorReduction(errorRate, standards),
      productivity: productivityGain
    }
  };

  console.log('Calculation results:', results);
  return results;
};

const calculateErrorCosts = (processVolume: string, errorRate: string, costPerError: number): number => {
  const volumeMap = {
    "Less than 100": 50,
    "100-500": 250,
    "501-1000": 750,
    "1001-5000": 2500,
    "More than 5000": 5000
  };
  
  const errorRateMap = {
    "1-2%": 0.015,
    "3-5%": 0.04,
    "6-10%": 0.08,
    "More than 10%": 0.12
  };

  const volume = volumeMap[processVolume] || 250;
  const rate = errorRateMap[errorRate] || 0.04;

  return volume * rate * costPerError * 12;
};

const calculateOperationalCosts = (processVolume: string, timeMultiplier: number): number => {
  const baseVolumeCosts = {
    "Less than 100": 500,
    "100-500": 1500,
    "501-1000": 3000,
    "1001-5000": 6000,
    "More than 5000": 12000
  };
  return (baseVolumeCosts[processVolume] || 1500) * timeMultiplier;
};

const calculateErrorReduction = (errorRate: string, standards: any): number => {
  const baseReduction = {
    "1-2%": 80,
    "3-5%": 85,
    "6-10%": 90,
    "More than 10%": 95
  }[errorRate] || 85;

  return Math.min(baseReduction * (1 + standards.automationPotential), 95);
};

const calculateProductivityGain = (
  timeSpent: number,
  automationPotential: number,
  processVolume: string
): number => {
  const volumeMultiplier = {
    "Less than 100": 0.8,
    "100-500": 1,
    "501-1000": 1.2,
    "1001-5000": 1.4,
    "More than 5000": 1.6
  }[processVolume] || 1;
  
  const percentageTimeOnManual = (timeSpent / 40) * 100;
  const baseGain = (percentageTimeOnManual * automationPotential);
  const finalGain = Math.round(baseGain * volumeMultiplier);
  
  return Math.min(Math.max(finalGain, 15), 45);
};