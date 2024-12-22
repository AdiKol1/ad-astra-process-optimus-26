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
  
  // Calculate current automation level from response
  const automationLevelStr = responses.automationLevel || '0-25%';
  const currentAutomationLevel = parseInt(automationLevelStr.split('-')[1] || '25') / 100;
  console.log('Current automation level:', currentAutomationLevel);
  
  // Calculate potential improvement (inverse of current level)
  const automationPotential = Math.min(1 - currentAutomationLevel, 0.85); // Cap at 85% improvement
  console.log('Automation potential:', automationPotential);
  
  // Enhanced manual process impact
  const manualProcessCount = responses.manualProcesses?.length || 0;
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
    annualSavings,
    automationROI,
    efficiency: calculateEfficiencyScore(responses, standards)
  };
  
  console.log('Final CAC metrics:', metrics);
  return metrics;
};