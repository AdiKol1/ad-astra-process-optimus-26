import React from 'react'
import type { StepProps } from '@/types/assessment'

export const InitialStep: React.FC<StepProps> = ({
  data,
  onChange,
  onComplete,
  onBack,
  isValid,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Process Optimization Assessment
      </h1>
      
      <p className="text-gray-600">
        Welcome to your process optimization assessment. This assessment will help us understand
        your current processes, technology usage, and team structure to provide personalized
        recommendations for improvement.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">What to expect:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>5-10 minutes to complete</li>
          <li>Questions about your current processes</li>
          <li>Technology stack assessment</li>
          <li>Team structure evaluation</li>
          <li>Personalized recommendations</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Benefits:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Identify process bottlenecks</li>
          <li>Discover automation opportunities</li>
          <li>Optimize resource allocation</li>
          <li>Improve team efficiency</li>
        </ul>
      </div>

      <button
        onClick={onComplete}
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Start Assessment
      </button>
    </div>
  )
} 