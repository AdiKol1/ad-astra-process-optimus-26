import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoreQuestionSection } from '../CoreQuestionSection';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock telemetry and performance monitoring
vi.mock('@/utils/monitoring/telemetry', () => ({
  telemetry: {
    track: vi.fn(),
  },
}));

vi.mock('@/utils/monitoring/performance', () => ({
  createPerformanceMonitor: () => ({
    start: () => 'test-mark',
    end: () => 100,
    getDuration: () => 100,
  }),
}));

// Test data
const mockSection = {
  id: 'test-section',
  title: 'Test Section',
  description: 'Test Description',
  questions: [
    {
      id: 'text-question',
      type: 'text',
      label: 'Text Question',
      required: true,
      description: 'Enter some text',
      placeholder: 'Type here...',
    },
    {
      id: 'select-question',
      type: 'select',
      label: 'Select Question',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: true,
    },
    {
      id: 'multiselect-question',
      type: 'multiSelect',
      label: 'MultiSelect Question',
      options: ['Option A', 'Option B', 'Option C'],
      required: false,
    },
  ],
};

describe('CoreQuestionSection', () => {
  const mockOnAnswer = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title and description', () => {
    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders all question types correctly', () => {
    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    // Text question
    expect(screen.getByLabelText('Text Question')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();

    // Select question
    expect(screen.getByLabelText('Select Question')).toBeInTheDocument();
    
    // MultiSelect question
    expect(screen.getByLabelText('MultiSelect Question')).toBeInTheDocument();
  });

  it('handles text input changes with performance tracking', async () => {
    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    const input = screen.getByLabelText('Text Question');
    await userEvent.type(input, 'test input');

    expect(mockOnAnswer).toHaveBeenCalledWith('text-question', 'test input');
    expect(telemetry.track).toHaveBeenCalledWith('question_answered', expect.any(Object));
  });

  it('handles select changes with performance tracking', async () => {
    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    const select = screen.getByLabelText('Select Question');
    await userEvent.click(select);
    const option = screen.getByText('Option 1');
    await userEvent.click(option);

    expect(mockOnAnswer).toHaveBeenCalledWith('select-question', 'Option 1');
    expect(telemetry.track).toHaveBeenCalledWith('question_answered', expect.any(Object));
  });

  it('handles multiselect changes with performance tracking', async () => {
    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    const checkbox = screen.getByLabelText('Option A');
    await userEvent.click(checkbox);

    expect(mockOnAnswer).toHaveBeenCalledWith('multiselect-question', ['Option A']);
    expect(telemetry.track).toHaveBeenCalledWith('question_answered', expect.any(Object));
  });

  it('displays validation errors correctly', () => {
    const errors = {
      'text-question': 'This field is required',
    };

    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={errors}
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Text Question')).toHaveAttribute('aria-invalid', 'true');
  });

  it('tracks interaction times correctly', async () => {
    render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    const input = screen.getByLabelText('Text Question');
    await userEvent.click(input);
    await new Promise(resolve => setTimeout(resolve, 100));
    await userEvent.type(input, 'test');

    expect(telemetry.track).toHaveBeenCalledWith('question_focused', expect.any(Object));
    expect(telemetry.track).toHaveBeenCalledWith('question_answered', expect.any(Object));
  });

  it('handles slow renders correctly', async () => {
    render(
      <CoreQuestionSection
        section={{
          ...mockSection,
          questions: Array(50).fill(mockSection.questions[0]), // Create a large number of questions
        }}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    await waitFor(() => {
      expect(telemetry.track).toHaveBeenCalledWith('section_slow_render', expect.any(Object));
    });
  });

  it('maintains accessibility standards', () => {
    const { container } = render(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{
          'text-question': 'Error message',
        }}
      />
    );

    // Check for proper ARIA attributes
    const errorInput = screen.getByLabelText('Text Question');
    expect(errorInput).toHaveAttribute('aria-invalid', 'true');
    expect(errorInput).toHaveAttribute('aria-errormessage');

    // Check for error message association
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });
});
