import React from 'react';
import { BaseSection } from '../components/BaseSection';
import { AssessmentSectionProps, BaseQuestionProps } from '../../../../types/assessment/components';
import { useAssessmentStore } from '../../../../stores/assessment';
import { ErrorBoundary } from '../../../error/ErrorBoundary';
import { LoadingState } from '../../../ui/loading-state';

const processSection = {
  title: 'Process Assessment',
  description: 'Help us understand your current business processes and challenges.',
  questions: [
    {
      id: 'processVolume',
      text: 'How many processes do you handle monthly?',
      type: 'number' as const,
      required: true,
      placeholder: 'Enter number of processes',
      validation: (value: number) => {
        if (isNaN(value) || value < 1) return 'Please enter a valid number';
        return undefined;
      }
    },
    {
      id: 'timeSpent',
      text: 'How much time is spent on these processes monthly?',
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
      text: 'What is your current error rate?',
      type: 'select' as const,
      required: true,
      options: [
        'Less than 1%',
        '1-5%',
        '6-10%',
        '11-20%',
        'More than 20%'
      ]
    },
    {
      id: 'complexity',
      text: 'How would you rate the complexity of your processes?',
      type: 'select' as const,
      required: true,
      options: [
        'Simple - Few steps, straightforward',
        'Moderate - Multiple steps, some decision points',
        'Complex - Many steps, multiple decision points',
        'Very Complex - Highly intricate, many dependencies'
      ]
    },
    {
      id: 'processDocumentation',
      text: 'Do you have documented process flows?',
      type: 'checkbox' as const,
      required: false
    }
  ] as BaseQuestionProps[]
};

const ProcessSection: React.FC<AssessmentSectionProps> = (props) => {
  const { responses, isLoading } = useAssessmentStore();
  
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading Process Assessment
              </h3>
              <div className="mt-2 text-sm text-red-700">
                Please try refreshing the page or contact support if the issue persists.
              </div>
            </div>
          </div>
        </div>
      }
    >
      <LoadingState 
        isLoading={isLoading} 
        text="Loading Process Assessment..."
      >
        <BaseSection
          {...props}
          section={processSection}
          initialData={responses}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default ProcessSection; 