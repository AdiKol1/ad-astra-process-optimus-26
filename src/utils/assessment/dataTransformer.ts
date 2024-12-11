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
  console.log('Starting data transformation with raw values:', {
    teamScore,
    processScore,
    cacMetrics,
    totalScore
  });

  // Convert decimal scores to percentages
  const transformedData: AssessmentData = {
    ...currentData,
    qualificationScore: Math.round(totalScore * 100),
    automationPotential: Math.round(cacMetrics.efficiency * 100),
    sectionScores: {
      team: { 
        percentage: Math.round(teamScore.score * 100)
      },
      process: { 
        percentage: Math.round(processScore.score * 100)
      },
      automation: { 
        percentage: Math.round(cacMetrics.efficiency * 100)
      }
    },
    results: {
      annual: {
        savings: cacMetrics.annualSavings,
        hours: Math.round(((teamScore.score + processScore.score) / 2) * 2080)
      },
      cac: {
        currentCAC: cacMetrics.currentCAC,
        potentialReduction: Math.round(cacMetrics.potentialReduction * 100),
        annualSavings: cacMetrics.annualSavings,
        automationROI: Math.round(cacMetrics.automationROI * 100)
      }
    },
    userInfo: currentData.userInfo
  };

  console.log('Transformed assessment data (percentages converted):', transformedData);
  return transformedData;
};