import type { ProcessAssessmentResponse } from '@/types/processAssessment';
import { 
  TIME_RANGE_MAPPINGS, 
  ERROR_RANGE_MAPPINGS, 
  VOLUME_RANGE_MAPPINGS 
} from './mappings';
import { validateProcessAssessment } from './validation';

interface TransformedData {
  timeSpent: number;
  errorRate: number;
  processVolume: number;
  manualProcessCount: number;
}

export function transformProcessData(data: ProcessAssessmentResponse): TransformedData {
  // First validate the data
  const validation = validateProcessAssessment(data);
  if (!validation.isValid) {
    throw new Error(`Invalid process data: ${JSON.stringify(validation.errors)}`);
  }

  // Calculate average time spent per week
  const timeValues = data.timeSpent.map(time => {
    const mapping = TIME_RANGE_MAPPINGS.find(m => m.value === time);
    if (!mapping) throw new Error(`Invalid time range: ${time}`);
    return mapping.numericalValue;
  });
  const timeSpent = timeValues.reduce((a, b) => a + b, 0) / timeValues.length;

  // Calculate error rate as decimal
  const errorValues = data.errorRate.map(rate => {
    const mapping = ERROR_RANGE_MAPPINGS.find(m => m.value === rate);
    if (!mapping) throw new Error(`Invalid error range: ${rate}`);
    return mapping.numericalValue;
  });
  const errorRate = errorValues.reduce((a, b) => a + b, 0) / errorValues.length;

  // Get process volume
  const volumeMapping = VOLUME_RANGE_MAPPINGS.find(m => m.value === data.processVolume);
  if (!volumeMapping) throw new Error(`Invalid volume range: ${data.processVolume}`);

  return {
    timeSpent,
    errorRate,
    processVolume: volumeMapping.numericalValue,
    manualProcessCount: data.manualProcesses.length
  };
}

// Format transformed data for display
export function formatTransformedData(data: TransformedData) {
  return {
    timeSpent: `${Math.round(data.timeSpent)} hours per week`,
    errorRate: `${(data.errorRate * 100).toFixed(1)}%`,
    processVolume: data.processVolume.toLocaleString(),
    manualProcessCount: data.manualProcessCount
  };
}
