import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { logger } from '@/utils/logger';

interface ValidationError {
  field?: string;
  message: string;
}

interface NavigationControlsProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
  errors?: ValidationError[];
  isValid?: boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNext,
  onBack,
  currentStep,
  totalSteps,
  loading = false,
  errors = [],
  isValid = true
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  logger.info('Navigation controls rendering', {
    currentStep,
    totalSteps,
    progress,
    loading,
    errors,
    isValid
  });

  const handleNext = () => {
    logger.info('Next button clicked', { currentStep });
    if (!loading && isValid) {
      onNext();
    }
  };

  const handleBack = () => {
    logger.info('Back button clicked', { currentStep });
    if (!loading) {
      onBack();
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {errors.length > 0 && (
        <div className="space-y-2" role="alert" aria-label="Validation errors">
          {errors.map((error, index) => (
            <p 
              key={index} 
              className="text-sm text-destructive flex items-start gap-2"
            >
              <span className="text-destructive">•</span>
              {error.field ? (
                <span>
                  <strong>{error.field}:</strong> {error.message}
                </span>
              ) : (
                error.message
              )}
            </p>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || loading}
          className="min-w-[100px]"
        >
          Back
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={loading || !isValid || errors.length > 0}
          className="min-w-[140px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === totalSteps - 1 ? (
            'View Your Results'
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
};

export default NavigationControls;
