import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AssessmentSectionProps } from '@/components/features/assessment/core/AssessmentFlow/types';
import { FormSelect, FormInput } from '@/components/features/assessment/forms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const processSchema = z.object({
  manualProcesses: z.array(z.string()).min(1, 'Select at least one process'),
  timeSpent: z.number().min(1, 'Hours must be greater than 0'),
  errorRate: z.string().min(1, 'Select an error rate')
});

type ProcessFormData = z.infer<typeof processSchema>;

const errorRateOptions = [
  { value: '0-1%', label: '0-1%' },
  { value: '1-3%', label: '1-3%' },
  { value: '3-5%', label: '3-5%' },
  { value: '5-8%', label: '5-8%' },
  { value: '8-10%', label: '8-10%' },
  { value: '10%+', label: '10%+' }
];

const processOptions = [
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Document Processing', label: 'Document Processing' },
  { value: 'Report Generation', label: 'Report Generation' },
  { value: 'Email Processing', label: 'Email Processing' },
  { value: 'Invoice Processing', label: 'Invoice Processing' },
  { value: 'Customer Onboarding', label: 'Customer Onboarding' },
  { value: 'Other', label: 'Other' }
];

const ProcessesSection: React.FC<AssessmentSectionProps> = ({
  onValidationChange,
  onNext,
  onBack,
  isLoading,
  responses,
  metadata
}) => {
  const methods = useForm<ProcessFormData>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      manualProcesses: responses?.manualProcesses || [],
      timeSpent: responses?.timeSpent || 0,
      errorRate: responses?.errorRate || ''
    }
  });

  const { formState: { isValid } } = methods;

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  const onSubmit = (data: ProcessFormData) => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!isLoading}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">{metadata.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground">{metadata.description}</p>
          
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-8">
              <Card className="p-6">
                <div className="space-y-6">
                  <FormSelect
                    name="manualProcesses"
                    label="Manual Processes"
                    description="Select the processes that could benefit from automation"
                    options={processOptions}
                    required
                  />
                  
                  <FormInput
                    type="number"
                    name="timeSpent"
                    label="Hours Spent Weekly"
                    description="Average hours spent on manual processes per week"
                    required
                    min={1}
                  />
                  
                  <FormSelect
                    name="errorRate"
                    label="Error Rate"
                    description="Current error rate in manual processes"
                    options={errorRateOptions}
                    required
                  />
                </div>
              </Card>

              <div className="flex justify-between">
                {onBack && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={!!isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!!isLoading || !isValid}
                >
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

export default ProcessesSection;
