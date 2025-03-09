import React from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { useUI } from '@/contexts/ui/UIProvider';
import { useAssessmentForm } from '@/contexts/assessment/FormProvider';
import QuestionRenderer from './flow/QuestionRenderer';
import LeadCapture from './LeadCapture';
import ProcessSection from './steps/ProcessSection';
import ErrorBoundary from '../../common/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { telemetry } from '@/utils/monitoring/telemetry';
import { AssessmentStep } from '@/types/assessment/state';
import { STEP_CONFIG } from '@/types/assessment/steps';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { TEST_IDS } from '@/test/utils/constants';

const performanceMonitor = createPerformanceMonitor('AssessmentStore');

export const AssessmentFlow: React.FC = () => {
  const { state, dispatch } = useAssessment();
  const { isLoading } = useUI();
  const { isValid } = useAssessmentForm();
  const currentStep = state.currentStep;

  const renderTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    const mark = performanceMonitor.start('step_render');
    
    return () => {
      const renderTime = performanceMonitor.end(mark);
      if (renderTime > 100) {
        telemetry.track('assessment_flow_slow_render', {
          step: currentStep,
          renderTime
        });
      }
    };
  }, [currentStep]);

  const prevStepRef = React.useRef<AssessmentStep | null>(null);
  
  React.useEffect(() => {
    if (currentStep === prevStepRef.current) return;
    
    telemetry.track('assessment_flow_step_changed', {
      step: currentStep,
      stepCount: state.stepHistory.length,
      canMoveForward: true // We'll determine this based on validation later
    });
    
    prevStepRef.current = currentStep;
  }, [currentStep, state.stepHistory]);

  React.useEffect(() => {
    telemetry.track('assessment_validation_changed', { isValid });
  }, [isValid]);

  const renderStep = () => {
    if (state.isLoading) {
      return (
        <Card className="p-6">
          <div 
            role="status"
            data-testid={TEST_IDS.LOADING_SPINNER}
            className="flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </Card>
      );
    }

    if (state.error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription data-testid={TEST_IDS.ERROR_MESSAGE}>
            {state.error}
          </AlertDescription>
        </Alert>
      );
    }

    const mark = performanceMonitor.start('render_step_content');
    
    try {
      switch (currentStep) {
        case 'lead-capture':
          return (
            <div data-testid={TEST_IDS.LEAD_CAPTURE}>
              <LeadCapture />
            </div>
          );
        case 'process':
          return (
            <div data-testid={TEST_IDS.PROCESS_SECTION}>
              <ProcessSection />
            </div>
          );
        default:
          return (
            <Card className="p-6 space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                {STEP_CONFIG[currentStep]?.title || 'Welcome to the Assessment'}
              </h1>
              <Separator className="my-4" />
              <QuestionRenderer 
                step={currentStep}
                config={STEP_CONFIG[currentStep]}
              />
            </Card>
          );
      }
    } finally {
      performanceMonitor.end(mark);
    }
  };

  return (
    <div 
      data-testid="assessment-flow"
      className={isLoading ? 'opacity-50 pointer-events-none' : ''}
    >
      <ErrorBoundary
        fallback={
          <Card className="p-4 bg-destructive/10 text-destructive">
            <p data-testid={TEST_IDS.ERROR_MESSAGE}>
              Something went wrong. Please refresh the page.
            </p>
          </Card>
        }
      >
        {renderStep()}
      </ErrorBoundary>
    </div>
  );
};