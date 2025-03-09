import React from 'react';
import type { BaseStepComponentProps } from '@/components/features/assessment/core/AssessmentFlow';
import { AssessmentLanding } from '../AssessmentLanding';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useAssessmentStore } from '@/contexts/assessment/store';

const LandingSection: React.FC<BaseStepComponentProps> = ({
  onNext,
  onValidationChange,
  metadata
}) => {
  const { startAssessment } = useAssessmentStore();

  // Call onValidationChange with true since landing page is always valid
  React.useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const handleStart = React.useCallback(async () => {
    try {
      await startAssessment();
      onNext();
    } catch (error) {
      console.error('Error starting assessment:', error);
    }
  }, [startAssessment, onNext]);

  return (
    <ErrorBoundary>
      <AssessmentLanding onStart={handleStart} />
    </ErrorBoundary>
  );
};

export default LandingSection;
