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
  console.log('Starting data transformation with:', {
    teamScore,
    processScore,
    cacMetrics,
    totalScore
  });

  // Convert decimal scores to percentages and ensure proper structure
  const transformedData: AssessmentData = {
    ...currentData,
    qualificationScore: Math.round(totalScore * 100),
    // Convert efficiency to percentage if it's a decimal
    automationPotential: cacMetrics.efficiency > 1 ? 
      cacMetrics.efficiency : 
      Math.round(cacMetrics.efficiency * 100),
    sectionScores: {
      team: { 
        percentage: Math.round(teamScore.score * 100)
      },
      process: { 
        percentage: Math.round(processScore.score * 100)
      },
      automation: { 
        // Ensure automation percentage is properly scaled
        percentage: Math.round(cacMetrics.efficiency * 100)
      }
    },
    results: {
      annual: {
        savings: cacMetrics.annualSavings,
        // Calculate hours based on efficiency score
        hours: Math.round(((teamScore.score + processScore.score) / 2) * 2080) // 2080 = working hours per year
      },
      cac: {
        currentCAC: cacMetrics.currentCAC,
        // Ensure potentialReduction is a percentage
        potentialReduction: cacMetrics.potentialReduction > 1 ? 
          cacMetrics.potentialReduction : 
          Math.round(cacMetrics.potentialReduction * 100),
        annualSavings: cacMetrics.annualSavings,
        // Convert ROI to percentage if it's not already
        automationROI: cacMetrics.automationROI > 1 ? 
          cacMetrics.automationROI : 
          Math.round(cacMetrics.automationROI * 100)
      }
    },
    userInfo: currentData.userInfo
  };

  console.log('Transformed assessment data:', transformedData);
  return transformedData;
};