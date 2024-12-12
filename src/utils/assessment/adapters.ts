import { AssessmentResponses } from '@/types/assessment/core';
import { ProcessMetrics } from '@/types/assessment/process';
import { logger } from '@/utils/logger';

export const transformProcessData = (responses: AssessmentResponses): ProcessMetrics => {
  logger.info('Transforming process data', { responses });

  try {
    // Extract error rate from string format (e.g., "3-5%" -> 4)
    const errorRateStr = responses.errorRate || '0';
    const errorRateMatch = errorRateStr.match(/(\d+)-?(\d+)?%?/);
    const errorRate = errorRateMatch
      ? errorRateMatch[2]
        ? (parseInt(errorRateMatch[1]) + parseInt(errorRateMatch[2])) / 2
        : parseInt(errorRateMatch[1])
      : 0;

    // Extract process volume from string format
    const volumeStr = responses.processVolume || '0';
    const volumeMatch = volumeStr.match(/(\d+)/);
    const processVolume = volumeMatch ? parseInt(volumeMatch[1]) : 0;

    const metrics: ProcessMetrics = {
      timeSpent: responses.timeSpent || 0,
      errorRate: errorRate,
      processVolume: processVolume,
      manualProcessCount: (responses.manualProcesses || []).length,
      industry: responses.industry || 'default'
    };

    logger.info('Process data transformation complete', { metrics });
    return metrics;

  } catch (error) {
    logger.error('Error transforming process data', { error, responses });
    throw new Error('Failed to transform process data');
  }
};

export const parsePercentageRange = (range: string): number => {
  const match = range.match(/(\d+)-?(\d+)?%?/);
  if (!match) return 0;
  
  if (match[2]) {
    return (parseInt(match[1]) + parseInt(match[2])) / 2;
  }
  
  return parseInt(match[1]);
};
