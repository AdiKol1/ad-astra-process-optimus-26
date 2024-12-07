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
  const baseScore = level ? parseInt(level) : 25;
  return Math.min(baseScore + (toolMaturity * 0.3), 100);
};

export const calculateMarketingEfficiency = (metrics: MarketingMetrics): number => {
  return Math.round(
    Object.entries(METRIC_WEIGHTS).reduce((total, [key, weight]) => 
      total + (metrics[key as keyof MarketingMetrics] * weight), 0)
  );
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