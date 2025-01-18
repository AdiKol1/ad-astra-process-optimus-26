import { useMemo } from 'react';
import { teamQuestions } from '@/constants/questions/team';
import { qualifyingQuestions } from '@/constants/questions/qualifying';
import { impactQuestions } from '@/constants/questions/impact';
import { readinessQuestions } from '@/constants/questions/readiness';
import { marketingQuestions } from '@/constants/questions/marketing';
import { processesQuestions } from '@/constants/questions/processes';
import { CoreQuestionSection } from '@/types/assessment/questions';
import { logger } from '@/utils/logger';

export const getAssessmentSteps = () => {
  try {
    const allSteps = [
      teamQuestions,
      qualifyingQuestions,
      impactQuestions,
      readinessQuestions,
      processesQuestions,
      marketingQuestions
    ];

    // Validate steps structure
    const validSteps = allSteps.filter(step => {
      if (!step || !Array.isArray(step.questions)) {
        logger.error('Invalid step structure:', {
          component: 'getAssessmentSteps',
          step
        });
        return false;
      }
      return true;
    });

    return validSteps;
  } catch (err) {
    logger.error('Error loading assessment steps:', {
      component: 'getAssessmentSteps',
      error: err
    });
    return [];
  }
};

export const useAssessmentSteps = (currentStep: number) => {
  const steps = useMemo(() => getAssessmentSteps(), []);

  const currentStepData = useMemo(() => {
    if (!steps.length) {
      logger.error('No valid steps available', {
        component: 'useAssessmentSteps'
      });
      return null;
    }

    if (currentStep < 0 || currentStep >= steps.length) {
      logger.error('Invalid step index:', {
        component: 'useAssessmentSteps',
        currentStep,
        totalSteps: steps.length
      });
      return null;
    }

    return steps[currentStep];
  }, [steps, currentStep]);

  return {
    steps,
    currentStepData,
    totalSteps: steps.length
  };
};
