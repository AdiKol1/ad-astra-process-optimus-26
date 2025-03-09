import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { StepComponentProps } from '@/types/assessment/components';
import { FormSelect, FormCheckbox, FormMultiSelect } from '@/components/features/assessment/forms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { toast } from '@/components/ui/use-toast';

// Define the automation levels to match the expected type
const AutomationLevels = ['None', 'Basic', 'Moderate', 'Advanced'] as const;
type AutomationLevel = typeof AutomationLevels[number];

const technologySchema = z.object({
  currentSystems: z.array(z.string()).min(1, 'Select at least one system'),
  integrationNeeds: z.array(z.string()).min(1, 'Select at least one integration need'),
  automationLevel: z.enum(AutomationLevels),
  digitalTransformation: z.boolean(),
  techChallenges: z.array(z.string()).min(1, 'Select at least one challenge'),
  automationBudget: z.string().min(1, 'Select your automation budget'),
  automationFunding: z.array(z.string()).min(1, 'Select at least one funding method'),
  automationROI: z.string().min(1, 'Select expected ROI timeframe')
});

type TechnologyFormData = z.infer<typeof technologySchema>;

// Update responses for the AssessmentStore
interface TechnologyResponses {
  currentTools: string[];
  integrationNeeds: string[];
  automationLevel: string;
  digitalTransformation: boolean;
  techChallenges: string[];
  automationBudget: string;
  automationFunding: string[];
  automationROI: string;
}

const systemOptions = [
  { value: 'erp', label: 'Business Management Software (ERP)' },
  { value: 'crm', label: 'Customer Management Software (CRM)' },
  { value: 'pm', label: 'Project/Task Management Tools' },
  { value: 'dm', label: 'File/Document Storage Systems' },
  { value: 'comm', label: 'Team Communication Tools' },
  { value: 'custom', label: 'Custom-Built Software' },
  { value: 'legacy', label: 'Older Software Systems' }
];

const integrationOptions = [
  { value: 'data-sync', label: 'Automatic Data Sharing Between Systems' },
  { value: 'api', label: 'Connecting Different Software Together' },
  { value: 'workflow', label: 'Automating Manual Steps' },
  { value: 'third-party', label: 'Connecting to External Services' },
  { value: 'custom', label: 'Custom Software Connections' }
];

const automationLevelOptions = [
  { value: 'None', label: 'Manual Processes (No Automation)' },
  { value: 'Basic', label: 'Simple Automation (Basic Templates, etc.)' },
  { value: 'Moderate', label: 'Some Automation (Some Tasks Automated)' },
  { value: 'Advanced', label: 'Heavily Automated (Most Tasks Automated)' }
];

const challengeOptions = [
  { value: 'integration', label: 'Getting Systems to Work Together' },
  { value: 'data-quality', label: 'Data Accuracy & Reliability' },
  { value: 'tech-debt', label: 'Outdated Systems & Code' },
  { value: 'scalability', label: 'Systems Struggling as Business Grows' },
  { value: 'security', label: 'Security & Privacy Concerns' },
  { value: 'performance', label: 'Speed & Performance Issues' },
  { value: 'adoption', label: 'Team Struggling to Use New Tools' }
];

const automationBudgetOptions = [
  { value: 'under-25k', label: 'Under $25,000' },
  { value: '25k-100k', label: '$25,000-$100,000' },
  { value: '100k-250k', label: '$100,000-$250,000' },
  { value: '250k-500k', label: '$250,000-$500,000' },
  { value: 'over-500k', label: 'Over $500,000' }
];

const automationFundingOptions = [
  { value: 'annual-budget', label: 'Dedicated annual budget' },
  { value: 'project-approval', label: 'Project-by-project approval' },
  { value: 'department-budgets', label: 'Department budgets' },
  { value: 'external-funding', label: 'External funding/grants' },
  { value: 'no-formal-budget', label: 'No formal budget allocation' }
];

const automationROIOptions = [
  { value: 'under-6-months', label: 'Less than 6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: '1-2-years', label: '1-2 years' },
  { value: '2-plus-years', label: '2+ years' },
  { value: 'not-measured', label: 'Not measured formally' }
];

const TechnologySection: React.FC<StepComponentProps> = ({
  onComplete,
  onValidationChange,
  onNext,
  onBack,
  isLoading,
  metadata,
  responses
}) => {
  const { updateResponses, nextStep, setStep } = useAssessmentStore();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Log the responses for debugging
  useEffect(() => {
    logger.debug('TechnologySection responses from store', {
      responses,
    });
  }, [responses]);

  const methods = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      currentSystems: responses?.responses?.toolStack || [],
      integrationNeeds: responses?.responses?.integrationNeeds || [],
      automationLevel: (responses?.responses?.automationLevel as AutomationLevel) || 'None',
      digitalTransformation: Boolean(responses?.responses?.digitalTransformation),
      automationBudget: responses?.responses?.automationBudget || '',
      automationFunding: responses?.responses?.automationFunding || [],
      automationROI: responses?.responses?.automationROI || '',
      techChallenges: responses?.responses?.techChallenges || []
    },
    mode: 'onChange'
  });

  // Log form state for debugging
  useEffect(() => {
    const formState = methods.formState;
    logger.debug('TechnologySection form state', {
      isValid: formState.isValid,
      isSubmitting: formState.isSubmitting,
      errors: formState.errors,
      isDirty: formState.isDirty
    });
  }, [methods.formState]);

  useEffect(() => {
    const subscription = methods.watch(() => {
      const isValid = methods.formState.isValid;
      onValidationChange?.(isValid);
    });
    return () => subscription.unsubscribe();
  }, [methods, onValidationChange]);

  const onSubmit = async (data: TechnologyFormData) => {
    setSubmitting(true);
    setFormError(null);
    
    try {
      logger.info('Submitting technology form data', { data });
      
      // Track form submission
      telemetry.track('technology_form_submitted', {
        systemsCount: data.currentSystems.length,
        integrationsCount: data.integrationNeeds.length,
        automationLevel: data.automationLevel,
        timestamp: new Date().toISOString()
      });
      
      // Map form data to the structure expected by the store
      const responseData = {
        responses: {
          // Map currentSystems to toolStack since that's what the store expects
          toolStack: data.currentSystems,
          // Use automationLevel as is - it's already the correct type
          automationLevel: data.automationLevel,
          // Store other data in responses too
          integrationNeeds: data.integrationNeeds,
          digitalTransformation: data.digitalTransformation,
          techChallenges: data.techChallenges,
          // Add new budget fields
          automationBudget: data.automationBudget,
          automationFunding: data.automationFunding,
          automationROI: data.automationROI
        }
      };
      
      // Update responses in store
      await updateResponses(responseData);
      
      // Log success
      logger.info('Technology form data saved successfully');
      
      // Use nextStep to properly handle transition
      try {
        if (onNext) {
          onNext();
        } else {
          await nextStep();
        }
        
        // If we get here, the transition was successful
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        // Fall back to direct setStep if nextStep fails
        logger.error('Error in nextStep, attempting direct navigation', { error });
        setStep('team');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Error submitting technology form', { error: errorMessage });
      setFormError(errorMessage);
      
      // Use setTimeout to move the toast call outside of the current execution context
      setTimeout(() => {
        toast({
          title: "Submission Error",
          description: "There was a problem saving your technology assessment. Please try again.",
          variant: "destructive"
        });
      }, 0);
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualNavigation = () => {
    // Force navigation to next step
    logger.info('Forcing navigation to team step');
    setStep('team');
  };

  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!isLoading}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">{metadata.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground">{metadata.description}</p>
          
          {formError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {formError}
            </div>
          )}
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-8">
              <Card className="p-6">
                <div className="space-y-6">
                  <FormMultiSelect
                    name="currentSystems"
                    label="Software & Tools You Use"
                    description="Select the different types of software your team uses day-to-day"
                    options={systemOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="integrationNeeds"
                    label="Software Connection Needs"
                    description="Which ways do you need your different software to work together?"
                    options={integrationOptions}
                    required
                  />
                  
                  <FormSelect
                    name="automationLevel"
                    label="How Automated Are Your Processes"
                    description="How much of your work is already automated vs. manual?"
                    options={automationLevelOptions}
                    required
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="digitalTransformation"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          {...methods.register('digitalTransformation')}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="digitalTransformation" className="font-medium text-gray-900">
                          Going Digital
                        </label>
                        <p className="text-gray-500">Are you currently updating your organization with new digital tools and processes?</p>
                      </div>
                    </div>
                  </div>
                  
                  <FormMultiSelect
                    name="techChallenges"
                    label="Technology Pain Points"
                    description="Select the main technology problems your team faces"
                    options={challengeOptions}
                    required
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Automation Budget & ROI</h3>
                <div className="space-y-6">
                  <FormSelect
                    name="automationBudget"
                    label="What is your company's approximate annual budget for process automation?"
                    description="Select the range that best represents your budget"
                    options={automationBudgetOptions}
                    required
                  />
                  
                  <FormMultiSelect
                    name="automationFunding"
                    label="How do you typically fund automation initiatives?"
                    description="Select all that apply"
                    options={automationFundingOptions}
                    required
                  />
                  
                  <FormSelect
                    name="automationROI"
                    label="What ROI timeframe do you expect for automation investments?"
                    description="Select the timeframe you typically expect"
                    options={automationROIOptions}
                    required
                  />
                </div>
              </Card>

              <div className="flex justify-between gap-4">
                <Button 
                  type="button" 
                  onClick={onBack}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <div className="flex gap-2">
                  {formError && (
                    <Button
                      type="button"
                      onClick={handleManualNavigation}
                      variant="outline"
                      className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                    >
                      Skip to Next Step
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Having trouble? Contact support for assistance.</p>
          </div>
        </div>
      </LoadingState>
    </ErrorBoundary>
  );
}

export default TechnologySection;
