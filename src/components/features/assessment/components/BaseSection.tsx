import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { StepComponentProps, BaseSectionProps } from '@/types/assessment/components';
import { AssessmentResponses } from '@/types/assessment/state';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { getSchemaBySection } from '@/validation/assessment-schemas';
import { MobileQuestionCard } from '../forms/MobileQuestionCard';
import { MobileOptimizedInput } from '../forms/MobileOptimizedInput';
import { useMobileDetection } from '@/hooks/useMobileDetection';

const performanceMonitor = createPerformanceMonitor('BaseSection');

interface BaseSectionComponentProps extends StepComponentProps {
  section: BaseSectionProps;
  hideNavigation?: boolean;
}

export const BaseSection: React.FC<BaseSectionComponentProps> = ({
  step,
  section,
  onValidationChange,
  metadata,
  validationErrors = [],
  onNext,
  onBack,
  isLoading = false,
  responses = {},
  hideNavigation = false
}) => {
  const { isMobile } = useMobileDetection();
  const [mobileAnswers, setMobileAnswers] = useState<Record<string, string[]>>({});
  
  // Get the validation schema for this section
  const schema = React.useMemo(() => getSchemaBySection(step), [step]);
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch, setValue } = useForm({
    defaultValues: responses,
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const { 
    updateResponses, 
    addValidationError, 
    clearValidationErrors,
    setLoading 
  } = useAssessmentStore();

  // Memoize the validation check to prevent unnecessary re-renders
  const hasErrors = React.useMemo(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  // Effect to track validation state - only run when hasErrors changes
  React.useEffect(() => {
    if (isDirty) {
      onValidationChange(!hasErrors);
    }
  }, [hasErrors, isDirty, onValidationChange]);

  // Track section view and initialize form - only run once
  React.useEffect(() => {
    telemetry.track('section_viewed', {
      step,
      title: metadata.title
    });

    if (responses) {
      reset(responses);
    }
  }, [step, metadata.title, responses, reset]);

  // Handle mobile question selection
  const handleMobileSelection = (questionId: string, values: string[]) => {
    setMobileAnswers(prev => ({
      ...prev,
      [questionId]: values
    }));
    
    // Update form value
    const question = section.questions.find(q => q.id === questionId);
    if (question?.type === 'multiselect') {
      setValue(questionId, values);
    } else {
      setValue(questionId, values[0] || '');
    }
  };

  const onSubmit = async (data: Record<string, any>) => {
    const mark = performanceMonitor.start('submit');
    setLoading(true);
    
    try {
      // Validate data against schema
      await schema.parseAsync(data);
      
      // Update store with form data
      updateResponses(data as Partial<AssessmentResponses>);
      
      // Clear validation errors
      clearValidationErrors();
      
      // Track successful submission
      telemetry.track('section_completed', {
        step,
        data: data
      });
      
      // Move to next step if available
      if (onNext) {
        onNext();
      }
    } catch (error) {
      logger.error('Error submitting section', {
        step,
        error
      });
      
      // Set validation errors
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          addValidationError({
            field: err.path.join('.'),
            message: err.message,
            step,
            questionId: err.path[0].toString()
          });
        });
        onValidationChange(false);
      }
      
      // Track error
      telemetry.track('section_error', {
        step,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
      performanceMonitor.end(mark);
    }
  };

  // Render mobile version with our beautiful mobile components
  if (isMobile) {
    return (
      <div className="w-full space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {section.questions.map((question) => {
            if (question.type === 'select' || question.type === 'multiselect') {
              // Use MobileQuestionCard for select/multiselect questions
              const options = question.options?.map(option => ({
                value: option,
                label: option
              })) || [];

              const currentValues = mobileAnswers[question.id] || [];
              
              return (
                <MobileQuestionCard
                  key={question.id}
                  question={question.text}
                  options={options}
                  selectedValues={currentValues}
                  onSelectionChange={(values) => handleMobileSelection(question.id, values)}
                  multiSelect={question.type === 'multiselect'}
                  required={question.required}
                  error={errors[question.id]?.message as string}
                />
              );
            } else if (question.type === 'checkbox') {
              // Use MobileQuestionCard for checkbox (Yes/No)
              const options = [{ value: 'true', label: 'Yes' }];
              const currentValues = mobileAnswers[question.id] || [];
              
              return (
                <MobileQuestionCard
                  key={question.id}
                  question={question.text}
                  options={options}
                  selectedValues={currentValues}
                  onSelectionChange={(values) => handleMobileSelection(question.id, values)}
                  multiSelect={false}
                  required={question.required}
                  error={errors[question.id]?.message as string}
                />
              );
            } else {
              // Use MobileOptimizedInput for text/number inputs
              return (
                <MobileOptimizedInput
                  key={question.id}
                  label={question.text}
                  type={question.type}
                  placeholder={question.placeholder}
                  required={question.required}
                  error={errors[question.id]?.message as string}
                  {...register(question.id, {
                    valueAsNumber: question.type === 'number',
                    setValueAs: question.type === 'number' ? (value) => {
                      const num = parseFloat(value);
                      return isNaN(num) ? undefined : num;
                    } : undefined
                  })}
                />
              );
            }
          })}

          {validationErrors.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <h3 className="text-base font-semibold text-red-800 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    );
  }

  // Render desktop version (original)
  return (
    <Card className="w-full p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {metadata.title}
        </h2>
        
        <p className="mt-2 text-lg text-gray-600">
          {metadata.description}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-6">
            {section.questions.map((question) => (
              <div key={question.id}>
                <label 
                  htmlFor={question.id} 
                  className="block text-sm font-medium text-gray-700"
                >
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {question.type === 'select' || question.type === 'multiselect' ? (
                  <select
                    multiple={question.type === 'multiselect'}
                    {...register(question.id)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {question.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : question.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    {...register(question.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type={question.type}
                    placeholder={question.placeholder}
                    {...register(question.id, {
                      valueAsNumber: question.type === 'number',
                      setValueAs: question.type === 'number' ? (value) => {
                        const num = parseFloat(value);
                        return isNaN(num) ? undefined : num;
                      } : undefined
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                )}

                {errors[question.id] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[question.id]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          {validationErrors.length > 0 && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc space-y-1 pl-5">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hideNavigation && (
            <div className="flex justify-between">
              {onBack && (
                <Button
                  type="button"
                  onClick={onBack}
                  disabled={isLoading}
                  variant="outline"
                >
                  Back
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading || hasErrors}
                className="ml-auto"
              >
                {isLoading ? 'Loading...' : 'Next'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};

export default BaseSection; 