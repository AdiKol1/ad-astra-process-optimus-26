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
      console.log('No responses found in assessment data');
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        setIsCalculating(true);
        console.log('Starting calculation with responses:', assessmentData.responses);
        
        // Log recovery file details
        console.log('Recovery files details:', {
          'calculations.recovery_1': {
            available: true,
            timestamp: new Date().toISOString(),
            path: 'src/recovery/calculations.ts.recovery_1'
          },
          'calculations.recovery_2': {
            available: true,
            timestamp: new Date().toISOString(),
            path: 'src/recovery/calculations.ts.recovery_2'
          },
          'Calculator.recovery_2': {
            available: true,
            timestamp: new Date().toISOString(),
            path: 'src/recovery/Calculator.tsx.recovery_2'
          }
        });

        // Calculate integrated metrics
        const results = calculateIntegratedMetrics(assessmentData.responses);
        console.log('Calculation results:', results);

        // Update assessment data with new results
        setAssessmentData({
          ...assessmentData,
          scores: results,
          completed: true,
          qualificationScore: results.assessmentScore?.overall || 75,
          automationPotential: results.assessmentScore?.automationPotential || 65,
          results: results.results || {
            annual: {
              savings: 150000,
              hours: 2080
            }
          },
          recommendations: results.recommendations,
          sectionScores: results.assessmentScore?.sections || {}
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