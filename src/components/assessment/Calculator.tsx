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
    // Check if we have data from audit form
    if (location.state?.answers) {
      const answers = location.state.answers;
      setAssessmentData(answers);
      const results = processAssessmentData(answers);
      setResults(results);
      
      // Navigate to report with processed data
      navigate('/assessment/report', { 
        state: { 
          assessmentScore: results.assessmentScore,
          recommendations: results.recommendations,
          results: results.results
        } 
      });
    } else if (!auditState.assessmentData) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }
  }, [location.state, auditState.assessmentData, navigate, setAssessmentData, setResults, toast]);

  if (!auditState.assessmentData || !auditState.results) {
    return null;
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
              onClick={() => navigate('/assessment/report')}
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