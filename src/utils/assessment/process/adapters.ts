import type { ProcessResults } from './calculations';
import type { AssessmentResults } from '@/types/calculator';
import { AssessmentData, AssessmentResponses } from '@/types/assessment';
import { ProcessMetrics } from './calculations';

export function adaptProcessResults(results: ProcessResults): AssessmentResults {
  return {
    annual: {
      savings: results.savings.annual,
      hours: Math.round(results.metrics.efficiency * 2080) // 2080 = 40 hours * 52 weeks
    },
    cac: {
      currentCAC: results.costs.current,
      potentialReduction: results.metrics.errorReduction * 100,
      annualSavings: results.savings.annual,
      automationROI: results.metrics.roi * 100,
      efficiency: results.metrics.efficiency * 100
    }
  };
}

export function adaptForDisplay(results: ProcessResults) {
  return {
    costs: {
      current: formatCurrency(results.costs.current),
      projected: formatCurrency(results.costs.projected),
      breakdown: {
        labor: formatCurrency(results.costs.breakdown.labor),
        errors: formatCurrency(results.costs.breakdown.errors),
        overhead: formatCurrency(results.costs.breakdown.overhead)
      }
    },
    savings: {
      monthly: formatCurrency(results.savings.monthly),
      annual: formatCurrency(results.savings.annual),
      breakdown: {
        labor: formatCurrency(results.savings.breakdown.labor),
        errors: formatCurrency(results.savings.breakdown.errors),
        overhead: formatCurrency(results.savings.breakdown.overhead)
      }
    },
    metrics: {
      efficiency: formatPercentage(results.metrics.efficiency),
      errorReduction: formatPercentage(results.metrics.errorReduction),
      roi: formatPercentage(results.metrics.roi),
      paybackPeriodMonths: `${results.metrics.paybackPeriodMonths} months`
    }
  };
}

export const transformProcessData = (responses: AssessmentResponses): ProcessMetrics => {
  if (!responses) {
    return {
      timeSpent: 0,
      errorRate: 0,
      processVolume: 0,
      manualProcessCount: 0,
      industry: 'default'
    };
  }

  // Map process volume to numeric values (weekly process instances)
  const volumeMap: Record<string, number> = {
    'Low': 100,
    'Medium': 250,
    'High': 500,
    'Very High': 1000
  };

  // Map time wasted to hours per week
  const timeWastedMap: Record<string, number> = {
    'Less than 10 hours': 5,
    '10-20 hours': 15,
    '20-40 hours': 30,
    'More than 40 hours': 45
  };

  // Calculate error impact based on reported cost
  const errorImpactMap: Record<string, number> = {
    'Less than $1,000': 500,
    '$1,000 - $5,000': 3000,
    '$5,000 - $10,000': 7500,
    'More than $10,000': 15000
  };

  // Extract values with proper fallbacks
  const processVolume = responses.processVolume ? 
    volumeMap[responses.processVolume] || volumeMap['Medium'] : 
    volumeMap['Medium'];

  const timeSpent = responses.timeWasted ? 
    timeWastedMap[responses.timeWasted] || timeWastedMap['10-20 hours'] : 
    timeWastedMap['10-20 hours'];
  
  // Calculate error rate as a decimal (0-1)
  const errorImpactValue = responses.errorImpact ? 
    errorImpactMap[responses.errorImpact] || errorImpactMap['$1,000 - $5,000'] : 
    errorImpactMap['$1,000 - $5,000'];

  // Normalize error rate between 0-1, with a minimum of 0
  const errorRate = Math.max(0, Math.min(1, errorImpactValue / (processVolume * 100)));
  
  // Count manual processes from pain points, minimum of 1, maximum of 10
  const manualProcessCount = responses.painPoints?.length ? 
    Math.min(Math.max(responses.painPoints.length, 1), 10) : 
    1;

  // Get industry with fallback
  const industry = responses.industry || 'default';

  return {
    timeSpent,
    errorRate,
    processVolume,
    manualProcessCount,
    industry
  };
};

const parseErrorRate = (errorRate: string): number => {
  const rates: Record<string, number> = {
    'Less than 1%': 0.005,
    '1-2%': 0.015,
    '3-5%': 0.04,
    '6-10%': 0.08,
    'More than 10%': 0.12
  };
  return rates[errorRate] || 0.04;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}
