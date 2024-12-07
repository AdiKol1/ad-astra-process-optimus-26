import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import TrustIndicators from '@/components/shared/TrustIndicators';
import ValueMicroConversion from './ValueMicroConversion';
import StepProgress from './flow/StepProgress';
import QuestionRenderer from './flow/QuestionRenderer';
import NavigationControls from './flow/NavigationControls';
import LeadCaptureForm from './LeadCaptureForm';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';

const AssessmentFlow = () => {
  const { assessmentData } = useAssessment();
  const {
    steps,
    currentStep,
    showValueProp,
    handleAnswer,
    handleNext,
    handleBack
  } = useAssessmentSteps();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="p-6">
        <StepProgress 
          currentStep={currentStep} 
          totalSteps={steps.length} 
        />

        {currentStep === steps.length - 1 ? (
          <LeadCaptureForm onSubmit={handleNext} />
        ) : (
          <QuestionRenderer
            section={steps[currentStep]?.data}
            onAnswer={handleAnswer}
            answers={assessmentData?.responses || {}}
          />
        )}

        <NavigationControls
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>

      {showValueProp && <ValueMicroConversion className="mt-8" />}
      <TrustIndicators className="mt-8" />
    </div>
  );
};

export default AssessmentFlow;