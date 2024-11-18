import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  canProgress: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  step,
  onNext,
  onPrev,
  canProgress,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={step === 0}
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={!canProgress}
      >
        {step === 3 ? 'Complete' : 'Next'}
      </Button>
    </div>
  );
};