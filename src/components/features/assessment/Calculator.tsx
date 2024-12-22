import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateAssessmentResults } from '@/utils/calculations/services/calculationService';
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

        // Parse input data
        const input = {
          employees: Number(assessmentData.responses.employees) || 1,
          timeSpent: Number(assessmentData.responses.timeSpent) || 20,
          processVolume: assessmentData.responses.processVolume || "100-500",
          errorRate: assessmentData.responses.errorRate || "3-5%",
          industry: assessmentData.responses.industry || "Other"
        };

        // Calculate results using the new service
        const results = calculateAssessmentResults(input);

        // Calculate qualification score
        const qualificationScore = typeof assessmentData.qualificationScore === 'object' 
          ? (assessmentData.qualificationScore as any)?.score || 75
          : assessmentData.qualificationScore || 75;

        // Update assessment data with calculated results
        const finalData = {
          ...assessmentData,
          qualificationScore,
          results: {
            ...results,
            completed: true
          }
        };

        // Validate final assessment data
        const finalValidation = validationService.validateAssessmentData(finalData);
        if (!finalValidation.success) {
          console.error('Final data validation failed:', finalValidation.errors);
          throw new Error('Invalid calculation results');
        }

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