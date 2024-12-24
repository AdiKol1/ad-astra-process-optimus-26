import { MarketingMetrics, MarketingResults } from '../../../types/assessment/marketing';
import { INDUSTRY_CONFIGS, IndustryType } from '../../../types/industryConfig';
import { logger } from '../../../utils/logger';

const AUTOMATION_FACTORS = {
  timeReduction: {
    base: 0.55,    // 55% base time reduction
    max: 0.75      // 75% maximum time reduction
  },
  costReduction: {
    base: 0.45,    // 45% base cost reduction
    max: 0.60      // 60% maximum cost reduction
  },
  overheadReduction: {
    base: 0.35,    // 35% base overhead reduction
    max: 0.50      // 50% maximum overhead reduction
  }
};

const TOOL_EFFICIENCY_BONUS = {
  min: 0.05,       // 5% minimum efficiency bonus per tool
  max: 0.15        // 15% maximum total bonus
};

const COST_DISTRIBUTION = {
  labor: 0.4,      // 40% of budget
  tools: 0.3,      // 30% of budget
  overhead: 0.3    // 30% of budget
};

function parseAutomationLevel(level: string): number {
  try {
    const [min, max] = level.replace('%', '').split('-').map(Number);
    if (isNaN(min) || isNaN(max) || min < 0 || max > 100 || min > max) {
      throw new Error('Invalid automation level range');
    }
    return (min + max) / 200; // Convert to decimal (e.g., 26-50% -> 0.38)
  } catch (error) {
    logger.error('Error parsing automation level:', error);
    return 0;
  }
}

function calculateEfficiencyBonus(toolCount: number): number {
  const bonus = toolCount * TOOL_EFFICIENCY_BONUS.min;
  return Math.min(bonus, TOOL_EFFICIENCY_BONUS.max);
}

function calculateReduction(base: number, max: number, automationLevel: number, efficiencyBonus: number): number {
  const reduction = base * (automationLevel + efficiencyBonus);
  return Math.min(reduction, max);
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
    
    // Calculate efficiency bonus from tools
    const toolBonus = calculateEfficiencyBonus(data.toolStack.length);
    
    // Parse automation level
    const automationLevel = parseAutomationLevel(data.automationLevel);
    
    // Calculate base costs with industry-specific processing factor
    const currentLaborCost = data.marketingBudget * COST_DISTRIBUTION.labor * processingFactor;
    const currentToolCost = data.marketingBudget * COST_DISTRIBUTION.tools;
    const currentOverheadCost = data.marketingBudget * COST_DISTRIBUTION.overhead * processingFactor;
    const currentTotalCost = currentLaborCost + currentToolCost + currentOverheadCost;

    // Calculate reductions based on automation level and tool efficiency
    const laborReduction = calculateReduction(
      AUTOMATION_FACTORS.timeReduction.base,
      AUTOMATION_FACTORS.timeReduction.max,
      automationLevel,
      toolBonus
    );
    
    const costReduction = calculateReduction(
      AUTOMATION_FACTORS.costReduction.base,
      AUTOMATION_FACTORS.costReduction.max,
      automationLevel,
      toolBonus
    );
    
    const overheadReduction = calculateReduction(
      AUTOMATION_FACTORS.overheadReduction.base,
      AUTOMATION_FACTORS.overheadReduction.max,
      automationLevel,
      toolBonus
    );

    // Calculate projected costs
    const projectedLaborCost = currentLaborCost * (1 - laborReduction);
    const projectedToolCost = currentToolCost * (1 - costReduction);
    const projectedOverheadCost = currentOverheadCost * (1 - overheadReduction);
    const projectedTotalCost = projectedLaborCost + projectedToolCost + projectedOverheadCost;

    // Calculate savings with non-negative guarantees
    const monthlySavings = Math.max((currentTotalCost - projectedTotalCost) / 12, 0);
    const annualSavings = Math.max(currentTotalCost - projectedTotalCost, 0);

    // Calculate efficiency metrics with industry-specific factors
    const baseEfficiency = industryConfig.automationPotential * automationLevel * processingFactor;
    const efficiency = Math.min(baseEfficiency + toolBonus, industryConfig.automationPotential);

    // Prepare final results with detailed breakdowns
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
        roi: data.marketingBudget > 0 ? Math.min((annualSavings / data.marketingBudget) * 100, 300) : 0,
        paybackPeriodMonths: monthlySavings > 0 ? Math.min(data.marketingBudget / monthlySavings, 60) : 0
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
