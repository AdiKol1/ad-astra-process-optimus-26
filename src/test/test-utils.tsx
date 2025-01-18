import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { ToastProvider } from '@/components/ui/toast';

// Define interfaces for wrapper options
interface AllProvidersProps {
  children: React.ReactNode;
  initialState?: any;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
  route?: string;
}

// Create a wrapper with all providers
function AllProviders({ children, initialState }: AllProvidersProps) {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AssessmentProvider initialState={initialState}>
          {children}
        </AssessmentProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

// Custom render function
function customRender(
  ui: ReactElement,
  {
    initialState = {},
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  window.history.pushState({}, 'Test page', route);

  return render(ui, {
    wrapper: (props) => (
      <AllProviders {...props} initialState={initialState} />
    ),
    ...renderOptions,
  });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
};

// Mock timing utilities
export const advanceTimers = () => {
  vi.runOnlyPendingTimers();
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock API response utilities
export const mockApiResponse = (data: any) => ({
  ok: true,
  json: async () => data,
});

export const mockApiError = (status = 500, message = 'Server Error') => ({
  ok: false,
  status,
  statusText: message,
  json: async () => ({ message }),
});
