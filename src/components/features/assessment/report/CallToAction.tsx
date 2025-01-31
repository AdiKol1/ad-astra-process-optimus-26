import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActionButtons } from './ActionButtons';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { useAssessmentStore } from '@/stores/assessment';
import { telemetry } from '@/utils/monitoring/telemetry';

export const CallToAction: React.FC = React.memo(() => {
  const { results } = useAssessmentStore();

  React.useEffect(() => {
    telemetry.track('cta_section_viewed', {
      hasResults: !!results,
      timestamp: new Date().toISOString()
    });
  }, [results]);

  const CTAContent = () => (
    <Card className="bg-space-light/50">
      <CardContent className="p-6">
        <div 
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          role="region"
          aria-label="Call to action section"
        >
          <div className="space-y-2">
            <h3 
              className="text-xl font-semibold text-gold"
              id="cta-heading"
            >
              Ready to Transform Your Operations?
            </h3>
            <p 
              className="text-sm text-gray-300"
              id="cta-description"
            >
              Book a free strategy session (worth $1,500) to discuss your custom optimization plan
            </p>
          </div>
          <ActionButtons 
            aria-labelledby="cta-heading"
            aria-describedby="cta-description"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary>
      <CTAContent />
    </ErrorBoundary>
  );
});

CallToAction.displayName = 'CallToAction';