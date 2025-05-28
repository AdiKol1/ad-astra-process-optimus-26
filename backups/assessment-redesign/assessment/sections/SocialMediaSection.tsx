import React from 'react';
import { BaseSection } from '../components/BaseSection';
import type { StepComponentProps, BaseQuestionProps } from '@/types/assessment/components';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const socialMediaSection = {
  title: 'Your Social Media Presence',
  description: 'Tell us about your social media strategy and how it\'s currently managed.',
  questions: [
    {
      id: 'platforms',
      text: 'Which social media platforms do you currently use?',
      type: 'multiselect' as const,
      required: true,
      placeholder: 'Select all platforms where you have an active presence',
      options: [
        'Facebook',
        'Instagram',
        'Twitter/X',
        'LinkedIn',
        'TikTok',
        'YouTube',
        'Pinterest'
      ]
    },
    {
      id: 'postFrequency',
      text: 'How often do you post on social media?',
      type: 'select' as const,
      required: true,
      placeholder: 'Average posting frequency across your platforms',
      options: [
        'Daily',
        'Several times a week',
        'Weekly',
        'Monthly',
        'Rarely or inconsistently'
      ]
    },
    {
      id: 'goals',
      text: 'What are your primary goals for social media?',
      type: 'multiselect' as const,
      required: true,
      placeholder: 'Select your main objectives for using social media',
      options: [
        'Increase brand awareness',
        'Generate leads',
        'Improve customer engagement',
        'Drive sales',
        'Provide customer service',
        'Establish thought leadership'
      ]
    },
    {
      id: 'contentType',
      text: 'What types of content do you share?',
      type: 'multiselect' as const,
      required: true,
      placeholder: 'Select all content formats you regularly use',
      options: [
        'Text posts/articles',
        'Images and graphics',
        'Videos',
        'Stories/ephemeral content',
        'Live streams',
        'User-generated content'
      ]
    },
    {
      id: 'challenges',
      text: 'What challenges do you face with social media?',
      type: 'multiselect' as const,
      required: true,
      placeholder: 'Select the biggest pain points in your social media efforts',
      options: [
        'Maintaining consistency',
        'Creating content',
        'Getting engagement',
        'Measuring ROI',
        'Keeping up with algorithm changes',
        'Limited resources or time'
      ]
    },
    {
      id: 'analytics',
      text: 'Do you currently track social media analytics?',
      type: 'checkbox' as const,
      required: false,
      placeholder: 'Check if you regularly monitor your social media performance'
    },
    {
      id: 'toolsUsed',
      text: 'What tools do you use for social media management?',
      type: 'multiselect' as const,
      required: false,
      placeholder: 'Select all that apply (optional)',
      options: [
        'Social media scheduling tools',
        'Analytics tools',
        'Design/graphics tools',
        'Content creation tools',
        'CRM integration',
        'No tools - manually manage'
      ]
    }
  ] as BaseQuestionProps[]
};

const SocialMediaSection: React.FC<StepComponentProps> = (props) => {
  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!props.isLoading}>
        <BaseSection
          {...props}
          step="social-media"
          section={socialMediaSection}
          metadata={{
            title: socialMediaSection.title,
            description: socialMediaSection.description,
            estimatedTime: '4 minutes',
            requiredFields: ['platforms', 'postFrequency', 'goals', 'contentType', 'challenges']
          }}
        />
      </LoadingState>
    </ErrorBoundary>
  );
};

export default SocialMediaSection; 