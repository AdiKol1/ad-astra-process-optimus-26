export const INDUSTRY_CAC_STANDARDS = {
  'Healthcare': {
    baseReduction: 0.35, // Increased from 0.20
    toolImpact: 0.15,    // Increased from 0.10
    processImpact: 0.20, // Increased from 0.15
    revenueMultiplier: 1.4, // Added for ROI calculations
    conversionBase: 0.35  // Added for conversion calculations
  },
  'Financial Services': {
    baseReduction: 0.30,
    toolImpact: 0.12,
    processImpact: 0.18,
    revenueMultiplier: 1.35,
    conversionBase: 0.30
  },
  'Technology': {
    baseReduction: 0.25,
    toolImpact: 0.10,
    processImpact: 0.15,
    revenueMultiplier: 1.3,
    conversionBase: 0.25
  },
  'Other': {
    baseReduction: 0.20,
    toolImpact: 0.08,
    processImpact: 0.12,
    revenueMultiplier: 1.25,
    conversionBase: 0.20
  }
};

export const CUSTOMER_VOLUME_MULTIPLIERS = {
  "1-5 customers": 3,
  "6-20 customers": 13,
  "21-50 customers": 35,
  "More than 50": 60
};

export const SPEND_RANGES = {
  "Less than $1,000": 500,
  "$1,000 - $5,000": 3000,
  "$5,000 - $20,000": 12500,
  "More than $20,000": 25000
};

// New helper functions for calculations
export const getIndustryStandards = (industry: string) => {
  return INDUSTRY_CAC_STANDARDS[industry] || INDUSTRY_CAC_STANDARDS.Other;
};

export const calculateBaseReduction = (industry: string, hasAutomation: boolean) => {
  const standards = getIndustryStandards(industry);
  return standards.baseReduction * (hasAutomation ? 1.2 : 1);
};

export const calculateToolImpact = (industry: string, modernTools: boolean) => {
  const standards = getIndustryStandards(industry);
  return standards.toolImpact * (modernTools ? 1 : 0.5);
};