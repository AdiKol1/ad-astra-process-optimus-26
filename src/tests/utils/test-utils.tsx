import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentContext';
import { ProcessProvider } from '@/contexts/assessment/ProcessContext';
import { MarketingProvider } from '@/contexts/assessment/MarketingContext';

function render(ui: React.ReactElement, options = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProcessProvider>
        <MarketingProvider>
          <AssessmentProvider>
            {children}
          </AssessmentProvider>
        </MarketingProvider>
      </ProcessProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
