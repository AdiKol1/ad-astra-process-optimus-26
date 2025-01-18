import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { calculateQualificationScore } from '@/utils/qualificationScoring';
import { transformAuditFormData } from '@/utils/assessmentFlow';
import type { AssessmentResponses } from '@/types/assessment';

export const useAssessmentNavigation = (currentStep: number, totalSteps: number) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, setAssessmentData, setCurrentStep } = useAssessment();

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Great progress!",
        description: "You're getting closer to your personalized optimization plan.",
        duration: 3000
      });
    } else {
      const responses = state?.responses || {};
      const score = calculateQualificationScore(responses);
      
      const mappedData: Partial<AssessmentResponses> = {
        industry: responses.industry || '',
        employees: String(responses.teamSize || ''),
        processVolume: responses.processVolume || '',
        timelineExpectation: responses.timeline || '',
        marketingChallenges: responses.marketingChallenges || [],
        toolStack: responses.toolStack || [],
        metricsTracking: responses.metricsTracking || [],
        automationLevel: responses.automationLevel || '0-25%',
        name: responses.name || '',
        email: responses.email || '',
        phone: responses.phone || ''
      };
      
      const transformedData = transformAuditFormData(mappedData);
      
      const finalData = {
        ...state,
        ...transformedData,
        completed: true,
        qualificationScore: score
      };

      setAssessmentData(finalData);
      navigate('/assessment/report');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return { handleNext, handleBack };
};