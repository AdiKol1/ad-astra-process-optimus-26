import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { logger } from '@/utils/logger';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, calculateResults } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const performCalculation = async () => {
      try {
        logger.info('Starting assessment calculation');
        const results = await calculateResults();
        
        if (!results) {
          logger.warn('No results returned from calculation');
          navigate('/assessment');
          return;
        }

        logger.info('Assessment calculation completed', results);
        setIsCalculating(false);
      } catch (error) {
        logger.error('Error in assessment calculation:', error);
        setError(error instanceof Error ? error.message : 'An error occurred during calculation');
        setIsCalculating(false);
      }
    };

    performCalculation();
  }, [calculateResults, navigate]);

  if (error) {
    return <ErrorDisplay error={error} />;
    return <ErrorDisplay error={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
    return <LoadingDisplay />;
  }

  return null; // The AssessmentContext will handle navigation after calculation
};

export default Calculator;