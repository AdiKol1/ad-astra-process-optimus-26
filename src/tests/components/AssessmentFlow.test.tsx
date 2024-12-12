import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { vi } from 'vitest';
import AssessmentFlow from '@/components/features/assessment/AssessmentFlow';
import { useAssessmentSteps } from '@/hooks/useAssessmentSteps';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';

// Mock hooks
vi.mock('@/hooks/useAssessmentSteps', () => ({
  useAssessmentSteps: vi.fn()
}));

vi.mock('@/contexts/assessment/AssessmentContext', () => ({
  useAssessment: vi.fn()
}));

describe('AssessmentFlow', () => {
  const mockSteps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Tell us about your business',
      questions: [
        {
          id: 'industry',
          type: 'select',
          label: 'Industry',
          required: true,
          options: ['Technology', 'Healthcare', 'Finance']
        }
      ]
    }
  ];

  const mockAssessmentState = {
    responses: {},
    errors: {},
    loading: false,
    error: null
  };

  beforeEach(() => {
    (useAssessmentSteps as jest.Mock).mockReturnValue({
      steps: mockSteps,
      currentStep: 0,
      handleNext: vi.fn(),
      handleBack: vi.fn()
    });

    (useAssessment as jest.Mock).mockReturnValue({
      state: mockAssessmentState,
      setResponses: vi.fn(),
      setCurrentStep: vi.fn(),
      calculateResults: vi.fn()
    });
  });

  it('renders without crashing', () => {
    render(<AssessmentFlow />);
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    (useAssessment as jest.Mock).mockReturnValue({
      state: { ...mockAssessmentState, loading: true },
      setResponses: vi.fn(),
      setCurrentStep: vi.fn()
    });

    render(<AssessmentFlow />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles answers correctly', async () => {
    const setResponses = vi.fn();
    (useAssessment as jest.Mock).mockReturnValue({
      state: mockAssessmentState,
      setResponses,
      setCurrentStep: vi.fn()
    });

    render(<AssessmentFlow />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Technology' } });

    await waitFor(() => {
      expect(setResponses).toHaveBeenCalledWith({
        industry: 'Technology'
      });
    });
  });

  it('displays validation errors', () => {
    (useAssessment as jest.Mock).mockReturnValue({
      state: {
        ...mockAssessmentState,
        errors: { industry: 'Industry is required' }
      },
      setResponses: vi.fn(),
      setCurrentStep: vi.fn()
    });

    render(<AssessmentFlow />);
    expect(screen.getByText('Industry is required')).toBeInTheDocument();
  });

  it('handles final step calculation', async () => {
    const calculateResults = vi.fn().mockResolvedValue(undefined);
    (useAssessmentSteps as jest.Mock).mockReturnValue({
      steps: mockSteps,
      currentStep: mockSteps.length - 1,
      handleNext: vi.fn(),
      handleBack: vi.fn()
    });

    (useAssessment as jest.Mock).mockReturnValue({
      state: mockAssessmentState,
      setResponses: vi.fn(),
      setCurrentStep: vi.fn(),
      calculateResults
    });

    render(<AssessmentFlow />);
    
    const submitButton = screen.getByText('View Your Results');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(calculateResults).toHaveBeenCalled();
    });
  });
});
