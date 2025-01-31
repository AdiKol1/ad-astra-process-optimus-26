import React from 'react'
import type { StepProps } from '@/types/assessment'

export const CompleteStep: React.FC<StepProps> = ({
  data,
  onChange,
  onComplete,
  onBack,
  isValid,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assessment Complete</h2>
      <p className="text-gray-600">Thank you for completing the assessment!</p>
      
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Results
        </button>
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Download Report
        </button>
      </div>
    </div>
  )
} 