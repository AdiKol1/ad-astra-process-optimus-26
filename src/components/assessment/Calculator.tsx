import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateAutomationPotential } from '@/utils/calculations';
import { calculateAssessmentScore } from '@/utils/scoring';
import { InteractiveReport } from './InteractiveReport';

const Calculator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { auditState, setResults, setAssessmentData } = useAssessment();

  useEffect(() => {
    if (!auditState.assessmentData && !location.state?.assessmentData) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    // Process assessment data if we don't have results yet
    if (!auditState.results && (auditState.assessmentData || location.state?.assessmentData)) {
      const assessmentData = auditState.assessmentData || location.state.assessmentData;
      
      try {
        // Calculate scores based on actual assessment data
        const assessmentScore = calculateAssessmentScore(assessmentData);
        
        // Calculate automation potential and savings based on actual data
        const calculatedResults = calculateAutomationPotential({
          employees: assessmentData.processDetails.employees,
          timeSpent: assessmentData.processes.timeSpent,
          processVolume: assessmentData.processDetails.processVolume,
          errorRate: assessmentData.processes.errorRate
        });

        setAssessmentData(assessmentData);
        setResults({
          assessmentScore: {
            overall: assessmentScore.overall,
            automationPotential: assessmentScore.automationPotential,
            sections: assessmentScore.sections
          },
          results: {
            annual: {
              savings: calculatedResults.savings.annual,
              hours: calculatedResults.efficiency.timeReduction * 52 // Convert weekly hours to annual
            }
          },
          recommendations: {
            recommendations: [
              {
                title: "Implement Process Automation",
                description: `Based on your ${assessmentData.processes.manualProcesses.join(", ")} processes`,
                impact: calculatedResults.savings.annual > 50000 ? "high" : "medium",
                timeframe: assessmentData.processDetails.timeline,
                benefits: [
                  `${calculatedResults.efficiency.timeReduction} hours saved weekly`,
                  `${calculatedResults.efficiency.errorReduction}% error reduction`,
                  `$${calculatedResults.savings.annual.toLocaleString()} annual savings`
                ]
              }
            ]
          }
        });
        
        toast({
          title: "Assessment Processed",
          description: "Your audit data has been analyzed successfully.",
        });
      } catch (error) {
        console.error('Error processing assessment:', error);
        toast({
          title: "Processing Error",
          description: "There was an error processing your assessment data.",
          variant: "destructive",
        });
        navigate('/assessment');
      }
    }
  }, [location.state, navigate, setAssessmentData, setResults, toast, auditState]);

  if (!auditState.results) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Processing assessment data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <InteractiveReport data={auditState.results} />
    </div>
  );
};

export default Calculator;