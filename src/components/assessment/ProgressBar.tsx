import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <Progress value={progress} className="h-2" />
      <div className="mt-2 text-sm text-gray-500">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};