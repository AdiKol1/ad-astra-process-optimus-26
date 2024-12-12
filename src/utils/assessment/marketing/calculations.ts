import { MarketingMetrics, MarketingResults } from '@/types/assessment/marketing';
import { logger } from '@/utils/logger';
import {
  TOOL_SCORES,
  CHALLENGE_WEIGHTS,
  BUDGET_RANGES,
  METRIC_WEIGHTS,
  AUTOMATION_RANGES
} from '@/constants/marketingConstants';

export const calculateMarketingMetrics = (data: Record<string, any>): MarketingMetrics => {
  logger.info('Calculating marketing metrics', { data });

  try {
    // Calculate tool maturity
    const tools = data.toolStack || [];
    const toolMaturity = calculateToolMaturity(tools);

    // Calculate automation level
    const automationLevel = calculateAutomationLevel(data.automationLevel, toolMaturity);

    // Calculate process maturity
    const processMaturity = calculateProcessMaturity(
      data.manualProcesses || [],
      data.metricsTracking || []
    );

    // Calculate budget efficiency
    const budgetEfficiency = calculateBudgetEfficiency(
      data.marketingBudget,
      tools
    );

    // Calculate integration level
    const integrationLevel = calculateIntegrationLevel(tools);

    const metrics: MarketingMetrics = {
      toolMaturity,
      automationLevel,
      processMaturity,
      budgetEfficiency,
      integrationLevel
    };

    logger.info('Marketing metrics calculation complete', { metrics });
    return metrics;

  } catch (error) {
    logger.error('Error calculating marketing metrics', { error, data });
    throw new Error('Failed to calculate marketing metrics');
  }
};

export const calculateMarketingResults = (metrics: MarketingMetrics): MarketingResults => {
  logger.info('Calculating marketing results', { metrics });

  try {
    // Calculate CAC reduction based on automation and tool maturity
    const potentialReduction = (metrics.automationLevel + metrics.toolMaturity) / 200;
    const currentCAC = 200; // Base CAC, should be customized per industry
    const projectedCAC = currentCAC * (1 - potentialReduction);

    // Calculate automation improvements
    const automationPotential = (100 - metrics.automationLevel) * 0.7;
    const automationROI = (metrics.toolMaturity + metrics.processMaturity) / 2;

    // Calculate conversion improvements
    const currentConversion = 0.03; // Base conversion rate, should be customized
    const conversionImprovement = (metrics.toolMaturity + metrics.automationLevel) / 200;
    const projectedConversion = currentConversion * (1 + conversionImprovement);

    const results: MarketingResults = {
      cac: {
        current: currentCAC,
        projected: projectedCAC,
        reduction: potentialReduction
      },
      automation: {
        level: metrics.automationLevel,
        potential: automationPotential,
        roi: automationROI
      },
      conversion: {
        current: currentConversion,
        projected: projectedConversion,
        improvement: conversionImprovement
      }
    };

    logger.info('Marketing results calculation complete', { results });
    return results;

  } catch (error) {
    logger.error('Error calculating marketing results', { error, metrics });
    throw new Error('Failed to calculate marketing results');
  }
};

const calculateToolMaturity = (tools: string[]): number => {
  let score = 0;
  let integrationBonus = 0;
  const categories = new Set();

  tools.forEach(tool => {
    const toolInfo = TOOL_SCORES[tool];
    if (toolInfo) {
      score += toolInfo.score;
      categories.add(toolInfo.category);
      integrationBonus += toolInfo.integrationValue;
    }
  });

  if (categories.size > 1) {
    score += Math.min(integrationBonus * 0.2, 20);
  }

  return Math.min(score, 100);
};

const calculateAutomationLevel = (level: string, toolMaturity: number): number => {
  const baseScore = AUTOMATION_RANGES[level] || 25;
  const toolContribution = toolMaturity * 0.3;
  return Math.min(baseScore + toolContribution, 100);
};

const calculateProcessMaturity = (manualProcesses: string[], metrics: string[]): number => {
  const manualPenalty = Math.min(manualProcesses.length * 10, 50);
  const metricsBonus = Math.min(metrics.length * 15, 50);
  return Math.max(100 - manualPenalty + metricsBonus, 0);
};

const calculateBudgetEfficiency = (budget: string, tools: string[]): number => {
  const budgetLevel = BUDGET_RANGES[budget] || 1;
  const toolCount = tools.length;
  return Math.min(Math.max((toolCount / budgetLevel) * 25, 0), 100);
};

const calculateIntegrationLevel = (tools: string[]): number => {
  const toolSet = new Set(tools);
  const essentialTools = Object.entries(TOOL_SCORES)
    .filter(([_, info]) => info.category === 'essential')
    .map(([tool]) => tool);
  
  const integrationScore = essentialTools.reduce((score, tool) => 
    score + (toolSet.has(tool) ? 20 : 0), 0);
  
  return Math.min(integrationScore, 100);
};

export const validateMarketingMetrics = (metrics: Partial<MarketingMetrics>): boolean => {
  logger.info('Validating marketing metrics', { metrics });

  const requiredFields: (keyof MarketingMetrics)[] = [
    'toolMaturity',
    'automationLevel',
    'processMaturity',
    'budgetEfficiency',
    'integrationLevel'
  ];

  const missingFields = requiredFields.filter(field => metrics[field] === undefined);
  
  if (missingFields.length > 0) {
    logger.warn('Missing required marketing metrics fields', { missingFields });
    return false;
  }

  // Validate numeric fields are between 0 and 100
  const invalidFields = requiredFields.filter(field => {
    const value = metrics[field];
    return value !== undefined && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100);
  });

  if (invalidFields.length > 0) {
    logger.warn('Invalid numeric fields in marketing metrics', { invalidFields });
    return false;
  }

  logger.info('Marketing metrics validation successful');
  return true;
};
