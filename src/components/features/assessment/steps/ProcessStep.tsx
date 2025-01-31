import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { StepProps } from '@/types/assessment'

const processSchema = z.object({
  timeSpent: z.number()
    .min(0, 'Time spent must be positive')
    .max(168, 'Time spent cannot exceed 168 hours per week'),
  processVolume: z.number()
    .min(0, 'Process volume must be positive'),
  errorRate: z.number()
    .min(0, 'Error rate must be positive')
    .max(100, 'Error rate cannot exceed 100%')
})

type ProcessData = z.infer<typeof processSchema>

export const ProcessStep: React.FC<StepProps> = ({
  data,
  onChange,
  onComplete,
  onBack,
  isValid,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProcessData>({
    resolver: zodResolver(processSchema),
    defaultValues: data as ProcessData
  })

  const onSubmit = (formData: ProcessData) => {
    onChange(formData)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Process Assessment</h2>
        <p className="text-gray-600">
          Let's understand your current process metrics to identify optimization opportunities.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hours spent on manual processes per week
          </label>
          <input
            type="number"
            {...register('timeSpent', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.timeSpent && (
            <p className="mt-1 text-sm text-red-600">{errors.timeSpent.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly process volume
          </label>
          <input
            type="number"
            {...register('processVolume', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.processVolume && (
            <p className="mt-1 text-sm text-red-600">{errors.processVolume.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current error rate (%)
          </label>
          <input
            type="number"
            {...register('errorRate', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.errorRate && (
            <p className="mt-1 text-sm text-red-600">{errors.errorRate.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </form>
  )
} 