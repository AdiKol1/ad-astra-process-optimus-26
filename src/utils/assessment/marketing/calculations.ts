import { MarketingMetrics, MarketingResults, AutomationLevel } from '../../../types/assessment/marketing';
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

const DEFAULT_VALUES: MarketingMetrics = {
  toolStack: [],
  automationLevel: '0-25%' as AutomationLevel,
  marketingBudget: 5000,
  industry: 'Other' as IndustryType
};

function parseAutomationLevel(level: string): number {
  try {
    const [min, max] = level.replace('%', '').split('-').map(Number);
    if (isNaN(min) || isNaN(max) || min < 0 || max > 100 || min > max) {
      logger.warn('Invalid automation level, using default value');
      return 0.125; // Default to 12.5% (middle of 0-25%)
    }
    return (min + max) / 200; // Convert to decimal (e.g., 26-50% -> 0.38)
  } catch (error) {
    logger.error('Error parsing automation level:', error);
    return 0.125; // Default to 12.5%
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

export const validateMarketingMetrics = (metrics: Partial<MarketingMetrics>): MarketingMetrics => {
  if (!metrics) {
    logger.warn('No metrics provided, using default values');
    return DEFAULT_VALUES;
  }

  const validatedMetrics: MarketingMetrics = {
    toolStack: Array.isArray(metrics.toolStack) ? metrics.toolStack : DEFAULT_VALUES.toolStack,
    automationLevel: (typeof metrics.automationLevel === 'string' && 
      ['0-25%', '26-50%', '51-75%', '76-100%'].includes(metrics.automationLevel)) ? 
      metrics.automationLevel as AutomationLevel : DEFAULT_VALUES.automationLevel,
    marketingBudget: typeof metrics.marketingBudget === 'number' && metrics.marketingBudget >= 0 ?
      metrics.marketingBudget : DEFAULT_VALUES.marketingBudget,
    industry: (typeof metrics.industry === 'string' && 
      Object.keys(INDUSTRY_CONFIGS).includes(metrics.industry)) ?
      metrics.industry as IndustryType : DEFAULT_VALUES.industry
  };

  return validatedMetrics;
};

export const calculateMarketingMetrics = (data: Partial<MarketingMetrics>): MarketingResults => {
  logger.info('Calculating marketing metrics', { data });

  try {
    // Validate and normalize input data
    const validatedData = validateMarketingMetrics(data);
    logger.info('Using validated data:', validatedData);

    const industryConfig = INDUSTRY_CONFIGS[validatedData.industry as IndustryType] || INDUSTRY_CONFIGS.Other;
    const processingFactor = industryConfig.processingTimeMultiplier;
    
    // Calculate efficiency bonus from tools
    const toolBonus = calculateEfficiencyBonus(validatedData.toolStack.length);
    
    // Parse automation level
    const automationLevel = parseAutomationLevel(validatedData.automationLevel);
    
    // Calculate base costs with industry-specific processing factor
    const currentLaborCost = validatedData.marketingBudget * COST_DISTRIBUTION.labor * processingFactor;
    const currentToolCost = validatedData.marketingBudget * COST_DISTRIBUTION.tools;
    const currentOverheadCost = validatedData.marketingBudget * COST_DISTRIBUTION.overhead * processingFactor;
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
        roi: validatedData.marketingBudget > 0 ? Math.min((annualSavings / validatedData.marketingBudget) * 100, 300) : 0,
        paybackPeriodMonths: monthlySavings > 0 ? Math.min(validatedData.marketingBudget / monthlySavings, 60) : 0
      }
    };

    logger.info('Marketing metrics calculation complete', { results });
    return results;
  } catch (error) {
    logger.error('Error calculating marketing metrics:', error);
    throw error;
  }
};
