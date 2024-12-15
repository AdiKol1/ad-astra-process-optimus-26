import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { validateWeights } from './calculator/weightValidator';
import { toast } from '@/hooks/use-toast';

const WEIGHTS = {
  TEAM: 0.4,
  PROCESS: 0.4,
  CAC: 0.2
} as const;

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

        console.log('Starting calculation with responses:', assessmentData.responses);

        // Validate weights before calculation
        if (!validateWeights(WEIGHTS)) {
          throw new Error('Invalid weight distribution');
        }

        // Calculate section scores with null checks
        const teamScore = calculateTeamScore({ 
          responses: assessmentData.responses 
        });
        console.log('Team Score calculated:', teamScore);

        const processScore = calculateProcessScore({ 
          responses: assessmentData.responses 
        });
        console.log('Process Score calculated:', processScore);
        
        // Calculate CAC metrics with industry fallback
        const industry = assessmentData.responses.industry || 'Other';
        const cacMetrics = calculateCACMetrics(assessmentData.responses, industry);
        console.log('CAC Metrics calculated:', cacMetrics);

        // Ensure all required scores are present
        if (!teamScore?.score || !processScore?.score || !cacMetrics?.efficiency) {
          throw new Error('Missing required scores for calculation');
        }

        // Calculate automation potential based on all factors
        const automationPotential = Math.round(
          ((teamScore.score + processScore.score) / 2 + cacMetrics.efficiency) * 50
        );
        console.log('Automation potential calculated:', automationPotential);

        // Calculate weighted total score with type safety
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: WEIGHTS.TEAM },
          process: { score: processScore.score, weight: WEIGHTS.PROCESS },
          cac: { score: 1 - (cacMetrics.potentialReduction / 100), weight: WEIGHTS.CAC }
        });
        console.log('Total weighted score calculated:', totalScore);

        // Calculate annual hours saved based on team size and efficiency
        const teamSize = Number(assessmentData.responses.teamSize?.[0]?.split('-')[0]) || 1;
        const annualHours = Math.round(2080 * teamSize * (automationPotential / 100));
        console.log('Annual hours calculated:', annualHours);

        // Transform and validate the data before updating context
        const transformedData = {
          ...assessmentData,
          qualificationScore: Math.round(totalScore * 100),
          automationPotential,
          sectionScores: {
            team: { percentage: Math.round(teamScore.score * 100) },
            process: { percentage: Math.round(processScore.score * 100) },
            automation: { percentage: Math.round(cacMetrics.efficiency * 100) }
          },
          results: {
            annual: {
              savings: cacMetrics.annualSavings,
              hours: annualHours
            },
            cac: {
              currentCAC: cacMetrics.currentCAC,
              potentialReduction: Math.round(cacMetrics.potentialReduction),
              annualSavings: cacMetrics.annualSavings,
              automationROI: Math.round(cacMetrics.automationROI * 100)
            }
          }
        };

        console.log('Transformed data for context:', transformedData);

        await setAssessmentData(transformedData);
        console.log('Successfully updated assessment data');
        
        toast({
          title: "Calculation Complete",
          description: "Your assessment has been processed successfully.",
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while calculating scores';
        console.error('Error in calculation pipeline:', err);
        setError(errorMessage);
        
        toast({
          title: "Calculation Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsCalculating(false);
      }
    };

    calculateScores();
  }, [assessmentData?.responses, navigate, setAssessmentData]);

  if (error) {
    return (
      <ErrorBoundary>
        <ErrorDisplay error={error} />
      </ErrorBoundary>
    );
  }

  if (isCalculating) {
    return (
      <ErrorBoundary>
        <LoadingDisplay />
      </ErrorBoundary>
    );
  }

  return null;
};

export default Calculator;