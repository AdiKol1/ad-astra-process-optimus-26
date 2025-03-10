import { useState } from 'react';
import { calculateAssessmentScores } from '@/utils/calculations/scoreCalculator';
import { toast } from '@/hooks/use-toast';

export const useCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateScores = async (responses: Record<string, any>) => {
    try {
      if (!responses) {
        throw new Error('No assessment data available');
      }

      const results = calculateAssessmentScores(responses);
      
      toast({
        title: "Calculation Complete",
        description: "Your assessment has been processed successfully.",
      });

      return results;
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