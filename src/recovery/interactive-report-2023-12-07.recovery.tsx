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
    assessmentScore: {
      overall: number;
      automationPotential: number;
      sections?: Record<string, any>;
    };
    results: {
      annual: {
        savings: number;
        hours: number;
      };
    };
    recommendations?: any;
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
  console.log('InteractiveReport rendering with data:', data);

  // Ensure we have the required data with fallbacks
  const defaultData = {
    assessmentScore: {
      overall: 0,
      automationPotential: 0,
      sections: {}
    },
    results: {
      annual: {
        savings: 0,
        hours: 0
      }
    }
  };

  // Merge provided data with defaults
  const safeData = {
    ...defaultData,
    ...data,
    results: {
      ...defaultData.results,
      ...data.results
    },
    assessmentScore: {
      ...defaultData.assessmentScore,
      ...data.assessmentScore
    }
  };

  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  const handleGenerateReport = () => {
    navigate('/assessment/report', {
      state: {
        assessmentScore: safeData.assessmentScore,
        recommendations: safeData.recommendations,
        results: safeData.results
      }
    });
  };

  return (
    <div className="space-y-6">
      <UrgencyBanner score={safeData.assessmentScore.overall} />

      {safeData.userInfo && (
        <Card className="bg-space-light">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">Process Audit Report</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Prepared for: {safeData.userInfo.name}</p>
              <p className="text-sm text-gray-300">Contact: {safeData.userInfo.email}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <ResultsVisualization 
        assessmentScore={safeData.assessmentScore}
        results={safeData.results}
      />

      {safeData.industryAnalysis && (
        <IndustryInsights 
          industryAnalysis={safeData.industryAnalysis} 
          onBookConsultation={handleBookConsultation} 
        />
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          title="Time Saved"
          value={`${safeData.results.annual.hours}h`}
          description="Annual hours saved through automation"
          actionPrompt="See how we can save you valuable time"
        />
        <MetricCard
          title="Revenue Growth"
          value={`$${safeData.results.annual.savings.toLocaleString()}`}
          description="Additional annual revenue through optimization"
          actionPrompt="Learn how to boost your revenue"
        />
        <MetricCard
          title="Efficiency Gain"
          value={`${safeData.assessmentScore.automationPotential}%`}
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
