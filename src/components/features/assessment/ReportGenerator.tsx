import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ResultsVisualization } from './ResultsVisualization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportMetrics } from './report/ReportMetrics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { transformAssessmentData, calculateResults } from './report/ReportDataTransformer';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { assessmentData } = useAssessment();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [results, setResults] = React.useState<any>(null);
  
  console.log('Report Generator - Initial Assessment Data:', assessmentData);

  React.useEffect(() => {
    if (!assessmentData?.responses || Object.keys(assessmentData.responses).length === 0) {
      console.log('No assessment data available, redirecting to assessment');
      toast({
        title: "Assessment Incomplete",
        description: "Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    try {
      console.log('Starting report generation with responses:', assessmentData.responses);
      
      // Transform responses into the expected format
      const transformedData = transformAssessmentData(assessmentData.responses);
      console.log('Transformed assessment data:', transformedData);
      
      // Calculate results using the transformed data
      const calculatedResults = calculateResults(transformedData);
      console.log('Calculation results:', calculatedResults);
      
      setResults(calculatedResults);
      setIsCalculating(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error Generating Report",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive",
      });
      navigate('/assessment');
    }
  }, [assessmentData, navigate, toast]);

  // Show loading state while data is being processed
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  return (
    <div className="space-y-6">
      <ResultsVisualization 
        assessmentScore={results.assessmentScore}
        results={results.results}
      />

      <ReportMetrics 
        results={results.results}
        assessmentScore={{
          automationPotential: results.assessmentScore.automationPotential
        }}
      />

      <Card className="bg-space-light/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gold">Ready to Transform Your Operations?</h3>
              <p className="text-sm text-gray-300">
                Book a free strategy session (worth $1,500) to discuss your custom optimization plan
              </p>
            </div>
            <Button
              onClick={handleBookConsultation}
              className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
            >
              Book Free Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;