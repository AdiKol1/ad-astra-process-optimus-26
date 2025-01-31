import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const processDetailsSchema = z.object({
  employees: z.string().min(1, 'Number of employees is required'),
  processVolume: z.string().min(1, 'Monthly process volume is required'),
  industry: z.string().min(1, 'Industry is required'),
});

type ProcessDetailsFormData = z.infer<typeof processDetailsSchema>;

interface ProcessDetailsFormProps {
  onNext: () => void;
}

export default function ProcessDetailsForm({ onNext }: ProcessDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcessDetailsFormData>({
    resolver: zodResolver(processDetailsSchema),
  });

  const onSubmit = async (data: ProcessDetailsFormData) => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
            Number of Employees
          </label>
          <Input
            {...register('employees')}
            type="number"
            id="employees"
            placeholder="Enter number of employees"
          />
          {errors.employees && (
            <p className="mt-1 text-sm text-red-600">{errors.employees.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="processVolume" className="block text-sm font-medium text-gray-700">
            Monthly Process Volume
          </label>
          <Select {...register('processVolume')}>
            <option value="">Select volume range</option>
            <option value="0-100">0-100</option>
            <option value="100-500">100-500</option>
            <option value="500-1000">500-1000</option>
            <option value="1000+">1000+</option>
          </Select>
          {errors.processVolume && (
            <p className="mt-1 text-sm text-red-600">{errors.processVolume.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <Select {...register('industry')}>
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </Select>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
