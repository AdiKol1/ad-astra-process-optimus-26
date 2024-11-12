import React from 'react';
import { ResultsVisualization } from './ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { UrgencyBanner } from './UrgencyBanner';
import { MetricCard } from './MetricCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface InteractiveReportProps {
  data: {
    assessmentScore: any;
    results: any;
    recommendations: any;
    industryAnalysis?: any;
    userInfo?: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export const InteractiveReport: React.FC<InteractiveReportProps> = ({ data }) => {
  const navigate = useNavigate();
  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  const handleGenerateReport = () => {
    navigate('/assessment/report', {
      state: {
        assessmentScore: data.assessmentScore,
        recommendations: data.recommendations,
        results: data.results
      }
    });
  };

  return (
    <div className="space-y-6">
      <UrgencyBanner score={data.assessmentScore.overall} />

      {data.userInfo && (
        <Card className="bg-space-light">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">Process Audit Report</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Prepared for: {data.userInfo.name}</p>
              <p className="text-sm text-gray-300">Contact: {data.userInfo.email}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <ResultsVisualization 
        assessmentScore={data.assessmentScore}
        results={data.results}
      />

      {data.industryAnalysis && (
        <IndustryInsights 
          industryAnalysis={data.industryAnalysis} 
          onBookConsultation={handleBookConsultation} 
        />
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          title="Time Savings"
          value={`${data.results.annual.hours}h`}
          description="Annual hours saved through automation"
          actionPrompt="See how we can save you valuable time"
        />
        <MetricCard
          title="Cost Reduction"
          value={`$${data.results.annual.savings.toLocaleString()}`}
          description="Projected annual cost savings"
          actionPrompt="Learn how to reduce operational costs"
        />
        <MetricCard
          title="Efficiency Gain"
          value={`${data.assessmentScore.automationPotential}%`}
          description="Potential efficiency improvement"
          actionPrompt="Discover your automation opportunities"
        />
      </div>

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