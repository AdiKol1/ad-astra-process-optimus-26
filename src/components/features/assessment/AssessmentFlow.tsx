import React from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import QuestionSection from './QuestionSection';
import NavigationControls from './flow/NavigationControls';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import type { AssessmentStep } from '@/types/assessment/core';
import { logger } from '@/utils/logger';
import { TransitionWrapper, StaggeredList } from '@/components/shared/TransitionWrapper';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { ValidationWrapper } from '@/components/shared/ValidationFeedback';
import { useToast } from '@/components/ui/use-toast';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: AssessmentStep[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
  const { state, setResponses, setCurrentStep, calculateResults } = useAssessment();
  const { steps, currentStep, handleNext, handleBack } = useAssessmentSteps();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  logger.info('AssessmentFlow rendering', { 
    currentStep, 
    stepsCount: steps?.length,
    steps,
    assessmentState: state 
  });

  // Initialize assessment data if not already done
  React.useEffect(() => {
    try {
      if (!state.responses || Object.keys(state.responses).length === 0) {
        logger.info('Initializing assessment state');
        setResponses({});
        setCurrentStep(0);
      }
    } catch (err) {
      logger.error('Error initializing assessment', err);
      setError('Failed to initialize assessment. Please try refreshing the page.');
      toast({
        title: 'Error',
        description: 'Failed to initialize assessment. Please try refreshing the page.',
        variant: 'destructive',
      });
    }
  }, [state.responses, setResponses, setCurrentStep, toast]);

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

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    logger.warn('Invalid step index', { currentStep });
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Invalid step. Please start over.</p>
      </div>
    );
  }

  const handleAnswer = (sectionId: string, answers: Record<string, any>) => {
    logger.info('Handling answer', { sectionId, answers });
    
    setResponses({
      ...state.responses,
      [sectionId]: answers
    });
  };

  const handleNextStep = async () => {
    if (currentStep === steps.length - 1) {
      // Final step - calculate results
      setIsCalculating(true);
      try {
        await calculateResults();
        toast({
          title: 'Assessment Complete',
          description: 'Your results are ready to view.',
          variant: 'default'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to calculate assessment results. Please try again.',
          variant: 'destructive'
        });
        logger.error('Error calculating results', { error });
      } finally {
        setIsCalculating(false);
      }
    } else {
      handleNext();
    }
  };

  return (
    <>
      <LoadingOverlay 
        show={isCalculating} 
        message="Calculating your assessment results..." 
      />
      
      <TransitionWrapper
        show={true}
        type="fade"
        className="space-y-6"
      >
        <StaggeredList show={true}>
          {[
            <ValidationWrapper
              key="question-section"
              error={state.error}
              className="w-full"
            >
              <QuestionSection 
                section={currentStepData}
                onAnswer={handleAnswer}
                answers={state.responses}
                errors={state.errors}
                loading={state.loading}
              />
            </ValidationWrapper>,
            
            <NavigationControls 
              key="nav-controls"
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={handleNextStep}
              onBack={handleBack}
              loading={state.loading || isCalculating}
              error={state.error}
              isValid={!state.errors || Object.keys(state.errors).length === 0}
            />
          ]}
        </StaggeredList>
      </TransitionWrapper>
    </>
  );
};

export default AssessmentFlow;