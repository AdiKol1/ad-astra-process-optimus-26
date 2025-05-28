import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalizedCTA from './PersonalizedCTA';
import { AssessmentContext } from './AssessmentContext';

// Mock analytics
const mockTrackEvent = vi.fn();
vi.mock('./utils/analytics', () => ({
  trackEvent: mockTrackEvent,
}));

describe('PersonalizedCTA', () => {
  const mockOnAction = vi.fn();

  const renderWithContext = (currentStep = 25) => {
    const mockContextValue = {
      assessmentData: { currentStep, totalSteps: 100 },
      setAssessmentData: vi.fn(),
      currentStep,
      setCurrentStep: vi.fn(),
      leadScore: 0,
      setLeadScore: vi.fn(),
      leadData: null,
      setLeadData: vi.fn(),
      isPreviewMode: false,
      setPreviewMode: vi.fn()
    };

    return render(
      <AssessmentContext.Provider value={mockContextValue}>
        <PersonalizedCTA onAction={mockOnAction} />
      </AssessmentContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithContext();
    expect(screen.getByTestId('personalized-cta')).toBeInTheDocument();
  });

  it('shows early progress message when progress is low', () => {
    renderWithContext(25);
    expect(screen.getByText(/you're making great progress!/i)).toBeInTheDocument();
  });

  it('shows mid progress message when progress is moderate', () => {
    renderWithContext(60);
    expect(screen.getByText(/almost there! just a few more questions/i)).toBeInTheDocument();
  });

  it('shows final progress message when progress is high', () => {
    renderWithContext(80);
    expect(screen.getByText(/you're almost done!/i)).toBeInTheDocument();
  });

  it('calls onAction and tracks event when clicked', () => {
    renderWithContext(25);
    const button = screen.getByRole('button', { name: /continue assessment/i });
    
    fireEvent.click(button);
    
    expect(mockOnAction).toHaveBeenCalled();
    expect(mockTrackEvent).toHaveBeenCalledWith('cta_clicked', {
      section: 'assessment',
      progress: 25
    });
  });
});
