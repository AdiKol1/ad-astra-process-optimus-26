import { calculateCACReduction } from './costCalculations';

export const INDUSTRY_STANDARDS = {
  'Real Estate': {
    baseErrorRate: 0.06,
    automationPotential: 0.45, // Increased from 0.35
    processingTimeMultiplier: 1.2,
    costPerError: 45,
    savingsMultiplier: 0.9, // Increased from 0.8
    maxROI: 2.0 // Increased from 1.5
  },
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.55, // Increased from 0.45
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 1.1, // Increased from 0.9
    maxROI: 2.5 // Increased from 2.0
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.65, // Increased from 0.55
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.2, // Increased from 1.1
    maxROI: 3.0 // Increased from 2.5
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.5, // Increased from 0.4
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0,
    maxROI: 2.2 // Increased from 1.8
  }
};

export const getIndustryStandards = (industry: string) => {
  return INDUSTRY_STANDARDS[industry] || INDUSTRY_STANDARDS.Other;
};

export const calculateAutomationLevel = (
  industry: string,
  currentTools: string[],
  employeeCount: number,
  processVolume: string = '100-500'
): number => {
  const standards = getIndustryStandards(industry);
  
  const cacReduction = calculateCACReduction({
    industry,
    employeeCount,
    currentTools,
    processVolume
  });
  
  let automationLevel = standards.automationPotential * 100;
  
  const hasAdvancedTools = currentTools.some(tool => 
    !['Spreadsheets/Manual tracking'].includes(tool)
  );
  
  if (!hasAdvancedTools) {
    automationLevel *= 0.7; // Reduced penalty from 0.6 to 0.7
  }
  
  if (employeeCount <= 5) {
    automationLevel *= 0.85; // Reduced penalty from 0.8 to 0.85
  }
  
  automationLevel = (automationLevel + cacReduction) / 2;
  
  return Math.min(Math.round(automationLevel), 45); // Increased cap from 35% to 45%
};

export const calculateConversionImprovement = (
  automationLevel: number,
  industry: string
): number => {
  const standards = getIndustryStandards(industry);
  const baseImprovement = (automationLevel / 100) * 35; // Increased from 25
  return Math.min(Math.round(baseImprovement * standards.savingsMultiplier), 30); // Increased from 20
};

export const calculateROI = (
  industry: string,
  automationLevel: number,
  processVolume: string
): number => {
  const standards = getIndustryStandards(industry);
  const volumeMultiplier = {
    'Less than 100': 0.8, // Increased from 0.7
    '100-500': 1.1, // Increased from 1.0
    '501-1000': 1.4, // Increased from 1.3
    'More than 1000': 1.6 // Increased from 1.5
  }[processVolume] || 1.1;

  const baseROI = (automationLevel / 100) * standards.maxROI * 100;
  return Math.min(Math.round(baseROI * volumeMultiplier), 200); // Increased from 150
};