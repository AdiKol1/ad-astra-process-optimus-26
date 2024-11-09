import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { processAssessmentData } from '@/utils/assessmentFlow';
import { InteractiveReport } from './InteractiveReport';

const Calculator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { auditState, setResults, setAssessmentData } = useAssessment();

  useEffect(() => {
    console.log('Location state:', location.state); // Debug log
    console.log('Current audit state:', auditState); // Debug log

    if (!location.state && !auditState.assessmentData) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    // Process assessment data if it exists in location state
    if (location.state?.assessmentData) {
      const data = location.state.assessmentData;
      console.log('Processing new assessment data:', data); // Debug log
      
      try {
        const results = processAssessmentData(data);
        console.log('Processed results:', results); // Debug log
        
        setAssessmentData(data);
        setResults(results);
        
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
  }, [location.state, auditState.assessmentData, navigate, setAssessmentData, setResults, toast]);

  if (!auditState.results) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Processing assessment data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <InteractiveReport 
        data={auditState.results}
      />
      
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