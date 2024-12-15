import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '@/hooks/useCalculation';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { calculateScores, isCalculating, error } = useCalculation();

  React.useEffect(() => {
    const processCalculation = async () => {
      try {
        await calculateScores();
      } catch (err) {
        console.error('Failed to calculate scores:', err);
        navigate('/assessment');
      }
    };

    processCalculation();
  }, [calculateScores, navigate]);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
  }

  return null;
};

export default Calculator;