import React from 'react';
import { BaseSection } from '../components/BaseSection';
import type { StepComponentProps, BaseQuestionProps } from '@/types/assessment/components';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const processSection = {
  title: 'Your Business Processes',
  description: 'Tell us about how work gets done in your organization.',
  questions: [
    {
      id: 'processVolume',
      text: 'How many tasks or workflows does your team complete each month?',
      type: 'number' as const,
      required: true,
      placeholder: 'Enter a number',
      validation: (value: number) => {
        if (isNaN(value) || value < 1) return 'Please enter a valid number';
        return undefined;
      }
    },
    {
      id: 'timeSpent',
      text: 'How much time do these tasks take each month?',
      type: 'select' as const,
      required: true,
      options: [
        '0-10 hours',
        '11-20 hours',
        '21-40 hours',
        '41-80 hours',
        '80+ hours'
      ]
    },
    {
      id: 'errorRate',
      text: 'How often do mistakes happen in these tasks?',
      type: 'select' as const,
      required: true,
      options: [
        'Almost never (less than 1%)',
        'Rarely (1-5%)',
        'Sometimes (6-10%)',
        'Often (11-20%)',
        'Very frequently (more than 20%)'
      ]
    },
    {
      id: 'complexity',
      text: 'How complicated are your typical workflows?',
      type: 'select' as const,
      required: true,
      options: [
        'Simple - Just a few steps anyone can follow',
        'Moderate - Several steps with some decision-making',
        'Complex - Many steps with multiple decisions',
        'Very Complex - Complicated procedures with many dependencies'
      ]
    },
    {
      id: 'processDocumentation',
      text: 'Do you have written instructions for your workflows?',
      type: 'checkbox' as const,
      required: false
    }
  ] as BaseQuestionProps[]
};

const ProcessSection: React.FC<StepComponentProps> = (props) => {
  const { updateResponses } = useAssessmentStore();
  
  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!props.isLoading}>
        <BaseSection
          {...props}
          section={processSection}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default ProcessSection; 