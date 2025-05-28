import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { AssessmentFlow } from '../AssessmentFlow';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { TEST_IDS } from '@/test/utils/constants';

// Mock the required contexts
const mockUseAssessment = vi.fn();
const mockUseUI = vi.fn();
const mockUseAssessmentForm = vi.fn();

vi.mock('@/contexts/assessment/AssessmentContext', () => ({
  useAssessment: () => mockUseAssessment()
}));

vi.mock('@/contexts/ui/UIProvider', () => ({
  useUI: () => mockUseUI()
}));

vi.mock('@/contexts/assessment/FormProvider', () => ({
  useAssessmentForm: () => mockUseAssessmentForm()
}));

// Mock components
vi.mock('../flow/QuestionRenderer', () => ({
  default: () => <div data-testid={TEST_IDS.CORE_QUESTION}>Mock Question</div>
}));

vi.mock('../LeadCapture', () => ({
  default: () => <div data-testid={TEST_IDS.LEAD_CAPTURE}>Mock Lead Capture</div>
}));

vi.mock('../steps/ProcessSection', () => ({
  default: () => <div data-testid={TEST_IDS.PROCESS_SECTION}>Mock Process Section</div>
}));

// Mock utilities
vi.mock('@/utils/monitoring/telemetry', () => ({
  telemetry: {
    track: vi.fn()
  }
}));

vi.mock('@/utils/monitoring/performance', () => ({
  createPerformanceMonitor: () => ({
    start: vi.fn(),
    end: vi.fn(),
    clear: vi.fn()
  })
}));

describe('AssessmentFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUI.mockReturnValue({ isLoading: false });
    mockUseAssessmentForm.mockReturnValue({ isValid: true });
  });

  it('should render loading state when not initialized', () => {
    mockUseAssessment.mockReturnValue({
      state: { currentStep: null },
      isInitialized: false,
      error: null
    });

    renderWithProviders(<AssessmentFlow />);
    expect(screen.getByTestId(TEST_IDS.LOADING_SPINNER)).toBeInTheDocument();
  });

  it('should render lead capture step', async () => {
    mockUseAssessment.mockReturnValue({
      state: { currentStep: 'lead-capture' },
      isInitialized: true,
      error: null
    });

    renderWithProviders(<AssessmentFlow />);
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.LEAD_CAPTURE)).toBeInTheDocument();
    });
  });

  it('should render process step', async () => {
    mockUseAssessment.mockReturnValue({
      state: { currentStep: 'process' },
      isInitialized: true,
      error: null
    });

    renderWithProviders(<AssessmentFlow />);
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.PROCESS_SECTION)).toBeInTheDocument();
    });
  });

  it('should render error message when error exists', () => {
    const testError = 'Test error message';
    mockUseAssessment.mockReturnValue({
      state: { currentStep: null },
      isInitialized: true,
      error: testError
    });

    renderWithProviders(<AssessmentFlow />);
    expect(screen.getByText(testError)).toBeInTheDocument();
  });
});
