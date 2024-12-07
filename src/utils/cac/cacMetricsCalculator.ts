import { CACMetrics } from '@/types/assessment';
import { INDUSTRY_CAC_STANDARDS } from './industryStandards';

export const calculateCACMetrics = (
  responses: Record<string, any>,
  industry: string
): CACMetrics => {
  console.log('Calculating CAC metrics for industry:', industry, 'with responses:', responses);
  
  const standards = INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
  
  // Calculate base metrics
  const baseReduction = standards.baseReduction;
  const toolImpact = standards.toolImpact;
  
  console.log('Base metrics:', { baseReduction, toolImpact });
  
  // Calculate final values
  const potentialReduction = Math.min(baseReduction + toolImpact, 0.35); // Cap at 35%
  const currentCAC = calculateCurrentCAC(responses);
  const annualSavings = Math.round(currentCAC * potentialReduction * 12);
  
  const metrics = {
    currentCAC,
    potentialReduction,
    annualSavings,
    automationROI: calculateAutomationROI(annualSavings),
  };
  
  console.log('Final CAC metrics:', metrics);
  return metrics;
};

const calculateCurrentCAC = (responses: Record<string, any>): number => {
  // Base calculation logic
  const baseCAC = 1000; // Default value
  return baseCAC;
};

const calculateAutomationROI = (annualSavings: number): number => {
  const implementationCost = 25000; // Base implementation cost
  return Math.round((annualSavings / implementationCost) * 100);
};