import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentFlow from './AssessmentFlow';
import { AssessmentProvider } from './AssessmentContext';

// Mock analytics
vi.mock('./utils/analytics', () => ({
  Analytics: {
    startSession: vi.fn(),
    trackEvent: vi.fn()
  },
  trackFormFieldInteraction: vi.fn(),
  trackLeadInteraction: vi.fn()
}));

const mockContextValue = {
  assessmentData: { currentStep: 0, totalSteps: 8 },
  setAssessmentData: vi.fn(),
  currentStep: 0,
  setCurrentStep: vi.fn(),
  leadScore: 0,
  setLeadScore: vi.fn(),
  leadData: null,
  setLeadData: vi.fn(),
  isPreviewMode: false,
  setPreviewMode: vi.fn()
};

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <AssessmentProvider value={mockContextValue}>
        <AssessmentFlow />
      </AssessmentProvider>
    </BrowserRouter>
  );
};

describe('AssessmentFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows first section by default', () => {
    renderWithProviders();
    expect(screen.getByText(/team size/i)).toBeInTheDocument();
  });

  it('navigates to next section when clicking next', async () => {
    renderWithProviders();
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Fill in required fields
    const input = screen.getByLabelText(/team size/i);
    fireEvent.change(input, { target: { value: '10' } });
    
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/process complexity/i)).toBeInTheDocument();
    });
  });

  it('shows PersonalizedCTA after 25% progress', async () => {
    renderWithProviders();
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Fill in required fields and navigate
    const input = screen.getByLabelText(/team size/i);
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('personalized-cta')).toBeInTheDocument();
    });
  });
});
