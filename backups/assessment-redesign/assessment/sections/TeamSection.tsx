import React from 'react';
import { BaseSection } from '../components/BaseSection';
import type { StepComponentProps, BaseQuestionProps } from '@/types/assessment/components';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const teamSection = {
  title: 'Your Team',
  description: 'Tell us about the people who will be using improved processes.',
  questions: [
    {
      id: 'teamSize',
      text: 'How big is your team?',
      type: 'select' as const,
      required: true,
      placeholder: 'Total number of people in your organization',
      options: [
        '1-10 people',
        '11-50 people', 
        '51-200 people',
        '201-500 people',
        '501+ people'
      ]
    },
    {
      id: 'departments',
      text: 'Which departments need improvement?',
      type: 'multiselect' as const,
      required: true,
      placeholder: 'Select all areas that would benefit from better processes',
      options: [
        'Operations/Day-to-day Work',
        'IT/Technology',
        'Finance/Accounting',
        'HR/People Management',
        'Sales',
        'Marketing',
        'Customer Service/Support'
      ]
    },
    {
      id: 'skillLevels',
      text: 'Experience with process improvement',
      type: 'select' as const,
      required: true,
      placeholder: 'How much experience does your team have with improving work processes?',
      options: [
        'Just Starting - New to improving business processes',
        'Some Experience - Have made some improvements before',
        'Experienced - Regular process improvement activities',
        'Very Experienced - Extensive process improvement knowledge'
      ]
    },
    {
      id: 'changeReadiness',
      text: 'Openness to change',
      type: 'select' as const,
      required: true,
      placeholder: 'How does your team typically respond to changes in how work gets done?',
      options: [
        'Resistant - Team prefers current ways of working',
        'Neutral - Team is neither excited nor resistant to change',
        'Open - Team is willing to try new approaches',
        'Eager - Team actively seeks out better ways to work'
      ]
    },
    {
      id: 'trainingNeeds',
      text: 'What are your primary training needs?',
      type: 'multiselect' as const,
      required: true,
      placeholder: 'Select all that apply',
      options: [
        'Technical skills',
        'Software proficiency',
        'Process knowledge',
        'Leadership development',
        'Customer service',
        'Industry-specific knowledge'
      ]
    }
  ] as BaseQuestionProps[]
};

const TeamSection: React.FC<StepComponentProps> = (props) => {
  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!props.isLoading}>
        <BaseSection
          {...props}
          step="team"
          section={teamSection}
          metadata={{
            title: teamSection.title,
            description: teamSection.description,
            estimatedTime: '3 minutes',
            requiredFields: ['teamSize', 'departments', 'skillLevels', 'changeReadiness', 'trainingNeeds']
          }}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default TeamSection;
