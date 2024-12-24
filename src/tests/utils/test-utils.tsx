import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { vi } from 'vitest';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentContext';
import { ProcessProvider } from '@/contexts/assessment/ProcessContext';
import { MarketingProvider } from '@/contexts/assessment/MarketingContext';

// Mock the providers
vi.mock('@/contexts/assessment/AssessmentContext', async () => {
  const actual = await vi.importActual('@/contexts/assessment/AssessmentContext');
  return {
    ...actual,
    AssessmentProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('@/contexts/assessment/ProcessContext', async () => {
  const actual = await vi.importActual('@/contexts/assessment/ProcessContext');
  return {
    ...actual,
    ProcessProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('@/contexts/assessment/MarketingContext', async () => {
  const actual = await vi.importActual('@/contexts/assessment/MarketingContext');
  return {
    ...actual,
    MarketingProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

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
