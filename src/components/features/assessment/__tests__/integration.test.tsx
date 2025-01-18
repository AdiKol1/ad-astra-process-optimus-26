import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentFlow } from '../AssessmentFlow';
import { AssessmentProvider } from '../AssessmentProvider';
import { telemetry } from '@/utils/monitoring/telemetry';
import { saveFormDataToSheet } from '@/utils/googleSheets';

// Mock dependencies
vi.mock('@/utils/monitoring/telemetry');
vi.mock('@/utils/googleSheets', () => ({
  saveFormDataToSheet: vi.fn().mockResolvedValue({ success: true })
}));

describe('Assessment Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('completes full assessment flow', async () => {
    render(
      <AssessmentProvider>
        <AssessmentFlow />
      </AssessmentProvider>
    );

    // Step 1: Lead Capture
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company/i), 'Acme Inc');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify lead capture completion
    await waitFor(() => {
      expect(saveFormDataToSheet).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Acme Inc'
        })
      );
    });

    // Step 2: Process Section
    expect(await screen.findByText(/process assessment/i)).toBeInTheDocument();
    const processOption = screen.getByLabelText(/manual process/i);
    await userEvent.click(processOption);
    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    // Verify process selection
    expect(telemetry.trackEvent).toHaveBeenCalledWith(
      'process_selected',
      expect.any(Object)
    );

    // Step 3: Review
    expect(await screen.findByText(/review your answers/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify completion
    expect(telemetry.trackEvent).toHaveBeenCalledWith(
      'assessment_completed',
      expect.any(Object)
    );
  });

  it('handles validation errors across flow', async () => {
    render(
      <AssessmentProvider>
        <AssessmentFlow />
      </AssessmentProvider>
    );

    // Try to submit lead capture without data
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    // Fill lead capture partially
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    // Complete lead capture
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company/i), 'Acme Inc');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Try to proceed without selecting process
    await waitFor(() => {
      expect(screen.getByText(/process assessment/i)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText(/select a process/i)).toBeInTheDocument();
  });

  it('preserves data across page reloads', async () => {
    const { rerender } = render(
      <AssessmentProvider>
        <AssessmentFlow />
      </AssessmentProvider>
    );

    // Fill lead capture
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company/i), 'Acme Inc');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Simulate page reload
    rerender(
      <AssessmentProvider>
        <AssessmentFlow />
      </AssessmentProvider>
    );

    // Verify data persistence
    expect(await screen.findByText(/process assessment/i)).toBeInTheDocument();
    expect(localStorage.getItem('assessment_data')).toContain('John Doe');
  });
});
