import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../../../contexts/AssessmentContext';
import { calculateTeamScore } from './calculator/TeamScoreCalculator';
import { calculateProcessScore } from './calculator/ProcessScoreCalculator';
import { calculateWeightedScore } from './calculator/utils';
import { ErrorDisplay } from './calculator/ErrorDisplay';
import { LoadingDisplay } from './calculator/LoadingDisplay';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!assessmentData) {
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        setIsCalculating(true);
        const responses = assessmentData.responses;

        // Calculate section scores
        const teamScore = calculateTeamScore({ responses });
        const processScore = calculateProcessScore({ responses });

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: 0.5 },
          process: { score: processScore.score, weight: 0.5 }
        });

        // Calculate implementation cost based on company size and process complexity
        const baseImplementationCost = 25000; // Reduced base cost for better ROI accuracy
        const employeeCount = Number(responses.employees) || 1;
        const processVolume = responses.processVolume || '100-500';
        
        // Scale implementation cost based on company size
        const sizeMultiplier = employeeCount <= 5 ? 1 :
                              employeeCount <= 20 ? 1.3 :
                              employeeCount <= 50 ? 1.6 :
                              employeeCount <= 100 ? 2 : 2.5;

        // Scale based on process volume
        const volumeMultiplier = {
          'Less than 100': 0.8,
          '100-500': 1,
          '501-1000': 1.2,
          '1001-5000': 1.5,
          'More than 5000': 1.8
        }[processVolume] || 1;

        const implementationCost = baseImplementationCost * sizeMultiplier * volumeMultiplier;
        
        // Calculate 3-year ROI to better reflect long-term value
        const annualSavings = processScore.savings?.annual || 0;
        const threeYearSavings = annualSavings * 3; // Consider 3 years of benefits
        const roiPercentage = ((threeYearSavings - implementationCost) / implementationCost) * 100;

        console.log('ROI Calculation:', {
          baseImplementationCost,
          sizeMultiplier,
          volumeMultiplier,
          implementationCost,
          annualSavings,
          threeYearSavings,
          roiPercentage
        });

        setAssessmentData({
          ...assessmentData,
          scores: {
            team: teamScore,
            process: processScore,
            total: totalScore,
            roi: roiPercentage
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while calculating scores');
        console.error('Error calculating scores:', err);
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

  return null; // Results will be shown by ReportGenerator
};

export default Calculator;