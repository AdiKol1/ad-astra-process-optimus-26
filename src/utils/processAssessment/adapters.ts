import type { ProcessResults } from './calculations';
import type { AssessmentResults } from '@/types/calculator';
import { AssessmentData } from '@/types/assessment';
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

export const transformProcessData = (data: AssessmentData): ProcessMetrics => {
  console.log('Transforming process data:', data);

  // Extract time spent from processes section
  const timeSpent = data.processes?.timeSpent || 0;
  console.log('Time spent:', timeSpent);

  // Extract error rate from processes section
  const errorRate = parseErrorRate(data.processes?.errorRate || '3-5%');
  console.log('Error rate:', errorRate);

  // Calculate process volume from processDetails
  const processVolume = parseProcessVolume(data.processDetails?.processVolume || '100-500');
  console.log('Process volume:', processVolume);

  // Count manual processes
  const manualProcessCount = (data.processes?.manualProcesses?.length || 0);
  console.log('Manual process count:', manualProcessCount);

  return {
    timeSpent,
    errorRate,
    processVolume,
    manualProcessCount,
    industry: data.processDetails?.industry || 'Other'
  };
};

const parseErrorRate = (errorRate: string): number => {
  const rates: Record<string, number> = {
    '1-2%': 0.015,
    '3-5%': 0.04,
    '6-10%': 0.08,
    'More than 10%': 0.12
  };
  return rates[errorRate] || 0.04;
};

const parseProcessVolume = (volume: string): number => {
  const volumes: Record<string, number> = {
    'Less than 100': 50,
    '100-500': 250,
    '501-1000': 750,
    '1001-5000': 2500,
    'More than 5000': 5000
  };
  return volumes[volume] || 250;
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
  // Value is already in decimal form (e.g., 0.8 for 80%)
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
}
