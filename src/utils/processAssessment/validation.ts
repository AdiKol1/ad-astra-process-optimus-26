import type { ProcessAssessmentResponse } from '@/types/processAssessment';
import { TIME_RANGE_MAPPINGS, ERROR_RANGE_MAPPINGS, VOLUME_RANGE_MAPPINGS } from './mappings';

export function validateProcessAssessment(data: ProcessAssessmentResponse): string[] {
  const errors: string[] = [];

  if (!data.timeSpent || !Array.isArray(data.timeSpent) || data.timeSpent.length === 0) {
    errors.push('Time spent data is required and must be an array');
  } else {
    data.timeSpent.forEach(time => {
      if (!TIME_RANGE_MAPPINGS.some(mapping => mapping.value === time)) {
        errors.push(`Invalid time range: ${time}`);
      }
    });
  }

  if (!data.errorRate || !Array.isArray(data.errorRate) || data.errorRate.length === 0) {
    errors.push('Error rate data is required and must be an array');
  } else {
    data.errorRate.forEach(rate => {
      if (!ERROR_RANGE_MAPPINGS.some(mapping => mapping.value === rate)) {
        errors.push(`Invalid error rate: ${rate}`);
      }
    });
  }

  if (!data.processVolume) {
    errors.push('Process volume is required');
  } else if (!VOLUME_RANGE_MAPPINGS.some(mapping => mapping.value === data.processVolume)) {
    errors.push(`Invalid process volume: ${data.processVolume}`);
  }

  if (!data.industry) {
    errors.push('Industry is required');
  }

  return errors;
}

export function isValidProcessAssessment(data: ProcessAssessmentResponse): boolean {
  return validateProcessAssessment(data).length === 0;
} 