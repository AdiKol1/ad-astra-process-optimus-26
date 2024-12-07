interface MarketingScore {
  score: number;
  maxScore: number;
  percentage: number;
  needLevel: 'low' | 'medium' | 'high';
  recommendedServices: string[];
  priority: 'low' | 'medium' | 'high';
  metrics: {
    automationLevel: number;
    toolMaturity: number;
    challengeComplexity: number;
    marketingEfficiency: number;
  };
}

export const calculateMarketingScore = (answers: Record<string, any>): MarketingScore => {
  console.log('Calculating marketing score with answers:', answers);
  
  // Calculate tool maturity score
  const toolMaturity = calculateToolMaturity(answers.toolStack || []);
  
  // Calculate challenge complexity
  const challengeComplexity = calculateChallengeComplexity(answers.marketingChallenges || []);
  
  // Calculate automation level
  const automationLevel = calculateAutomationLevel(answers.automationLevel, toolMaturity);
  
  // Calculate marketing efficiency
  const marketingEfficiency = calculateMarketingEfficiency(
    toolMaturity,
    challengeComplexity,
    automationLevel
  );

  // Calculate overall score
  const totalScore = (toolMaturity + automationLevel + marketingEfficiency) / 3;
  
  // Determine need level and recommendations
  const needLevel = determineNeedLevel(totalScore);
  const recommendedServices = generateRecommendations(needLevel, answers);
  
  const result: MarketingScore = {
    score: Math.round(totalScore),
    maxScore: 100,
    percentage: Math.round(totalScore),
    needLevel,
    recommendedServices,
    priority: determinePriority(challengeComplexity, toolMaturity),
    metrics: {
      automationLevel,
      toolMaturity,
      challengeComplexity,
      marketingEfficiency
    }
  };

  console.log('Marketing score calculation result:', result);
  return result;
};

const calculateToolMaturity = (tools: string[]): number => {
  const essentialTools = ['CRM system', 'Email marketing platform', 'Analytics tools'];
  const advancedTools = ['Marketing automation platform', 'AI/ML tools'];
  
  let score = 0;
  tools.forEach(tool => {
    if (essentialTools.includes(tool)) score += 20;
    if (advancedTools.includes(tool)) score += 30;
  });
  
  return Math.min(score, 100);
};

const calculateChallengeComplexity = (challenges: string[]): number => {
  const complexChallenges = [
    'Campaign automation',
    'Performance tracking',
    'Budget optimization'
  ];
  
  return Math.min(
    (challenges.length / 6) * 100, // Adjusted from 4 to 6 for more realistic scaling
    100
  );
};

const calculateAutomationLevel = (level: string, toolMaturity: number): number => {
  const baseScore = level ? parseInt(level) : 25;
  return Math.min(baseScore + (toolMaturity * 0.3), 100);
};

const calculateMarketingEfficiency = (
  toolMaturity: number,
  challengeComplexity: number,
  automationLevel: number
): number => {
  return Math.round(
    (toolMaturity * 0.4) + 
    (automationLevel * 0.4) + 
    ((100 - challengeComplexity) * 0.2)
  );
};

const determineNeedLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 40) return 'high';
  if (score < 70) return 'medium';
  return 'low';
};

const determinePriority = (
  challengeComplexity: number,
  toolMaturity: number
): 'low' | 'medium' | 'high' => {
  const score = (challengeComplexity * 0.7) + (toolMaturity * 0.3);
  if (score < 40) return 'high';
  if (score < 70) return 'medium';
  return 'low';
};

const generateRecommendations = (
  needLevel: 'low' | 'medium' | 'high',
  answers: Record<string, any>
): string[] => {
  const recommendations: string[] = [];
  
  if (needLevel === 'high') {
    recommendations.push(
      'Complete Marketing Automation Implementation',
      'Strategic Marketing Consultation',
      'Process Optimization Workshop'
    );
  } else if (needLevel === 'medium') {
    recommendations.push(
      'Marketing Workflow Optimization',
      'Automation Enhancement',
      'Performance Analytics Setup'
    );
  } else {
    recommendations.push(
      'Advanced Marketing Optimization',
      'AI Integration Consultation',
      'Growth Strategy Workshop'
    );
  }

  return recommendations;
};