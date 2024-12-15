import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';
import { calculateAutomationPotential } from '@/utils/calculations/automationCalculator';
import { toast } from '@/hooks/use-toast';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
      console.log('No assessment data found, redirecting to assessment');
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        console.log('Starting calculation with responses:', assessmentData.responses);

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses: assessmentData.responses });
        console.log('Team Score calculated:', teamScore);

        const processScore = calculateProcessScore({ responses: assessmentData.responses });
        console.log('Process Score calculated:', processScore);
        
        // Calculate automation potential
        const automationResults = calculateAutomationPotential(assessmentData.responses);
        console.log('Automation results calculated:', automationResults);
        
        // Calculate CAC metrics
        const cacMetrics = calculateCACMetrics(
          assessmentData.responses,
          assessmentData.responses.industry || 'Other'
        );
        console.log('CAC Metrics calculated:', cacMetrics);

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: 0.4 },
          process: { score: processScore.score, weight: 0.4 },
          cac: { score: 1 - (cacMetrics.potentialReduction / 100), weight: 0.2 }
        });

        const transformedData = {
          ...assessmentData,
          qualificationScore: Math.round(totalScore * 100),
          automationPotential: Math.round(automationResults.efficiency.productivity),
          sectionScores: {
            team: { percentage: Math.round(teamScore.score * 100) },
            process: { percentage: Math.round(processScore.score * 100) },
            automation: { percentage: Math.round(cacMetrics.efficiency * 100) }
          },
          results: {
            annual: {
              savings: automationResults.savings.annual,
              hours: automationResults.efficiency.timeReduction * 52
            },
            cac: {
              currentCAC: cacMetrics.currentCAC,
              potentialReduction: Math.round(cacMetrics.potentialReduction),
              annualSavings: cacMetrics.annualSavings,
              automationROI: Math.round(cacMetrics.automationROI * 100)
            }
          }
        };

        console.log('Setting transformed assessment data:', transformedData);
        await setAssessmentData(transformedData);

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
    return <ErrorDisplay error={error} />;
  }

  if (isCalculating) {
    return <LoadingDisplay />;
  }

  return null;
};

export default Calculator;