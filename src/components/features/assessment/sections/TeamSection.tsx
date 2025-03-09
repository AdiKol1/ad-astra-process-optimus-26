import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { StepComponentProps } from '@/types/assessment/components';
import { FormSelect, FormMultiSelect } from '@/components/features/assessment/forms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';
import { useAssessmentStore } from '@/contexts/assessment/store';

const teamSchema = z.object({
  teamSize: z.string().min(1, 'Select team size'),
  departments: z.array(z.string()).min(1, 'Select at least one department'),
  skillLevel: z.string().min(1, 'Select skill level'),
  changeReadiness: z.string().min(1, 'Select change readiness level'),
  trainingBudget: z.string().min(1, 'Select your training budget'),
  trainingDelivery: z.array(z.string()).min(1, 'Select at least one training delivery method'),
  trainingNeeds: z.array(z.string()).min(1, 'Select at least one training need')
});

type TeamFormData = z.infer<typeof teamSchema>;

const teamSizeOptions = [
  { value: '1-10', label: '1-10 people' },
  { value: '11-50', label: '11-50 people' },
  { value: '51-200', label: '51-200 people' },
  { value: '201-500', label: '201-500 people' },
  { value: '501+', label: '501+ people' }
];

const departmentOptions = [
  { value: 'operations', label: 'Operations/Day-to-day Work' },
  { value: 'it', label: 'IT/Technology' },
  { value: 'finance', label: 'Finance/Accounting' },
  { value: 'hr', label: 'HR/People Management' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'customer-service', label: 'Customer Service/Support' }
];

const skillLevelOptions = [
  { value: 'beginner', label: 'Just Starting - New to improving business processes' },
  { value: 'intermediate', label: 'Some Experience - Have made some improvements before' },
  { value: 'advanced', label: 'Experienced - Regular process improvement activities' },
  { value: 'expert', label: 'Very Experienced - Extensive process improvement knowledge' }
];

const changeReadinessOptions = [
  { value: 'resistant', label: 'Resistant - Team prefers current ways of working' },
  { value: 'neutral', label: 'Neutral - Team is neither excited nor resistant to change' },
  { value: 'open', label: 'Open - Team is willing to try new approaches' },
  { value: 'eager', label: 'Eager - Team actively seeks out better ways to work' }
];

const trainingBudgetOptions = [
  { value: 'under-10k', label: 'Under $10,000' },
  { value: '10k-50k', label: '$10,000-$50,000' },
  { value: '50k-100k', label: '$50,000-$100,000' },
  { value: '100k-250k', label: '$100,000-$250,000' },
  { value: 'over-250k', label: 'Over $250,000' }
];

const trainingDeliveryOptions = [
  { value: 'in-person', label: 'In-person workshops' },
  { value: 'online', label: 'Online courses' },
  { value: 'mentoring', label: 'Mentoring programs' },
  { value: 'conferences', label: 'External conferences' },
  { value: 'on-the-job', label: 'On-the-job training' },
  { value: 'certification', label: 'Formal certification programs' }
];

const trainingNeedsOptions = [
  { value: 'technical', label: 'Technical skills' },
  { value: 'software', label: 'Software proficiency' },
  { value: 'process', label: 'Process knowledge' },
  { value: 'leadership', label: 'Leadership development' },
  { value: 'customer-service', label: 'Customer service' },
  { value: 'industry', label: 'Industry-specific knowledge' }
];

const TeamSection: React.FC<StepComponentProps> = ({
  onComplete,
  onValidationChange,
  isLoading,
  metadata,
  responses
}) => {
  const { updateResponses } = useAssessmentStore();
  const methods = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: responses?.team || {
      teamSize: '',
      departments: [],
      skillLevel: '',
      changeReadiness: '',
      trainingBudget: '',
      trainingDelivery: [],
      trainingNeeds: []
    }
  });

  useEffect(() => {
    const subscription = methods.watch(() => {
      const isValid = methods.formState.isValid;
      onValidationChange?.(isValid);
    });
    return () => subscription.unsubscribe();
  }, [methods, onValidationChange]);

  const onSubmit = async (data: TeamFormData) => {
    try {
      await updateResponses({ team: data } as any);
      onComplete();
    } catch (error) {
      console.error('Error submitting team form', error);
    }
  };

  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!isLoading}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Your Team</h2>
          <p className="mt-2 text-lg text-muted-foreground">Tell us about the people who will be using improved processes.</p>
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-8">
              <Card className="p-6">
                <div className="space-y-6">
                  <FormSelect
                    name="teamSize"
                    label="How big is your team?"
                    description="Total number of people in your organization"
                    options={teamSizeOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="departments"
                    label="Which departments need improvement?"
                    description="Select all areas that would benefit from better processes"
                    options={departmentOptions}
                    required
                  />
                  
                  <FormSelect
                    name="skillLevel"
                    label="Experience with process improvement"
                    description="How much experience does your team have with improving work processes?"
                    options={skillLevelOptions}
                    required
                  />
                  
                  <FormSelect
                    name="changeReadiness"
                    label="Openness to change"
                    description="How does your team typically respond to changes in how work gets done?"
                    options={changeReadinessOptions}
                    required
                  />
                </div>
              </Card>

              <Card className="p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">Training & Development</h3>
                <div className="space-y-6">
                  <FormSelect
                    name="trainingBudget"
                    label="What is your company's approximate annual budget for employee training?"
                    description="Select the range that best represents your budget"
                    options={trainingBudgetOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="trainingDelivery"
                    label="How does your organization currently deliver training?"
                    description="Select all that apply"
                    options={trainingDeliveryOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="trainingNeeds"
                    label="What are your primary training needs?"
                    description="Select all that apply"
                    options={trainingNeedsOptions}
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

export default TeamSection;
