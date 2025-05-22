import type { ProcessAssessmentResponse, ProcessMetrics, ProcessAssessmentResult } from '@/types/processAssessment';
import { TIME_RANGE_MAPPINGS, ERROR_RANGE_MAPPINGS, VOLUME_RANGE_MAPPINGS } from './mappings';
import { validateProcessAssessment } from './validation';
import { INDUSTRY_CONFIGS, IndustryType } from '@/types/industryConfig';

export function calculateProcessMetrics(data: ProcessAssessmentResponse): ProcessMetrics {
  const errors = validateProcessAssessment(data);
  if (errors.length > 0) {
    throw new Error(`Invalid process assessment data: ${errors.join(', ')}`);
  }

  const timeValues = data.timeSpent.map(time => {
    const mapping = TIME_RANGE_MAPPINGS.find(m => m.value === time);
    return mapping?.numeric || 0;
  });

  const errorValues = data.errorRate.map(rate => {
    const mapping = ERROR_RANGE_MAPPINGS.find(m => m.value === rate);
    return mapping?.numeric || 0;
  });

  const volumeMapping = VOLUME_RANGE_MAPPINGS.find(m => m.value === data.processVolume);

  // Apply industry multipliers
  const industryKey = (data.industry in INDUSTRY_CONFIGS ? data.industry : 'Other') as IndustryType;
  const industryConfig = INDUSTRY_CONFIGS[industryKey];

  return {
    timeSpent: (timeValues.reduce((a: number, b: number) => a + b, 0) / timeValues.length) * industryConfig.efficiencyMultiplier,
    errorRate: (errorValues.reduce((a: number, b: number) => a + b, 0) / errorValues.length) * industryConfig.errorRateMultiplier,
    processVolume: (volumeMapping?.numeric || 0) * industryConfig.volumeMultiplier
  };
}

export function calculateProcessScore(metrics: ProcessMetrics): number {
  // Normalize values to 0-1 range
  const normalizedTime = Math.min(metrics.timeSpent / 10, 1);
  const normalizedError = Math.min(metrics.errorRate / 0.15, 1);
  const normalizedVolume = Math.min(metrics.processVolume / 7500, 1);

  // Calculate weighted score (adjust weights as needed)
  const timeWeight = 0.4;
  const errorWeight = 0.4;
  const volumeWeight = 0.2;

  return (
    (1 - normalizedTime) * timeWeight +
    (1 - normalizedError) * errorWeight +
    normalizedVolume * volumeWeight
  ) * 100;
}

export function generateRecommendations(metrics: ProcessMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.timeSpent > 4) {
    recommendations.push('Consider process automation to reduce manual processing time');
  }

  if (metrics.errorRate > 0.05) {
    recommendations.push('Implement additional validation checks to reduce error rates');
  }

  if (metrics.processVolume > 1000) {
    recommendations.push('Scale up automation to handle high process volume efficiently');
  }

  return recommendations;
}

export function calculateProcessAssessment(data: ProcessAssessmentResponse): ProcessAssessmentResult {
  const metrics = calculateProcessMetrics(data);
  const score = calculateProcessScore(metrics);
  const recommendations = generateRecommendations(metrics);

  return {
    metrics,
    recommendations,
    score
  };
} 