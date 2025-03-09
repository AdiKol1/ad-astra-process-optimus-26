import React from 'react';
import { useForm } from 'react-hook-form';
import type { StepComponentProps } from '@/types/assessment/components';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

const GoalsSection: React.FC<StepComponentProps> = ({
  onComplete,
  isLoading,
  metadata,
  responses
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: responses?.goals || {}
  });

  return (
    <ErrorBoundary>
      <LoadingState isLoading={!!isLoading}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">{metadata.title}</h2>
          <p className="mt-2 text-lg text-muted-foreground">{metadata.description}</p>
          
          <form onSubmit={handleSubmit(onComplete)} className="mt-8 space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
                  Key Objectives
                </label>
                <select
                  multiple
                  {...register('objectives', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Efficiency">Improve Process Efficiency</option>
                  <option value="Cost">Reduce Operational Costs</option>
                  <option value="Quality">Enhance Quality & Accuracy</option>
                  <option value="Scalability">Increase Scalability</option>
                  <option value="Compliance">Strengthen Compliance</option>
                  <option value="Innovation">Drive Innovation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="expectedOutcomes" className="block text-sm font-medium text-gray-700">
                  Expected Outcomes
                </label>
                <select
                  multiple
                  {...register('expectedOutcomes', { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="Time Savings">Time Savings</option>
                  <option value="Cost Reduction">Cost Reduction</option>
                  <option value="Error Reduction">Error Reduction</option>
                  <option value="Better Analytics">Better Analytics & Insights</option>
                  <option value="Employee Satisfaction">Improved Employee Satisfaction</option>
                  <option value="Customer Experience">Enhanced Customer Experience</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </LoadingState>
    </ErrorBoundary>
  );
};

export default GoalsSection;
