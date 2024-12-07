import React from 'react';
import ProgressBar from '../ProgressBar';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
      <p className="text-sm text-gray-600 mt-2">
        {`${Math.round(((currentStep + 1) / totalSteps) * 100)}% complete - Just ${totalSteps - currentStep - 1} quick questions to go!`}
      </p>
    </div>
  );
};

export default StepProgress;