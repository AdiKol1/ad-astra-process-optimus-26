import React from 'react';
import { BaseSection } from '../components/BaseSection';
import { AssessmentSectionProps, BaseQuestionProps } from '../../../../types/assessment/components';
import { useAssessmentStore } from '../../../../stores/assessment';
import { ErrorBoundary } from '../../../error/ErrorBoundary';
import { LoadingState } from '../../../ui/loading-state';

const technologySection = {
  title: 'Technology Assessment',
  description: 'Help us understand your current technology stack and integration needs.',
  questions: [
    {
      id: 'currentSystems',
      text: 'Which systems are currently in use?',
      type: 'multiselect' as const,
      required: true,
      options: [
        'ERP System',
        'CRM System',
        'HR Information System',
        'Accounting Software',
        'Project Management Tools',
        'Custom Software',
        'Spreadsheets',
        'Paper-based Systems'
      ]
    },
    {
      id: 'integrationNeeds',
      text: 'What are your integration requirements?',
      type: 'multiselect' as const,
      required: true,
      options: [
        'Data Synchronization',
        'API Integration',
        'File Transfer',
        'Single Sign-On',
        'Workflow Automation',
        'Custom Integration',
        'No integration needed'
      ]
    },
    {
      id: 'automationLevel',
      text: 'What is your current level of automation?',
      type: 'select' as const,
      required: true,
      options: [
        'Fully Manual',
        'Partially Automated',
        'Mostly Automated',
        'Fully Automated'
      ]
    },
    {
      id: 'digitalTransformation',
      text: 'Are you currently undergoing any digital transformation initiatives?',
      type: 'checkbox' as const,
      required: false
    },
    {
      id: 'techChallenges',
      text: 'What are your main technical challenges?',
      type: 'multiselect' as const,
      required: true,
      options: [
        'System Integration',
        'Data Quality',
        'User Adoption',
        'Technical Skills',
        'Legacy Systems',
        'Security Concerns',
        'Cost of Implementation',
        'Maintenance'
      ]
    }
  ] as BaseQuestionProps[]
};

const TechnologySection: React.FC<AssessmentSectionProps> = (props) => {
  const { responses, isLoading } = useAssessmentStore();
  
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading Technology Assessment
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
        text="Loading Technology Assessment..."
      >
        <BaseSection
          {...props}
          section={technologySection}
          initialData={responses}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default TechnologySection;
