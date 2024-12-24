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

const validateResponses = (responses: Record<string, any>): boolean => {
  console.log('Validating responses:', responses);
  
  // Check required fields
  const requiredFields = ['manualProcesses', 'teamSize', 'industry'];
  const missingFields = requiredFields.filter(field => !responses[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields);
    return false;
  }

  // Validate types
  if (!Array.isArray(responses.manualProcesses)) {
    console.error('manualProcesses must be an array');
    return false;
  }

  const teamSize = Number(responses.teamSize);
  if (isNaN(teamSize)) {
    console.error('teamSize must be a number');
    return false;
  }

  return true;
};

export const calculateCACMetrics = (
  responses: Record<string, any>,
  industry: string
): CACMetrics => {
  console.log('Starting CAC calculation with:', { responses, industry });

  // Validate responses
  if (!validateResponses(responses)) {
    console.error('Invalid responses for CAC calculation');
    return {
      currentCAC: 1000, // Default values
      potentialReduction: 0.2,
      annualSavings: 2400,
      automationROI: 0.5,
      efficiency: 0.8
    };
  }
  
  const standards = INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
  
  // Calculate manual process impact
  const manualProcessCount = responses.manualProcesses.length;
  const manualImpact = (manualProcessCount / 5) * standards.manualPenalty;
  console.log('Manual impact:', manualImpact);
  
  // Refined tool impact calculation
  const hasModernTools = responses.toolStack?.some(tool => 
    ['Marketing automation platform', 'AI/ML tools', 'CRM system'].includes(tool)
  );
  const toolImpact = standards.toolImpact * (hasModernTools ? 0.6 : 1.2); // More impact if using basic tools
  console.log('Tool impact:', toolImpact);
  
  // Progressive team size multiplier
  const teamSizeMultiplier = calculateTeamSizeMultiplier(responses.teamSize?.[0]);
  
  // Calculate potential reduction based on all factors
  const potentialReduction = Math.min(
    (automationPotential + (manualImpact * 0.2) + (toolImpact * 0.2)) * teamSizeMultiplier,
    0.85 // Cap at 85% maximum reduction
  );
  
  // Calculate metrics
  const currentCAC = calculateCurrentCAC(responses, standards);
  const annualSavings = Math.round(currentCAC * potentialReduction * 12);
  const automationROI = calculateProgressiveROI(annualSavings, standards, responses);
  
  const metrics = {
    currentCAC,
    potentialReduction,
    potentialReduction,
    annualSavings,
    automationROI,
    efficiency: 1 - potentialReduction
  };
  
  console.log('Calculated CAC metrics:', metrics);
  return metrics;
};