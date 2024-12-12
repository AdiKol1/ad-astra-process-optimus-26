import React from 'react';
import { useForm } from 'react-hook-form';

interface ChallengesSectionProps {
  onNext: (data: any) => void;
}

const ChallengesSection: React.FC<ChallengesSectionProps> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Challenges & Pain Points</h2>
      <form onSubmit={handleSubmit(onNext)} className="mt-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="painPoints" className="block text-sm font-medium text-gray-700">
              Current Pain Points
            </label>
            <select
              multiple
              {...register('painPoints', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
              <p className="mt-1 text-sm text-red-600">Please select at least one pain point</p>
            )}
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority Level
            </label>
            <select
              {...register('priority', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select priority</option>
              <option value="Critical">Critical - Needs immediate attention</option>
              <option value="High">High - Important but not urgent</option>
              <option value="Medium">Medium - Plan to address in 3-6 months</option>
              <option value="Low">Low - Nice to have</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">Please select a priority level</p>
            )}
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
  );
};

export default ChallengesSection;
