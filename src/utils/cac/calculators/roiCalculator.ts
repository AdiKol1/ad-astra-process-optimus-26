import { calculateImplementationCost } from './costCalculator';
import { IndustryStandard } from '../industryStandards';

export const calculateProgressiveROI = (
  annualSavings: number,
  standards: IndustryStandard,
  responses: Record<string, any>
): number => {
  console.log('Calculating ROI with:', { annualSavings, standards });
  
  const implementationCost = calculateImplementationCost(responses);
  const baseROI = (annualSavings / implementationCost) * 100;
  const scaledROI = baseROI * standards.revenueMultiplier;
  
  // Dynamic ROI cap based on industry potential
  const roiCap = standards.baseReduction >= 0.3 ? 400 : 300;
  
  const finalROI = Math.min(Math.round(scaledROI), roiCap);
  console.log('ROI calculation details:', { baseROI, scaledROI, roiCap, finalROI });
  
  return finalROI;
};