import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import { UrgencyBanner } from './UrgencyBanner';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);

  console.log('[AssessmentReport] Initializing with data:', {
    hasData: !!assessmentData,
    responses: assessmentData?.responses,
    qualificationScore: assessmentData?.qualificationScore
  });

  React.useEffect(() => {
    // Validate required data
    if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
      console.log('[AssessmentReport] No assessment data found, redirecting to assessment');
      toast({
        title: "Assessment Incomplete",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    console.log('[AssessmentReport] Data validation passed, processing report');

    // Simulate data processing delay
    const timer = setTimeout(() => {
      console.log('[AssessmentReport] Loading complete');
      setIsLoading(false);
    }, 1000);

    return () => {
      console.log('[AssessmentReport] Cleaning up');
      clearTimeout(timer);
    };
  }, [assessmentData, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!assessmentData) {
    console.log('[AssessmentReport] Assessment data is null or undefined');
    return null;
  }

  console.log('[AssessmentReport] Rendering report with data:', {
    qualificationScore: assessmentData.qualificationScore,
    hasUserInfo: !!assessmentData.userInfo,
    responseCount: Object.keys(assessmentData.responses || {}).length
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ReportHeader userInfo={assessmentData.userInfo} />
      
      <div className="space-y-6 mt-8">
        <UrgencyBanner score={assessmentData.qualificationScore || 75} />
        
        <InteractiveReport 
          data={{
            assessmentScore: {
              overall: assessmentData.qualificationScore || 75,
              automationPotential: assessmentData.automationPotential || 65,
              sections: assessmentData.sectionScores || {}
            },
            results: assessmentData.results || {
              annual: {
                savings: 150000,
                hours: 2080
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