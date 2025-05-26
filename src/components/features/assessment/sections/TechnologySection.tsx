import React from 'react';
import { BaseSection } from '../components/BaseSection';
import type { StepComponentProps, BaseQuestionProps } from '@/types/assessment/components';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const technologySection = {
  title: 'Your Technology Stack',
  description: 'Tell us about the software and tools your organization uses.',
  questions: [
    {
      id: 'currentSystems',
      text: 'Software & Tools You Use',
      type: 'multiselect' as const,
      required: true,
      options: [
        'Business Management Software (ERP)',
        'Customer Management Software (CRM)',
        'Project/Task Management Tools',
        'File/Document Storage Systems',
        'Team Communication Tools',
        'Custom-Built Software',
        'Older Software Systems'
      ]
    },
    {
      id: 'integrationNeeds',
      text: 'Software Connection Needs',
      type: 'multiselect' as const,
      required: true,
      options: [
        'Automatic Data Sharing Between Systems',
        'Connecting Different Software Together',
        'Automating Manual Steps',
        'Connecting to External Services',
        'Custom Software Connections'
      ]
    },
    {
      id: 'automationLevel',
      text: 'How Automated Are Your Processes',
      type: 'select' as const,
      required: true,
      options: [
        'Manual Processes (No Automation)',
        'Simple Automation (Basic Templates, etc.)',
        'Some Automation (Some Tasks Automated)',
        'Heavily Automated (Most Tasks Automated)'
      ]
    },
    {
      id: 'digitalTransformation',
      text: 'Going Digital',
      type: 'checkbox' as const,
      required: false
    },
    {
      id: 'techChallenges',
      text: 'Technology Pain Points',
      type: 'multiselect' as const,
      required: true,
      options: [
        'Getting Systems to Work Together',
        'Data Accuracy & Reliability',
        'Outdated Systems & Code',
        'Systems Struggling as Business Grows',
        'Security & Privacy Concerns',
        'Speed & Performance Issues',
        'Team Struggling to Use New Tools'
      ]
    }
  ] as BaseQuestionProps[]
};

const TechnologySection: React.FC<StepComponentProps> = (props) => {
  const { updateResponses } = useAssessmentStore();
  
  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!props.isLoading}>
        <BaseSection
          {...props}
          section={technologySection}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default TechnologySection;
