import React, { useCallback, useEffect, useMemo } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { QuestionSection } from './sections';
import { NavigationControls } from './flow';
import { useAssessmentSteps } from '../../../hooks/useAssessmentSteps';
import { logger } from '../../../utils/logger';
import { TransitionWrapper, LoadingOverlay } from '../../../components/shared';
import { useToast } from '../../../components/ui';
import { AssessmentResponses } from '../../../types/assessment';
import { QuestionSection as QuestionSectionType, QuestionData } from '../../../types/questions';

interface AssessmentFlowProps {
  currentStep?: number;
  steps?: QuestionSectionType[];
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = () => {
  const { state, setResponse } = useAssessment();
  const { steps, currentStep, handleNext, handleBack } = useAssessmentSteps();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  // Memoize the current step data to prevent unnecessary recalculations
  const currentStepData = useMemo(() => {
    if (!steps || steps.length === 0) return null;
    return steps[currentStep];
  }, [steps, currentStep]);

  logger.info('AssessmentFlow rendering', { 
    currentStep, 
    stepsCount: steps?.length,
    steps,
    assessmentState: state,
    isInitialized
  }, 'assessment', 'AssessmentFlow');

  // Initialize assessment data only once
  useEffect(() => {
    if (!isInitialized && (!state.responses || Object.keys(state.responses).length === 0)) {
      try {
        logger.info('Initializing assessment state', undefined, 'assessment', 'AssessmentFlow');
        // Initialize with empty responses for each question
        const questions = currentStepData?.data?.questions || currentStepData?.questions || [];
        questions.forEach((question) => {
          setResponse(question.id as keyof AssessmentResponses, '');
        });
        setIsInitialized(true);
      } catch (err) {
        logger.error('Error initializing assessment', err, 'assessment', 'AssessmentFlow');
        setError('Failed to initialize assessment. Please try refreshing the page.');
        toast({
          title: 'Error',
          description: 'Failed to initialize assessment. Please try refreshing the page.',
          variant: 'destructive',
        });
      }
    }
  }, [isInitialized, state.responses, setResponse, toast, currentStepData]);

  const areAllRequiredQuestionsAnswered = useCallback((questions: QuestionData[], answers: Record<string, any>) => {
    return questions.every(question => {
      if (!question.required) return true;
      const answer = answers[question.id];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== '';
    });
  }, []);

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    try {
      logger.info('Handling answer', { questionId, answer }, 'assessment', 'AssessmentFlow');
      setResponse(questionId as keyof AssessmentResponses, answer);
    } catch (err) {
      logger.error('Error handling answer', err, 'assessment', 'AssessmentFlow');
      toast({
        title: 'Error',
        description: 'Failed to save your answer. Please try again.',
        variant: 'destructive',
      });
    }
  }, [setResponse, toast]);

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
    logger.warn('No steps provided to AssessmentFlow', undefined, 'assessment', 'AssessmentFlow');
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading assessment...</p>
      </div>
    );
  }

  if (!currentStepData) {
    logger.warn('Invalid step index', { currentStep }, 'assessment', 'AssessmentFlow');
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Invalid step. Please start over.</p>
      </div>
    );
  }

  // Transform questions to ensure they have the required 'label' property
  const questions = currentStepData.data?.questions || currentStepData.questions;
  const transformedQuestions = questions.map(question => ({
    ...question,
    label: question.label || question.text || '',
  }));

  return (
    <div className="max-w-4xl mx-auto py-8">
      <LoadingOverlay 
        show={isCalculating} 
        message="Calculating your assessment results..." 
      />
      <TransitionWrapper>
        <div className="space-y-8">
          <QuestionSection
            section={{
              title: currentStepData.data?.title || currentStepData.title,
              description: currentStepData.data?.description || currentStepData.description,
              questions: transformedQuestions
            }}
            onAnswer={handleAnswer}
            answers={state.responses}
            errors={error && currentStepData.id ? { [currentStepData.id]: error } : undefined}
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
