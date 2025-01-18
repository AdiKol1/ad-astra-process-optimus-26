import React, { useCallback } from 'react';
import { CoreQuestionSection } from '../components/CoreQuestionSection';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { AssessmentStep, StepConfig } from '@/types/assessment/steps';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';

const performanceMonitor = createPerformanceMonitor('QuestionRenderer');

interface QuestionRendererProps {
  step: AssessmentStep;
  config: StepConfig;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  step,
  config,
}) => {
  const { state, setResponse, getStepMetrics } = useAssessment();
  const answers = state.responses;

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    const mark = performanceMonitor.start('handle_answer');
    try {
      setResponse(questionId as any, answer);

      telemetry.track('question_answered', {
        step,
        questionId,
        answerType: typeof answer,
        responseTime: performanceMonitor.getDuration(mark),
        ...getStepMetrics()
      });
    } finally {
      performanceMonitor.end(mark);
    }
  }, [step, setResponse, getStepMetrics]);

  if (!config || !config.questions) {
    telemetry.track('question_renderer_invalid_config', {
      step,
      hasConfig: !!config,
      hasQuestions: config?.questions?.length > 0
    });
    return null;
  }

  return (
    <CoreQuestionSection
      section={config}
      onAnswer={handleAnswer}
      answers={answers}
    />
  );
};

export default QuestionRenderer;