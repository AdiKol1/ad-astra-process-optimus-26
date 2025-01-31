import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { useAssessmentStore } from '@/stores/assessment'
import { STEPS, type Step } from '@/types/assessment'
import { logger } from '@/utils/logger'

// Step Components
import { InitialStep } from './steps/InitialStep'
import { ProcessStep } from './steps/ProcessStep'
import { TechnologyStep } from './steps/TechnologyStep'
import { TeamStep } from './steps/TeamStep'
import { ResultsStep } from './steps/ResultsStep'
import { CompleteStep } from './steps/CompleteStep'

const StepComponents: Record<Step, React.FC<any>> = {
  initial: InitialStep,
  process: ProcessStep,
  technology: TechnologyStep,
  team: TeamStep,
  results: ResultsStep,
  complete: CompleteStep
}

export const AssessmentFlow: React.FC = () => {
  const navigate = useNavigate()
  const { step = 'initial' } = useParams<{ step?: Step }>()
  
  const {
    assessment,
    startAssessment,
    updateStep,
    completeStep,
    canProgress,
    getNextStep,
    getPreviousStep
  } = useAssessmentStore()

  // Initialize assessment if needed
  React.useEffect(() => {
    if (!assessment) {
      startAssessment()
    }
  }, [assessment, startAssessment])

  // Handle invalid steps
  React.useEffect(() => {
    if (!assessment) return

    if (!STEPS.includes(step as Step)) {
      logger.warn('Invalid step detected, redirecting to initial', { step })
      navigate('/assessment/initial', { replace: true })
      return
    }

    if (step !== assessment.step) {
      navigate(`/assessment/${assessment.step}`, { replace: true })
    }
  }, [step, assessment, navigate])

  if (!assessment) {
    return <div>Loading...</div>
  }

  const StepComponent = StepComponents[assessment.step]
  if (!StepComponent) {
    logger.error('Invalid step component', { step: assessment.step })
    return null
  }

  const currentStepIndex = STEPS.indexOf(assessment.step)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Step {currentStepIndex + 1} of {STEPS.length}
            </h2>
            {!assessment.isValid[assessment.step] && (
              <p className="text-red-500">
                Please complete all required fields
              </p>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8">
          <StepComponent
            data={assessment.data[assessment.step]}
            onChange={(data: unknown) => updateStep(assessment.step, data)}
            onComplete={() => completeStep(assessment.step)}
            onBack={() => {
              const prevStep = getPreviousStep(assessment.step)
              if (prevStep) {
                navigate(`/assessment/${prevStep}`)
              }
            }}
            isValid={assessment.isValid[assessment.step]}
            isSubmitting={false}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const prevStep = getPreviousStep(assessment.step)
              if (prevStep) {
                navigate(`/assessment/${prevStep}`)
              }
            }}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Back
          </button>

          <button
            onClick={() => {
              if (canProgress(assessment.step)) {
                completeStep(assessment.step)
              }
            }}
            disabled={!canProgress(assessment.step)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {assessment.step === 'complete' ? 'Finish' : 'Next'}
          </button>
        </div>
      </Card>
    </div>
  )
} 