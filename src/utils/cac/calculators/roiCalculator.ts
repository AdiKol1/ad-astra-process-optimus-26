import { IndustryStandard } from '../industryStandards';

export const calculateProgressiveROI = (
  annualSavings: number,
  standards: IndustryStandard,
  responses: Record<string, any>
): number => {
  // Base implementation cost varies by industry
  const baseImplementationCost = standards.baseCAC * 10;
  
  // Adjust implementation cost based on team size
  const teamSizeMultiplier = {
    '1-5 employees': 0.7,
    '6-20 employees': 1.0,
    '21-50 employees': 1.3,
    '51-200 employees': 1.6,
    '201+ employees': 2.0
  }[responses.teamSize?.[0]] || 1.0;
  
  const implementationCost = baseImplementationCost * teamSizeMultiplier;
  
  // Calculate ROI percentage
  const roi = (annualSavings / implementationCost) * 100;
  
  // Cap ROI based on industry standards
  const maxROI = standards.revenueMultiplier * 100;
  
  return Math.min(roi, maxROI);
};