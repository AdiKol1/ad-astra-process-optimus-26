import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { ResultsVisualization } from './ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { UrgencyBanner } from './UrgencyBanner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ReportMetrics } from './report/ReportMetrics';
import { useToast } from '@/hooks/use-toast';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assessmentData } = useAssessment();

  console.log('Report Generator - Assessment Data:', assessmentData);

  // Handle case where assessment data is not available
  if (!assessmentData || !assessmentData.results) {
    console.log('No assessment data available');
    toast({
      title: "No assessment data",
      description: "Please complete the assessment first.",
      variant: "destructive",
    });
    navigate('/assessment');
    return null;
  }

  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  const handleGenerateReport = () => {
    navigate('/assessment/report', {
      state: {
        assessmentScore: {
          overall: assessmentData.results.automationPotential || 0,
          sections: {
            process: { percentage: 75 },
            technology: { percentage: 60 },
            team: { percentage: 80 }
          }
        },
        results: assessmentData.results,
        recommendations: {
          recommendations: [
            {
              title: "Process Automation",
              description: "Implement automation for manual data entry tasks",
              impact: "high",
              timeframe: "3-6 months",
              benefits: ["Reduced processing time", "Fewer errors", "Cost savings"]
            }
          ]
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <UrgencyBanner score={assessmentData.results.automationPotential || 0} />

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
            <div className="flex gap-4">
              <Button
                onClick={handleBookConsultation}
                className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
              >
                Book Free Consultation
              </Button>
              <Button
                onClick={handleGenerateReport}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10"
              >
                Generate PDF Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;