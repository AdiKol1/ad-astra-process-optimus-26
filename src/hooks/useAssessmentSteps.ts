import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateQualificationScore } from '@/utils/qualificationScoring';
import { transformAuditFormData } from '@/utils/assessmentFlow';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { cacQuestions } from '@/constants/questions/cac';
import { marketingQuestions } from '@/constants/questions/marketing';
import { teamQuestions } from '@/constants/questions/team';

export const useAssessmentSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData, setAssessmentData, currentStep, setCurrentStep } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  const steps = [
    { 
      id: 'team',
      data: teamQuestions
    },
    { 
      id: 'qualifying', 
      data: {
        ...qualifyingQuestions,
        questions: qualifyingQuestions.questions.slice(0, 2)
      }
    },
    { 
      id: 'impact', 
      data: {
        ...impactQuestions,
        questions: impactQuestions.questions.filter(q => 
          ['timeWasted', 'errorImpact'].includes(q.id)
        )
      }
    },
    {
      id: 'marketing',
      data: marketingQuestions
    },
    {
      id: 'cac',
      data: cacQuestions
    },
    { 
      id: 'readiness', 
      data: {
        ...readinessQuestions,
        questions: readinessQuestions.questions.filter(q => 
          ['decisionMaking', 'timeline'].includes(q.id)
        )
      }
    },
    {
      id: 'contact',
      data: {
        title: "Almost Done!",
        description: "Please provide your contact information to receive your personalized assessment report.",
        questions: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            text: 'Full Name',
            required: true,
            placeholder: 'John Doe'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            text: 'Email Address',
            required: true,
            placeholder: 'john@example.com'
          },
          {
            id: 'phone',
            type: 'tel',
            label: 'Phone Number',
            text: 'Phone Number',
            required: true,
            placeholder: '(555) 555-5555'
          },
          {
            id: 'company',
            type: 'text',
            label: 'Company Name',
            text: 'Company Name',
            required: false,
            placeholder: 'Acme Inc'
          }
        ]
      }
    }
  ];

  const handleAnswer = (questionId: string, answer: any) => {
    if (!assessmentData) {
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep,
        totalSteps: steps.length,
        completed: false
      });
      return;
    }
    
    const newResponses = {
      ...(assessmentData.responses || {}),
      [questionId]: answer
    };
    
    const updatedData = {
      ...assessmentData,
      responses: newResponses,
      currentStep: currentStep,
      totalSteps: steps.length,
      completed: false
    };

    setAssessmentData(updatedData);

    if (!showValueProp && currentStep === 0 && Object.keys(newResponses).length >= 1) {
      setShowValueProp(true);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

  return {
    steps,
    currentStep,
    showValueProp,
    handleAnswer,
    handleNext,
    handleBack
  };
};