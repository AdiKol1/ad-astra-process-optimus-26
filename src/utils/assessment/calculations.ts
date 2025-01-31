import { calculateProcessMetrics } from './process/calculations';
import { generateCACResults } from '../cacCalculations';
import { logger } from '../logger';
import { telemetry } from '../monitoring/telemetry';
import type { AssessmentResponses } from '@/types/assessment';
import type { ProcessData } from '@/types/assessment/calculations';

export const calculateAssessmentResults = (responses: AssessmentResponses | null) => {
  if (!responses) return null;

  try {
    // Transform process data
    const processData: ProcessData = { 
      responses: {
        manualProcesses: responses.manualProcesses || [],
        teamSize: Number(responses.teamSize) || 0,
        industry: responses.industry || 'default',
        marketingSpend: Number(responses.marketingSpend) || 0,
        customerVolume: Number(responses.customerVolume) || 0,
        toolStack: responses.toolStack || []
      }
    };
    logger.info('Transformed process data:', processData);

    // Calculate process metrics
    const processResults = calculateProcessMetrics(processData);
    logger.info('Process calculation results:', processResults);

    // Calculate CAC metrics
    const cacResults = generateCACResults({
      industry: responses.industry || 'default',
      marketing_spend: Number(responses.marketingSpend) || 0,
      new_customers: Number(responses.customerVolume) || 0,
      manualProcesses: responses.manualProcesses || [],
      toolStack: responses.toolStack || []
    });
    logger.info('CAC calculation results:', cacResults);

    return {
      scores: {
        processScore: processResults.score,
        technologyScore: cacResults.technologyScore,
        teamScore: processResults.teamScore,
        totalScore: Math.round((processResults.score + cacResults.technologyScore + processResults.teamScore) / 3)
      },
      recommendations: [
        ...processResults.recommendations,
        ...cacResults.recommendations
      ],
      calculatedAt: new Date().toISOString()
    };
  } catch (error) {
    const err = error as Error;
    logger.error('Error calculating results:', { message: err.message, stack: err.stack });
    telemetry.track('results_calculation_error', { message: err.message });
    return null;
  }
};
