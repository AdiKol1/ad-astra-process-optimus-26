import React from 'react';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';

interface StepNavigationProps {
  onNext?: () => Promise<boolean> | boolean;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onNext,
  onPrev,
  nextLabel = 'Continue',
  prevLabel = 'Back'
}) => {
  const { goToNextStep, goToPreviousStep, isLastStep } = useAssessment();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (onNext) {
        const canProceed = await onNext();
        if (canProceed) {
          goToNextStep();
        }
      } else {
        goToNextStep();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
    goToPreviousStep();
  };

  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={handlePrev}
        className="w-24"
      >
        {prevLabel}
      </Button>
      
      <Button
        onClick={handleNext}
        className="w-32"
        disabled={isLoading}
      >
        {isLastStep ? 'Complete' : nextLabel}
      </Button>
    </div>
  );
};

export default StepNavigation;