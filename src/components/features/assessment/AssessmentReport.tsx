import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import { UrgencyBanner } from './UrgencyBanner';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logger } from '@/utils/logger';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, state } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);

  logger.info('AssessmentReport rendering with data:', { assessmentData, state });

  React.useEffect(() => {
    const checkAssessmentData = () => {
      // Check if we have responses and if the assessment is completed
      if (!state.responses || Object.keys(state.responses).length === 0 || !state.completed) {
        logger.warn('Assessment incomplete or no responses found', { 
          hasResponses: !!state.responses, 
          responseCount: Object.keys(state.responses || {}).length,
          completed: state.completed 
        });
        
        toast({
          title: "Assessment Incomplete",
          description: "Please complete all sections of the assessment first.",
          variant: "destructive",
        });
        
        navigate('/assessment');
        return false;
      }

      // Check if we have the required assessment data
      if (!assessmentData || !assessmentData.qualificationScore) {
        logger.warn('Missing required assessment data', { 
          hasAssessmentData: !!assessmentData,
          qualificationScore: assessmentData?.qualificationScore 
        });
        
        toast({
          title: "Data Processing Error",
          description: "There was an error processing your assessment. Please try again.",
          variant: "destructive",
        });
        
        navigate('/assessment');
        return false;
      }

      return true;
    };

    // Initial validation
    if (!checkAssessmentData()) {
      return;
    }

    // Simulate data processing delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [assessmentData, state, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ReportHeader userInfo={assessmentData.userInfo} />
      
      <div className="space-y-6 mt-8">
        <UrgencyBanner score={qualificationScore} />
        
        <InteractiveReport 
          data={{
            assessmentScore: {
              overall: qualificationScore,
              automationPotential: assessmentData.automationPotential || 65,
              sections: assessmentData.sectionScores || {}
            },
            results: {
              annual: {
                savings: assessmentData.results?.annual?.savings || 0,
                hours: assessmentData.results?.annual?.hours || 0
              },
              cac: assessmentData.results?.cac
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