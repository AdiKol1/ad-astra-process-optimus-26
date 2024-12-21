import React from 'react';
import { ResultsVisualization } from './ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { UrgencyBanner } from './UrgencyBanner';
import { MetricCard } from './MetricCard';
import { ReportHeader } from './report/ReportHeader';
import { CallToAction } from './report/CallToAction';

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
      cac?: {
        currentCAC: number;
        potentialReduction: number;
        annualSavings: number;
        automationROI: number;
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
  console.log('InteractiveReport rendering with data:', data);

  const handleBookConsultation = () => {
    window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank');
  };

  // Calculate percentage values for metrics
  const cacReductionPercentage = data.results.cac?.potentialReduction || 0;
  const roiPercentage = data.results.cac?.automationROI || 0;
  const efficiencyGain = data.assessmentScore.automationPotential || 0;

  return (
    <div className="space-y-6">
      <UrgencyBanner score={data.assessmentScore.overall} />
      <ReportHeader userInfo={data.userInfo} />

      <ResultsVisualization 
        assessmentScore={{
          overall: data.assessmentScore.overall,
          automationPotential: efficiencyGain,
          sections: data.assessmentScore.sections
        }}
        results={{
          annual: data.results.annual,
          cac: {
            currentCAC: data.results.cac?.currentCAC || 0,
            potentialReduction: cacReductionPercentage,
            automationROI: roiPercentage,
            annualSavings: data.results.cac?.annualSavings || 0
          }
        }}
      />

      {data.industryAnalysis && (
        <IndustryInsights 
          industryAnalysis={data.industryAnalysis} 
          onBookConsultation={handleBookConsultation} 
        />
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          title="Time Saved"
          value={`${data.results.annual.hours}h`}
          description="Annual hours saved through automation"
          actionPrompt="See how we can save you valuable time"
        />
        <MetricCard
          title="Revenue Growth"
          value={`$${data.results.annual.savings.toLocaleString()}`}
          description="Additional annual revenue through optimization"
          actionPrompt="Learn how to boost your revenue"
        />
        <MetricCard
          title="Efficiency Gain"
          value={`${efficiencyGain}%`}
          description="Potential efficiency improvement"
          actionPrompt="Discover your automation opportunities"
        />
      </div>

      <CallToAction onBookConsultation={handleBookConsultation} />
    </div>
  );
};