import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import { UrgencyBanner } from './UrgencyBanner';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { assessmentData } = useAssessment();

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
  }, [assessmentData, navigate]);

  if (!assessmentData) {
    return null;
  }

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