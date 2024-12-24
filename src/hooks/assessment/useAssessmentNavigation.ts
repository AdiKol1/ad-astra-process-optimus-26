import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateQualificationScore } from '@/utils/qualificationScoring';
import { transformAuditFormData } from '@/utils/assessmentFlow';

export const useAssessmentNavigation = (currentStep: number, totalSteps: number) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, setAssessmentData, setCurrentStep } = useAssessment();

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Great progress!",
        description: "You're getting closer to your personalized optimization plan.",
        duration: 3000
      });
    } else {
      const score = calculateQualificationScore(assessmentData?.responses || {});
      
      const mappedData = {
        industry: assessmentData?.responses?.industry || '',
        employees: String(assessmentData?.responses?.teamSize || ''),
        processVolume: assessmentData?.responses?.processVolume || '',
        timelineExpectation: assessmentData?.responses?.timeline || '',
        marketingChallenges: assessmentData?.responses?.marketingChallenges || [],
        toolStack: assessmentData?.responses?.toolStack || [],
        metricsTracking: assessmentData?.responses?.metricsTracking || [],
        automationLevel: assessmentData?.responses?.automationLevel || '0-25%',
        name: assessmentData?.responses?.name || '',
        email: assessmentData?.responses?.email || '',
        phone: assessmentData?.responses?.phone || ''
      };
      
      const transformedData = transformAuditFormData(mappedData);
      
      const finalData = {
        ...assessmentData,
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