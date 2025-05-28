import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoreQuestionSection } from '../CoreQuestionSection';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '../../../../../test/test-utils';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../test/utils/renderWithProviders';
import { mockTelemetry } from '../../../../../test/test-utils';

// Mock telemetry
vi.mock('../../../../../utils/monitoring/telemetry', () => ({
  telemetry: mockTelemetry
}));

vi.mock('@/utils/monitoring/performance', () => ({
  createPerformanceMonitor: () => ({
    start: vi.fn(() => 'test-mark'),
    end: vi.fn(() => 100),
    getDuration: vi.fn(() => 100)
  })
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
      required: true
    },
    {
      id: 'select-question',
      type: 'select',
      label: 'Select Question',
      options: ['Option 1', 'Option 2'],
      required: true
    },
    {
      id: 'multiSelect-question',
      type: 'multiSelect',
      label: 'Multiselect Question',
      options: ['Option A', 'Option B'],
      required: true
    }
  ]
};

describe('CoreQuestionSection', () => {
  const mockOnAnswer = vi.fn();
  const mockTrackMetric = vi.fn();
  const mockTrackError = vi.fn();
  const mockTrackSlowRender = vi.fn();
  const user = userEvent.setup();
  
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

  it('renders all questions correctly', () => {
    renderWithProviders(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    expect(screen.getByText('Text Question')).toBeInTheDocument();
    expect(screen.getByText('Select Question')).toBeInTheDocument();
    expect(screen.getByText('Multiselect Question')).toBeInTheDocument();
  });

  it('handles text input changes with performance tracking', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    const input = screen.getByRole('textbox', { name: /Text Question/i });
    await user.type(input, 'test input');
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith('text-question', 'test input');
    });
    
    expect(mockTelemetry.track).toHaveBeenCalledWith(
      'question_answered',
      expect.objectContaining({
        questionId: 'text-question',
        valueType: 'string'
      })
    );
  });

  it('handles select changes with performance tracking', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    const select = screen.getByRole('combobox', { name: /Select Question/i });
    await user.click(select);
    const option = screen.getByRole('option', { name: /Option 1/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith('select-question', 'Option 1');
    });

    expect(mockTelemetry.track).toHaveBeenCalledWith(
      'question_answered',
      expect.objectContaining({
        questionId: 'select-question',
        valueType: 'string'
      })
    );
  });

  it('handles multiselect changes with performance tracking', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{}}
      />
    );

    // Select multiple options
    const optionA = screen.getByRole('checkbox', { name: /Option A/i });
    const optionB = screen.getByRole('checkbox', { name: /Option B/i });
    await user.click(optionA);
    await user.click(optionB);

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith('multiSelect-question', ['Option A', 'Option B']);
    });

    expect(mockTelemetry.track).toHaveBeenCalledWith(
      'question_answered',
      expect.objectContaining({
        questionId: 'multiSelect-question',
        valueType: 'object'
      })
    );
  });

  it('displays validation errors', () => {
    renderWithProviders(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={{}}
        errors={{
          'text-question': 'This field is required',
          'select-question': 'Please select an option'
        }}
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('preserves answers when re-rendering', () => {
    const answers = {
      'text-question': 'saved text',
      'select-question': 'Option 1',
      'multiSelect-question': ['Option A']
    };

    renderWithProviders(
      <CoreQuestionSection
        section={mockSection}
        onAnswer={mockOnAnswer}
        answers={answers}
        errors={{}}
      />
    );

    const textInput = screen.getByRole('textbox', { name: /Text Question/i });
    expect(textInput).toHaveValue('saved text');

    const select = screen.getByRole('combobox', { name: /Select Question/i });
    expect(select).toHaveTextContent('Option 1');

    const optionACheckbox = screen.getByRole('checkbox', { name: /Option A/i });
    expect(optionACheckbox).toBeChecked();
  });
});
