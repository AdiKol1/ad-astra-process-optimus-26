import React from 'react';
import { BaseSection } from '../components/BaseSection';
import { AssessmentSectionProps, BaseQuestionProps } from '../../../../types/assessment/components';
import { useAssessmentStore } from '../../../../stores/assessment';
import { ErrorBoundary } from '../../../error/ErrorBoundary';
import { LoadingState } from '../../../ui/loading-state';

const teamSection = {
  title: 'Team Assessment',
  description: 'Help us understand your team structure and capabilities.',
  questions: [
    {
      id: 'teamSize',
      text: 'What is your current team size?',
      type: 'select' as const,
      required: true,
      options: [
        '1-5 employees',
        '6-20 employees',
        '21-50 employees',
        '51-200 employees',
        '201-500 employees',
        '500+ employees'
      ]
    },
    {
      id: 'departments',
      text: 'Which departments are involved in process improvement initiatives?',
      type: 'multiselect' as const,
      required: true,
      options: [
        'Operations',
        'IT',
        'Finance',
        'HR',
        'Sales',
        'Marketing',
        'Customer Service',
        'Product Development',
        'Quality Assurance'
      ]
    },
    {
      id: 'skillLevels',
      text: 'How would you rate your team\'s process improvement capabilities?',
      type: 'select' as const,
      required: true,
      options: [
        'Beginner - Limited experience with process improvement',
        'Intermediate - Some experience with basic tools',
        'Advanced - Regular use of process improvement methods',
        'Expert - Certified practitioners and established programs'
      ]
    },
    {
      id: 'changeReadiness',
      text: 'How would you describe your organization\'s readiness for change?',
      type: 'select' as const,
      required: true,
      options: [
        'Resistant - Significant opposition to change',
        'Neutral - Mixed reception to change initiatives',
        'Receptive - Generally open to improvements',
        'Eager - Actively seeking change opportunities'
      ]
    },
    {
      id: 'trainingNeeds',
      text: 'What are your team\'s training needs?',
      type: 'multiselect' as const,
      required: true,
      options: [
        'Process Mapping',
        'Data Analysis',
        'Project Management',
        'Change Management',
        'Lean Six Sigma',
        'Technology Skills',
        'Leadership Development',
        'Communication Skills'
      ]
    }
  ] as BaseQuestionProps[]
};

const TeamSection: React.FC<AssessmentSectionProps> = (props) => {
  const { responses, isLoading } = useAssessmentStore();
  
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading Team Assessment
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
        text="Loading Team Assessment..."
      >
        <BaseSection
          {...props}
          section={teamSection}
          initialData={responses}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default TeamSection;
