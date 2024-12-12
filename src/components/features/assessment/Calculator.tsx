import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { transformAssessmentData } from '@/utils/assessment/dataTransformer';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import type { AssessmentResults } from '@/types/calculator';

const WEIGHTS = {
  TEAM: 0.4,
  PROCESS: 0.4,
  CAC: 0.2
};

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const calculateScores = async () => {
      try {
        if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
          console.log('No assessment data found, redirecting to assessment');
          navigate('/assessment');
          return;
        }

        // Debug: Log the raw responses
        console.log('Raw Assessment Responses:', JSON.stringify(assessmentData.responses, null, 2));

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses: assessmentData.responses });
        console.log('Team Score:', teamScore);

        const processScore = calculateProcessScore({ responses: assessmentData.responses });
        console.log('Process Score:', processScore);
        
        // Calculate CAC metrics with industry fallback
        const industry = assessmentData.responses.industry || 'Other';
        const cacMetrics = calculateCACMetrics(assessmentData.responses, industry);
        console.log('CAC Metrics:', cacMetrics);

        // Debug: Log all intermediate calculations
        const debugData = {
          teamScore,
          processScore,
          cacMetrics,
          industry,
          responses: assessmentData.responses
        };
        console.log('Debug Data:', debugData);

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: WEIGHTS.TEAM },
          process: { score: processScore.score, weight: WEIGHTS.PROCESS },
          cac: { score: Math.min(cacMetrics.potentialReduction, 1), weight: WEIGHTS.CAC }
        });

        // Transform the calculated data into AssessmentResults format
        const results: AssessmentResults = {
          annual: {
            savings: cacMetrics.annualSavings || 0,
            hours: Math.round((processScore.score || 0) * 2080)
          },
          cac: {
            currentCAC: cacMetrics.currentCAC || 1000,  // Fallback to base value
            potentialReduction: (cacMetrics.potentialReduction || 0) * 100,  // Convert decimal to percentage
            annualSavings: cacMetrics.annualSavings || 0,
            automationROI: (cacMetrics.automationROI || 0) * 100,  // Convert decimal to percentage
            projectedRevenue: cacMetrics.projectedRevenue || 0,
            conversionImprovement: cacMetrics.conversionImprovement || 0  // Already a percentage
          }
        };

        console.log('Final Results:', results);

        // Update assessment data with validated results
        const transformedData = {
          ...assessmentData,
          results
        };

        console.log('Setting assessment data:', transformedData);
        await setAssessmentData(transformedData);

        setIsCalculating(false);
      } catch (err) {
        console.error('Error in calculation:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during calculation');
        setIsCalculating(false);
      }
    };

    calculateScores();
  }, [assessmentData?.responses, navigate, setAssessmentData]);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
  }

  return null;
};

export default Calculator;