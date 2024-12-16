import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AssessmentErrorBoundary } from './AssessmentErrorBoundary';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      // Validate required data
      if (!assessmentData.qualificationScore) {
        throw new Error('Assessment score calculation failed');
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

  if (!assessmentData) return null;

  return (
    <AssessmentErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ReportHeader userInfo={assessmentData.userInfo} />
        
        <div className="space-y-6 mt-8">
          <InteractiveReport 
            data={{
              assessmentScore: {
                overall: assessmentData.qualificationScore || 0,
                automationPotential: assessmentData.automationPotential || 0,
                sections: assessmentData.sectionScores || {}
              },
              results: {
                annual: {
                  savings: assessmentData.results?.annual.savings || 0,
                  hours: assessmentData.results?.annual.hours || 0
                }
              },
              recommendations: assessmentData.recommendations || {},
              industryAnalysis: assessmentData.industryAnalysis,
              userInfo: assessmentData.userInfo
            }}
          />
        </div>

        <TrustIndicators className="mt-12" />
      </div>
    </AssessmentErrorBoundary>
  );
};

export default AssessmentReport;