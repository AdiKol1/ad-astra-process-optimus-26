import { SectionScore } from '../../../../types/assessment';
import { ProcessMetrics } from '../../../../types/assessment/process';
import { CalculationProps } from './types';
import { calculateErrorScore } from './utils';
import { calculateProcessMetrics } from '../../../../utils/assessment/process/calculations';
import { logger } from '../../../../utils/logger';

const parseTimeRange = (timeRange: string): number => {
  const ranges: { [key: string]: number } = {
    '0-10 hours': 5,
    '10-20 hours': 15,
    '20-30 hours': 25,
    '30-40 hours': 35,
    '40+ hours': 45
  };
  return ranges[timeRange] || 0;
};

const parseErrorImpact = (impact: string): number => {
  const ranges: { [key: string]: number } = {
    '$0 - $1,000': 500,
    '$1,000 - $5,000': 3000,
    '$5,000 - $10,000': 7500,
    '$10,000+': 12000
  };
  return ranges[impact] || 0;
};

export const calculateProcessScore = ({ responses }: CalculationProps): SectionScore => {
  try {
    logger.info('Calculating process score with responses:', responses);

    // Extract and validate required fields
    const timeWasted = responses.timeWasted || '0-10 hours';
    const errorImpact = responses.errorImpact || '$0 - $1,000';
    const industry = responses.industry || 'default';
    const manualProcesses = responses.manualProcesses || [];

    // Transform responses to ProcessMetrics format
    const metrics: ProcessMetrics = {
      timeSpent: parseTimeRange(timeWasted),
      errorRate: parseErrorImpact(errorImpact) / 10000, // Normalize to 0-1 range
      processVolume: manualProcesses.length * 20, // Estimate 20 instances per process
      manualProcessCount: manualProcesses.length,
      industry: industry
    };

    // Calculate process metrics
    const processResults = calculateProcessMetrics(metrics);

    // Calculate component scores
    const processCountScore = Math.max(0, 1 - (manualProcesses.length / 8));
    const timeScore = Math.max(0, 1 - (metrics.timeSpent / 40));
    const errorScore = calculateErrorScore(errorImpact);

    const overallScore = (processCountScore * 0.4 + timeScore * 0.3 + errorScore * 0.3);

    return {
      score: overallScore,
      confidence: 0.85,
      efficiency: processResults.metrics.efficiency,
      toolMaturity: processCountScore * 100,
      automationLevel: (1 - timeScore) * 100,
      areas: [
        {
          name: 'Manual Process Load',
          score: processCountScore,
          insights: [`${manualProcesses.length} manual processes identified`]
        },
        {
          name: 'Time Efficiency',
          score: timeScore,
          insights: [`${metrics.timeSpent} hours spent on manual tasks weekly`]
        },
        {
          name: 'Error Management',
          score: errorScore,
          insights: [`Estimated error impact: ${errorImpact}`]
        }
      ]
    };
  } catch (error) {
    logger.error('Error calculating process score:', error);
    // Return a default score with error indication
    return {
      score: 0,
      confidence: 0,
      efficiency: 0,
      toolMaturity: 0,
      automationLevel: 0,
      areas: [
        {
          name: 'Error',
          score: 0,
          insights: ['Failed to calculate process score']
        }
      ]
    };
  }
};