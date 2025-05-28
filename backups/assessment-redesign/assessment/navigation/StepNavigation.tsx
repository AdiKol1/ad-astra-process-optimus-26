import React from 'react';
import { AssessmentStep, StepConfig, STEP_ORDER, STEP_CONFIG } from '@/types/assessment/steps';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { ClipboardList, UserCircle, BarChart2, Cpu, Users, PieChart, CheckCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepNavigationProps {
  currentStep: AssessmentStep;
  metadata: StepConfig;
  canGoNext: boolean;
  canGoBack: boolean;
  currentStepIndex: number;
  totalSteps: number;
  isComplete: boolean;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

// Map step keys to icons
const STEP_ICONS: Record<AssessmentStep, React.ComponentType<any>> = {
  'initial': ClipboardList,
  'lead-capture': UserCircle,
  'process': BarChart2,
  'technology': Cpu,
  'team': Users,
  'social-media': Share2,
  'detailed-results': PieChart,
  'complete': CheckCircle
};

// Get friendly names for the step labels
const getStepLabel = (step: AssessmentStep): string => {
  switch (step) {
    case 'initial': return 'Start';
    case 'lead-capture': return 'Your Info';
    case 'process': return 'Process';
    case 'technology': return 'Technology';
    case 'team': return 'Team';
    case 'social-media': return 'Social Media';
    case 'detailed-results': return 'Results';
    case 'complete': return 'Complete';
    default: return '';
  }
};

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  metadata,
  canGoNext,
  canGoBack,
  currentStepIndex,
  totalSteps,
  isComplete,
  onNext,
  onBack,
  isLoading
}) => {
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  
  // Calculate which steps are completed
  const completedSteps = STEP_ORDER.slice(0, STEP_ORDER.indexOf(currentStep));
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{metadata.title}</h2>
          <p className="text-gray-600">{metadata.description}</p>
          <p className="text-sm text-gray-500">Estimated time: {metadata.estimatedTime}</p>
        </div>
        <div className="flex gap-2">
          {canGoBack && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          {!isComplete && (
            <Button
              onClick={onNext}
              disabled={!canGoNext || isLoading}
            >
              {isLoading ? 'Loading...' : 'Next'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Enhanced Progress Indicator */}
      <div className="mb-6">
        {/* Mobile progress bar (visible on small screens) */}
        <div className="sm:hidden w-full">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm">
            <span>{getStepLabel(currentStep)}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
        
        {/* Desktop step indicator (visible on larger screens) */}
        <div className="hidden sm:block relative">
          {/* Connector line */}
          <div className="absolute top-7 left-0 w-full h-0.5 bg-gray-200 -z-10" />
          
          {/* Step indicators */}
          <div className="flex justify-between">
            {STEP_ORDER.map((step, index) => {
              const StepIcon = STEP_ICONS[step];
              const isCompleted = completedSteps.includes(step);
              const isCurrent = step === currentStep;
              const isUpcoming = !isCompleted && !isCurrent;
              
              return (
                <div 
                  key={step} 
                  className="flex flex-col items-center"
                >
                  {/* Step Circle */}
                  <motion.div 
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center mb-2",
                      isCompleted && "bg-green-100 text-green-700 border-2 border-green-300",
                      isCurrent && "bg-blue-100 text-blue-700 border-2 border-blue-500 ring-4 ring-blue-100",
                      isUpcoming && "bg-gray-100 text-gray-400 border border-gray-300"
                    )}
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: isCurrent ? 1.1 : 1,
                      y: isCurrent ? -5 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <StepIcon className={cn(
                        "h-6 w-6",
                        isCurrent && "text-blue-600",
                        isUpcoming && "text-gray-400"
                      )} />
                    )}
                  </motion.div>
                  
                  {/* Step Label */}
                  <span className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCompleted && "text-green-600",
                    isCurrent && "text-blue-600 font-bold",
                    isUpcoming && "text-gray-400"
                  )}>
                    {getStepLabel(step)}
                  </span>
                  
                  {/* Current step indicator dot */}
                  {isCurrent && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Save Progress Notice */}
      <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Your progress is automatically saved. You can return and continue anytime.
      </div>
    </div>
  );
}; 