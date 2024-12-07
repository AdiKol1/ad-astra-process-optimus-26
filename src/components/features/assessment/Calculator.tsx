import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../../../contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { generateCACResults } from '@/utils/cacCalculations';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!assessmentData) {
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        setIsCalculating(true);
        const responses = assessmentData.responses;

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses });
        const processScore = calculateProcessScore({ responses });
        const cacResults = generateCACResults(responses);

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: 0.4 },
          process: { score: processScore.score, weight: 0.4 },
          cac: { score: 1 - (cacResults.potentialReduction || 0), weight: 0.2 }
        });

        console.log('CAC Results:', cacResults);

        setAssessmentData({
          ...assessmentData,
          scores: {
            team: teamScore,
            process: processScore,
            total: totalScore,
            cac: cacResults
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while calculating scores');
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