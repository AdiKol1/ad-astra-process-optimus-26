import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/contexts/assessment/store';
import { StepComponentProps, BaseSectionProps } from '@/types/assessment/components';
import { AssessmentResponses } from '@/types/assessment/state';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { createPerformanceMonitor } from '@/utils/monitoring/performance';
import { getSchemaBySection } from '@/validation/assessment-schemas';
import { UnifiedQuestionCard } from '../forms/UnifiedQuestionCard';
import { UnifiedInput } from '../forms/UnifiedInput';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  
  // Get the validation schema for this section
  const schema = React.useMemo(() => getSchemaBySection(step), [step]);
  
  // Get the correct default values based on the step
  const getDefaultValues = () => {
    if (step === 'team') {
      return responses?.team || {};
    } else if (step === 'social-media') {
      return responses?.socialMedia || {};
    } else {
      return responses || {};
    }
  };

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch, setValue } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(schema),
    mode: 'onSubmit'
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

  // Track section view and initialize form - only run when step changes
  React.useEffect(() => {
    telemetry.track('section_viewed', {
      step,
      title: metadata.title
    });

    const defaultValues = getDefaultValues();
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [step, metadata.title]);

  // Handle question selection
  const handleSelectionChange = (questionId: string, values: string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: values
    }));
    
    // Update form value
    const question = section.questions.find(q => q.id === questionId);
    if (question?.type === 'multiselect') {
      setValue(questionId, values);
    } else if (question?.type === 'checkbox') {
      // Convert string to boolean for checkbox questions
      const boolValue = values[0] === 'true';
      setValue(questionId, boolValue, { shouldValidate: true });
    } else {
      setValue(questionId, values[0] || '', { shouldValidate: true });
    }
  };

  const onSubmit = async (data: Record<string, any>) => {
    const mark = performanceMonitor.start('submit');
    setLoading(true);
    
    try {
      // Convert checkbox values to booleans before validation
      const processedData = Object.entries(data).reduce((acc, [key, value]) => {
        const question = section.questions.find(q => q.id === key);
        if (question?.type === 'checkbox') {
          acc[key] = value === 'true' || value === true;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Validate data against schema
      await schema.parseAsync(processedData);
      
      // Update store with form data in the correct nested structure
      if (step === 'team') {
        updateResponses({ team: processedData } as Partial<AssessmentResponses>);
      } else if (step === 'social-media') {
        updateResponses({ socialMedia: processedData } as Partial<AssessmentResponses>);
      } else {
        updateResponses(processedData as Partial<AssessmentResponses>);
      }
      
      // Clear validation errors
      clearValidationErrors();
      
      // Track successful submission
      telemetry.track('section_completed', {
        step,
        data: processedData
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

  // Unified render for both desktop and mobile
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {metadata.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {metadata.description}
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
            {section.questions.map((question, index) => {
              if (question.type === 'select' || question.type === 'multiselect') {
                // Use UnifiedQuestionCard for select/multiselect questions
                const options = question.options?.map(option => ({
                  value: option,
                  label: option
                })) || [];

                const currentValues = selectedAnswers[question.id] || [];
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <UnifiedQuestionCard
                      question={question.text}
                      options={options}
                      selectedValues={currentValues}
                      onSelectionChange={(values) => handleSelectionChange(question.id, values)}
                      multiSelect={question.type === 'multiselect'}
                      required={question.required}
                      error={errors[question.id]?.message as string}
                    />
                  </motion.div>
                );
              } else if (question.type === 'checkbox') {
                // Use UnifiedQuestionCard for checkbox (Yes/No)
                const options = [
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' }
                ];
                const currentValues = selectedAnswers[question.id] || [];
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <UnifiedQuestionCard
                      question={question.text}
                      options={options}
                      selectedValues={currentValues}
                      onSelectionChange={(values) => handleSelectionChange(question.id, values)}
                      multiSelect={false}
                      required={question.required}
                      error={errors[question.id]?.message as string}
                    />
                  </motion.div>
                );
              } else {
                // Use UnifiedInput for text/number inputs
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <UnifiedInput
                      label={question.text}
                      type={question.type}
                      placeholder={question.placeholder}
                      required={question.required}
                      error={errors[question.id]?.message as string}
                      {...register(question.id)}
                    />
                  </motion.div>
                );
              }
            })}

            {/* Error Summary */}
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-red-50 border border-red-200 p-6"
              >
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Please fix the following errors:
                </h3>
                <ul className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{error.message}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {!hideNavigation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-between pt-8"
              >
                {onBack && (
                  <Button
                    type="button"
                    onClick={onBack}
                    disabled={isLoading}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || hasErrors}
                  size="lg"
                  className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>Loading...</>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BaseSection; 