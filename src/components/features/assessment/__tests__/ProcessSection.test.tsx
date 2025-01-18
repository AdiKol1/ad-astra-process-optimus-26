import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProcessSection from '../steps/ProcessSection';
import { AssessmentProvider } from '../AssessmentProvider';
import { telemetry } from '@/utils/monitoring/telemetry';

// Mock dependencies
vi.mock('@/utils/monitoring/telemetry');

describe('ProcessSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders process section correctly', () => {
    render(
      <AssessmentProvider>
        <ProcessSection />
      </AssessmentProvider>
    );

    expect(screen.getByText(/process assessment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('handles process selection', async () => {
    render(
      <AssessmentProvider>
        <ProcessSection />
      </AssessmentProvider>
    );

    const processOption = screen.getByLabelText(/manual process/i);
    await userEvent.click(processOption);

    expect(processOption).toBeChecked();
    expect(telemetry.trackEvent).toHaveBeenCalledWith(
      'process_selected',
      expect.any(Object)
    );
  });

  it('validates process selection before proceeding', async () => {
    render(
      <AssessmentProvider>
        <ProcessSection />
      </AssessmentProvider>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(await screen.findByText(/select a process/i)).toBeInTheDocument();
  });

  it('saves progress automatically', async () => {
    render(
      <AssessmentProvider>
        <ProcessSection />
      </AssessmentProvider>
    );

    const processOption = screen.getByLabelText(/manual process/i);
    await userEvent.click(processOption);

    await waitFor(() => {
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'progress_saved',
        expect.any(Object)
      );
    });
  });

  it('handles offline mode', async () => {
    // Mock offline status
    const originalOnline = window.navigator.onLine;
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true
    });

    render(
      <AssessmentProvider>
        <ProcessSection />
      </AssessmentProvider>
    );

    const processOption = screen.getByLabelText(/manual process/i);
    await userEvent.click(processOption);

    expect(await screen.findByText(/offline mode/i)).toBeInTheDocument();

    // Restore online status
    Object.defineProperty(window.navigator, 'onLine', {
      value: originalOnline,
      writable: true
    });
  });
});
