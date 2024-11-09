import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateAssessmentScore } from '@/utils/scoring';
import { calculateAutomationPotential } from '@/utils/calculations';
import { generateRecommendations } from '@/utils/recommendations';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InteractiveReport } from './InteractiveReport';

const Calculator = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<any>(null);

  useEffect(() => {
    // Check for both assessment flow data and audit form data
    const answers = location.state?.answers;
    if (!answers) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    try {
      // Process the data regardless of its source (audit form or assessment)
      const assessmentScore = calculateAssessmentScore(answers);
      const results = calculateAutomationPotential(answers);
      const recommendations = generateRecommendations(answers);

      setAssessmentData({
        answers,
        assessmentScore,
        results,
        recommendations,
        // Include source information
        source: location.state?.source || 'audit-form'
      });

    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "There was an error processing your assessment data.",
        variant: "destructive",
      });
      navigate('/assessment');
    }
  }, [location.state, toast, navigate]);

  const handleGeneratePDF = () => {
    if (!assessmentData) return;
    
    navigate('/assessment/report', { 
      state: { ...assessmentData }
    });
  };

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading assessment results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <InteractiveReport data={assessmentData} />
      
      <Card className="bg-space-light mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gold">Download Report</h3>
              <p className="text-sm text-gray-300">
                Get a detailed PDF report with all insights and recommendations.
              </p>
            </div>
            <Button
              onClick={handleGeneratePDF}
              className="bg-gold hover:bg-gold-light text-space px-8"
            >
              Generate PDF <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;