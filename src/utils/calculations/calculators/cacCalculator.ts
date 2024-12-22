import { IndustryConfig, getIndustryConfig } from '../config/industryConfigs';
import { AssessmentInput } from '../types/assessmentTypes';

export const calculateCAC = (input: AssessmentInput, config: IndustryConfig) => {
  console.log('Calculating CAC with input:', input);

  const hasManualProcesses = input.toolStack?.includes('Spreadsheets/Manual tracking') ?? true;
  const baseCAC = config.baseCAC;
  const manualImpact = hasManualProcesses ? config.manualPenalty : 1;
  
  const currentCAC = Math.round(baseCAC * manualImpact * config.marketingMultiplier);
  
  // Calculate potential reduction (capped at 45%)
  const potentialReduction = Math.min(
    config.automationPotential * config.savingsMultiplier,
    0.45
  );
  
  const annualSavings = Math.round(currentCAC * potentialReduction * 12);
  
  // Calculate ROI (capped by industry maxROI)
  const implementationCost = 25000; // Base implementation cost
  const automationROI = Math.min(
    (annualSavings / implementationCost) * 100,
    config.maxROI * 100
  );

  return {
    currentCAC,
    potentialReduction: Math.round(potentialReduction * 100),
    annualSavings,
    automationROI: Math.round(automationROI)
  };
};