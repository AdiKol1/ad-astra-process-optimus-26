import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium">Assessment Progress</p>
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>
        <span className={cn(
          "text-sm font-medium",
          progress === 100 ? "text-green-500" : "text-muted-foreground"
        )}>
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className={cn(
          "h-2",
          progress === 100 ? "bg-green-100" : "bg-gray-100"
        )}
      />
      
      <div className="flex justify-between px-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              index <= currentStep ? "bg-gold" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
};