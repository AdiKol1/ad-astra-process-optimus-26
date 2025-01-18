import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadCapture from '../LeadCapture';
import { AssessmentProvider } from '../AssessmentProvider';
import { telemetry } from '@/utils/monitoring/telemetry';
import { performanceMonitor } from '@/utils/monitoring/performance';

// Mock dependencies
vi.mock('@/utils/monitoring/telemetry');
vi.mock('@/utils/monitoring/performance');
vi.mock('@/utils/googleSheets', () => ({
  saveFormDataToSheet: vi.fn().mockResolvedValue({ success: true })
}));

describe('LeadCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(
      <AssessmentProvider>
        <LeadCapture />
      </AssessmentProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates form fields', async () => {
    render(
      <AssessmentProvider>
        <LeadCapture />
      </AssessmentProvider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/company is required/i)).toBeInTheDocument();
  });

  it('handles successful form submission', async () => {
    render(
      <AssessmentProvider>
        <LeadCapture />
      </AssessmentProvider>
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company/i), 'Acme Inc');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'lead_capture_success',
        expect.any(Object)
      );
    });
  });

  it('handles form submission errors', async () => {
    vi.mock('@/utils/googleSheets', () => ({
      saveFormDataToSheet: vi.fn().mockRejectedValue(new Error('API Error'))
    }));

    render(
      <AssessmentProvider>
        <LeadCapture />
      </AssessmentProvider>
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company/i), 'Acme Inc');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(telemetry.trackError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      );
    });

    expect(await screen.findByText(/error submitting form/i)).toBeInTheDocument();
  });

  it('prevents rapid form submissions', async () => {
    render(
      <AssessmentProvider>
        <LeadCapture />
      </AssessmentProvider>
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company/i), 'Acme Inc');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    await userEvent.click(submitButton);

    expect(await screen.findByText(/please wait/i)).toBeInTheDocument();
  });
});
