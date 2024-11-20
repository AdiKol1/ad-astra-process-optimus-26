import React, { useState, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ProgressBar from './ProgressBar';
import TrustIndicators from '@/components/shared/TrustIndicators';
import { trackEvent } from '@/utils/analytics';

// Import question sets
import { teamQuestions } from '@/constants/questions/team';
import { processesQuestions } from '@/constants/questions/processes';
import { processDetailsQuestions } from '@/constants/questions/processDetails';
import { technologyQuestions } from '@/constants/questions/technology';
import { challengesQuestions } from '@/constants/questions/challenges';
import { goalsQuestions } from '@/constants/questions/goals';
import { budgetAndTimelineQuestions } from '@/constants/questions/budgetAndTimeline';

// Lazy load components
const QuestionSection = lazy(() => import('./QuestionSection'));
const ValueMicroConversion = lazy(() => import('./ValueMicroConversion'));
const IndustryInsights = lazy(() => import('./IndustryInsights'));
const PersonalizedCTA = lazy(() => import('./PersonalizedCTA'));

const steps = [
  { id: 'team', Component: QuestionSection, data: teamQuestions, requiredFields: ['teamSize', 'departments', 'roleBreakdown', 'hoursPerWeek'] },
  { id: 'processes', Component: QuestionSection, data: processesQuestions, requiredFields: ['manualProcesses', 'timeSpent', 'errorRate'] },
  { id: 'processDetails', Component: QuestionSection, data: processDetailsQuestions, requiredFields: ['employees', 'processVolume'] },
  { id: 'technology', Component: QuestionSection, data: technologyQuestions, requiredFields: ['currentSystems', 'integrationNeeds'] },
  { id: 'challenges', Component: QuestionSection, data: challengesQuestions, requiredFields: ['painPoints', 'priority'] },
  { id: 'goals', Component: QuestionSection, data: goalsQuestions, requiredFields: ['objectives', 'expectedOutcomes'] },
  { id: 'budgetTimeline', Component: QuestionSection, data: budgetAndTimelineQuestions, requiredFields: ['budget', 'timeline'] },
  { id: 'value', Component: ValueMicroConversion },
  { id: 'insights', Component: IndustryInsights },
  { id: 'cta', Component: PersonalizedCTA },
];

const AssessmentFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    assessmentData, 
    setAssessmentData, 
    currentStep, 
    setCurrentStep,
    isLoading: contextLoading 
  } = useAssessment();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: any) => {
    if (!assessmentData) {
      setAssessmentData({
        responses: { [questionId]: answer },
        currentStep: 0,
        completed: false
      });
      return;
    }

    const newResponses = { 
      ...assessmentData.responses, 
      [questionId]: answer 
    };

    setAssessmentData({
      ...assessmentData,
      responses: newResponses,
    });

    // Track question interaction
    trackEvent('Question_Answer', {
      section: steps[currentStep].id,
      questionId,
      questionType: typeof answer === 'number' ? 'number' : typeof answer === 'object' ? 'multiSelect' : 'text',
      answerLength: answer?.toString().length,
    });

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: '',
      }));
    }
  };

  const validateResponses = (): boolean => {
    if (!assessmentData) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    const currentStepData = steps[currentStep];
    if (!currentStepData) {
      console.error('Invalid step data');
      return false;
    }

    const { requiredFields = [] } = currentStepData;
    const currentQuestions = currentStepData.data.questions;

    // Validate required fields
    requiredFields.forEach(fieldId => {
      const value = assessmentData.responses[fieldId];
      const question = currentQuestions.find(q => q.id === fieldId);

      if (!question) return;

      if (question.type === 'multiInput') {
        if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
          newErrors[fieldId] = 'Please fill in all role breakdowns';
          isValid = false;
        } else {
          const hasEmptyField = question.fields?.some(field => !value[field.id]);
          if (hasEmptyField) {
            newErrors[fieldId] = 'Please fill in all role breakdowns';
            isValid = false;
          }
        }
      } else if (question.type === 'multiSelect') {
        if (!Array.isArray(value) || value.length === 0) {
          newErrors[fieldId] = 'Please select at least one option';
          isValid = false;
        }
      } else if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[fieldId] = 'This field is required';
        isValid = false;
      }

      // Validate number fields
      if (question.type === 'number' && value) {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          if (question.min !== undefined && numValue < question.min) {
            newErrors[fieldId] = `Value must be at least ${question.min}`;
            isValid = false;
          }
          if (question.max !== undefined && numValue > question.max) {
            newErrors[fieldId] = `Value must not exceed ${question.max}`;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      toast({
        title: "Please complete all required fields",
        description: "Some required information is missing or invalid.",
        variant: "destructive",
      });
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateResponses()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        trackEvent('assessment_next_step', {
          fromStep: currentStep,
          toStep: currentStep + 1,
          stepId: steps[currentStep + 1].id
        });
      } else {
        setAssessmentData(prev => prev ? { ...prev, completed: true } : null);
        navigate('/assessment/results');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      trackEvent('assessment_prev_step', {
        fromStep: currentStep,
        toStep: currentStep - 1,
        stepId: steps[currentStep - 1].id
      });
    }
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep]?.Component;

  if (!CurrentStepComponent) {
    console.error('Invalid step component');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="mb-8">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={steps.length} 
          />
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          }
        >
          <CurrentStepComponent
            section={steps[currentStep].data}
            onAnswer={handleAnswer}
            answers={assessmentData?.responses || {}}
            errors={errors}
          />
        </Suspense>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>

      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;
