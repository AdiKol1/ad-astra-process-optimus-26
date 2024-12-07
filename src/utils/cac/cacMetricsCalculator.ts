import { CACMetrics } from '@/types/assessment';
import { INDUSTRY_CAC_STANDARDS, CUSTOMER_VOLUME_MULTIPLIERS } from './industryStandards';

export const calculateCACMetrics = (
  responses: Record<string, any>,
  industry: string
): CACMetrics => {
  console.log('Calculating CAC metrics for industry:', industry, 'with responses:', responses);
  
  const standards = INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
  
  // Calculate base reduction based on industry and manual processes
  const hasHighManualProcesses = (responses.manualProcesses?.length || 0) > 3;
  const baseReduction = standards.baseReduction * (hasHighManualProcesses ? 1.2 : 1);
  
  // Calculate tool impact based on current systems
  const hasBasicTools = responses.toolStack?.includes('Spreadsheets/Manual tracking');
  const toolImpact = standards.toolImpact * (hasBasicTools ? 0.5 : 1);
  
  // Calculate team size impact
  const teamSizeMultiplier = responses.teamSize?.[0]?.includes('6-20') ? 1.2 : 1;
  
  console.log('Calculation factors:', {
    baseReduction,
    toolImpact,
    teamSizeMultiplier,
    hasHighManualProcesses,
    hasBasicTools
  });
  
  // Calculate final values with all factors
  const potentialReduction = Math.min(
    (baseReduction + toolImpact) * teamSizeMultiplier,
    0.35 // Cap at 35%
  );
  
  // Calculate current CAC based on industry standards
  const currentCAC = calculateCurrentCAC(responses, standards);
  
  // Calculate annual savings
  const annualSavings = Math.round(currentCAC * potentialReduction * 12);
  
  // Calculate ROI based on efficiency gains
  const automationROI = calculateAutomationROI(annualSavings, standards);
  
  const metrics = {
    currentCAC,
    potentialReduction: Math.round(potentialReduction * 100), // Convert to percentage
    annualSavings,
    automationROI,
  };
  
  console.log('Final CAC metrics:', metrics);
  return metrics;
};

const calculateCurrentCAC = (
  responses: Record<string, any>,
  standards: any
): number => {
  // Base CAC calculation using industry standards
  const baseCAC = standards.baseCAC || 1000;
  
  // Adjust based on manual processes
  const processMultiplier = (responses.manualProcesses?.length || 1) * 0.15;
  
  // Adjust based on team size
  const teamSizeMultiplier = responses.teamSize?.[0]?.includes('6-20') ? 1.2 : 1;
  
  return Math.round(baseCAC * (1 + processMultiplier) * teamSizeMultiplier);
};

const calculateAutomationROI = (annualSavings: number, standards: any): number => {
  const implementationCost = 25000; // Base implementation cost
  const baseROI = (annualSavings / implementationCost) * 100;
  
  // Apply industry-specific ROI multiplier
  const roiMultiplier = standards.revenueMultiplier || 1;
  
  // Cap ROI at 300%
  return Math.min(Math.round(baseROI * roiMultiplier), 300);
};