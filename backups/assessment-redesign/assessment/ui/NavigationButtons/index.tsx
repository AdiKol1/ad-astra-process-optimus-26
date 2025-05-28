import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import type { NavigationButtonsProps } from '@/types/assessment';

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  loading = false,
  disabled = false
}) => {
  const handleNext = React.useCallback(() => {
    if (!loading && !disabled) {
      onNext();
    }
  }, [loading, disabled, onNext]);

  const handleBack = React.useCallback(() => {
    if (!loading && !disabled && onBack) {
      onBack();
    }
  }, [loading, disabled, onBack]);

  return (
    <ErrorBoundary>
      <div className="flex justify-between mt-8">
        {onBack && (
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={loading || disabled}
            className="min-w-[100px]"
          >
            {backLabel}
          </Button>
        )}
        <div className={onBack ? '' : 'ml-auto'}>
          <Button
            onClick={handleNext}
            disabled={loading || disabled}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              nextLabel
            )}
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
};