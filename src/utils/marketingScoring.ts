interface MarketingScore {
  score: number;
  maxScore: number;
  percentage: number;
  needLevel: 'low' | 'medium' | 'high';
  recommendedServices: string[];
  priority: 'low' | 'medium' | 'high';
}

export const calculateMarketingScore = (answers: Record<string, any>): MarketingScore => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Score single-select questions
  const singleSelectScoring = (answer: string, options: string[]): number => {
    return options.indexOf(answer);
  };

  // Score multi-select questions
  const multiSelectScoring = (selections: string[], options: string[]): number => {
    const essentialTools = ['CRM system', 'Email marketing platform', 'Customer Acquisition Cost (CAC)'];
    const advancedTools = ['AI/ML tools', 'Marketing automation platform', 'Return on Ad Spend (ROAS)'];
    
    let score = 0;
    selections.forEach(selection => {
      if (essentialTools.includes(selection)) score += 2;
      if (advancedTools.includes(selection)) score += 1;
    });
    return Math.min(score, 4); // Cap at 4 to match other scales
  };

  // Calculate scores for each question
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = marketingQuestions.questions.find(q => q.id === questionId);
    if (!question) return;

    let questionScore = 0;
    if (question.type === 'select') {
      questionScore = singleSelectScoring(answer as string, question.options);
    } else if (question.type === 'multiSelect') {
      questionScore = multiSelectScoring(answer as string[], question.options);
    }

    totalScore += questionScore * (question.weight || 1);
    maxPossibleScore += 4 * (question.weight || 1); // 4 is max score per question
  });

  const percentage = (totalScore / maxPossibleScore) * 100;

  // Determine need level and recommended services
  const needLevel = percentage < 40 ? 'high' : percentage < 70 ? 'medium' : 'low';
  
  const recommendedServices = [];
  if (needLevel === 'high') {
    recommendedServices.push(
      'Complete Marketing Automation Implementation',
      'Strategic Marketing Consultation',
      'Process Optimization Workshop'
    );
  } else if (needLevel === 'medium') {
    recommendedServices.push(
      'Marketing Workflow Optimization',
      'Automation Enhancement',
      'Performance Analytics Setup'
    );
  } else {
    recommendedServices.push(
      'Advanced Marketing Optimization',
      'AI Integration Consultation',
      'Growth Strategy Workshop'
    );
  }

  // Determine priority based on growth goals and current challenges
  const priority = answers.growthGoals?.includes('More than 100% growth') || 
                  answers.marketingChallenges?.length > 3 ? 'high' :
                  answers.growthGoals?.includes('51-100% growth') ? 'medium' : 'low';

  return {
    score: totalScore,
    maxScore: maxPossibleScore,
    percentage,
    needLevel,
    recommendedServices,
    priority
  };
};