export interface IndustryStandard {
  baseReduction: number;
  toolImpact: number;
  processImpact: number;
  revenueMultiplier: number;
  conversionBase: number;
  baseCAC: number;
  manualPenalty: number;
}

export const INDUSTRY_CAC_STANDARDS: Record<string, IndustryStandard> = {
  'Healthcare': {
    baseReduction: 0.35,
    toolImpact: 0.15,
    processImpact: 0.20,
    revenueMultiplier: 1.5,
    conversionBase: 0.25,
    baseCAC: 1500,
    manualPenalty: 0.35
  },
  'Real Estate': {
    baseReduction: 0.30,
    toolImpact: 0.12,
    processImpact: 0.15,
    revenueMultiplier: 1.35,
    conversionBase: 0.20,
    baseCAC: 1200,
    manualPenalty: 0.25
  },
  'Financial Services': {
    baseReduction: 0.32,
    toolImpact: 0.14,
    processImpact: 0.18,
    revenueMultiplier: 1.45,
    conversionBase: 0.22,
    baseCAC: 1400,
    manualPenalty: 0.30
  },
  'Legal': {
    baseReduction: 0.28,
    toolImpact: 0.12,
    processImpact: 0.16,
    revenueMultiplier: 1.40,
    conversionBase: 0.20,
    baseCAC: 1300,
    manualPenalty: 0.28
  },
  'Construction': {
    baseReduction: 0.25,
    toolImpact: 0.10,
    processImpact: 0.15,
    revenueMultiplier: 1.30,
    conversionBase: 0.18,
    baseCAC: 1100,
    manualPenalty: 0.25
  },
  'Other': {
    baseReduction: 0.20,
    toolImpact: 0.10,
    processImpact: 0.12,
    revenueMultiplier: 1.25,
    conversionBase: 0.15,
    baseCAC: 1000,
    manualPenalty: 0.20
  }
};

export const CUSTOMER_VOLUME_MULTIPLIERS: Record<string, number> = {
  '1-5 customers': 3,
  '6-20 customers': 13,
  '21-50 customers': 35,
  '51-100 customers': 75,
  '100+ customers': 150
};

export const SPEND_RANGES: Record<string, number> = {
  'Less than $1,000': 500,
  '$1,000 - $5,000': 3000,
  '$5,000 - $10,000': 7500,
  '$10,000 - $50,000': 30000,
  'More than $50,000': 75000
};

export const getIndustryStandards = (industry: string) => {
  return INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
};

export const calculateBaseReduction = (industry: string, hasModernTools: boolean) => {
  const standards = getIndustryStandards(industry);
  return hasModernTools ? standards.baseReduction : standards.baseReduction * 0.7;
};

export const calculateToolImpact = (industry: string, hasModernTools: boolean) => {
  const standards = getIndustryStandards(industry);
  return hasModernTools ? standards.toolImpact : standards.toolImpact * 0.5;
};
