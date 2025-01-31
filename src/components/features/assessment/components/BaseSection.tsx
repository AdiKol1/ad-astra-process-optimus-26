import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { useAssessmentStore } from '../../../../stores/assessment';
import { AssessmentSectionProps, BaseSectionProps } from '../../../../types/assessment/components';
import { AssessmentResponses, ValidationError } from '../../../../types/assessment/state';
import { logger } from '../../../../utils/logger';
import { telemetry } from '../../../../utils/monitoring/telemetry';
import { createPerformanceMonitor } from '../../../../utils/monitoring/performance';
import { getSchemaBySection } from '../../../../validation/assessment-schemas';

const performanceMonitor = createPerformanceMonitor('BaseSection');

interface BaseSectionComponentProps extends AssessmentSectionProps {
  section: BaseSectionProps;
}

export const BaseSection: React.FC<BaseSectionComponentProps> = ({
  step,
  section,
  onValidationChange,
  initialData,
  validationErrors = [],
  onNext,
  onBack,
  isLoading = false,
  disabled = false,
}) => {
  // Get the validation schema for this section
  const schema = React.useMemo(() => getSchemaBySection(step), [step]);
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm({
    defaultValues: initialData,
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
      title: section.title
    });

    if (initialData) {
      reset(initialData);
    }
  }, [step, section.title, initialData, reset]);

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
        data
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
            message: err.message
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

  return (
    <Card className="w-full p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {section.title}
        </h2>
        
        <p className="mt-2 text-lg text-gray-600">
          {section.description}
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
                      valueAsNumber: question.type === 'number'
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

          <div className="flex justify-between">
            {onBack && (
              <Button
                type="button"
                onClick={onBack}
                disabled={isLoading || disabled}
                variant="outline"
              >
                Back
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading || disabled || hasErrors}
              className="ml-auto"
            >
              {isLoading ? 'Loading...' : 'Next'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default BaseSection; 