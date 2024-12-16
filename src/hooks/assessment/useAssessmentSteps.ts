import { useAssessment } from '@/contexts/AssessmentContext';
import { useAssessmentNavigation } from './useAssessmentNavigation';
import { useAssessmentAnswers } from './useAssessmentAnswers';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { cacQuestions } from '@/constants/questions/cac';
import { marketingQuestions } from '@/constants/questions/marketing';
import { teamQuestions } from '@/constants/questions/team';
import type { AssessmentStep } from '@/types/assessmentFlow';

interface UseAssessmentStepsReturn {
  steps: AssessmentStep[];
  currentStep: number;
  showValueProp: boolean;
  handleAnswer: (questionId: string, answer: any) => void;
  handleNext: () => void;
  handleBack: () => void;
}

export const useAssessmentSteps = (): UseAssessmentStepsReturn => {
  const { currentStep } = useAssessment();

  const steps: AssessmentStep[] = [
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

  const { handleAnswer, showValueProp } = useAssessmentAnswers(currentStep, steps.length);
  const { handleNext, handleBack } = useAssessmentNavigation(currentStep, steps.length);

  return {
    steps,
    currentStep,
    showValueProp,
    handleAnswer,
    handleNext,
    handleBack
  };
};