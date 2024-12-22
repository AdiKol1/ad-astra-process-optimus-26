import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ReportHeader } from './report/ReportHeader';
import { InteractiveReport } from './InteractiveReport';
import { UrgencyBanner } from './UrgencyBanner';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AssessmentReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(true);

  console.log('AssessmentReport rendering with data:', assessmentData);

  // Extract qualification score from object or number
  const getQualificationScore = (score: any): number => {
    if (typeof score === 'number') return score;
    if (typeof score === 'object' && score !== null) {
      return score.score || 75; // Default to 75 if score property doesn't exist
    }
    return 75; // Default fallback
  };

  // Ensure we have valid annual results
  const getAnnualResults = (results: any) => {
    const defaultAnnual = {
      savings: 150000,
      hours: 2080
    };

    if (!results) return defaultAnnual;
    if (!results.annual) return defaultAnnual;

    return {
      savings: results.annual.savings || defaultAnnual.savings,
      hours: results.annual.hours || defaultAnnual.hours
    };
  };

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

  const qualificationScore = getQualificationScore(assessmentData.qualificationScore);
  const annualResults = getAnnualResults(assessmentData.results);

  console.log('Processed assessment data:', {
    qualificationScore,
    annualResults,
    assessmentData
  });

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
              annual: annualResults,
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