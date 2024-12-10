import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import type { AssessmentResults, AssessmentScores, IndustryAnalysis } from '@/types/calculator';

const WEIGHTS = {
  TEAM: 0.4,
  PROCESS: 0.4,
  CAC: 0.2
};

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const calculateScores = async () => {
      try {
        if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
          console.log('No assessment data found, redirecting to assessment');
          navigate('/assessment');
          return;
        }

        console.log('Starting score calculation with responses:', assessmentData.responses);

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses: assessmentData.responses });
        const processScore = calculateProcessScore({ responses: assessmentData.responses });
        
        // Calculate CAC metrics with industry fallback
        const industry = assessmentData.responses.industry || 'Other';
        const cacMetrics = calculateCACMetrics(assessmentData.responses, industry);
        console.log('Calculated CAC metrics:', cacMetrics);

        // Convert potential reduction to percentage for weighted score
        const potentialReductionFraction = cacMetrics.potentialReduction / 100;

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: WEIGHTS.TEAM },
          process: { score: processScore.score, weight: WEIGHTS.PROCESS },
          cac: { score: 1 - potentialReductionFraction, weight: WEIGHTS.CAC }
        });

        // Prepare section scores with proper structure
        const sectionScores: AssessmentScores = {
          team: { 
            score: teamScore.score,
            percentage: Math.round(teamScore.score * 100) 
          },
          process: { 
            score: processScore.score,
            percentage: Math.round(processScore.score * 100)
          },
          automation: { 
            score: cacMetrics.efficiency / 100,
            percentage: cacMetrics.efficiency
          }
        };

        // Prepare results with proper structure
        const results: AssessmentResults = {
          annual: {
            savings: cacMetrics.annualSavings,
            hours: Math.round((teamScore.score + processScore.score) / 2 * 2080) // 2080 = working hours per year
          },
          cac: cacMetrics
        };

        // Prepare industry analysis
        const industryAnalysis: IndustryAnalysis = {
          currentCAC: cacMetrics.currentCAC,
          potentialReduction: cacMetrics.potentialReduction,
          automationROI: cacMetrics.automationROI,
          benchmarks: {
            averageAutomation: 65,
            topPerformerAutomation: 85
          }
        };

        const qualificationScore = Math.round(totalScore * 100);
        console.log('Calculated qualification score:', qualificationScore);

        // Update assessment data with all calculated metrics
        const updatedData = {
          ...assessmentData,
          qualificationScore,
          automationPotential: cacMetrics.efficiency,
          sectionScores,
          results,
          industryAnalysis
        };

        console.log('Setting updated assessment data:', updatedData);
        await setAssessmentData(updatedData);
        console.log('Successfully updated assessment data');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while calculating scores';
        setError(errorMessage);
        console.error('Error calculating scores:', err);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateScores();
  }, [assessmentData?.responses, navigate, setAssessmentData]);

  if (error) {
    return (
      <ErrorBoundary>
        <ErrorDisplay error={error} />
      </ErrorBoundary>
    );
  }

  if (isCalculating) {
    return (
      <ErrorBoundary>
        <LoadingDisplay />
      </ErrorBoundary>
    );
  }

  return null;
};

export default Calculator;