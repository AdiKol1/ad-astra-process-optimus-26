import { MarketingMetrics } from '@/types/assessment';

const TOOL_SCORES = {
  'Marketing automation platform': 30,
  'CRM system': 25,
  'Analytics tools': 20,
  'Email marketing platform': 15,
  'AI/ML tools': 35,
  'Spreadsheets/Manual tracking': 10
};

const CHALLENGE_WEIGHTS = {
  'Lead generation': 15,
  'Lead qualification': 15,
  'Campaign automation': 20,
  'Performance tracking': 15,
  'Content creation': 10,
  'Channel management': 15,
  'Budget optimization': 10
};

export const calculateMarketingMetrics = (responses: Record<string, any>): MarketingMetrics => {
  console.log('Calculating marketing metrics with responses:', responses);
  
  // Calculate tool maturity
  const toolStack = responses.toolStack || [];
  const toolMaturity = calculateToolMaturity(toolStack);
  console.log('Tool maturity score:', toolMaturity);
  
  // Calculate automation level from response
  const automationLevelStr = responses.automationLevel?.[0] || '0-25%';
  const automationLevel = calculateAutomationLevel(automationLevelStr, toolMaturity);
  console.log('Automation level:', automationLevel);
  
  // Calculate marketing efficiency
  const marketingChallenges = responses.marketingChallenges || [];
  const efficiency = calculateMarketingEfficiency(toolMaturity, marketingChallenges, automationLevel);
  console.log('Marketing efficiency:', efficiency);
  
  const metrics = {
    toolMaturity,
    automationLevel,
    efficiency,
    overallScore: Math.round((toolMaturity + automationLevel + efficiency) / 3)
  };
  
  console.log('Final marketing metrics:', metrics);
  return metrics;
};

const calculateToolMaturity = (tools: string[]): number => {
  const score = tools.reduce((acc, tool) => acc + (TOOL_SCORES[tool] || 5), 0);
  return Math.min(score, 100);
};

const calculateAutomationLevel = (level: string, toolMaturity: number): number => {
  const levelMap = {
    '0-25%': 25,
    '26-50%': 50,
    '51-75%': 75,
    '76-100%': 100
  };
  const baseScore = levelMap[level] || 25;
  return Math.min(baseScore + (toolMaturity * 0.3), 100);
};

const calculateMarketingEfficiency = (
  toolMaturity: number,
  challenges: string[],
  automationLevel: number
): number => {
  // Calculate challenge impact
  const challengeScore = challenges.reduce((acc, challenge) => 
    acc + (CHALLENGE_WEIGHTS[challenge] || 10), 0);
  
  // Higher challenge score means lower efficiency
  const baseEfficiency = 100 - (challengeScore * 0.5);
  
  // Adjust based on tool maturity and automation
  const adjustedEfficiency = baseEfficiency * 
    ((toolMaturity / 100) * 0.4 + (automationLevel / 100) * 0.6);
  
  return Math.max(Math.min(adjustedEfficiency, 100), 0);
};
