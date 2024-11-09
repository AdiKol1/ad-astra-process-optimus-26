import React from 'react';
import { ResultsVisualization } from './ResultsVisualization';
import { IndustryInsights } from './IndustryInsights';
import { RecommendationCard } from './RecommendationCard';
import { SectionScoreCard } from './ScoreCards';
import { BookingPrompt } from './BookingPrompt';

interface InteractiveReportProps {
  data: {
    assessmentScore: any;
    results: any;
    recommendations: any;
    industryAnalysis?: any;
  };
}

export const InteractiveReport: React.FC<InteractiveReportProps> = ({ data }) => {
  const handleBookConsultation = () => {
    window.open('https://calendly.com/your-booking-link', '_blank');
  };

  return (
    <div className="space-y-6">
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