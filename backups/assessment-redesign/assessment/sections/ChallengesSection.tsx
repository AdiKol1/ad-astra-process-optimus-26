import React from 'react';
import { useForm } from 'react-hook-form';
import type { StepComponentProps } from '@/types/assessment/components';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const ChallengesSection: React.FC<StepComponentProps> = ({
  onComplete,
  isLoading,
  metadata,
  responses
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: responses?.challenges || {}
  });

  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!isLoading}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">{metadata.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground">{metadata.description}</p>
          
          <Card className="mt-8">
            <form onSubmit={handleSubmit(onComplete)} className="p-6 space-y-6">
              <div>
                <label htmlFor="painPoints" className="block text-sm font-medium">
                  Current Pain Points
                </label>
                <select
                  multiple
                  {...register('painPoints', { required: true })}
                  className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="Time Consuming">Time-Consuming Manual Tasks</option>
                  <option value="Error Prone">Error-Prone Processes</option>
                  <option value="Data Silos">Data Silos</option>
                  <option value="Poor Visibility">Poor Process Visibility</option>
                  <option value="Bottlenecks">Process Bottlenecks</option>
                  <option value="Communication">Communication Issues</option>
                  <option value="Other">Other</option>
                </select>
                {errors.painPoints && (
                  <p className="mt-1 text-sm text-destructive">Please select at least one pain point</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Next
                </button>
              </div>
            </form>
          </Card>
        </div>
      </LoadingState>
    </ErrorBoundary>
  );
};

export default ChallengesSection;
