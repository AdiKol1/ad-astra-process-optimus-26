import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNext,
  onBack,
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 0}
      >
        Back
      </Button>
      
      <Button 
        onClick={onNext}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {currentStep === totalSteps - 1 ? 'View Your Results' : 'Continue'}
      </Button>
    </div>
  );
};

export default NavigationControls;