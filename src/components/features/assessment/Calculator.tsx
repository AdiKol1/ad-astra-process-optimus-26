import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculation } from '@/hooks/useCalculation';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useToast } from '@/hooks/use-toast';
import { validationService } from '@/services/ValidationService';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, setAssessmentData } = useAssessment();
  const { calculateScores, isCalculating, error } = useCalculation();

  React.useEffect(() => {
    const processCalculation = async () => {
      try {
        console.log('Starting calculation process with assessment data:', assessmentData);

        // Validate assessment data
        if (!assessmentData?.responses) {
          console.error('No assessment responses found');
          toast({
            title: "Missing Assessment Data",
            description: "Please complete the assessment questions first.",
            variant: "destructive",
          });
          navigate('/assessment');
          return;
        }

        // Validate responses
        const validationResult = validationService.validateResponses(assessmentData.responses);
        if (!validationResult.success) {
          console.error('Response validation failed:', validationResult.errors);
          toast({
            title: "Invalid Assessment Data",
            description: "Some of your responses are invalid. Please check your answers.",
            variant: "destructive",
          });
          navigate('/assessment');
          return;
        }

        console.log('Calculating scores with responses:', assessmentData.responses);
        const results = await calculateScores(assessmentData.responses);
        console.log('Raw calculation results:', results);

        // Validate calculation results
        const transformedResults = {
          ...results,
          results: {
            ...results.results,
            cac: {
              ...results.results.cac,
              potentialReduction: results.results.cac?.potentialReduction 
                ? Math.round(results.results.cac.potentialReduction * 100)
                : 0,
              automationROI: results.results.cac?.automationROI 
                ? Math.round(results.results.cac.automationROI * 100)
                : 0
            }
          }
        };

        console.log('Transformed results with percentage values:', transformedResults);

        // Validate final assessment data
        const finalData = {
          ...assessmentData,
          ...transformedResults,
          completed: true
        };

        const finalValidation = validationService.validateAssessmentData(finalData);
        if (!finalValidation.success) {
          console.error('Final data validation failed:', finalValidation.errors);
          throw new Error('Invalid calculation results');
        }

        // Update assessment data with validated results
        setAssessmentData(finalData);
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