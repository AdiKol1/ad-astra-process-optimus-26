import React from 'react';
import { ResultsVisualization } from './ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { RecommendationCard } from './RecommendationCard';
import { SectionScoreCard } from './ScoreCards';
import { BookingPrompt } from './BookingPrompt';
import { Card, CardContent } from '@/components/ui/card';

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
  const handleBookConsultation = () => {
    window.open('https://calendly.com/your-booking-link', '_blank');
  };

  return (
    <div className="space-y-6">
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
      
      <div className="grid md:grid-cols-2 gap-6">
        {data.recommendations.recommendations.map((rec: any, index: number) => (
          <RecommendationCard 
            key={index} 
            recommendation={rec}
            onBookConsultation={handleBookConsultation}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data.assessmentScore.sections).map(([sectionId, section]: [string, any]) => (
          <SectionScoreCard
            key={sectionId}
            title={sectionId.replace(/([A-Z])/g, ' $1').trim()}
            score={section.percentage}
          />
        ))}
      </div>

      <BookingPrompt onBookConsultation={handleBookConsultation} />
    </div>
  );
};