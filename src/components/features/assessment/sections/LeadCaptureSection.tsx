import React from 'react';
import { Card } from '@/components/ui/card';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { LeadCaptureForm } from '@/components/features/assessment/forms';
import type { StepComponentProps } from '@/types/assessment/components';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

export const LeadCaptureSection: React.FC<StepComponentProps> = ({
  onComplete,
  validationErrors,
  isValid,
  isLoading,
  metadata,
  onNext,
  onBack,
  onValidationChange,
  step
}) => {
  console.log('LeadCaptureSection render:', { metadata, validationErrors, isValid, isLoading });
  
  const { responses, updateResponses } = useAssessmentStore();
  console.log('LeadCaptureSection store:', { responses });

  const handleSubmit = (data: any) => {
    console.log('LeadCaptureSection handleSubmit:', { data });
    updateResponses({ responses: { ...data } });
    onComplete();
  };

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{metadata?.title || 'Your Information'}</h2>
            <p className="text-gray-600">{metadata?.description || 'Please provide your contact information to continue.'}</p>
          </div>

          <LeadCaptureForm
            onSubmit={handleSubmit}
            validationErrors={validationErrors}
            isValid={isValid}
            isLoading={isLoading}
            initialData={responses?.responses || {}}
          />
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default LeadCaptureSection; 