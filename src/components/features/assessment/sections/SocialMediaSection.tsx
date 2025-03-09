import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { StepComponentProps } from '@/types/assessment/components';
import { FormSelect, FormMultiSelect, FormCheckbox } from '@/components/features/assessment/forms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';
import { useAssessmentStore } from '@/contexts/assessment/store';

const socialMediaSchema = z.object({
  platforms: z.array(z.string()).min(1, 'Select at least one social media platform'),
  postFrequency: z.string().min(1, 'Select posting frequency'),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  contentType: z.array(z.string()).min(1, 'Select at least one content type'),
  challenges: z.array(z.string()).min(1, 'Select at least one challenge'),
  analytics: z.boolean(),
  toolsUsed: z.array(z.string()),
  marketingBudget: z.string().min(1, 'Select your marketing budget'),
  budgetAllocation: z.array(z.string()).min(1, 'Select at least one budget allocation'),
  budgetIncrease: z.string().min(1, 'Select your budget increase plans')
});

type SocialMediaFormData = z.infer<typeof socialMediaSchema>;

const platformOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'pinterest', label: 'Pinterest' }
];

const postFrequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'several-times-week', label: 'Several times a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'rarely', label: 'Rarely or inconsistently' }
];

const goalOptions = [
  { value: 'brand-awareness', label: 'Increase brand awareness' },
  { value: 'lead-generation', label: 'Generate leads' },
  { value: 'customer-engagement', label: 'Improve customer engagement' },
  { value: 'sales', label: 'Drive sales' },
  { value: 'customer-service', label: 'Provide customer service' },
  { value: 'thought-leadership', label: 'Establish thought leadership' }
];

const contentTypeOptions = [
  { value: 'text-posts', label: 'Text posts/articles' },
  { value: 'images', label: 'Images and graphics' },
  { value: 'videos', label: 'Videos' },
  { value: 'stories', label: 'Stories/ephemeral content' },
  { value: 'live-streams', label: 'Live streams' },
  { value: 'user-generated', label: 'User-generated content' }
];

const challengeOptions = [
  { value: 'consistency', label: 'Maintaining consistency' },
  { value: 'content-creation', label: 'Creating content' },
  { value: 'engagement', label: 'Getting engagement' },
  { value: 'roi', label: 'Measuring ROI' },
  { value: 'algorithm', label: 'Keeping up with algorithm changes' },
  { value: 'resources', label: 'Limited resources or time' }
];

const toolOptions = [
  { value: 'scheduling', label: 'Social media scheduling tools' },
  { value: 'analytics', label: 'Analytics tools' },
  { value: 'design', label: 'Design/graphics tools' },
  { value: 'content-creation', label: 'Content creation tools' },
  { value: 'crm', label: 'CRM integration' },
  { value: 'none', label: 'No tools - manually manage' }
];

const marketingBudgetOptions = [
  { value: 'under-10k', label: 'Under $10,000' },
  { value: '10k-50k', label: '$10,000-$50,000' },
  { value: '50k-200k', label: '$50,000-$200,000' },
  { value: '200k-500k', label: '$200,000-$500,000' },
  { value: 'over-500k', label: 'Over $500,000' }
];

const budgetAllocationOptions = [
  { value: 'traditional', label: 'Traditional advertising' },
  { value: 'digital', label: 'Digital marketing' },
  { value: 'content', label: 'Content creation' },
  { value: 'social', label: 'Social media' },
  { value: 'pr', label: 'PR/Communications' },
  { value: 'events', label: 'Events/Conferences' },
  { value: 'other', label: 'Other' }
];

const budgetIncreaseOptions = [
  { value: 'significant', label: 'Yes, significantly' },
  { value: 'moderate', label: 'Yes, moderately' },
  { value: 'no-change', label: 'No change planned' },
  { value: 'decrease', label: 'Planning to decrease' }
];

const SocialMediaSection: React.FC<StepComponentProps> = ({
  onComplete,
  onValidationChange,
  isLoading,
  metadata,
  responses
}) => {
  const { updateResponses } = useAssessmentStore();
  const methods = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: responses?.socialMedia || {
      platforms: [],
      postFrequency: '',
      goals: [],
      contentType: [],
      challenges: [],
      analytics: false,
      toolsUsed: [],
      marketingBudget: '',
      budgetAllocation: [],
      budgetIncrease: ''
    }
  });

  useEffect(() => {
    const subscription = methods.watch(() => {
      const isValid = methods.formState.isValid;
      onValidationChange?.(isValid);
    });
    return () => subscription.unsubscribe();
  }, [methods, onValidationChange]);

  const onSubmit = async (data: SocialMediaFormData) => {
    // Track form submission with marketing budget data
    try {
      // Update responses in store
      await updateResponses({ socialMedia: data } as any);
      onComplete();
    } catch (error) {
      console.error('Error submitting social media form', error);
    }
  };

  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!isLoading}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Your Social Media Presence</h2>
          <p className="mt-2 text-lg text-muted-foreground">Tell us about your social media strategy and how it's currently managed.</p>
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-8">
              <Card className="p-6">
                <div className="space-y-6">
                  <FormMultiSelect
                    name="platforms"
                    label="Which social media platforms do you currently use?"
                    description="Select all platforms where you have an active presence"
                    options={platformOptions}
                    required
                  />
                  
                  <FormSelect
                    name="postFrequency"
                    label="How often do you post on social media?"
                    description="Average posting frequency across your platforms"
                    options={postFrequencyOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="goals"
                    label="What are your primary goals for social media?"
                    description="Select your main objectives for using social media"
                    options={goalOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="contentType"
                    label="What types of content do you share?"
                    description="Select all content formats you regularly use"
                    options={contentTypeOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="challenges"
                    label="What challenges do you face with social media?"
                    description="Select the biggest pain points in your social media efforts"
                    options={challengeOptions}
                    required
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 space-y-0">
                      <div className="flex h-6 items-center">
                        <input
                          type="checkbox"
                          id="analytics"
                          {...methods.register('analytics')}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor="analytics"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Do you regularly track social media analytics?
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Whether you monitor performance metrics for your social media efforts
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <FormMultiSelect
                    name="toolsUsed"
                    label="What tools do you use to manage social media?"
                    description="Select all tools that assist with your social media management"
                    options={toolOptions}
                  />
                </div>
              </Card>

              <Card className="p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Marketing Budget</h3>
                <div className="space-y-6">
                  <FormSelect
                    name="marketingBudget"
                    label="What is your company's approximate annual marketing budget?"
                    description="Select the range that best represents your budget"
                    options={marketingBudgetOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="budgetAllocation"
                    label="How is your marketing budget currently allocated?"
                    description="Select all that apply"
                    options={budgetAllocationOptions}
                    required
                  />
                  
                  <FormSelect
                    name="budgetIncrease"
                    label="Are you planning to increase your marketing budget in the next fiscal year?"
                    description="Select your budget plans"
                    options={budgetIncreaseOptions}
                    required
                  />
                </div>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading}>
                  Next
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </LoadingState>
    </ErrorBoundary>
  );
};

export default SocialMediaSection; 