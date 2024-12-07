import { MarketingMetrics } from '@/types/assessment';

export const calculateMarketingMetrics = (responses: Record<string, any>): MarketingMetrics => {
  console.log('Calculating marketing metrics with responses:', responses);
  
  // Calculate tool maturity
  const toolStack = responses.toolStack || [];
  const toolMaturity = calculateToolMaturity(toolStack);
  
  // Calculate automation level
  const automationLevel = calculateAutomationLevel(responses.automationLevel, toolMaturity);
  
  // Calculate marketing efficiency
  const marketingChallenges = responses.marketingChallenges || [];
  const efficiency = calculateMarketingEfficiency(toolMaturity, marketingChallenges.length, automationLevel);
  
  console.log('Marketing metrics calculated:', { toolMaturity, automationLevel, efficiency });
  
  return {
    toolMaturity,
    automationLevel,
    efficiency,
    overallScore: Math.round((toolMaturity + automationLevel + efficiency) / 3)
  };
};

const calculateToolMaturity = (tools: string[]): number => {
  const toolScores: Record<string, number> = {
    'CRM system': 25,
    'Marketing automation': 30,
    'Email platform': 20,
    'Analytics tools': 15,
    'Social media tools': 10
  };

  const score = tools.reduce((acc, tool) => acc + (toolScores[tool] || 5), 0);
  return Math.min(score, 100);
};

const calculateAutomationLevel = (level: string, toolMaturity: number): number => {
  const baseScore = level ? parseInt(level) : 25;
  return Math.min(baseScore + (toolMaturity * 0.3), 100);
};

const calculateMarketingEfficiency = (
  toolMaturity: number,
  challengeCount: number,
  automationLevel: number
): number => {
  const baseEfficiency = 100 - (challengeCount * 10);
  const adjustedEfficiency = baseEfficiency * (automationLevel / 100);
  return Math.max(Math.min(adjustedEfficiency, 100), 0);
};