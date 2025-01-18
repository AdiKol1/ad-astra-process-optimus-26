import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentContext';
import { UIProvider } from '@/contexts/ui/UIProvider';
import { AssessmentFormProvider } from '@/contexts/assessment/FormProvider';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';

interface RenderOptions {
  assessment?: {
    isInitialized?: boolean;
    currentStep?: string;
    error?: string;
    getStepMetrics?: () => any;
    getStepHistory?: () => any[];
    canMoveToStep?: (step: string) => boolean;
  };
  ui?: {
    isLoading?: boolean;
  };
  form?: {
    isValid?: boolean;
  };
}

interface WrapperProps {
  children: React.ReactNode;
  options?: RenderOptions;
}

export const AllTheProviders = ({ children, options = {} }: WrapperProps) => {
  const {
    assessment = {},
    ui = {},
    form = {}
  } = options;

  return (
    <HelmetProvider>
      <BrowserRouter>
        <UIProvider initialState={ui}>
          <AssessmentProvider initialState={assessment}>
            <AssessmentFormProvider initialState={form}>
              {children}
              <Toaster />
            </AssessmentFormProvider>
          </AssessmentProvider>
        </UIProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} options={options} />,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
