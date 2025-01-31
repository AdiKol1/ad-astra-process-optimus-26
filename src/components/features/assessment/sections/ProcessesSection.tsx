import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { StepComponentProps } from '@/components/features/assessment/core/AssessmentFlow/types';
import { useAssessmentStore } from '@/stores/assessment';

const ProcessesSection: React.FC<StepComponentProps> = ({
  onValidationChange,
  onNext,
  onBack,
  isLoading
}) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm();
  const { responses } = useAssessmentStore();

  // Update parent about validation state
  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  const onSubmit = (data: any) => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Process Analysis</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="manualProcesses" className="block text-sm font-medium text-gray-700">
              Manual Processes
            </label>
            <select
              multiple
              {...register('manualProcesses', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isLoading}
              defaultValue={responses.manualProcesses}
            >
              <option value="Data Entry">Data Entry</option>
              <option value="Document Processing">Document Processing</option>
              <option value="Report Generation">Report Generation</option>
              <option value="Email Processing">Email Processing</option>
              <option value="Invoice Processing">Invoice Processing</option>
              <option value="Other">Other</option>
            </select>
            {errors.manualProcesses && (
              <p className="mt-1 text-sm text-red-600">Please select at least one process</p>
            )}
          </div>
          
          <div>
            <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-700">
              Hours Spent Weekly
            </label>
            <input
              type="number"
              {...register('timeSpent', { required: true, min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isLoading}
              defaultValue={responses.timeSpent}
            />
            {errors.timeSpent && (
              <p className="mt-1 text-sm text-red-600">Please enter valid hours spent</p>
            )}
          </div>
          
          <div>
            <label htmlFor="errorRate" className="block text-sm font-medium text-gray-700">
              Error Rate
            </label>
            <select
              {...register('errorRate', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isLoading}
              defaultValue={responses.errorRate}
            >
              <option value="">Select error rate</option>
              <option value="0-1%">0-1%</option>
              <option value="1-3%">1-3%</option>
              <option value="3-5%">3-5%</option>
              <option value="5-8%">5-8%</option>
              <option value="8-10%">8-10%</option>
              <option value="10%+">10%+</option>
            </select>
            {errors.errorRate && (
              <p className="mt-1 text-sm text-red-600">Please select an error rate</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            disabled={isLoading}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessesSection;
