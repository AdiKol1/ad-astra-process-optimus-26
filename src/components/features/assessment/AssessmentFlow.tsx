import React, { useCallback, useEffect, useMemo } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { QuestionSection } from './sections';
import { NavigationControls } from './flow';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import type { AssessmentStep } from '@/types/assessment/core';
import { logger } from '@/utils/logger';
import { TransitionWrapper, LoadingOverlay } from '@/components/shared';
import { useToast } from '@/components/ui';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
  const { state, setResponses } = useAssessment();
  const { steps, currentStep, handleNext, handleBack } = useAssessmentSteps();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  logger.info('AssessmentFlow rendering', { 
    currentStep, 
    stepsCount: steps?.length,
    steps,
    assessmentState: state,
    isInitialized
  });

  // Initialize assessment data only once
  useEffect(() => {
    if (!isInitialized && (!state.responses || Object.keys(state.responses).length === 0)) {
      try {
        logger.info('Initializing assessment state');
        setResponses({});
        setIsInitialized(true);
      } catch (err) {
        logger.error('Error initializing assessment', err);
        setError('Failed to initialize assessment. Please try refreshing the page.');
        toast({
          title: 'Error',
          description: 'Failed to initialize assessment. Please try refreshing the page.',
          variant: 'destructive',
        });
      }
    }
  }, [isInitialized, state.responses, setResponses, toast]);

  const areAllRequiredQuestionsAnswered = useCallback((questions: any[], answers: Record<string, any>) => {
    return questions.every(question => {
      if (!question.required) return true;
      const answer = answers[question.id];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== '';
    });
  }, []);

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    try {
      logger.info('Handling answer', { questionId, answer });
      
      setResponses(prevResponses => ({
        ...prevResponses,
        [questionId]: answer
      }));
      
      // Remove automatic navigation - let the user control when to move forward
    } catch (err) {
      logger.error('Error handling answer', err);
      toast({
        title: 'Error',
        description: 'Failed to save your answer. Please try again.',
        variant: 'destructive',
      });
    }
  }, [setResponses, toast]);

  // Memoize the current step data to prevent unnecessary recalculations
  const currentStepData = useMemo(() => {
    if (!steps || steps.length === 0) return null;
    return steps[currentStep];
  }, [steps, currentStep]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    logger.warn('No steps provided to AssessmentFlow');
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading assessment...</p>
      </div>
    );
  }

  if (!currentStepData) {
    logger.warn('Invalid step index', { currentStep });
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Invalid step. Please start over.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <LoadingOverlay 
        show={isCalculating} 
        message="Calculating your assessment results..." 
      />
      <TransitionWrapper>
        <div className="space-y-8">
          <QuestionSection
            section={currentStepData.data}
            onAnswer={handleAnswer}
            answers={state.responses || {}}
            errors={error ? { [currentStepData.id]: error } : {}}
          />
          <NavigationControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={handleNext}
            onBack={handleBack}
            loading={isCalculating}
            error={error}
          />
        </div>
      </TransitionWrapper>
    </div>
  );
};

export default React.memo(AssessmentFlow);