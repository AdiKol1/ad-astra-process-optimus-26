import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessment';
import type { StepComponentProps } from '../core/AssessmentFlow/types';
import { CheckCircle } from 'lucide-react';

export const CompletionSection: React.FC<StepComponentProps> = ({
  onComplete
}) => {
  const { results } = useAssessmentStore();

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold">Assessment Complete!</h2>
        
        <p className="text-gray-600">
          Thank you for completing the assessment. Your results have been processed and are ready for review.
        </p>

        {results && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Next Steps</h3>
            <p className="text-gray-600">
              Our team will review your assessment and reach out to discuss your personalized optimization strategy.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => {
                  // Open results in a new tab when we have a URL
                  // For now, just show the dashboard
                  window.location.href = '/dashboard';
                }}
              >
                View Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompletionSection; 