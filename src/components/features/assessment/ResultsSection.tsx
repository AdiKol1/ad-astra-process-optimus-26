import React, { useMemo } from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateAutomationPotential } from '@/utils/calculations';
import type { CalculationResults } from '@/utils/calculations/types/calculationTypes';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AssessmentFormData {
  laborCosts: number;
  processCount: number;
  manualProcesses: string[];
  errorRate: number;
  teamSize: number;
}

interface AssessmentResults {
  costs: {
    current: number;
    projected: number;
  };
  savings: {
    monthly: number;
    annual: number;
  };
  efficiency: {
    timeReduction: number;
    errorReduction: number;
    productivity: number;
  };
  automationPotential: number;
  recommendations: string[];
}

interface AssessmentContextType {
  formData: AssessmentFormData | null;
  isLoading: boolean;
  error: Error | null;
}

const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.1;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: STAGGER_DELAY
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const ResultCard: React.FC<{
  title: string;
  children: React.ReactNode;
  index: number;
}> = React.memo(({ title, children, index }) => (
  <motion.div
    variants={ITEM_VARIANTS}
    custom={index}
    transition={{ delay: index * STAGGER_DELAY }}
  >
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  </motion.div>
));

ResultCard.displayName = 'ResultCard';

const getRecommendations = (results: CalculationResults): string[] => {
  const recommendations = [];
  
  if (results.efficiency.errorReduction > 30) {
    recommendations.push('Implement error reduction strategies through process automation');
  }
  
  if (results.efficiency.timeReduction > 40) {
    recommendations.push('Prioritize automation implementation for maximum time savings');
  }

  if (results.efficiency.productivity < 70) {
    recommendations.push('Focus on productivity improvements through process optimization');
  }
  
  recommendations.push('Schedule a consultation with our process optimization experts');
  recommendations.push('Get a detailed analysis of your automation opportunities');
  
  return recommendations;
};

export const ResultsSection: React.FC = React.memo(() => {
  const { formData, isLoading, error } = useAssessment() as AssessmentContextType;

  const results = useMemo(() => {
    if (!formData) return null;
    try {
      const calculatedResults = calculateAutomationPotential(formData) as CalculationResults;
      
      // Calculate automation potential based on efficiency metrics
      const automationPotential = Math.round(
        (calculatedResults.efficiency.timeReduction + 
         calculatedResults.efficiency.errorReduction + 
         calculatedResults.efficiency.productivity) / 3
      );
      
      // Generate recommendations
      const recommendations = getRecommendations(calculatedResults);

      // Combine into final results
      const finalResults: AssessmentResults = {
        ...calculatedResults,
        automationPotential,
        recommendations
      };
      
      // Track results calculation
      telemetry.track('results_calculated', {
        costs: finalResults.costs,
        savings: finalResults.savings,
        efficiency: finalResults.efficiency,
        automationPotential,
        timestamp: new Date().toISOString()
      });

      logger.info('Results calculated successfully', {
        costs: finalResults.costs,
        savings: finalResults.savings,
        efficiency: finalResults.efficiency,
        automationPotential
      });

      return finalResults;
    } catch (error) {
      const err = error as Error;
      logger.error('Error calculating results:', {
        message: err.message,
        stack: err.stack,
        formData
      });
      return null;
    }
  }, [formData]);

  const handleBookConsultation = () => {
    try {
      telemetry.track('consultation_requested', {
        costs: results?.costs,
        savings: results?.savings,
        efficiency: results?.efficiency,
        automationPotential: results?.automationPotential,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Implement booking flow
      logger.info('User requested consultation');
    } catch (error) {
      const err = error as Error;
      logger.error('Error requesting consultation:', {
        message: err.message,
        stack: err.stack
      });
    }
  };

  if (error) {
    return (
      <motion.div 
        className="text-red-600 p-4 rounded-lg bg-red-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="alert"
      >
        <p className="font-medium">Error calculating results: {error.message}</p>
        <p className="mt-2 text-sm">Please try refreshing the page or contact support.</p>
      </motion.div>
    );
  }

  if (isLoading || !results) {
    return (
      <div 
        className="flex justify-center items-center min-h-[400px]"
        role="status"
        aria-label="Calculating results"
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        className="space-y-6"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        role="region"
        aria-labelledby="results-title"
      >
        <motion.div 
          className="text-center"
          variants={ITEM_VARIANTS}
        >
          <motion.h2 
            id="results-title"
            className="text-2xl font-bold tracking-tight text-gray-900"
            variants={ITEM_VARIANTS}
          >
          Your Process Optimization Results
          </motion.h2>
          <motion.p 
            className="mt-2 text-lg text-gray-600"
            variants={ITEM_VARIANTS}
          >
          Based on your responses, here's what we found
          </motion.p>
        </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard title="Current State" index={0}>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Costs</p>
                <p className="text-2xl font-bold" aria-label={`Current costs: $${results.costs.current.toLocaleString()}`}>
                  ${results.costs.current.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Projected Costs</p>
                <p className="text-2xl font-bold" aria-label={`Projected costs: $${results.costs.projected.toLocaleString()}`}>
                  ${results.costs.projected.toLocaleString()}
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500">Efficiency Metrics</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Time Reduction</p>
                    <p className="text-lg font-semibold">{results.efficiency.timeReduction}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Error Reduction</p>
                    <p className="text-lg font-semibold">{results.efficiency.errorReduction}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Productivity</p>
                    <p className="text-lg font-semibold">{results.efficiency.productivity}%</p>
                  </div>
                </div>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="Potential Impact" index={1}>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Automation Potential</p>
                <p 
                  className="text-2xl font-bold"
                  aria-label={`Automation potential: ${results.automationPotential}%`}
                >
                  {results.automationPotential}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Annual Savings</p>
                <p 
                  className="text-3xl font-bold text-green-600"
                  aria-label={`Annual savings: $${results.savings.annual.toLocaleString()}`}
                >
                  ${results.savings.annual.toLocaleString()}
                </p>
                <p 
                  className="text-sm text-gray-500 mt-1"
                  aria-label={`Monthly savings: $${results.savings.monthly.toLocaleString()}`}
                >
                  (${results.savings.monthly.toLocaleString()} per month)
                </p>
              </div>
            </div>
          </ResultCard>
      </div>

        <motion.div 
          className="bg-gray-50 p-6 rounded-lg"
          variants={ITEM_VARIANTS}
        >
        <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
        <div className="space-y-4">
          <p>
            Based on your assessment results, we recommend the following steps to optimize your
            processes:
          </p>
            <motion.ul 
              className="list-disc pl-5 space-y-2"
              variants={ITEM_VARIANTS}
            >
              {results.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  variants={ITEM_VARIANTS}
                  custom={index}
                  className="text-gray-700"
                >
                  {recommendation}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              className="mt-6"
              variants={ITEM_VARIANTS}
            >
              <Button
                onClick={handleBookConsultation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 group transition-all duration-300"
                aria-label="Book a consultation with our process optimization experts"
              >
                Book Your Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
        </div>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
});

ResultsSection.displayName = 'ResultsSection';
