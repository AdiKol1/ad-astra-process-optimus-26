import { ProcessMetrics, ProcessResults } from '@/types/assessment/process';
import { logger } from '@/utils/logger';

const INDUSTRY_RATES = {
  'Real Estate': { hourlyRate: 45, errorCost: 250 },
  'Financial Services': { hourlyRate: 65, errorCost: 500 },
  'Healthcare': { hourlyRate: 55, errorCost: 400 },
  'Technology': { hourlyRate: 75, errorCost: 300 },
  'Manufacturing': { hourlyRate: 50, errorCost: 350 },
  'default': { hourlyRate: 50, errorCost: 300 }
};

const AUTOMATION_FACTORS = {
  timeReduction: 0.65,  // 65% time reduction
  errorReduction: 0.85, // 85% error reduction
  overheadReduction: 0.45 // 45% overhead reduction
};

export const calculateProcessMetrics = (metrics: ProcessMetrics): ProcessResults => {
  logger.info('Calculating process metrics', { metrics });

  try {
    const industryRates = INDUSTRY_RATES[metrics.industry] || INDUSTRY_RATES.default;
    
    // Current costs calculation
    const currentLaborCost = metrics.timeSpent * industryRates.hourlyRate * metrics.manualProcessCount;
    const currentErrorCost = (metrics.errorRate / 100) * industryRates.errorCost * metrics.processVolume;
    const currentOverheadCost = currentLaborCost * 0.2; // 20% of labor cost
    
    const currentTotalCost = currentLaborCost + currentErrorCost + currentOverheadCost;

    // Projected costs after automation
    const projectedLaborCost = currentLaborCost * (1 - AUTOMATION_FACTORS.timeReduction);
    const projectedErrorCost = currentErrorCost * (1 - AUTOMATION_FACTORS.errorReduction);
    const projectedOverheadCost = currentOverheadCost * (1 - AUTOMATION_FACTORS.overheadReduction);
    
    const projectedTotalCost = projectedLaborCost + projectedErrorCost + projectedOverheadCost;

    // Calculate savings
    const monthlySavings = currentTotalCost - projectedTotalCost;
    const annualSavings = monthlySavings * 12;

    // Calculate ROI and metrics
    const implementationCost = currentTotalCost * 0.5; // Estimated implementation cost
    const roi = (annualSavings / implementationCost) * 100;
    const paybackPeriodMonths = implementationCost / monthlySavings;

    const results: ProcessResults = {
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
          labor: currentLaborCost - projectedLaborCost,
          errors: currentErrorCost - projectedErrorCost,
          overhead: currentOverheadCost - projectedOverheadCost
        }
      },
      metrics: {
        efficiency: AUTOMATION_FACTORS.timeReduction * 100,
        errorReduction: AUTOMATION_FACTORS.errorReduction * 100,
        roi: roi,
        paybackPeriodMonths: paybackPeriodMonths
      }
    };

    logger.info('Process metrics calculation complete', { results });
    return results;

  } catch (error) {
    logger.error('Error calculating process metrics', { error, metrics });
    throw new Error('Failed to calculate process metrics');
  }
};

export const validateProcessMetrics = (metrics: Partial<ProcessMetrics>): boolean => {
  logger.info('Validating process metrics', { metrics });

  const requiredFields: (keyof ProcessMetrics)[] = [
    'timeSpent',
    'errorRate',
    'processVolume',
    'manualProcessCount',
    'industry'
  ];

  const missingFields = requiredFields.filter(field => metrics[field] === undefined);
  
  if (missingFields.length > 0) {
    logger.warn('Missing required process metrics fields', { missingFields });
    return false;
  }

  // Validate numeric fields
  const numericFields: (keyof ProcessMetrics)[] = ['timeSpent', 'errorRate', 'processVolume', 'manualProcessCount'];
  const invalidFields = numericFields.filter(field => {
    const value = metrics[field];
    return value !== undefined && (isNaN(Number(value)) || Number(value) < 0);
  });

  if (invalidFields.length > 0) {
    logger.warn('Invalid numeric fields in process metrics', { invalidFields });
    return false;
  }

  logger.info('Process metrics validation successful');
  return true;
};
