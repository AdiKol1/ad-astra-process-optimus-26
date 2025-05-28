import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const processesSchema = z.object({
  timeSpent: z.string().min(1, 'Time spent is required'),
  errorRate: z.string().min(1, 'Error rate is required'),
  complexity: z.string().min(1, 'Process complexity is required'),
});

type ProcessesFormData = z.infer<typeof processesSchema>;

interface ProcessesFormProps {
  onNext: () => void;
}

export default function ProcessesForm({ onNext }: ProcessesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcessesFormData>({
    resolver: zodResolver(processesSchema),
  });

  const onSubmit = async (data: ProcessesFormData) => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-700">
            Time Spent (hours/week)
          </label>
          <Input
            {...register('timeSpent')}
            type="number"
            id="timeSpent"
            placeholder="Enter hours per week"
          />
          {errors.timeSpent && (
            <p className="mt-1 text-sm text-red-600">{errors.timeSpent.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="errorRate" className="block text-sm font-medium text-gray-700">
            Error Rate
          </label>
          <Select {...register('errorRate')}>
            <option value="">Select error rate</option>
            <option value="0-1%">0-1%</option>
            <option value="1-3%">1-3%</option>
            <option value="3-5%">3-5%</option>
            <option value="5-8%">5-8%</option>
            <option value="8-10%">8-10%</option>
            <option value="10%+">10%+</option>
          </Select>
          {errors.errorRate && (
            <p className="mt-1 text-sm text-red-600">{errors.errorRate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-gray-700">
            Process Complexity
          </label>
          <Select {...register('complexity')}>
            <option value="">Select complexity</option>
            <option value="low">Low - Simple, repetitive tasks</option>
            <option value="medium">Medium - Some decision making required</option>
            <option value="high">High - Complex decision making</option>
          </Select>
          {errors.complexity && (
            <p className="mt-1 text-sm text-red-600">{errors.complexity.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
