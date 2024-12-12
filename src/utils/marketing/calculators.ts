import { TOOL_SCORES, CHALLENGE_WEIGHTS, BUDGET_RANGES, METRIC_WEIGHTS } from '@/constants/marketingConstants';
import { MarketingMetrics } from '@/types/marketing';

export const calculateToolMaturity = (tools: string[]): number => {
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

export const calculateChallengeComplexity = (challenges: string[]): number => {
  const complexityScore = challenges.reduce((score, challenge) => 
    score + (CHALLENGE_WEIGHTS[challenge] || 10), 0);

  return Math.min(complexityScore, 100);
};

export const calculateBudgetEfficiency = (budget: string, tools: string[]): number => {
  const budgetLevel = BUDGET_RANGES[budget] || 1;
  const toolCount = tools.length;
  const efficiency = (toolCount / budgetLevel) * 25;
  
  return Math.min(Math.max(efficiency, 0), 100);
};

export const calculateProcessMaturity = (manualProcesses: string[], metrics: string[]): number => {
  const manualPenalty = Math.min(manualProcesses.length * 10, 50);
  const metricsBonus = Math.min(metrics.length * 15, 50);
  
  return Math.max(100 - manualPenalty + metricsBonus, 0);
};

export const calculateAutomationLevel = (level: string, toolMaturity: number): number => {
  // Parse the automation level range into a base score
  const levelRanges: Record<string, number> = {
    '0-25%': 25,
    '26-50%': 50,
    '51-75%': 75,
    '76-100%': 100
  };
  
  // Get base score from the range, default to 25 if not found
  const baseScore = levelRanges[level] || 25;
  
  // Calculate final score considering tool maturity
  // Tool maturity contributes up to 30% additional automation potential
  const toolContribution = toolMaturity * 0.3;
  const finalScore = Math.min(baseScore + toolContribution, 100);
  
  console.log('Automation level calculation:', {
    level,
    baseScore,
    toolMaturity,
    toolContribution,
    finalScore
  });
  
  return finalScore;
};

export const calculateMarketingEfficiency = (metrics: MarketingMetrics): number => {
  const efficiency = Math.round(
    Object.entries(METRIC_WEIGHTS).reduce((total, [key, weight]) => 
      total + (metrics[key as keyof MarketingMetrics] * weight), 0)
  );

  console.log('Marketing efficiency calculation:', {
    metrics,
    efficiency
  });

  return efficiency;
};

export const calculateIntegrationLevel = (tools: string[]): number => {
  const toolSet = new Set(tools);
  const essentialTools = Object.entries(TOOL_SCORES)
    .filter(([_, info]) => info.category === 'essential')
    .map(([tool]) => tool);
  
  const integrationScore = essentialTools.reduce((score, tool) => 
    score + (toolSet.has(tool) ? 20 : 0), 0);
  
  return Math.min(integrationScore, 100);
};