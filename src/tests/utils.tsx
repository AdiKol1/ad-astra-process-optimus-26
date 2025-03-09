import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AssessmentProvider } from '../components/features/assessment/AssessmentProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AssessmentProvider>
      {children}
    </AssessmentProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: AllTheProviders, ...options })
});

// Mock assessment data
export const mockAssessmentData = {
  industry: 'technology',
  employeeRange: '50-200',
  processComplexity: 'medium',
  currentChallenges: ['data_entry', 'communication'],
  timeSpent: '40-60'
};

// Helper to wait for state updates
export const waitForStateUpdate = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to simulate network latency
export const simulateNetworkLatency = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Helper to mock local storage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };