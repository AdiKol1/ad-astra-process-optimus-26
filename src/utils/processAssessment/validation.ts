import type { ProcessAssessmentResponse, ValidationResult } from '@/types/processAssessment';
import { 
  TIME_RANGE_MAPPINGS, 
  ERROR_RANGE_MAPPINGS, 
  VOLUME_RANGE_MAPPINGS,
  MANUAL_PROCESS_MAPPINGS 
} from './mappings';

export function validateProcessAssessment(data: Partial<ProcessAssessmentResponse>): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate manual processes
  if (!data.manualProcesses?.length) {
    errors.manualProcesses = 'Please select at least one manual process';
  } else {
    const validProcesses = Object.keys(MANUAL_PROCESS_MAPPINGS);
    const invalidProcesses = data.manualProcesses.filter(
      process => !validProcesses.includes(process)
    );
    if (invalidProcesses.length) {
      errors.manualProcesses = `Invalid process types: ${invalidProcesses.join(', ')}`;
    }
  }

  // Validate time spent
  if (!data.timeSpent?.length) {
    errors.timeSpent = 'Please select time spent on manual processes';
  } else {
    const validTimeRanges = TIME_RANGE_MAPPINGS.map(m => m.value);
    const invalidTimes = data.timeSpent.filter(
      time => !validTimeRanges.includes(time)
    );
    if (invalidTimes.length) {
      errors.timeSpent = `Invalid time ranges: ${invalidTimes.join(', ')}`;
    }
  }

  // Validate error rate
  if (!data.errorRate?.length) {
    errors.errorRate = 'Please select error rates';
  } else {
    const validErrorRanges = ERROR_RANGE_MAPPINGS.map(m => m.value);
    const invalidRates = data.errorRate.filter(
      rate => !validErrorRanges.includes(rate)
    );
    if (invalidRates.length) {
      errors.errorRate = `Invalid error rates: ${invalidRates.join(', ')}`;
    }
  }

  // Validate process volume
  if (!data.processVolume) {
    errors.processVolume = 'Please select process volume';
  } else {
    const validVolumes = VOLUME_RANGE_MAPPINGS.map(m => m.value);
    if (!validVolumes.includes(data.processVolume)) {
      errors.processVolume = 'Invalid process volume';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
