import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { transformAssessmentData } from '@/utils/assessment/dataTransformer';
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
    const calculateScores = async () => {
      try {
        if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
          console.log('No assessment data found, redirecting to assessment');
          navigate('/assessment');
          return;
        }

        console.log('Starting calculation with responses:', assessmentData.responses);

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses: assessmentData.responses });
        console.log('Team Score calculated:', teamScore);

        const processScore = calculateProcessScore({ responses: assessmentData.responses });
        console.log('Process Score calculated:', processScore);
        
        // Calculate CAC metrics with industry fallback
        const industry = assessmentData.responses.industry || 'Other';
        const cacMetrics = calculateCACMetrics(assessmentData.responses, industry);
        console.log('CAC Metrics calculated:', cacMetrics);

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: WEIGHTS.TEAM },
          process: { score: processScore.score, weight: WEIGHTS.PROCESS },
          cac: { score: 1 - (cacMetrics.potentialReduction / 100), weight: WEIGHTS.CAC }
        });
        console.log('Total weighted score calculated:', totalScore);

        // Transform the data into the correct format
        const transformedData = transformAssessmentData(
          teamScore,
          processScore,
          cacMetrics,
          totalScore,
          assessmentData
        );

        console.log('Data transformed for context:', transformedData);
        console.log('Verifying critical metrics:', {
          qualificationScore: transformedData.qualificationScore,
          automationPotential: transformedData.automationPotential,
          sectionScores: transformedData.sectionScores,
          results: transformedData.results
        });

        await setAssessmentData(transformedData);
        console.log('Successfully updated assessment data');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while calculating scores';
        console.error('Error in calculation pipeline:', err);
        setError(errorMessage);
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