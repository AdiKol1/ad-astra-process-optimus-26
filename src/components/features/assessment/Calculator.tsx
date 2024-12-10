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
    if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
      console.log('No assessment data found, redirecting to assessment');
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        const { responses } = assessmentData;
        console.log('Starting score calculation with responses:', responses);

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses });
        const processScore = calculateProcessScore({ responses });
        
        // Calculate CAC metrics with industry fallback
        const industry = responses.industry || 'Other';
        const cacMetrics = calculateCACMetrics(responses, industry);
        console.log('Calculated CAC metrics:', cacMetrics);

        // Convert potential reduction to fraction for weighted score
        const potentialReductionFraction = (cacMetrics.potentialReduction ?? 0) / 100;

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: WEIGHTS.TEAM },
          process: { score: processScore.score, weight: WEIGHTS.PROCESS },
          cac: { score: 1 - potentialReductionFraction, weight: WEIGHTS.CAC }
        });

        // Calculate annual savings and hours
        const annualSavings = cacMetrics.annualSavings || 0;
        const annualHours = Math.round((teamScore.score + processScore.score) / 2 * 2080); // Based on standard work year

        // Update assessment data with all calculated metrics
        const updatedData = {
          ...assessmentData,
          qualificationScore: Math.round(totalScore * 100),
          automationPotential: cacMetrics.efficiency,
          sectionScores: {
            team: { percentage: Math.round(teamScore.score * 100) },
            process: { percentage: Math.round(processScore.score * 100) },
            automation: { percentage: cacMetrics.efficiency }
          },
          results: {
            annual: {
              savings: annualSavings,
              hours: annualHours
            }
          },
          industryAnalysis: {
            currentCAC: cacMetrics.currentCAC,
            potentialReduction: cacMetrics.potentialReduction,
            automationROI: cacMetrics.automationROI
          }
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