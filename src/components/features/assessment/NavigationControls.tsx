import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';

interface NavigationControlsProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  disabled?: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  disabled = false
}) => {
  const { isLoading } = useAssessment();

  return (
    <div className="flex justify-between items-center w-full mt-6 space-x-4">
      <Button
        onClick={onBack}
        variant="outline"
        disabled={isFirstStep || isLoading || disabled}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <Button
        onClick={onNext}
        disabled={isLoading || disabled}
        className="flex items-center gap-2"
      >
        {isLastStep ? 'Complete' : 'Next'}
        {!isLastStep && <ChevronRight className="h-4 w-4" />}
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        )}
      </Button>
    </div>
  );
};

export default NavigationControls;
