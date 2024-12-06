import React from 'react';
import { MetricCard } from '../MetricCard';

interface ReportMetricsProps {
  results: {
    annual: {
      hours: number;
      savings: number;
    };
  };
  assessmentScore: {
    automationPotential: number;
  };
}

export const ReportMetrics: React.FC<ReportMetricsProps> = ({ results, assessmentScore }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <MetricCard
        title="Time Saved"
        value={`${results.annual.hours}h`}
        description="Annual hours saved through automation"
        actionPrompt="See how we can save you valuable time"
      />
      <MetricCard
        title="Revenue Growth"
        value={`$${results.annual.savings.toLocaleString()}`}
        description="Additional annual revenue through optimization"
        actionPrompt="Learn how to boost your revenue"
      />
      <MetricCard
        title="Efficiency Gain"
        value={`${assessmentScore.automationPotential}%`}
        description="Potential efficiency improvement"
        actionPrompt="Discover your automation opportunities"
      />
    </div>
  );
};