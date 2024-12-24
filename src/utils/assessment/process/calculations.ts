import { ProcessMetrics, ProcessResults } from '@/types/assessment/process';
import { INDUSTRY_CONFIGS, IndustryType } from '@/types/industryConfig';
import { logger } from '@/utils/logger';

const AUTOMATION_FACTORS = {
  timeReduction: 0.65,  // 65% time reduction
  errorReduction: 0.85, // 85% error reduction
  overheadReduction: 0.45 // 45% overhead reduction
};

export const calculateProcessMetrics = (metrics: ProcessMetrics): ProcessResults => {
  logger.info('Calculating process metrics', { metrics });

  try {
    // Get industry config with fallback
    const industryConfig = INDUSTRY_CONFIGS[metrics.industry as IndustryType] || INDUSTRY_CONFIGS.Other;
    
    // Ensure we have valid numeric inputs
    const timeSpent = Math.max(0, metrics.timeSpent || 0);
    const processVolume = Math.max(0, metrics.processVolume || 0);
    const errorRate = Math.max(0, Math.min(1, metrics.errorRate || 0));
    const manualProcessCount = Math.max(1, metrics.manualProcessCount || 1);
    
    // Current costs calculation with processing time adjustment
    const adjustedTime = timeSpent * industryConfig.processingTimeMultiplier;
    const currentLaborCost = adjustedTime * industryConfig.hourlyRate * manualProcessCount;
    const currentErrorCost = errorRate * industryConfig.errorCostMultiplier * processVolume;
    const currentOverheadCost = currentLaborCost * 0.2; // 20% of labor cost
    
    const currentTotalCost = Math.max(0, currentLaborCost + currentErrorCost + currentOverheadCost);

    // Projected costs after automation
    const projectedLaborCost = currentLaborCost * (1 - AUTOMATION_FACTORS.timeReduction * industryConfig.automationPotential);
    const projectedErrorCost = currentErrorCost * (1 - AUTOMATION_FACTORS.errorReduction);
    const projectedOverheadCost = currentOverheadCost * (1 - AUTOMATION_FACTORS.overheadReduction);
    
    const projectedTotalCost = Math.max(0, projectedLaborCost + projectedErrorCost + projectedOverheadCost);

    // Calculate savings (ensure non-negative)
    const monthlySavings = Math.max(0, currentTotalCost - projectedTotalCost);
    const annualSavings = monthlySavings * 12;

    // Calculate efficiency metrics (ensure between 0-1)
    const baseEfficiency = Math.min(1, industryConfig.automationPotential * AUTOMATION_FACTORS.timeReduction);
    const volumeBonus = Math.min((processVolume) / 1000, 0.15);
    const processBonus = Math.min((manualProcessCount) / 5, 0.10);
    const efficiency = Math.min(1, Math.max(0, baseEfficiency + volumeBonus + processBonus));

    // Calculate ROI (ensure non-negative)
    const implementationCost = Math.max(1000, industryConfig.implementationCostBase * manualProcessCount);
    const roi = monthlySavings > 0 ? (annualSavings / implementationCost) * 100 : 0;
    const paybackPeriodMonths = monthlySavings > 0 ? implementationCost / monthlySavings : 0;

    const results = {
      costs: {
        current: currentTotalCost,
        projected: projectedTotalCost,
        breakdown: {
          labor: currentLaborCost,
          errors: currentErrorCost,
          overhead: currentOverheadCost
        }
      },
      savings: {
        monthly: monthlySavings,
        annual: annualSavings,
        breakdown: {
          labor: Math.max(0, currentLaborCost - projectedLaborCost),
          errors: Math.max(0, currentErrorCost - projectedErrorCost),
          overhead: Math.max(0, currentOverheadCost - projectedOverheadCost)
        }
      },
      metrics: {
        efficiency,
        errorReduction: AUTOMATION_FACTORS.errorReduction,
        roi,
        paybackPeriodMonths
      }
    };

    logger.info('Process metrics calculated', { results });
    return results;

  } catch (error) {
    logger.error('Error calculating process metrics', { error, metrics });
    // Return safe defaults instead of throwing
    return {
      costs: {
        current: 0,
        projected: 0,
        breakdown: { labor: 0, errors: 0, overhead: 0 }
      },
      savings: {
        monthly: 0,
        annual: 0,
        breakdown: { labor: 0, errors: 0, overhead: 0 }
      },
      metrics: {
        efficiency: 0,
        errorReduction: 0,
        roi: 0,
        paybackPeriodMonths: 0
      }
    };
  }
};

export const validateProcessMetrics = (metrics: Partial<ProcessMetrics>): boolean => {
  if (!metrics) return false;

  const requiredFields: (keyof ProcessMetrics)[] = [
    'timeSpent',
    'errorRate',
    'processVolume',
    'manualProcessCount',
    'industry'
  ];

  // Check for required fields
  const hasAllFields = requiredFields.every(field => metrics[field] !== undefined);
  if (!hasAllFields) {
    logger.warn('Missing required fields in process metrics', { 
      metrics,
      missingFields: requiredFields.filter(field => metrics[field] === undefined)
    });
    return false;
  }

  // Validate numeric fields
  const numericFields = ['timeSpent', 'errorRate', 'processVolume', 'manualProcessCount'];
  const validNumbers = numericFields.every(field => {
    const value = metrics[field as keyof ProcessMetrics] as number;
    return typeof value === 'number' && !isNaN(value) && value >= -Infinity;
  });

  if (!validNumbers) {
    logger.warn('Invalid numeric fields in process metrics', {
      invalidFields: numericFields.filter(field => {
        const value = metrics[field as keyof ProcessMetrics] as number;
        return typeof value !== 'number' || isNaN(value) || value < -Infinity;
      })
    });
    return false;
  }

  // Validate ranges
  if (metrics.timeSpent! < 0) {
    logger.warn('Invalid time spent value', { timeSpent: metrics.timeSpent });
    return false;
  }

  if (metrics.processVolume! < 0) {
    logger.warn('Invalid process volume value', { processVolume: metrics.processVolume });
    return false;
  }

  if (metrics.manualProcessCount! < 0) {
    logger.warn('Invalid manual process count', { manualProcessCount: metrics.manualProcessCount });
    return false;
  }

  // Validate industry
  if (!Object.keys(INDUSTRY_CONFIGS).includes(metrics.industry! as IndustryType)) {
    logger.warn('Invalid industry type', { industry: metrics.industry });
    return false;
  }

  return true;
};
