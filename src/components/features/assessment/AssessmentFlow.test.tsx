import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentFlow from './AssessmentFlow';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AssessmentProvider>
        {component}
      </AssessmentProvider>
    </BrowserRouter>
  );
};

describe('AssessmentFlow', () => {
  it('renders without crashing', () => {
    renderWithProviders(<AssessmentFlow />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows first section by default', () => {
    renderWithProviders(<AssessmentFlow />);
    expect(screen.getByText(/team size/i)).toBeInTheDocument();
  });

  it('navigates to next section when clicking next', async () => {
    renderWithProviders(<AssessmentFlow />);
    const nextButton = screen.getByText('Next');
    
    // Fill in required fields
    const input = screen.getByLabelText(/team size/i);
    fireEvent.change(input, { target: { value: '10' } });
    
    fireEvent.click(nextButton);
    expect(await screen.findByText(/process complexity/i)).toBeInTheDocument();
  });

  it('shows PersonalizedCTA after 25% progress', async () => {
    renderWithProviders(<AssessmentFlow />);
    const nextButton = screen.getByText('Next');
    
    // Navigate through sections
    for (let i = 0; i < 2; i++) {
      fireEvent.click(nextButton);
      await screen.findByRole('progressbar');
    }
    
    expect(screen.getByTestId('personalized-cta')).toBeInTheDocument();
  });
});
