import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../../../contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { WEIGHTS } from './calculator/constants';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!assessmentData?.responses) {
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        setIsCalculating(true);
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

        setAssessmentData({
          ...assessmentData,
          scores: {
            team: teamScore,
            process: processScore,
            total: totalScore,
            cac: cacMetrics
          }
        });
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
    return <ErrorDisplay error={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
  }

  return null;
};

export default Calculator;