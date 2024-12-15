import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);

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

    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [assessmentData, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!assessmentData) return null;

  return (
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
  );
};

export default AssessmentReport;