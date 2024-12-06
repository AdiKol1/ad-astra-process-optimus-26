import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ResultsVisualization } from './ResultsVisualization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportMetrics } from './report/ReportMetrics';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();

  console.log('Report Generator - Assessment Data:', assessmentData);

  // Show loading state while data is being processed
  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle case where assessment data is not available
  if (!assessmentData.results) {
    console.log('No results data available in assessment data');
    return (
      <Card className="p-6 text-center">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Assessment Incomplete</h2>
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