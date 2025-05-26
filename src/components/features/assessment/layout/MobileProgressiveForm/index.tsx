import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileProgressiveFormProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const MobileProgressiveForm: React.FC<MobileProgressiveFormProps> = ({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  onNext,
  onPrevious,
  nextLabel = "Next",
  previousLabel = "Previous",
  isNextDisabled = false,
  isPreviousDisabled = false,
  isLoading = false,
  className
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div 
      className={cn("fixed inset-0 bg-white flex flex-col", className)}
      data-assessment-mobile="true"
    >

      {/* Mobile Header - Fixed positioning for true full-screen */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          {/* Back button and progress in header */}
          <div className="flex items-center justify-between mb-3">
            {!isPreviousDisabled && (
              <button
                onClick={onPrevious}
                disabled={isPreviousDisabled || isLoading}
                className="flex items-center text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
            
            <div className="text-sm text-gray-600 font-medium">
              {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          {/* Step Title */}
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {stepTitle}
            </h1>
            {stepDescription && (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {stepDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-4 py-6">
          {children}
        </div>
      </div>

      {/* Mobile Navigation Footer - Single primary action */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            className={cn(
              "w-full h-12 text-base font-medium",
              "bg-blue-600 hover:bg-blue-700",
              "text-white shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Loading...
              </div>
            ) : (
              <>
                {nextLabel}
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          {/* Safe area for mobile devices */}
          <div className="h-safe-area-inset-bottom" />
        </div>
      </div>
    </div>
  );
};

export default MobileProgressiveForm; 