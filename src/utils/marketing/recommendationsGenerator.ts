import { RecommendedService } from '@/types/marketing';

export const determineNeedLevel = (score: number, complexity: number): 'low' | 'medium' | 'high' => {
  const complexityFactor = complexity / 200;
  
  if (score < (35 - complexityFactor * 10)) return 'high';
  if (score < (65 - complexityFactor * 5)) return 'medium';
  return 'low';
};

export const determinePriority = (
  challengeComplexity: number,
  toolMaturity: number,
  budgetEfficiency: number
): 'low' | 'medium' | 'high' => {
  const score = (challengeComplexity * 0.4) + (toolMaturity * 0.3) + (budgetEfficiency * 0.3);
  
  if (score < 40) return 'high';
  if (score < 70) return 'medium';
  return 'low';
};

export const generateDetailedRecommendations = (
  needLevel: 'low' | 'medium' | 'high',
  answers: Record<string, any>
): RecommendedService[] => {
  const recommendations: RecommendedService[] = [];
  const currentTools = new Set(answers.toolStack || []);
  
  if (needLevel === 'high') {
    if (!currentTools.has('Marketing automation platform')) {
      recommendations.push({
        title: 'Marketing Automation Implementation',
        description: 'Deploy comprehensive marketing automation solution',
        priority: 'high',
        implementationTimeframe: '3-6 months',
        estimatedImpact: 80,
        prerequisites: ['Process documentation', 'Team training'],
        risks: ['Learning curve', 'Initial productivity dip']
      });
    }
    
    if (!currentTools.has('Analytics tools')) {
      recommendations.push({
        title: 'Analytics Implementation',
        description: 'Set up comprehensive analytics tracking',
        priority: 'high',
        implementationTimeframe: '1-3 months',
        estimatedImpact: 70,
        prerequisites: ['Tracking strategy', 'Data collection setup'],
        risks: ['Data accuracy', 'Integration complexity']
      });
    }
  }

  if (needLevel === 'medium') {
    recommendations.push({
      title: 'Marketing Process Optimization',
      description: 'Streamline existing marketing workflows',
      priority: 'medium',
      implementationTimeframe: '2-4 months',
      estimatedImpact: 60,
      prerequisites: ['Process audit', 'Team feedback'],
      risks: ['Change resistance', 'Temporary disruption']
    });
  }

  return recommendations;
};