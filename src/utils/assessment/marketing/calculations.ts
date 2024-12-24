import { MarketingMetrics, MarketingResults } from '../../../types/assessment/marketing';
import { INDUSTRY_CONFIGS, IndustryType } from '../../../types/industryConfig';
import { logger } from '../../../utils/logger';

const AUTOMATION_FACTORS = {
  timeReduction: 0.55,  // 55% time reduction
  costReduction: 0.45,  // 45% cost reduction
  overheadReduction: 0.35 // 35% overhead reduction
};

function parseAutomationLevel(level: string): number {
  try {
    const [min, max] = level.replace('%', '').split('-').map(Number);
    return (min + max) / 200; // Convert to decimal (e.g., 26-50% -> 0.38)
  } catch (error) {
    logger.error('Error parsing automation level:', error);
    return 0;
  }
}

export const calculateMarketingMetrics = (data: MarketingMetrics): MarketingResults => {
  logger.info('Calculating marketing metrics', { data });

  try {
    // Validate input data
    if (!validateMarketingMetrics(data)) {
      throw new Error('Invalid marketing metrics data');
    }

    const industryConfig = INDUSTRY_CONFIGS[data.industry as IndustryType] || INDUSTRY_CONFIGS.Other;
    const processingFactor = industryConfig.processingTimeMultiplier;
    
    // Calculate base costs
    const currentLaborCost = data.marketingBudget * 0.4 * processingFactor;
    const currentToolCost = data.marketingBudget * 0.3;
    const currentOverheadCost = data.marketingBudget * 0.3 * processingFactor;
    const currentTotalCost = currentLaborCost + currentToolCost + currentOverheadCost;

    // Calculate projected costs
    const automationLevel = parseAutomationLevel(data.automationLevel);
    const projectedLaborCost = currentLaborCost * (1 - AUTOMATION_FACTORS.timeReduction * automationLevel);
    const projectedToolCost = currentToolCost * (1 - AUTOMATION_FACTORS.costReduction);
    const projectedOverheadCost = currentOverheadCost * (1 - AUTOMATION_FACTORS.overheadReduction);
    const projectedTotalCost = projectedLaborCost + projectedToolCost + projectedOverheadCost;

    // Calculate savings
    const monthlySavings = Math.max((currentTotalCost - projectedTotalCost) / 12, 0);
    const annualSavings = Math.max(currentTotalCost - projectedTotalCost, 0);

    // Calculate efficiency metrics
    const baseEfficiency = industryConfig.automationPotential * automationLevel * processingFactor;
    const toolBonus = Math.min(data.toolStack.length * 0.05, 0.15);
    const efficiency = Math.min(baseEfficiency + toolBonus, industryConfig.automationPotential);

    const results: MarketingResults = {
      costs: {
        current: currentTotalCost,
        projected: projectedTotalCost,
        breakdown: {
          labor: { current: currentLaborCost, projected: projectedLaborCost },
          tools: { current: currentToolCost, projected: projectedToolCost },
          overhead: { current: currentOverheadCost, projected: projectedOverheadCost }
        }
      },
      savings: {
        monthly: monthlySavings,
        annual: annualSavings,
        breakdown: {
          labor: Math.max(currentLaborCost - projectedLaborCost, 0),
          tools: Math.max(currentToolCost - projectedToolCost, 0),
          overhead: Math.max(currentOverheadCost - projectedOverheadCost, 0)
        }
      },
      metrics: {
        efficiency,
        automationLevel,
        roi: data.marketingBudget > 0 ? (annualSavings / data.marketingBudget) * 100 : 0,
        paybackPeriodMonths: monthlySavings > 0 ? data.marketingBudget / monthlySavings : 0
      }
    };

    logger.info('Marketing metrics calculation complete', { results });
    return results;
  } catch (error) {
    logger.error('Error calculating marketing metrics:', error);
    throw error;
  }
};

export const validateMarketingMetrics = (metrics: Partial<MarketingMetrics>): boolean => {
  if (!metrics) {
    logger.warn('No metrics provided');
    return false;
  }

  const requiredFields: (keyof MarketingMetrics)[] = [
    'toolStack',
    'automationLevel',
    'marketingBudget',
    'industry'
  ];

  // Check required fields
  const missingFields = requiredFields.filter(field => metrics[field] === undefined);
  if (missingFields.length > 0) {
    logger.warn('Missing required marketing metrics fields', { missingFields });
    return false;
  }

  // Validate tool stack
  if (!Array.isArray(metrics.toolStack) || metrics.toolStack.length === 0) {
    logger.warn('Invalid tool stack', { toolStack: metrics.toolStack });
    return false;
  }

  // Validate marketing budget
  if (typeof metrics.marketingBudget !== 'number' || metrics.marketingBudget < 0) {
    logger.warn('Invalid marketing budget', { marketingBudget: metrics.marketingBudget });
    return false;
  }

  // Validate automation level format
  if (typeof metrics.automationLevel !== 'string' || !metrics.automationLevel.match(/^\d+-\d+%$/)) {
    logger.warn('Invalid automation level format', { automationLevel: metrics.automationLevel });
    return false;
  }

  // Validate industry
  if (!Object.keys(INDUSTRY_CONFIGS).includes(metrics.industry as IndustryType)) {
    logger.warn('Invalid industry type', { industry: metrics.industry });
    return false;
  }

  return true;
};
