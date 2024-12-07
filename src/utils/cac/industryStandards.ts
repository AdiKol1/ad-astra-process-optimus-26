export const INDUSTRY_CAC_STANDARDS = {
  'Healthcare': {
    baseReduction: 0.15, // Adjusted from 0.35 to be more realistic
    toolImpact: 0.10,    // Adjusted from 0.15
    processImpact: 0.12, // Adjusted from 0.20
    revenueMultiplier: 1.3,
    conversionBase: 0.25,
    baseCAC: 1200 // Higher due to industry complexity
  },
  'Financial Services': {
    baseReduction: 0.12,
    toolImpact: 0.08,
    processImpact: 0.10,
    revenueMultiplier: 1.25,
    conversionBase: 0.20,
    baseCAC: 1000
  },
  'Technology': {
    baseReduction: 0.10,
    toolImpact: 0.07,
    processImpact: 0.08,
    revenueMultiplier: 1.2,
    conversionBase: 0.18,
    baseCAC: 800
  },
  'Other': {
    baseReduction: 0.08,
    toolImpact: 0.05,
    processImpact: 0.06,
    revenueMultiplier: 1.15,
    conversionBase: 0.15,
    baseCAC: 600
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