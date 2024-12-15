import { useState } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateTeamScore } from '@/components/features/assessment/calculator/TeamScoreCalculator';
import { calculateProcessScore } from '@/components/features/assessment/calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from '@/components/features/assessment/calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { calculateAutomationPotential } from '@/utils/calculations/automationCalculator';
import { toast } from '@/hooks/use-toast';

export const useCalculation = () => {
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateScores = async () => {
    try {
      if (!assessmentData?.responses) {
        throw new Error('No assessment data available');
      }

      const teamScore = calculateTeamScore({ responses: assessmentData.responses });
      const processScore = calculateProcessScore({ responses: assessmentData.responses });
      const automationResults = calculateAutomationPotential(assessmentData.responses);
      const cacMetrics = calculateCACMetrics(
        assessmentData.responses,
        assessmentData.responses.industry || 'Other'
      );

      const totalScore = calculateWeightedScore({
        team: { score: teamScore.score, weight: 0.4 },
        process: { score: processScore.score, weight: 0.4 },
        cac: { score: 1 - (cacMetrics.potentialReduction / 100), weight: 0.2 }
      });

      const transformedData = {
        ...assessmentData,
        qualificationScore: Math.round(totalScore * 100),
        automationPotential: Math.round(automationResults.efficiency.productivity),
        sectionScores: {
          team: { percentage: Math.round(teamScore.score * 100) },
          process: { percentage: Math.round(processScore.score * 100) },
          automation: { percentage: Math.round(cacMetrics.efficiency * 100) }
        },
        results: {
          annual: {
            savings: automationResults.savings.annual,
            hours: automationResults.efficiency.timeReduction * 52
          },
          cac: {
            currentCAC: cacMetrics.currentCAC,
            potentialReduction: Math.round(cacMetrics.potentialReduction),
            annualSavings: cacMetrics.annualSavings,
            automationROI: Math.round(cacMetrics.automationROI * 100)
          }
        }
      };

      await setAssessmentData(transformedData);
      
      toast({
        title: "Calculation Complete",
        description: "Your assessment has been processed successfully.",
      });

      return transformedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while calculating scores';
      setError(errorMessage);
      toast({
        title: "Calculation Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculateScores,
    isCalculating,
    error,
    setError
  };
};