import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadCaptureForm from '../LeadCaptureForm';
import { vi } from 'vitest';
import type { AuditFormData } from '@/types/assessment';

describe('LeadCaptureForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<LeadCaptureForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/implementation timeline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional information/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LeadCaptureForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /get your free assessment/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/company is required/i)).toBeInTheDocument();
      expect(screen.getByText(/industry is required/i)).toBeInTheDocument();
      expect(screen.getByText(/timeline expectation is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<LeadCaptureForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /get your free assessment/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<LeadCaptureForm onSubmit={mockOnSubmit} />);

    const formData: AuditFormData = {
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '1234567890',
      company: 'Acme Inc',
      industry: 'small_business',
      timelineExpectation: '3_months',
      message: 'Test message'
    };

    // Fill in text inputs
    await userEvent.type(screen.getByLabelText(/full name/i), formData.name);
    await userEvent.type(screen.getByLabelText(/email address/i), formData.email);
    await userEvent.type(screen.getByLabelText(/phone number/i), formData.phone);
    await userEvent.type(screen.getByLabelText(/company name/i), formData.company);
    await userEvent.type(screen.getByLabelText(/additional information/i), formData.message);
    
    // Handle select inputs
    const industrySelect = screen.getByLabelText(/industry/i);
    await userEvent.click(industrySelect);
    await userEvent.click(screen.getByText(/small business/i));
    
    const timelineSelect = screen.getByLabelText(/implementation timeline/i);
    await userEvent.click(timelineSelect);
    await userEvent.click(screen.getByText(/within 3 months/i));

    const submitButton = screen.getByRole('button', { name: /get your free assessment/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(formData);
    });
  });

  it('shows progress indicator', async () => {
    render(<LeadCaptureForm onSubmit={mockOnSubmit} />);

    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toBeInTheDocument();

    // Progress should start at 0
    expect(progressElement).toHaveAttribute('aria-valuenow', '0');

    // Fill in some fields and check progress increases
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');

    await waitFor(() => {
      const newProgress = parseInt(progressElement.getAttribute('aria-valuenow') || '0');
      expect(newProgress).toBeGreaterThan(0);
    });
  });

  it('shows loading state during submission', async () => {
    render(<LeadCaptureForm onSubmit={mockOnSubmit} />);

    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/company name/i), 'Acme Inc');

    const industrySelect = screen.getByLabelText(/industry/i);
    await userEvent.click(industrySelect);
    await userEvent.click(screen.getByText(/small business/i));
    
    const timelineSelect = screen.getByLabelText(/implementation timeline/i);
    await userEvent.click(timelineSelect);
    await userEvent.click(screen.getByText(/within 3 months/i));

    // Mock a slow submission
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const submitButton = screen.getByRole('button', { name: /get your free assessment/i });
    await userEvent.click(submitButton);

    // Check for loading state
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
