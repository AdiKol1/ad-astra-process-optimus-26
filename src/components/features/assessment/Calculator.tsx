import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateAssessmentResults } from '@/utils/calculations/assessmentCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { useToast } from '@/hooks/use-toast';
import { validationService } from '@/services/ValidationService';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const processCalculation = async () => {
      try {
        console.log('Starting calculation process with assessment data:', assessmentData);

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

        // Calculate results using calculation system
        const results = calculateAssessmentResults(assessmentData.responses);
        console.log('Raw calculation results:', results);

        // Transform CAC metrics to percentages
        if (results.cac) {
          console.log('CAC metrics before transformation:', results.cac);
          
          // Ensure potentialReduction is a decimal before converting to percentage
          const rawReduction = typeof results.cac.potentialReduction === 'number' 
            ? results.cac.potentialReduction 
            : 0;
            
          const transformedCac = {
            ...results.cac,
            potentialReduction: Math.round(rawReduction * 100),
            automationROI: Math.round((results.cac.automationROI || 0) * 100)
          };
          
          results.cac = transformedCac;
          console.log('CAC metrics after transformation:', results.cac);
        }

        // Update assessment data with calculated results
        const finalData = {
          ...assessmentData,
          results,
          completed: true
        };

        console.log('Final assessment data with results:', finalData);

        // Validate final assessment data
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
      } finally {
        setIsCalculating(false);
      }
    };

    processCalculation();
  }, [assessmentData, navigate, setAssessmentData, toast]);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
  }

  return null;
};

export default Calculator;