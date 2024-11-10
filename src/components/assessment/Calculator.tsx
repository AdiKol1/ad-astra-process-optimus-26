import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { transformAuditFormData } from '@/utils/assessmentFlow';
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
      const data = auditState.assessmentData || location.state.assessmentData;
      
      try {
        const transformedData = transformAuditFormData(data);
        setAssessmentData(transformedData);
        setResults({
          assessmentScore: {
            overall: 75,
            automationPotential: 85,
            sections: {
              processDetails: { percentage: 80 },
              technology: { percentage: 70 },
              processes: { percentage: 75 }
            }
          },
          results: {
            annual: {
              savings: 50000,
              hours: 2080
            }
          },
          recommendations: {
            recommendations: [
              {
                title: "Implement Process Automation",
                description: "Automate manual data entry processes",
                impact: "high",
                timeframe: "3 months",
                benefits: ["Time savings", "Error reduction"]
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
      
      <Card className="bg-space-light mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gold">Generate Report</h3>
              <p className="text-sm text-gray-300">
                Get a detailed PDF report with all insights and recommendations.
              </p>
            </div>
            <Button
              onClick={() => navigate('/assessment/report', {
                state: {
                  assessmentScore: auditState.results.assessmentScore,
                  recommendations: auditState.results.recommendations,
                  results: auditState.results.results
                }
              })}
              className="bg-gold hover:bg-gold-light text-space px-8"
            >
              Generate PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;