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
      // Calculate scores and generate insights
      const assessmentScore = calculateAssessmentScore(answers);
      const results = calculateAutomationPotential(answers);
      const recommendations = generateRecommendations(answers);

      // Add industry analysis for audit form submissions
      const industryAnalysis = location.state?.source === 'audit-form' ? {
        benchmarks: {
          'Process Efficiency': '75%',
          'Automation Potential': `${assessmentScore.automationPotential}%`,
          'Cost Savings': 'High'
        },
        opportunities: [
          'Process Standardization',
          'Workflow Automation',
          'Data Integration'
        ]
      } : null;

      const processedData = {
        answers,
        assessmentScore,
        results,
        recommendations,
        industryAnalysis,
        source: location.state?.source
      };

      setAssessmentData(processedData);
      
      // If coming from audit form, automatically proceed to report
      if (location.state?.source === 'audit-form') {
        navigate('/assessment/report', { 
          state: processedData
        });
      }

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

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Processing assessment data...</p>
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
              <h3 className="text-xl font-semibold text-gold">Generate Report</h3>
              <p className="text-sm text-gray-300">
                Get a detailed PDF report with all insights and recommendations.
              </p>
            </div>
            <Button
              onClick={() => navigate('/assessment/report', { state: assessmentData })}
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