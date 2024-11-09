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