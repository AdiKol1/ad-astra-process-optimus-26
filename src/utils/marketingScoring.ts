import { MarketingScore } from '@/types/marketing';
import {
  calculateToolMaturity,
  calculateChallengeComplexity,
  calculateAutomationLevel,
  calculateBudgetEfficiency,
  calculateProcessMaturity,
  calculateIntegrationLevel,
  calculateMarketingEfficiency
} from './marketing/calculators';
import {
  determineNeedLevel,
  determinePriority,
  generateDetailedRecommendations
} from './marketing/recommendationsGenerator';

export const calculateMarketingScore = (answers: Record<string, any>): MarketingScore => {
  console.log('Calculating marketing score with answers:', answers);

  const toolMaturity = calculateToolMaturity(answers.toolStack || []);
  const challengeComplexity = calculateChallengeComplexity(answers.marketingChallenges || []);
  const automationLevel = calculateAutomationLevel(answers.automationLevel, toolMaturity);
  const budgetEfficiency = calculateBudgetEfficiency(answers.marketingBudget, answers.toolStack || []);
  const processMaturity = calculateProcessMaturity(answers.manualProcesses || [], answers.metricsTracking || []);
  const integrationLevel = calculateIntegrationLevel(answers.toolStack || []);

  const metrics = {
    toolMaturity,
    challengeComplexity,
    automationLevel,
    budgetEfficiency,
    processMaturity,
    integrationLevel,
    marketingEfficiency: 0
  };

  metrics.marketingEfficiency = calculateMarketingEfficiency(metrics);

  const totalScore = metrics.marketingEfficiency;
  const needLevel = determineNeedLevel(totalScore, challengeComplexity);

  console.log('Calculated marketing metrics:', metrics);

  return {
    score: Math.round(totalScore),
    maxScore: 100,
    percentage: Math.round(totalScore),
    needLevel,
    recommendedServices: generateDetailedRecommendations(needLevel, answers),
    priority: determinePriority(challengeComplexity, toolMaturity, budgetEfficiency),
    metrics
  };
};