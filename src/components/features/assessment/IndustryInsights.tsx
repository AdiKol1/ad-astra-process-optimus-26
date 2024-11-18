import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface IndustryInsightsProps {
  industryAnalysis: {
    benchmarks: {
      averageProcessingTime: string;
      errorRates: string;
      automationLevel: string;
      costSavings: string;
    };
    opportunities: string[];
    risks: string[];
    trends: string[];
  };
  onBookConsultation: () => void;
}

export const IndustryInsights: React.FC<IndustryInsightsProps> = ({ industryAnalysis, onBookConsultation }) => {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Industry Insights</h3>
          <Button
            onClick={onBookConsultation}
            variant="outline"
            className="text-gold border-gold hover:bg-gold/10"
          >
            <Clock className="mr-2 h-4 w-4" />
            Schedule Industry Deep-Dive
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Industry Benchmarks</h4>
            <ul className="space-y-2">
              <li>Processing Time: {industryAnalysis.benchmarks.averageProcessingTime}</li>
              <li>Error Rates: {industryAnalysis.benchmarks.errorRates}</li>
              <li>Automation Level: {industryAnalysis.benchmarks.automationLevel}</li>
              <li>Typical Cost Savings: {industryAnalysis.benchmarks.costSavings}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Key Opportunities</h4>
            <ul className="list-disc list-inside">
              {industryAnalysis.opportunities.map((opportunity, index) => (
                <li key={index} className="text-sm text-muted-foreground">{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium mb-2">Industry Risks</h4>
            <ul className="list-disc list-inside">
              {industryAnalysis.risks.map((risk, index) => (
                <li key={index} className="text-sm text-muted-foreground">{risk}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Current Trends</h4>
            <ul className="list-disc list-inside">
              {industryAnalysis.trends.map((trend, index) => (
                <li key={index} className="text-sm text-muted-foreground">{trend}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};