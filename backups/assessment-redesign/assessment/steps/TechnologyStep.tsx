import React from 'react'
import type { StepProps } from '@/types/assessment'

export const TechnologyStep: React.FC<StepProps> = ({
  data,
  onChange,
  onComplete,
  onBack,
  isValid,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Technology Assessment</h2>
      <p className="text-gray-600">Coming soon...</p>
      
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
} 