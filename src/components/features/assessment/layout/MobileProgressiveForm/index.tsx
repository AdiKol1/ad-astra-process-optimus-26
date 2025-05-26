import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Mobile Header with Progress */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          {/* Step Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
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

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Navigation Footer */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isPreviousDisabled || isLoading}
              className={cn(
                "flex-1 h-12 text-base font-medium",
                "border-2 border-gray-200",
                "hover:border-gray-300 hover:bg-gray-50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {previousLabel}
            </Button>

            {/* Next Button */}
            <Button
              onClick={onNext}
              disabled={isNextDisabled || isLoading}
              className={cn(
                "flex-1 h-12 text-base font-medium",
                "bg-blue-600 hover:bg-blue-700",
                "border-2 border-blue-600 hover:border-blue-700",
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
          </div>
          
          {/* Safe area for mobile devices */}
          <div className="h-safe-area-inset-bottom" />
        </div>
      </div>
    </div>
  );
};

export default MobileProgressiveForm; 