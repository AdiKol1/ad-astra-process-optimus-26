import { AssessmentData, CACMetrics } from '@/types/assessmentTypes';

interface ScoreResult {
  score: number;
}

export const transformAssessmentData = (
  teamScore: ScoreResult,
  processScore: ScoreResult,
  cacMetrics: CACMetrics,
  totalScore: number,
  currentData: AssessmentData
): AssessmentData => {
  console.log('Transforming assessment data with:', {
    teamScore,
    processScore,
    cacMetrics,
    totalScore
  });

  const transformedData: AssessmentData = {
    ...currentData,
    qualificationScore: Math.round(totalScore * 100),
    automationPotential: cacMetrics.efficiency,
    sectionScores: {
      team: { 
        percentage: Math.round(teamScore.score * 100),
        score: teamScore.score
      },
      process: { 
        percentage: Math.round(processScore.score * 100),
        score: processScore.score
      },
      automation: { 
        percentage: cacMetrics.efficiency,
        score: cacMetrics.efficiency / 100
      }
    },
    results: {
      annual: {
        savings: cacMetrics.annualSavings,
        hours: Math.round(((teamScore.score + processScore.score) / 2) * 2080) // 2080 = working hours per year
      },
      cac: cacMetrics
    }
  };

  console.log('Transformed assessment data:', transformedData);
  return transformedData;
};