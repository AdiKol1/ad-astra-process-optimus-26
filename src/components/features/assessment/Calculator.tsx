import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '@/hooks/useCalculation';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useToast } from '@/hooks/use-toast';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, setAssessmentData } = useAssessment();
  const { calculateScores, isCalculating, error } = useCalculation();

  React.useEffect(() => {
    const processCalculation = async () => {
      try {
        console.log('Starting calculation process with assessment data:', assessmentData);

        if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
          console.error('No assessment responses found');
          toast({
            title: "Missing Assessment Data",
            description: "Please complete the assessment questions first.",
            variant: "destructive",
          });
          navigate('/assessment');
          return;
        }

        console.log('Calculating scores with responses:', assessmentData.responses);
        const results = await calculateScores(assessmentData.responses);
        console.log('Calculation results:', results);

        // Update assessment data with calculated results
        setAssessmentData({
          ...assessmentData,
          ...results,
          completed: true
        });

        navigate('/assessment/report');
      } catch (err) {
        console.error('Failed to calculate scores:', err);
        toast({
          title: "Calculation Error",
          description: "There was an error processing your assessment. Please try again.",
          variant: "destructive",
        });
        navigate('/assessment');
      }
    };

    processCalculation();
  }, [calculateScores, navigate, assessmentData, toast, setAssessmentData]);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
  }

  return null;
};

export default Calculator;