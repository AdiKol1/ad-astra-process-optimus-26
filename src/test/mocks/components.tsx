import React from 'react';
import { vi } from 'vitest';

// Mock components
export const QuestionRenderer = vi.fn().mockImplementation(({ step, config }) => (
  <div data-testid="question-renderer" data-step={step}>
    Mock Question Renderer
  </div>
));

export const LeadCapture = vi.fn().mockImplementation(() => (
  <div data-testid="lead-capture-form">
    Mock Lead Capture Form
  </div>
));

export const ProcessSection = vi.fn().mockImplementation(() => (
  <div data-testid="process-section">
    Mock Process Section
  </div>
));

export const ErrorBoundary = vi.fn().mockImplementation(({ children, fallback, onError }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    onError?.(error);
    return fallback;
  }
});
