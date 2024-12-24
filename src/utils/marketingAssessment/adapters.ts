import { AssessmentResponses } from '../../types/assessment';
import { MarketingMetrics } from '../../types/assessment/marketing';
import { logger } from '../../utils/logger';

function parseBudgetToNumber(budget: string): number {
  switch(budget) {
    case 'Less than $5,000': return 5000;
    case '$5,001 - $10,000': return 10000;
    case '$10,001 - $25,000': return 25000;
    case '$25,001 - $50,000': return 50000;
    case 'More than $50,000': return 75000;
    default: 
      logger.warn('Invalid budget value', { budget });
      return 0;
  }
}

export function transformMarketingData(responses: AssessmentResponses): MarketingMetrics {
  logger.info('Transforming marketing data', { responses });

  try {
    const transformedData: MarketingMetrics = {
      toolStack: responses.toolStack || [],
      automationLevel: responses.automationLevel || '0-25%',
      marketingBudget: parseBudgetToNumber(responses.marketingBudget as string),
      industry: responses.industry || 'Other'
    };

    logger.info('Marketing data transformed successfully', { transformedData });
    return transformedData;
  } catch (error) {
    logger.error('Error transforming marketing data:', error);
    throw error;
  }
}
