import { MODERN_TOOLS } from '@/components/features/assessment/calculator/constants';
import { CACMetrics } from '@/types/assessment';

const MAX_POTENTIAL_REDUCTION = 0.45; // 45% as decimal

interface IndustryStandard {
  manualPenalty: number;
  toolImpact: number;
  baseReduction: number;
  revenueMultiplier: number;
}

const INDUSTRY_CAC_STANDARDS: Record<string, IndustryStandard> = {
  'Healthcare': {
    manualPenalty: 0.08,
    toolImpact: 0.15,
    baseReduction: 0.25,
    revenueMultiplier: 1.3
  },
  'Financial Services': {
    manualPenalty: 0.06,
    toolImpact: 0.12,
    baseReduction: 0.22,
    revenueMultiplier: 1.25
  },
  'Other': {
    manualPenalty: 0.05,
    toolImpact: 0.1,
    baseReduction: 0.2,
    revenueMultiplier: 1.2
  }
};

const calculateTeamSizeMultiplier = (teamSize: number): number => {
  if (teamSize <= 0) return 1;
  return 1 + Math.min(teamSize / 100, 0.5); // Cap at 1.5x
};

const calculateCurrentCAC = (responses: Record<string, any>, standards: IndustryStandard): number => {
  const baseCAC = 500; // Base CAC value
  const processMultiplier = Math.min((responses.manualProcesses?.length || 1) * 0.2, 0.8);
  const teamSizeMultiplier = calculateTeamSizeMultiplier(Number(responses.teamSize) || 1);
  
  return Math.round(baseCAC * (1 + processMultiplier) * teamSizeMultiplier);
};

const calculateProgressiveROI = (
  annualSavings: number,
  standards: IndustryStandard
): number => {
  // Return ROI as decimal (e.g., 1.2 for 120% ROI)
  const baseROI = annualSavings / 5000;
  return Math.min(baseROI * standards.revenueMultiplier, 3.0); // Cap at 300% (3.0)
};

export const calculateCACMetrics = (
  responses: Record<string, any>,
  industry: string
): CACMetrics => {
  console.log('Calculating CAC metrics for industry:', industry);
  
  const standards = INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
  
  // Calculate manual process impact
  const manualProcessCount = Array.isArray(responses.manualProcesses) 
    ? responses.manualProcesses.length 
    : 0;
  const manualImpact = (manualProcessCount / 5) * standards.manualPenalty;
  
  // Calculate tool impact
  const hasModernTools = Array.isArray(responses.toolStack) && 
    responses.toolStack.some(tool => MODERN_TOOLS.includes(tool));
  const toolImpact = standards.toolImpact * (hasModernTools ? 1.2 : 0.6);
  
  // Calculate team size impact
  const teamSize = Number(responses.teamSize) || 1;
  const teamSizeMultiplier = calculateTeamSizeMultiplier(teamSize);
  
  // Calculate potential reduction
  const potentialReduction = Math.min(
    ((standards.baseReduction - manualImpact) + toolImpact) * teamSizeMultiplier,
    MAX_POTENTIAL_REDUCTION
  );
  
  // Calculate final metrics
  const currentCAC = calculateCurrentCAC(responses, standards);
  const annualSavings = Math.round(currentCAC * potentialReduction * 12);
  const automationROI = calculateProgressiveROI(annualSavings, standards);
  
  const metrics: CACMetrics = {
    currentCAC,
    potentialReduction, // Keep as decimal (e.g., 0.36 for 36%)
    annualSavings,
    automationROI, // Keep as decimal (e.g., 1.2 for 120%)
    efficiency: 1 - potentialReduction // Keep as decimal (e.g., 0.64 for 64%)
  };
  
  console.log('Final CAC metrics (all percentages as decimals):', metrics);
  return metrics;
};