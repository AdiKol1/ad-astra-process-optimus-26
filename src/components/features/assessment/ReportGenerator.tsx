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

  // Transform responses into the expected format
  const transformResponses = (responses: Record<string, any>) => {
    console.log('Transforming responses:', responses);
    
    // Extract employee count from teamSize array
    const employeeCount = responses.teamSize?.[0]?.split(' ')?.[0]?.split('-')?.[0] || '1';
    
    // Extract hours from timeSpent array
    const timeSpent = responses.timeSpent?.[0]?.split(' ')?.[0] || '10';
    
    // Extract error rate
    const errorRate = responses.errorRate?.[0] || '1-5% errors';
    
    return {
      processDetails: {
        employees: parseInt(employeeCount),
        processVolume: responses.processVolume || '100-500',
        industry: responses.industry || 'Other',
        timeline: responses.timelineExpectation || '3_months'
      },
      processes: {
        manualProcesses: responses.manualProcesses || [],
        timeSpent: parseInt(timeSpent),
        errorRate: errorRate
      },
      team: {
        teamSize: parseInt(employeeCount),
        departments: ['Operations']
      },
      technology: {
        currentSystems: responses.toolStack || ['Spreadsheets'],
        integrationNeeds: []
      },
      challenges: {
        painPoints: responses.marketingChallenges || [],
        priority: 'Efficiency'
      },
      goals: {
        objectives: ['Process automation'],
        expectedOutcomes: ['Reduced processing time']
      }
    };
  };

  React.useEffect(() => {
    if (!assessmentData?.responses) {
      console.log('No assessment data available, redirecting to assessment');
      navigate('/assessment');
      return;
    }

    const generateResults = async () => {
      try {
        setIsCalculating(true);
        console.log('Generating results from assessment data:', assessmentData);

        // Transform the responses first
        const transformedData = transformResponses(assessmentData.responses);
        console.log('Transformed data:', transformedData);

        // Calculate results using the transformed data
        const calculationResults = calculateAutomationPotential({
          employees: transformedData.processDetails.employees.toString(),
          timeSpent: transformedData.processes.timeSpent.toString(),
          processVolume: transformedData.processDetails.processVolume,
          errorRate: transformedData.processes.errorRate,
          industry: transformedData.processDetails.industry
        });

        console.log('Calculation results:', calculationResults);

        const results = {
          annual: {
            savings: calculationResults.savings.annual,
            hours: calculationResults.efficiency.timeReduction * 52
          },
          automationPotential: calculationResults.efficiency.productivity,
          roi: calculationResults.savings.annual / (calculationResults.costs.projected || 1)
        };

        // Store the results in state
        setIsCalculating(false);
        return results;

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

  // Check if we have valid responses
  const hasValidResponses = assessmentData?.responses && 
                          Object.keys(assessmentData.responses).length > 0;

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

  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  // Calculate mock scores for visualization
  const mockScores = {
    overall: 75,
    sections: {
      process: { percentage: 75 },
      technology: { percentage: 60 },
      team: { percentage: 80 }
    }
  };

  // Use mock results until real calculations are implemented
  const mockResults = {
    annual: {
      savings: 50000,
      hours: 520
    }
  };

  return (
    <div className="space-y-6">
      <ResultsVisualization 
        assessmentScore={mockScores}
        results={mockResults}
      />

      <ReportMetrics 
        results={mockResults}
        assessmentScore={{
          automationPotential: mockScores.overall
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