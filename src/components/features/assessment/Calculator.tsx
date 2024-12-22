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

        // Calculate results using calculation system
        const results = calculateAssessmentResults(assessmentData.responses);
        console.log('Raw calculation results:', results);

        // Transform qualification score from object to number if needed
        const qualificationScore = typeof assessmentData.qualificationScore === 'object' 
          ? (assessmentData.qualificationScore as any)?.score || 75
          : assessmentData.qualificationScore || 75;

        // Ensure we have the required annual results structure
        const annualResults = {
          savings: results.savings?.annual || 150000,
          hours: results.efficiency?.timeReduction * 52 || 2080
        };

        // Transform CAC metrics to percentages
        const cacMetrics = results.cac ? {
          ...results.cac,
          potentialReduction: Math.round((results.cac.potentialReduction || 0) * 100),
          automationROI: Math.round((results.cac.automationROI || 0) * 100)
        } : undefined;

        // Update assessment data with calculated results
        const finalData = {
          ...assessmentData,
          qualificationScore,
          results: {
            ...results,
            annual: annualResults,
            cac: cacMetrics
          },
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