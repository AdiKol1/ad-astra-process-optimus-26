import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const teamInformationSchema = z.object({
  teamSize: z.string().min(1, 'Team size is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  trainingTime: z.string().min(1, 'Training time is required'),
});

type TeamInformationFormData = z.infer<typeof teamInformationSchema>;

interface TeamInformationFormProps {
  onNext: () => void;
}

export default function TeamInformationForm({ onNext }: TeamInformationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamInformationFormData>({
    resolver: zodResolver(teamInformationSchema),
  });

  const onSubmit = async (data: TeamInformationFormData) => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">
            Team Size
          </label>
          <Input
            {...register('teamSize')}
            type="number"
            id="teamSize"
            placeholder="Enter team size"
          />
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <Select {...register('experienceLevel')}>
            <option value="">Select experience level</option>
            <option value="entry">Entry Level</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </Select>
          {errors.experienceLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="trainingTime" className="block text-sm font-medium text-gray-700">
            Training Time (months)
          </label>
          <Select {...register('trainingTime')}>
            <option value="">Select training time</option>
            <option value="0-1">0-1 month</option>
            <option value="1-3">1-3 months</option>
            <option value="3-6">3-6 months</option>
            <option value="6+">6+ months</option>
          </Select>
          {errors.trainingTime && (
            <p className="mt-1 text-sm text-red-600">{errors.trainingTime.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
