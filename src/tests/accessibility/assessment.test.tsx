import React from 'react';
import { render, screen, axe } from '@testing-library/react';
import { vi } from 'vitest';
import { AssessmentFlow } from '@/components/features/assessment/AssessmentFlow';
import QuestionSection from '@/components/features/assessment/QuestionSection';
import NavigationControls from '@/components/features/assessment/flow/NavigationControls';

// Mock hooks and contexts
vi.mock('@/hooks/useAssessmentSteps');
vi.mock('@/contexts/assessment/AssessmentContext');

describe('Assessment Accessibility', () => {
  const mockQuestion = {
    id: 'test-question',
    type: 'text',
    label: 'Test Question',
    required: true
  };

  const mockSection = {
    title: 'Test Section',
    description: 'Test Description',
    questions: [mockQuestion]
  };

  describe('QuestionSection', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <QuestionSection
          section={mockSection}
          onAnswer={() => {}}
          answers={{}}
          errors={{}}
        />
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has proper ARIA labels', () => {
      render(
        <QuestionSection
          section={mockSection}
          onAnswer={() => {}}
          answers={{}}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Test Question');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('properly handles error states', () => {
      render(
        <QuestionSection
          section={mockSection}
          onAnswer={() => {}}
          answers={{}}
          errors={{ 'test-question': 'Error message' }}
        />
      );

      const input = screen.getByLabelText('Test Question');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-errormessage');
    });
  });

  describe('NavigationControls', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <NavigationControls
          currentStep={0}
          totalSteps={3}
          onNext={() => {}}
          onBack={() => {}}
        />
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has proper button labels', () => {
      render(
        <NavigationControls
          currentStep={0}
          totalSteps={3}
          onNext={() => {}}
          onBack={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue|view your results/i })).toBeInTheDocument();
    });

    it('properly handles disabled states', () => {
      render(
        <NavigationControls
          currentStep={0}
          totalSteps={3}
          onNext={() => {}}
          onBack={() => {}}
          loading={true}
        />
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      const nextButton = screen.getByRole('button', { name: /continue/i });

      expect(backButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('AssessmentFlow', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<AssessmentFlow />);
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('maintains focus management during navigation', () => {
      render(<AssessmentFlow />);
      
      const nextButton = screen.getByRole('button', { name: /continue/i });
      nextButton.focus();
      expect(document.activeElement).toBe(nextButton);
    });

    it('provides proper landmark regions', () => {
      render(<AssessmentFlow />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
