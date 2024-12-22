import { getIndustryConfig } from './config/industryConfigs';
import { calculateCAC } from './calculators/cacCalculator';
import { calculateAutomation } from './calculators/automationCalculator';
import type { AssessmentInput, CalculationResults } from './types/assessmentTypes';

export const calculateAssessmentResults = (input: AssessmentInput): CalculationResults => {
  console.log('Calculating assessment results for:', input);

  const config = getIndustryConfig(input.industry);
  
  // Calculate CAC metrics
  const cacMetrics = calculateCAC(input, config);
  
  // Calculate automation metrics
  const { automation, annual } = calculateAutomation(input, config);
  
  return {
    cac: cacMetrics,
    automation,
    annual
  };
};