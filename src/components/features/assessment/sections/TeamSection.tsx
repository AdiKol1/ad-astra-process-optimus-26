import React from 'react';
import { useForm } from 'react-hook-form';

interface TeamSectionProps {
  onNext: (data: any) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Team Information</h2>
      <form onSubmit={handleSubmit(onNext)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">
              Team Size
            </label>
            <input
              type="number"
              {...register('teamSize', { required: true, min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.teamSize && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid team size</p>
            )}
          </div>
          
          <div>
            <label htmlFor="departments" className="block text-sm font-medium text-gray-700">
              Involved Departments
            </label>
            <select
              multiple
              {...register('departments', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="HR">Human Resources</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Other">Other</option>
            </select>
            {errors.departments && (
              <p className="mt-1 text-sm text-red-600">Please select at least one department</p>
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

export default TeamSection;
