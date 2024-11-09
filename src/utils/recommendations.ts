import { calculateAssessmentScore } from './scoring';
import { getRecommendationsByScore, RecommendationTemplate } from '@/constants/recommendationTemplates';

export const generateRecommendations = (answers: Record<string, any>) => {
  const score = calculateAssessmentScore(answers);
  const recommendations = getRecommendationsByScore(score.overall);
  
  return {
    score,
    recommendations,
    summary: {
      automationPotential: score.automationPotential,
      priorityAreas: recommendations
        .filter(rec => rec.impact === 'high')
        .map(rec => rec.title),
      timeframe: recommendations.length > 2 ? 'phased' : 'immediate',
    }
  };
};