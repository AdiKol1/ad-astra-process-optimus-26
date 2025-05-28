import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LeadCaptureForm from './LeadCaptureForm';
import { AssessmentContext } from './AssessmentContext';
import { Analytics, trackFormFieldInteraction, trackLeadInteraction } from './utils/analytics';

// Mock analytics functions
vi.mock('./utils/analytics', () => ({
  Analytics: {
    startSession: vi.fn(),
    trackEvent: vi.fn()
  },
  trackFormFieldInteraction: vi.fn(),
  trackLeadInteraction: vi.fn()
}));

const mockContextValue = {
  assessmentData: { currentStep: 1, totalSteps: 5 },
  setAssessmentData: vi.fn(),
  currentStep: 1,
  setCurrentStep: vi.fn(),
  leadScore: 0,
  setLeadScore: vi.fn(),
  leadData: null,
  setLeadData: vi.fn(),
  isPreviewMode: false,
  setPreviewMode: vi.fn()
};

const renderWithProviders = (onSubmit = vi.fn()) => {
  return render(
    <BrowserRouter>
      <AssessmentContext.Provider value={mockContextValue}>
        <LeadCaptureForm onSubmit={onSubmit} />
      </AssessmentContext.Provider>
    </BrowserRouter>
  );
};

describe('LeadCaptureForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderWithProviders();
    expect(screen.getByLabelText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role \*/i)).toBeInTheDocument();
  });

  it('tracks field interactions', async () => {
    renderWithProviders();
    const firstNameInput = screen.getByLabelText(/first name \*/i);
    await userEvent.type(firstNameInput, 'John');
    
    expect(trackFormFieldInteraction).toHaveBeenCalledWith({
      field: 'firstName',
      value: 'John',
      step: mockContextValue.currentStep
    });
  });

  it('validates required fields', async () => {
    renderWithProviders();
    const submitButton = screen.getByText(/get full report/i);
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/company is required/i)).toBeInTheDocument();
      expect(screen.getByText(/role is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockOnSubmit = vi.fn();
    renderWithProviders(mockOnSubmit);
    
    await userEvent.type(screen.getByLabelText(/first name \*/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name \*/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/business email \*/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company \*/i), 'Acme Inc');
    await userEvent.type(screen.getByLabelText(/role \*/i), 'Manager');
    
    fireEvent.click(screen.getByText(/get full report/i));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Inc',
        role: 'Manager',
        phoneNumber: '',
        industry: '',
        companySize: '',
        captureStep: mockContextValue.currentStep
      });
    });
  });

  it('handles submission errors', async () => {
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Submission failed'));
    renderWithProviders(mockOnSubmit);
    
    await userEvent.type(screen.getByLabelText(/first name \*/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name \*/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/business email \*/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company \*/i), 'Acme Inc');
    await userEvent.type(screen.getByLabelText(/role \*/i), 'Manager');
    
    fireEvent.click(screen.getByText(/get full report/i));
    
    await waitFor(() => {
      expect(screen.getByText(/error submitting form/i)).toBeInTheDocument();
    });
  });

  it('tracks form abandonment', () => {
    const { unmount } = renderWithProviders();
    unmount();
    
    expect(trackLeadInteraction).toHaveBeenCalledWith({
      category: 'Lead',
      action: 'Form_Abandon',
      metadata: expect.objectContaining({
        formStep: mockContextValue.currentStep.toString()
      })
    });
  });
});