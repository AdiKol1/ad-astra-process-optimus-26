import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ResultsVisualization } from './ResultsVisualization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportMetrics } from './report/ReportMetrics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { calculateAutomationPotential } from '@/utils/calculations';
import { useToast } from '@/hooks/use-toast';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { assessmentData } = useAssessment();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = React.useState(true);
  
  console.log('Report Generator - Initial Assessment Data:', assessmentData);

  React.useEffect(() => {
    if (!assessmentData) {
      console.log('No assessment data available, redirecting to assessment');
      navigate('/assessment');
      return;
    }

    const generateResults = async () => {
      try {
        setIsCalculating(true);
        console.log('Generating results from assessment data:', assessmentData);

        // Calculate results using the assessment data
        const calculationResults = calculateAutomationPotential({
          employees: assessmentData.processDetails.employees.toString(),
          timeSpent: assessmentData.processes.timeSpent.toString(),
          processVolume: assessmentData.processDetails.processVolume,
          errorRate: assessmentData.processes.errorRate,
          industry: assessmentData.processDetails.industry
        });

        console.log('Calculation results:', calculationResults);

        // Update assessment data with results if they don't exist
        if (!assessmentData.results) {
          assessmentData.results = {
            annual: {
              savings: calculationResults.savings.annual,
              hours: calculationResults.efficiency.timeReduction * 52
            },
            automationPotential: calculationResults.efficiency.productivity,
            roi: calculationResults.savings.annual / (calculationResults.costs.projected || 1)
          };
        }

        setIsCalculating(false);
      } catch (error) {
        console.error('Error generating results:', error);
        toast({
          title: "Error Generating Report",
          description: "There was a problem generating your report. Please try again.",
          variant: "destructive",
        });
        navigate('/assessment');
      }
    };

    generateResults();
  }, [assessmentData, navigate, toast]);

  // Show loading state while data is being processed
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if we have valid responses and results
  const hasValidResponses = assessmentData?.processDetails && 
                          Object.keys(assessmentData.processDetails).length > 0;
  const hasResults = assessmentData?.results;

  // If no valid responses, show incomplete message
  if (!hasValidResponses) {
    return (
      <Card className="p-6 text-center">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Assessment Incomplete</h2>
          <p className="text-muted-foreground mb-6">
            Please complete the assessment to view your personalized report.
          </p>
          <Button onClick={() => navigate('/assessment')}>
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If we have responses but no results, redirect to assessment
  if (!hasResults) {
    console.log('No results data available, redirecting to assessment');
    navigate('/assessment');
    return null;
  }

  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  return (
    <div className="space-y-6">
      <ResultsVisualization 
        assessmentScore={{
          overall: assessmentData.results.automationPotential || 0,
          sections: {
            process: { percentage: 75 },
            technology: { percentage: 60 },
            team: { percentage: 80 }
          }
        }}
        results={assessmentData.results}
      />

      <ReportMetrics 
        results={assessmentData.results.annual}
        assessmentScore={{
          automationPotential: assessmentData.results.automationPotential || 0
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