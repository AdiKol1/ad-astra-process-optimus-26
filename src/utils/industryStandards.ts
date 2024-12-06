import { calculateCACReduction } from './costCalculations';

export const INDUSTRY_STANDARDS = {
  'Real Estate': {
    baseErrorRate: 0.06,
    automationPotential: 0.35,
    processingTimeMultiplier: 1.2,
    costPerError: 45,
    savingsMultiplier: 0.8,
    maxROI: 1.5
  },
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.45,
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 0.9,
    maxROI: 2.0
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.55,
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.1,
    maxROI: 2.5
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.4,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0,
    maxROI: 1.8
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
    automationLevel *= 0.6;
  }
  
  if (employeeCount <= 5) {
    automationLevel *= 0.8;
  }
  
  automationLevel = (automationLevel + cacReduction) / 2;
  
  return Math.min(Math.round(automationLevel), 35);
};

export const calculateConversionImprovement = (
  automationLevel: number,
  industry: string
): number => {
  const standards = getIndustryStandards(industry);
  const baseImprovement = (automationLevel / 100) * 25;
  return Math.min(Math.round(baseImprovement * standards.savingsMultiplier), 20);
};

export const calculateROI = (
  industry: string,
  automationLevel: number,
  processVolume: string
): number => {
  const standards = getIndustryStandards(industry);
  const volumeMultiplier = {
    'Less than 100': 0.7,
    '100-500': 1,
    '501-1000': 1.3,
    'More than 1000': 1.5
  }[processVolume] || 1;

  const baseROI = (automationLevel / 100) * standards.maxROI * 100;
  return Math.min(Math.round(baseROI * volumeMultiplier), 150);
};