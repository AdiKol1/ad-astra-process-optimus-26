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
    throw new Error('Marketing budget is required');
  }

  // Type guard to check if the budget string is a valid BudgetRange
  function isBudgetRange(value: string): value is BudgetRange {
    return Object.keys(BUDGET_RANGES).includes(value);
  }

  if (!isBudgetRange(budget)) {
    throw new Error(`Invalid budget range: ${budget}. Must be one of: ${Object.keys(BUDGET_RANGES).join(', ')}`);
  }

  const range = BUDGET_RANGES[budget];
  return range.min; // Use minimum value instead of default
}

function validateToolStack(toolStack: unknown): string[] {
  if (!Array.isArray(toolStack)) {
    throw new Error('Tool stack must be an array');
  }

  const validTools = toolStack.filter(tool => 
    typeof tool === 'string' && tool.trim().length > 0
  );

  if (validTools.length === 0) {
    throw new Error('Tool stack cannot be empty');
  }

  if (validTools.length !== toolStack.length) {
    throw new Error('All tools must be non-empty strings');
  }

  return validTools;
}

function validateAutomationLevel(level: unknown): AutomationLevel {
  if (typeof level !== 'string') {
    throw new Error('Automation level must be a string');
  }

  const validLevels: AutomationLevel[] = ['0-25%', '26-50%', '51-75%', '76-100%'];
  if (!validLevels.includes(level as AutomationLevel)) {
    throw new Error(`Automation level must be one of: ${validLevels.join(', ')}`);
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

  if (!responses) {
    throw new Error('No responses provided');
  }

  // Validate required fields exist
  if (!responses.toolStack || !(responses as any).automationLevel || !(responses as any).marketingBudget || !responses.industry) {
    throw new Error('Missing required marketing fields');
  }

  // Transform with strict validation
  const transformedData: MarketingMetrics = {
    toolStack: validateToolStack(responses.toolStack),
    automationLevel: validateAutomationLevel((responses as AssessmentResponses).automationLevel),
    marketingBudget: parseBudgetToNumber((responses as AssessmentResponses).marketingBudget),
    industry: responses.industry
  };

  // Validate the transformed data
  const validationErrors = validateMarketingData(transformedData);
  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
    throw new Error(`Invalid marketing data: ${errorMessages}`);
  }

  // Ensure no empty or default values
  if (!transformedData.toolStack.length || 
      !transformedData.automationLevel || 
      !transformedData.marketingBudget || 
      !transformedData.industry) {
    throw new Error('Marketing data validation failed: missing required values');
  }

  logger.info('Marketing data transformed successfully', { transformedData });
  return transformedData;
}

export function validateMarketingMetrics(metrics: Partial<MarketingMetrics>): ValidationError[] {
  return validateMarketingData(metrics);
}
