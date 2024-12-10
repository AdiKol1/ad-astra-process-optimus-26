import { AssessmentData } from '@/types/assessmentTypes';
import { CACMetrics } from '@/types/calculator';

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

  // Convert decimal scores to percentages and ensure proper structure
  const transformedData: AssessmentData = {
    ...currentData,
    qualificationScore: Math.round(totalScore * 100),
    automationPotential: cacMetrics.efficiency,
    sectionScores: {
      team: { 
        percentage: Math.round(teamScore.score * 100)
      },
      process: { 
        percentage: Math.round(processScore.score * 100)
      },
      automation: { 
        percentage: cacMetrics.efficiency
      }
    },
    results: {
      annual: {
        savings: cacMetrics.annualSavings,
        hours: Math.round(((teamScore.score + processScore.score) / 2) * 2080) // 2080 = working hours per year
      },
      cac: {
        currentCAC: cacMetrics.currentCAC,
        potentialReduction: cacMetrics.potentialReduction,
        annualSavings: cacMetrics.annualSavings,
        automationROI: cacMetrics.automationROI
      }
    },
    userInfo: currentData.userInfo
  };

  console.log('Transformed assessment data:', transformedData);
  return transformedData;
};