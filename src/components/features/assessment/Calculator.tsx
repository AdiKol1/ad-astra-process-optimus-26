import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateIntegratedMetrics } from '@/utils/calculations/integrationCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';

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
        console.log('Starting calculation with responses:', assessmentData.responses);

        // Calculate integrated metrics
        const results = calculateIntegratedMetrics(assessmentData.responses);
        console.log('Calculation results:', results);

        // Update assessment data with new results
        setAssessmentData({
          ...assessmentData,
          scores: results,
          completed: true
        });
      } catch (err) {
        console.error('Error calculating scores:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while calculating scores');
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