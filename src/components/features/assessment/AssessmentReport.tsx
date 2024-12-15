import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { calculateAnnualSavings } from '@/utils/calculations/savingsCalculator';
import { formatMetric } from '@/utils/formatting/metricFormatter';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);

  console.log('AssessmentReport rendering with data:', assessmentData);

  React.useEffect(() => {
    if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
      console.log('No assessment data found, redirecting to assessment');
      toast({
        title: "Assessment Incomplete",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    // Simulate data processing delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [assessmentData, navigate, toast]);

  const calculateMetrics = React.useCallback(() => {
    if (!assessmentData?.responses) return null;

    const employeeCount = parseInt(assessmentData.responses.teamSize?.[0]?.split('-')[0] || '1');
    const automationPotential = assessmentData.automationPotential || 0;
    
    const annualSavings = calculateAnnualSavings({
      employeeCount,
      hourlyRate: 50,
      automationPotential,
      processVolume: assessmentData.responses.processVolume || '100-500',
      industry: assessmentData.responses.industry || 'Other'
    });

    const annualHours = Math.round(2080 * employeeCount * (automationPotential / 100));

    return {
      savings: annualSavings,
      hours: annualHours
    };
  }, [assessmentData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!assessmentData) {
    console.log('Assessment data is null or undefined');
    return null;
  }

  const metrics = calculateMetrics();
  console.log('Calculated metrics:', metrics);

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
                savings: metrics?.savings || 0,
                hours: metrics?.hours || 0
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