import React from 'react';
import { AssessmentProvider as LegacyAssessmentProvider } from './assessment/AssessmentContext';
// Import the new provider but don't use it yet
// import { AssessmentProvider as ModernAssessmentProvider } from './assessment/AssessmentProvider';
import { FormProvider } from './assessment/FormProvider';
import { UIProvider } from './ui/UIProvider';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';

interface RootProviderProps {
  children: React.ReactNode;
}

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  const performanceMonitor = createPerformanceMonitor('RootProvider');

  React.useEffect(() => {
    performanceMonitor.start('initialization');
    telemetry.track('root_provider_mounted');

    return () => {
      performanceMonitor.end('initialization');
      telemetry.track('root_provider_unmounted');
    };
  }, []);

  const handleFormSubmit = async (data: any) => {
    telemetry.track('assessment_form_submitted', { data });
  };

  // TODO: Future migration to ModernAssessmentProvider
  // Will need to:
  // 1. Port over all validation logic
  // 2. Add retry mechanism
  // 3. Add debounced saving
  // 4. Ensure all existing features are covered
  // 5. Add A/B testing capability to test both implementations
  return (
    <UIProvider>
      <LegacyAssessmentProvider>
        <FormProvider onSubmit={handleFormSubmit}>
          {children}
        </FormProvider>
      </LegacyAssessmentProvider>
    </UIProvider>
  );
};

export default RootProvider;
