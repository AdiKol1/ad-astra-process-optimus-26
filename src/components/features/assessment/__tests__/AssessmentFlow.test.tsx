import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentProvider } from '../../../contexts/AssessmentContext';
import AssessmentFlow from '../AssessmentFlow';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AssessmentProvider>{children}</AssessmentProvider>
  </BrowserRouter>
);

describe('AssessmentFlow', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <AssessmentFlow />
      </TestWrapper>
    );
    expect(screen.getByRole('heading', { name: /Process Optimization Assessment/i })).toBeInTheDocument();
  });

  it('shows start assessment button initially', () => {
    render(
      <TestWrapper>
        <AssessmentFlow />
      </TestWrapper>
    );
    expect(screen.getByRole('button', { name: /start assessment/i })).toBeInTheDocument();
  });

  it('shows process details section after starting', () => {
    render(
      <TestWrapper>
        <AssessmentFlow />
      </TestWrapper>
    );
    
    const startButton = screen.getByRole('button', { name: /start assessment/i });
    fireEvent.click(startButton);
    
    expect(screen.getByRole('heading', { name: /process details/i })).toBeInTheDocument();
  });

  it('shows PersonalizedCTA after starting assessment', () => {
    render(
      <TestWrapper>
        <AssessmentFlow />
      </TestWrapper>
    );
    
    const startButton = screen.getByRole('button', { name: /start assessment/i });
    fireEvent.click(startButton);
    
    expect(screen.getByTestId('personalized-cta')).toBeInTheDocument();
  });
});
