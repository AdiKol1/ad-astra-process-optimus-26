import { INDUSTRY_CAC_STANDARDS } from './industryStandards';
import { calculateEfficiencyScore } from './calculators/efficiencyCalculator';
import { calculateCurrentCAC, calculateTeamSizeMultiplier } from './calculators/costCalculator';
import { calculateProgressiveROI } from './calculators/roiCalculator';
import type { CACMetrics } from '@/types/assessment';

export const calculateCACMetrics = (
  responses: Record<string, any>,
  industry: string
): CACMetrics => {
  console.log('Calculating CAC metrics for industry:', industry, 'with responses:', responses);
  
  const standards = INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
  
  // Enhanced manual process impact
  const manualProcessCount = responses.manualProcesses?.length || 0;
  const manualImpact = (manualProcessCount / 5) * standards.manualPenalty;
  
  // Refined tool impact calculation
  const hasModernTools = responses.toolStack?.some(tool => 
    ['Marketing automation platform', 'AI/ML tools', 'CRM system'].includes(tool)
  );
  const toolImpact = standards.toolImpact * (hasModernTools ? 1.2 : 0.6);
  
  // Progressive team size multiplier
  const teamSizeMultiplier = calculateTeamSizeMultiplier(responses.teamSize?.[0]);
  
  // Calculate potential reduction with new caps
  const potentialReduction = Math.min(
    ((standards.baseReduction - manualImpact) + toolImpact) * teamSizeMultiplier,
    0.45 // Cap at 45% for maximum realistic reduction
  );
  
  // Calculate metrics
  const currentCAC = calculateCurrentCAC(responses, standards);
  const annualSavings = Math.round(currentCAC * potentialReduction * 12);
  const automationROI = calculateProgressiveROI(annualSavings, standards, responses);
  
  const metrics = {
    currentCAC,
    potentialReduction: Math.round(potentialReduction * 100),
    annualSavings,
    automationROI,
    efficiency: calculateEfficiencyScore(responses, standards)
  };
  
  console.log('Final CAC metrics:', metrics);
  return metrics;
};