import React from 'react';
import { useForm } from 'react-hook-form';

interface ProcessDetailsSectionProps {
  onNext: (data: any) => void;
}

const ProcessDetailsSection: React.FC<ProcessDetailsSectionProps> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Process Details</h2>
      <form onSubmit={handleSubmit(onNext)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
              Number of Employees
            </label>
            <input
              type="number"
              {...register('employees', { required: true, min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.employees && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid number of employees</p>
            )}
          </div>
          
          <div>
            <label htmlFor="processVolume" className="block text-sm font-medium text-gray-700">
              Monthly Process Volume
            </label>
            <select
              {...register('processVolume', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select volume range</option>
              <option value="0-100">0-100</option>
              <option value="100-500">100-500</option>
              <option value="500-1000">500-1,000</option>
              <option value="1000+">1,000+</option>
            </select>
            {errors.processVolume && (
              <p className="mt-1 text-sm text-red-600">Please select a process volume range</p>
            )}
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              {...register('industry', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select industry</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Technology">Technology</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">Please select an industry</p>
            )}
          </div>
          
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
              Implementation Timeline
            </label>
            <select
              {...register('timeline', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select timeline</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="12+ months">12+ months</option>
            </select>
            {errors.timeline && (
              <p className="mt-1 text-sm text-red-600">Please select a timeline</p>
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

export default ProcessDetailsSection;
