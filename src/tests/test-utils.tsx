import React, { useEffect } from 'react';
import { render as rtlRender, RenderOptions as RTLRenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentProvider';
import { FormProvider } from '@/contexts/assessment/FormProvider';
import { UIProvider } from '@/contexts/ui/UIProvider';

// Define interfaces for wrapper options
interface WrapperProps {
  children: React.ReactNode;
  options?: RenderOptions;
}

interface RenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
  assessment?: {
    isInitialized?: boolean;
    currentStep?: string;
    error?: string;
  };
  ui?: {
    isLoading?: boolean;
  };
  form?: {
    isValid?: boolean;
    values?: Record<string, any>;
    errors?: Record<string, string>;
  };
}

const defaultOptions: RenderOptions = {
  assessment: {
    isInitialized: true,
    currentStep: 'process',
    error: undefined
  },
  ui: {
    isLoading: false
  },
  form: {
    isValid: true,
    values: {},
    errors: {}
  }
};

// Mock pointer capture for Radix UI
const mockPointerCapture = () => {
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = function() { return false; };
  }
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = function() { return; };
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = function() { return; };
  }
};

// Mock scroll behavior for Radix UI
const mockScrollBehavior = () => {
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = function() { return; };
  }
};

const AllTheProviders: React.FC<WrapperProps> = ({ children, options = {} }) => {
  useEffect(() => {
    mockPointerCapture();
    mockScrollBehavior();
  }, []);

  const mockFormSubmit = vi.fn();

  return (
    <HelmetProvider>
      <BrowserRouter>
        <UIProvider>
          <AssessmentProvider>
            <FormProvider onSubmit={mockFormSubmit}>
              {children}
            </FormProvider>
          </AssessmentProvider>
        </UIProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

// Custom render method
const render = (ui: React.ReactElement, options: RenderOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  return rtlRender(ui, {
    wrapper: (props) => <AllTheProviders {...props} options={mergedOptions} />,
    ...mergedOptions
  });
};

// Mock utilities
export const mockTelemetry = {
  track: vi.fn(),
  getEvents: vi.fn(() => []),
  clearEvents: vi.fn()
};

export const mockPerformanceMonitor = {
  start: vi.fn(() => 'test-mark'),
  end: vi.fn(() => 100),
  getDuration: vi.fn(() => 100),
  clear: vi.fn()
};

// Re-export everything
export * from '@testing-library/react';
export { render };
export { default as userEvent } from '@testing-library/user-event';
