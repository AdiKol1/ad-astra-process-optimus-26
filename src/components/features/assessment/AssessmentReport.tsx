import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AssessmentErrorBoundary } from './AssessmentErrorBoundary';
import { validationService } from '@/services/ValidationService';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Transform assessment data for display
  const transformedData = React.useMemo(() => {
    if (!assessmentData) return null;

    console.log('Transforming assessment data:', assessmentData);

    // Extract and validate CAC metrics
    const cacMetrics = assessmentData.results?.cac;
    console.log('Processing CAC metrics:', cacMetrics);

    if (!cacMetrics) {
      console.error('No CAC metrics found in results');
      return null;
    }

    // Ensure qualification score is a number
    let qualificationScore: number;
    if (typeof assessmentData.qualificationScore === 'object') {
      qualificationScore = (assessmentData.qualificationScore as any)?.score || 75;
    } else if (typeof assessmentData.qualificationScore === 'number') {
      qualificationScore = assessmentData.qualificationScore;
    } else {
      qualificationScore = 75; // Default score
    }

    // Ensure we have the required annual results structure
    const annualResults = {
      savings: assessmentData.results?.annual?.savings || 150000,
      hours: assessmentData.results?.annual?.hours || 2080
    };

    // Ensure CAC metrics are properly formatted as percentages
    const transformedCac = {
      currentCAC: cacMetrics.currentCAC || 0,
      potentialReduction: Math.round((cacMetrics.potentialReduction || 0) * 100),
      annualSavings: cacMetrics.annualSavings || 0,
      automationROI: Math.round((cacMetrics.automationROI || 0) * 100)
    };

    console.log('Transformed CAC metrics:', transformedCac);

    // Calculate automation potential from qualificationScore
    const automationPotential = Math.round((qualificationScore || 0) * 0.8);

    return {
      assessmentScore: {
        overall: qualificationScore,
        automationPotential,
        sections: assessmentData.sectionScores || {}
      },
      results: {
        annual: annualResults,
        cac: transformedCac
      },
      recommendations: assessmentData.recommendations || {},
      industryAnalysis: assessmentData.industryAnalysis,
      userInfo: assessmentData.userInfo
    };
  }, [assessmentData]);

  React.useEffect(() => {
    if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
      toast({
        title: "Assessment Incomplete",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    try {
      // Validate assessment data
      const validationResult = validationService.validateAssessmentData(assessmentData);
      if (!validationResult.success) {
        throw new Error(validationResult.errors?.join(', ') || 'Invalid assessment data');
      }

      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error Loading Report",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [assessmentData, navigate, toast]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-500">Error Loading Report</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!transformedData) return null;

  return (
    <AssessmentErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ReportHeader userInfo={transformedData.userInfo} />
        
        <div className="space-y-6 mt-8">
          <InteractiveReport data={transformedData} />
        </div>

        <TrustIndicators className="mt-12" />
      </div>
    </AssessmentErrorBoundary>
  );
};

export default AssessmentReport;