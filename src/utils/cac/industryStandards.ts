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
    baseReduction: 0.35, // Increased for healthcare
    toolImpact: 0.15,
    processImpact: 0.20,
    revenueMultiplier: 1.5,
    conversionBase: 0.25,
    baseCAC: 1500,
    manualPenalty: 0.35 // Increased as suggested
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