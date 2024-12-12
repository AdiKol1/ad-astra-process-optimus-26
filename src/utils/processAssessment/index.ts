export * from './mappings';
export * from './validation';
export * from './transformation';
export * from './calculations';

import type { ProcessAssessmentResponse } from '@/types/processAssessment';
import { validateProcessAssessment } from './validation';
import { transformProcessData, formatTransformedData } from './transformation';
import { calculateProcessMetrics } from './calculations';

interface ProcessAssessmentResult {
  isValid: boolean;
  errors?: Record<string, string>;
  transformedData?: ReturnType<typeof formatTransformedData>;
  calculations?: ReturnType<typeof calculateProcessMetrics>;
  results?: {
    process: ReturnType<typeof calculateProcessMetrics>;
    cac: {
      currentCAC: number;
      potentialReduction: number;
      annualSavings: number;
      automationROI: number;
      efficiency: number;
    };
  };
}

export function processAssessment(
  data: ProcessAssessmentResponse, 
  industry: string
): ProcessAssessmentResult {
  // Step 1: Validate
  const validation = validateProcessAssessment(data);
  if (!validation.isValid) {
    return {
      isValid: false,
      errors: validation.errors
    };
  }

  try {
    // Step 2: Transform
    const transformedData = transformProcessData(data);
    const formattedData = formatTransformedData(transformedData);

    // Step 3: Calculate
    const calculations = calculateProcessMetrics({
      timeSpent: transformedData.timeSpent,
      errorRate: transformedData.errorRate,
      processVolume: transformedData.processVolume,
      manualProcessCount: transformedData.manualProcessCount,
      industry,
      implementationCost: '120000' // Default implementation cost
    });

    // Step 4: Return results
    return {
      isValid: true,
      transformedData: formattedData,
      calculations,
      results: {
        process: calculations,
        cac: {
          currentCAC: calculations.costs.current,
          potentialReduction: calculations.metrics.errorReduction * 100,
          annualSavings: calculations.savings.annual,
          automationROI: calculations.metrics.roi * 100,
          efficiency: calculations.metrics.efficiency * 100
        }
      }
    };
  } catch (error) {
    return {
      isValid: false,
      errors: {
        general: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };
  }
}
