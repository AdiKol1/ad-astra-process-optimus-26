import { Industry } from '@/types/assessment/core';
import { logger } from '@/utils/logger';

/**
 * Interface for industry configuration
 */
export interface IndustryConfig {
  /** Base error rate for the industry (0-1) */
  baseErrorRate: number;
  /** Potential for automation in the industry (0-1) */
  automationPotential: number;
  /** Multiplier for processing time calculations */
  processingTimeMultiplier: number;
  /** Average cost per error in USD */
  costPerError: number;
  /** Multiplier for savings calculations */
  savingsMultiplier: number;
  /** Maximum return on investment */
  maxROI: number;
  /** Marketing cost multiplier */
  marketingMultiplier: number;
  /** Penalty for manual processes */
  manualPenalty: number;
  /** Base customer acquisition cost in USD */
  baseCAC: number;
}

/**
 * Validates an industry configuration
 * @param config Industry configuration to validate
 * @returns True if the configuration is valid, false otherwise
 */
const validateConfig = (config: IndustryConfig): boolean => {
  // Validate ranges
  if (config.baseErrorRate < 0 || config.baseErrorRate > 1) return false;
  if (config.automationPotential < 0 || config.automationPotential > 1) return false;
  if (config.processingTimeMultiplier <= 0) return false;
  if (config.costPerError < 0) return false;
  if (config.savingsMultiplier <= 0) return false;
  if (config.maxROI <= 0) return false;
  if (config.marketingMultiplier <= 0) return false;
  if (config.manualPenalty <= 0) return false;
  if (config.baseCAC < 0) return false;

  return true;
};

/**
 * Industry configurations
 */
export const INDUSTRY_CONFIGS: Record<Industry, IndustryConfig> = {
  'Technology': {
    baseErrorRate: 0.04,
    automationPotential: 0.70,
    processingTimeMultiplier: 1.1,
    costPerError: 80,
    savingsMultiplier: 1.3,
    maxROI: 3.5,
    marketingMultiplier: 1.4,
    manualPenalty: 1.0,
    baseCAC: 1100
  },
  'Real Estate': {
    baseErrorRate: 0.06,
    automationPotential: 0.45,
    processingTimeMultiplier: 1.2,
    costPerError: 45,
    savingsMultiplier: 0.90,
    maxROI: 2.0,
    marketingMultiplier: 1.2,
    manualPenalty: 1.3,
    baseCAC: 1200
  },
  'Healthcare': {
    baseErrorRate: 0.08,
    automationPotential: 0.55,
    processingTimeMultiplier: 1.3,
    costPerError: 75,
    savingsMultiplier: 1.1,
    maxROI: 2.5,
    marketingMultiplier: 1.1,
    manualPenalty: 1.2,
    baseCAC: 1500
  },
  'Financial Services': {
    baseErrorRate: 0.05,
    automationPotential: 0.65,
    processingTimeMultiplier: 1.2,
    costPerError: 100,
    savingsMultiplier: 1.2,
    maxROI: 3.0,
    marketingMultiplier: 1.3,
    manualPenalty: 1.1,
    baseCAC: 1400
  },
  'Other': {
    baseErrorRate: 0.05,
    automationPotential: 0.5,
    processingTimeMultiplier: 1.0,
    costPerError: 50,
    savingsMultiplier: 1.0,
    maxROI: 2.2,
    marketingMultiplier: 1.0,
    manualPenalty: 1.0,
    baseCAC: 1000
  }
} as const;

// Validate all configs at startup
Object.entries(INDUSTRY_CONFIGS).forEach(([industry, config]) => {
  if (!validateConfig(config)) {
    throw new Error(`Invalid industry config for ${industry}`);
  }
});

/**
 * Gets the industry configuration for the given industry
 * @param industry Industry to get the configuration for
 * @returns Industry configuration
 */
export const getIndustryConfig = (industry: Industry): IndustryConfig => {
  try {
    const config = INDUSTRY_CONFIGS[industry];
    if (!config) {
      logger.warn('Unknown industry, falling back to Other:', industry);
      return INDUSTRY_CONFIGS['Other'];
    }
    return config;
  } catch (error) {
    logger.error('Error getting industry config:', error);
    return INDUSTRY_CONFIGS['Other'];
  }
};

/**
 * Calculates the ROI for the given industry and investment
 * @param industry Industry to calculate the ROI for
 * @param investment Investment amount
 * @param timeSpan Time span for the investment (default: 1)
 * @returns Calculated ROI
 */
export const calculateROI = (
  industry: Industry,
  investment: number,
  timeSpan: number = 1
): number => {
  const config = getIndustryConfig(industry);
  const baseROI = (investment * config.savingsMultiplier * config.maxROI) / timeSpan;
  return Math.min(baseROI, investment * config.maxROI);
};

/**
 * Estimates the error reduction for the given industry and current error rate
 * @param industry Industry to estimate the error reduction for
 * @param currentErrorRate Current error rate
 * @returns Estimated error reduction
 */
export const estimateErrorReduction = (
  industry: Industry,
  currentErrorRate: number
): number => {
  const config = getIndustryConfig(industry);
  const reduction = currentErrorRate * config.automationPotential;
  return Math.min(reduction, currentErrorRate * 0.9); // Max 90% reduction
};