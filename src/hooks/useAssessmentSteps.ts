import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui';
import { useAssessment } from './useAssessment';
import { qualifyingQuestions } from '../constants/questions/qualifying';
import { impactQuestions } from '../constants/questions/impact';
import { readinessQuestions } from '../constants/questions/readiness';
import { cacQuestions } from '../constants/questions/cac';
import { marketingQuestions } from '../constants/questions/marketing';
import { teamQuestions } from '../constants/questions/team';
import { logger } from '../utils/logger';
import { calculateProcessMetrics } from '../utils/assessment/process/calculations';
import { AssessmentData } from '../types/assessment';

export const useAssessmentSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, setCurrentStep, setAssessmentData } = useAssessment();
  const [showValueProp, setShowValueProp] = useState(false);

  const steps = useMemo(() => [
    { 
      id: 'team',
      data: teamQuestions
    },
    { 
      id: 'qualifying', 
      data: {
        ...qualifyingQuestions,
        questions: qualifyingQuestions.questions.slice(0, 2)
      }
    },
    { 
      id: 'impact', 
      data: {
        ...impactQuestions,
        questions: impactQuestions.questions.filter(q => 
          ['timeWasted', 'errorImpact'].includes(q.id)
        )
      }
    },
    {
      id: 'marketing',
      data: marketingQuestions
    },
    {
      id: 'cac',
      data: cacQuestions
    },
    { 
      id: 'readiness', 
      data: readinessQuestions
    }
  ], []);

  const calculateResults = useCallback(() => {
    // Parse numeric values from responses
    const timeSpentMap = {
      'Less than 10 hours': 5,
      '10-20 hours': 15,
      '20-30 hours': 25,
      '30-40 hours': 35,
      'More than 40 hours': 45
    };

    const errorImpactMap = {
      'Less than $1,000': 500,
      '$1,000 - $5,000': 3000,
      '$5,000 - $10,000': 7500,
      '$10,000 - $50,000': 30000,
      'More than $50,000': 75000
    };

    const automationLevelMap = {
      '0-25%': 0.125,
      '26-50%': 0.375,
      '51-75%': 0.625,
      '76-100%': 0.875
    };

    // Extract and convert metrics from responses
    const metrics = {
      timeSpent: timeSpentMap[state.responses.timeWasted as keyof typeof timeSpentMap] || 0,
      errorRate: 0.05, // Default error rate
      processVolume: state.responses.processVolume ? parseInt(state.responses.processVolume) : 100,
      manualProcessCount: (state.responses.painPoints?.length || 1),
      industry: state.responses.industry || 'technology',
      implementationCost: state.responses.implementationCost || '0'
    };

    // Calculate results
    const processResults = calculateProcessMetrics(metrics);

    // Calculate CAC metrics
    const marketingBudgetMap = {
      'Less than $5,000': 2500,
      '$5,001 - $10,000': 7500,
      '$10,001 - $25,000': 17500,
      '$25,001 - $50,000': 37500,
      'More than $50,000': 75000
    };

    const marketingBudget = marketingBudgetMap[state.responses.marketingBudget as keyof typeof marketingBudgetMap] || 0;
    const currentAutomationLevel = automationLevelMap[state.responses.automationLevel as keyof typeof automationLevelMap] || 0;
    
    const cacMetrics = {
      current: marketingBudget / 100, // Assuming 100 customers as baseline
      projected: (marketingBudget * 0.7) / 150, // 30% cost reduction and 50% more customers
      potentialReduction: 0.3, // 30% potential reduction
      conversionImprovement: 50, // 50% improvement
      reduction: 0.3 // 30% reduction
    };

    // Update assessment data with results
    return Promise.resolve()
      .then(() => {
        setAssessmentData((prev: AssessmentData) => ({
          ...prev,
          results: {
            process: {
              annual: {
                savings: processResults.savings.annual,
                hours: processResults.metrics.efficiency * 2080 // Annual work hours
              },
              metrics: {
                efficiency: processResults.metrics.efficiency,
                savings: processResults.savings.annual,
                roi: processResults.metrics.roi
              }
            },
            cac: cacMetrics
          },
          completedAt: new Date().toISOString()
        }));
      });
  }, [state.responses, setAssessmentData]);

  const handleNext = useCallback(() => {
    const nextStep = state.currentStep + 1;
    
    if (nextStep < steps.length) {
      logger.info('Moving to next step', { from: state.currentStep, to: nextStep });
      setCurrentStep(nextStep);
    } else {
      logger.info('Assessment completed, calculating results');
      
      try {
        calculateResults()
          .then(() => {
            logger.info('Results calculated, navigating to results page');
            navigate('/assessment/results');
          })
          .catch(error => {
            logger.error('Error calculating results:', error);
            toast({
              title: 'Error',
              description: 'Failed to calculate results. Please try again.',
              variant: 'destructive',
            });
          });
      } catch (error) {
        logger.error('Error processing assessment data', error);
        toast({
          title: 'Error',
          description: 'Failed to process assessment data. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [steps.length, setCurrentStep, navigate, state.currentStep, calculateResults, toast]);

  const handleBack = useCallback(() => {
    const prevStep = state.currentStep - 1;
    if (prevStep >= 0) {
      logger.info('Moving to previous step', { from: state.currentStep, to: prevStep });
      setCurrentStep(prevStep);
    }
  }, [setCurrentStep, state.currentStep]);

  return useMemo(() => ({
    steps,
    currentStep: state.currentStep,
    handleNext,
    handleBack,
    showValueProp,
    setShowValueProp
  }), [
    steps,
    state.currentStep,
    handleNext,
    handleBack,
    showValueProp,
    setShowValueProp
  ]);
};
