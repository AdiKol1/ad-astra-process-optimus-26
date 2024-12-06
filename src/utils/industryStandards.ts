import { calculateCACReduction, calculateImplementationCost } from './costCalculations';

export const INDUSTRY_STANDARDS = {
  'Real Estate': {
    baseErrorRate: 0.06, // 6% due to manual data entry
    automationPotential: 0.35, // 35% of tasks can be automated initially
    processingTimeMultiplier: 1.2, // 20% longer due to client interactions
    costPerError: 45, // Cost per error in dollars
    savingsMultiplier: 0.8, // Conservative savings multiplier
    maxROI: 1.5 // 150% maximum ROI in first year
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
  processVolume: string
): number => {
  const standards = getIndustryStandards(industry);
  
  // Calculate CAC reduction as part of automation level assessment
  const cacReduction = calculateCACReduction({
    industry,
    employeeCount,
    currentTools,
    processVolume
  });
  
  // Base automation level from industry standard
  let automationLevel = standards.automationPotential * 100;
  
  // Adjust based on current tools
  const hasAdvancedTools = currentTools.some(tool => 
    !['Spreadsheets/Manual tracking'].includes(tool)
  );
  
  if (!hasAdvancedTools) {
    automationLevel *= 0.6; // Reduce potential if using basic tools
  }
  
  // Adjust based on team size
  if (employeeCount <= 5) {
    automationLevel *= 0.8; // Smaller teams typically have less automation
  }
  
  // Factor in CAC reduction potential
  automationLevel = (automationLevel + cacReduction) / 2;
  
  return Math.min(Math.round(automationLevel), 35); // Cap at 35% for realistic expectations
};

export const calculateCACReduction = (
  automationLevel: number,
  industry: string
): number => {
  const standards = getIndustryStandards(industry);
  const baseReduction = (automationLevel / 100) * 30; // Base 30% max reduction
  return Math.min(Math.round(baseReduction * standards.savingsMultiplier), 25);
};

export const calculateConversionImprovement = (
  automationLevel: number,
  industry: string
): number => {
  const standards = getIndustryStandards(industry);
  const baseImprovement = (automationLevel / 100) * 25; // Base 25% max improvement
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