import React from 'react';
import { useForm } from 'react-hook-form';

interface TechnologySectionProps {
  onNext: (data: any) => void;
}

const TechnologySection: React.FC<TechnologySectionProps> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Technology Assessment</h2>
      <form onSubmit={handleSubmit(onNext)} className="mt-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="currentSystems" className="block text-sm font-medium text-gray-700">
              Current Systems
            </label>
            <select
              multiple
              {...register('currentSystems', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="ERP">ERP System</option>
              <option value="CRM">CRM System</option>
              <option value="HRIS">HR Information System</option>
              <option value="Accounting">Accounting Software</option>
              <option value="Project Management">Project Management Tools</option>
              <option value="Custom">Custom Software</option>
            </select>
            {errors.currentSystems && (
              <p className="mt-1 text-sm text-red-600">Please select at least one system</p>
            )}
          </div>
          
          <div>
            <label htmlFor="integrationNeeds" className="block text-sm font-medium text-gray-700">
              Integration Needs
            </label>
            <select
              multiple
              {...register('integrationNeeds', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Data Sync">Data Synchronization</option>
              <option value="API">API Integration</option>
              <option value="File Transfer">File Transfer</option>
              <option value="Single Sign-On">Single Sign-On</option>
              <option value="Workflow">Workflow Automation</option>
              <option value="Custom">Custom Integration</option>
            </select>
            {errors.integrationNeeds && (
              <p className="mt-1 text-sm text-red-600">Please select at least one integration need</p>
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

export default TechnologySection;
