import React, { createContext, useContext, useEffect } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AssessmentFormData } from '@/types/assessment/core';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { STEP_CONFIG, AssessmentStep } from '@/types/assessment/steps';
import { useAssessmentStore } from './store';
import { useUI } from '../ui/UIProvider';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  responses: z.object({
    industry: z.enum(['Technology', 'Healthcare', 'Financial Services', 'Real Estate', 'Other']),
    employees: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
    timeSpent: z.enum(['0-10', '11-20', '20-40', '40+']),
    processVolume: z.enum(['0-50', '51-100', '100-500', '500+']),
    errorRate: z.enum(['0-1%', '1-3%', '3-5%', '5%+']),
    processComplexity: z.enum([
      'Simple - Linear flow with few decision points',
      'Medium - Some complexity with decision points',
      'Complex - Many decision points and variations',
      'Very Complex - Multiple integrations and custom logic'
    ])
  })
});

type FormSchema = z.infer<typeof formSchema>;

interface FormContextValue {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitForm: () => Promise<void>;
  validateStep: (step: AssessmentStep) => boolean;
  getStepErrors: (step: AssessmentStep) => string[];
}

const FormContext = createContext<FormContextValue | null>(null);

export const useAssessmentForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useAssessmentForm must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: AssessmentFormData) => Promise<void>;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children, onSubmit }) => {
  console.log('FormProvider rendering');
  
  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });

  const { currentStep, updateResponses } = useAssessmentStore();
  const { showError } = useUI();

  const validateStep = (step: AssessmentStep): boolean => {
    console.log('Validating step:', step);
    const config = STEP_CONFIG[step];
    if (!config?.requiredFields?.length) return true;

    const fields = config.requiredFields;
    const values = methods.getValues();
    const errors = methods.formState.errors;

    const hasAllFields = fields.every((field: string) => {
      const value = values[field as keyof FormSchema];
      return value !== undefined && value !== '';
    });

    const hasNoErrors = fields.every((field: string) => !errors[field as keyof FormSchema]);

    return hasAllFields && hasNoErrors;
  };

  const getStepErrors = (step: AssessmentStep): string[] => {
    const config = STEP_CONFIG[step];
    if (!config?.requiredFields?.length) return [];

    return config.requiredFields
      .map((field: string) => {
        const error = methods.formState.errors[field as keyof FormSchema];
        return error?.message;
      })
      .filter((msg: unknown): msg is string => typeof msg === 'string');
  };

  const handleSubmit = async (data: FormSchema) => {
    try {
      console.log('Form submission started:', { data, currentStep });
      telemetry.track('assessment_form_submit_started', {
        step: currentStep,
        isValid: methods.formState.isValid
      });

      if (!validateStep(currentStep)) {
        const errors = getStepErrors(currentStep);
        showError(errors[0] || 'Please fill in all required fields');
        return;
      }

      // Update store with form data
      updateResponses(data);
      
      // Call onSubmit handler
      await onSubmit(data);
      
      telemetry.track('assessment_form_submit_success', {
        step: currentStep
      });
    } catch (error) {
      logger.error('Form submission failed', { error });
      telemetry.track('assessment_form_submit_error', { error });
      showError('Form submission failed. Please try again.');
      throw error;
    }
  };

  useEffect(() => {
    // Validate current step when it changes
    if (currentStep) {
      console.log('Step changed, validating:', currentStep);
      const isStepValid = validateStep(currentStep);
      telemetry.track('assessment_step_validation', {
        step: currentStep,
        isValid: isStepValid
      });
    }
  }, [currentStep]);

  const contextValue: FormContextValue = {
    isValid: methods.formState.isValid,
    isDirty: methods.formState.isDirty,
    isSubmitting: methods.formState.isSubmitting,
    submitForm: methods.handleSubmit(handleSubmit),
    validateStep,
    getStepErrors
  };

  return (
    <FormContext.Provider value={contextValue}>
      <RHFProvider {...methods}>
        {children}
      </RHFProvider>
    </FormContext.Provider>
  );
};

export default FormProvider;
