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

        // Validate required fields
        const requiredFields = ['employees', 'timeSpent', 'processVolume', 'errorRate', 'industry'];
        const missingFields = requiredFields.filter(field => !assessmentData.responses[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing required fields:', missingFields);
          toast({
            title: "Incomplete Assessment",
            description: "Please complete all required fields before continuing.",
            variant: "destructive",
          });
          navigate('/assessment');
          return;
        }

        // Parse and validate input data
        const input = {
          employees: Math.max(1, Number(assessmentData.responses.employees) || 1),
          timeSpent: Math.min(168, Math.max(1, Number(assessmentData.responses.timeSpent) || 20)),
          processVolume: assessmentData.responses.processVolume || "100-500",
          errorRate: assessmentData.responses.errorRate || "3-5%",
          industry: assessmentData.responses.industry || "Other"
        };

        console.log('Calculating results with input:', input);

        // Calculate results using the service
        const results = calculateAssessmentResults(input);
        console.log('Calculation results:', results);

        // Calculate qualification score with bounds checking
        const qualificationScore = typeof assessmentData.qualificationScore === 'object' 
          ? Math.min(100, Math.max(0, (assessmentData.qualificationScore as any)?.score || 75))
          : Math.min(100, Math.max(0, assessmentData.qualificationScore || 75));

        // Update assessment data with calculated results
        const finalData = {
          ...assessmentData,
          qualificationScore,
          results: {
            ...results,
            completed: true,
            timestamp: new Date().toISOString()
          }
        };

        // Validate final assessment data
        const finalValidation = validationService.validateAssessmentData(finalData);
        if (!finalValidation.success) {
          console.error('Final data validation failed:', finalValidation.errors);
          throw new Error('Invalid calculation results');
        }

        console.log('Setting final assessment data:', finalData);
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