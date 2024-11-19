import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalizedCTA from './PersonalizedCTA';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

describe('PersonalizedCTA', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <AssessmentProvider>
        <PersonalizedCTA onAction={mockOnAction} />
      </AssessmentProvider>
    );
    expect(screen.getByTestId('personalized-cta')).toBeInTheDocument();
  });

  it('calls onAction when CTA button is clicked', () => {
    render(
      <AssessmentProvider>
        <PersonalizedCTA onAction={mockOnAction} />
      </AssessmentProvider>
    );
    
    const ctaButton = screen.getByRole('button');
    fireEvent.click(ctaButton);
    
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it('displays dynamic content based on assessment context', () => {
    render(
      <AssessmentProvider initialData={{ responses: { industry: 'Technology' } }}>
        <PersonalizedCTA onAction={mockOnAction} />
      </AssessmentProvider>
    );
    
    expect(screen.getByText(/technology/i)).toBeInTheDocument();
  });
});
