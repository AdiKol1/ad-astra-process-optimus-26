import { AssessmentResponses } from '../../types/assessment';
import { 
  MarketingMetrics, 
  BudgetRange, 
  BudgetRangeConfig, 
  BudgetRangeMap,
  AutomationLevel,
  ValidationError
} from '../../types/assessment/marketing';
import { logger } from '../../utils/logger';

const BUDGET_RANGES: BudgetRangeMap = {
  'Less than $5,000': { min: 0, max: 5000, defaultValue: 5000 },
  '$5,001 - $10,000': { min: 5001, max: 10000, defaultValue: 10000 },
  '$10,001 - $25,000': { min: 10001, max: 25000, defaultValue: 25000 },
  '$25,001 - $50,000': { min: 25001, max: 50000, defaultValue: 50000 },
  'More than $50,000': { min: 50001, max: Infinity, defaultValue: 75000 },
};

function parseBudgetToNumber(budget: string | undefined): number {
  if (!budget) {
    logger.warn('No budget provided');
    return 0;
  }

  // Type guard to check if the budget string is a valid BudgetRange
  function isBudgetRange(value: string): value is BudgetRange {
    return Object.keys(BUDGET_RANGES).includes(value);
  }

  if (!isBudgetRange(budget)) {
    logger.warn('Invalid budget range', { budget });
    return 0;
  }

  return BUDGET_RANGES[budget].defaultValue;
}

function validateToolStack(toolStack: unknown): string[] {
  if (!Array.isArray(toolStack)) {
    logger.warn('Invalid tool stack format', { toolStack });
    return [];
  }

  const validTools = toolStack.filter(tool => 
    typeof tool === 'string' && tool.trim().length > 0
  );

  if (validTools.length !== toolStack.length) {
    logger.warn('Some tools were invalid and filtered out', {
      original: toolStack,
      filtered: validTools
    });
  }

  return validTools;
}

function validateAutomationLevel(level: unknown): AutomationLevel {
  if (typeof level !== 'string') {
    logger.warn('Invalid automation level type', { level });
    return '0-25%';
  }

  const validLevels: AutomationLevel[] = ['0-25%', '26-50%', '51-75%', '76-100%'];
  if (typeof level !== 'string' || !validLevels.includes(level as AutomationLevel)) {
    logger.warn('Invalid automation level value', { level });
    return '0-25%';
  }

  return level as AutomationLevel;
}

function validateMarketingData(data: Partial<MarketingMetrics>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.toolStack || data.toolStack.length === 0) {
    errors.push({
      field: 'toolStack',
      message: 'Tool stack cannot be empty'
    });
  }

  if (!data.marketingBudget || data.marketingBudget === 0) {
    errors.push({
      field: 'marketingBudget',
      message: 'Marketing budget must be provided'
    });
  }

  if (!data.industry) {
    errors.push({
      field: 'industry',
      message: 'Industry must be provided'
    });
  }

  if (!data.automationLevel) {
    errors.push({
      field: 'automationLevel',
      message: 'Automation level must be provided'
    });
  }

  return errors;
}

export function transformMarketingData(responses: AssessmentResponses): MarketingMetrics {
  logger.info('Starting marketing data transformation', { responses });

  try {
    if (!responses) {
      throw new Error('No responses provided for transformation');
    }

    const transformedData: MarketingMetrics = {
      toolStack: validateToolStack(responses.toolStack),
      automationLevel: validateAutomationLevel(responses.automationLevel),
      marketingBudget: parseBudgetToNumber(responses.marketingBudget),
      industry: responses.industry || 'Other'
    };

    const validationErrors = validateMarketingData(transformedData);
    
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }

    logger.info('Marketing data transformed successfully', { transformedData });
    return transformedData;
  } catch (error) {
    logger.error('Error transforming marketing data:', error);
    throw new Error(`Failed to transform marketing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateMarketingMetrics(metrics: Partial<MarketingMetrics>): ValidationError[] {
  return validateMarketingData(metrics);
}
