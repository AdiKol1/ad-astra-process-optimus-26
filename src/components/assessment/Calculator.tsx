import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateAssessmentScore } from '@/utils/scoring';
import { calculateAutomationPotential } from '@/utils/calculations';
import { generateRecommendations } from '@/utils/recommendations';
import { ResultsVisualization } from './ResultsVisualization';
import { getIndustryAnalysis, type IndustryAnalysis } from '@/utils/industryAnalysis';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import { CalculatorHeader } from './CalculatorHeader';
import { IndustryInsights } from './IndustryInsights';
import { RecommendationCard } from './RecommendationCard';
import { BookingPrompt } from './BookingPrompt';
import { SectionScoreCard } from './ScoreCards';

interface CalculatorProps {
  answers: Record<string, any>;
}

const Calculator: React.FC<CalculatorProps> = ({ answers }) => {
  const { toast } = useToast();
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);
  const assessmentScore = calculateAssessmentScore(answers);
  const results = calculateAutomationPotential(answers);
  const recommendations = generateRecommendations(answers);

  useEffect(() => {
    const fetchIndustryAnalysis = async () => {
      if (answers.industry) {
        toast({
          title: "Analyzing Industry Data",
          description: "Fetching real-time insights for your industry...",
        });
        
        const analysis = await getIndustryAnalysis(answers.industry);
        setIndustryAnalysis(analysis);
        
        toast({
          title: "Analysis Complete",
          description: "Industry-specific insights are now available in your report.",
        });

        setTimeout(() => setShowBookingPrompt(true), 2000);
      }
    };

    fetchIndustryAnalysis();
  }, [answers.industry, toast]);

  const handleBookConsultation = () => {
    window.open('https://calendly.com/your-booking-link', '_blank');
    toast({
      title: "Booking Started",
      description: "Opening our consultation booking calendar...",
    });
  };

  return (
    <div className="space-y-6">
      {showBookingPrompt && <BookingPrompt onBookConsultation={handleBookConsultation} />}

      <CalculatorHeader 
        assessmentScore={assessmentScore} 
        results={results}
        showBookingPrompt={showBookingPrompt}
        onBookConsultation={handleBookConsultation}
      />

      <ResultsVisualization 
        assessmentScore={assessmentScore}
        results={results}
      />

      {industryAnalysis && (
        <IndustryInsights 
          industryAnalysis={industryAnalysis} 
          onBookConsultation={handleBookConsultation} 
        />
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.recommendations.map((rec, index) => (
          <RecommendationCard 
            key={index} 
            recommendation={rec}
            onBookConsultation={handleBookConsultation}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(assessmentScore.sections).map(([sectionId, section]) => (
          <SectionScoreCard
            key={sectionId}
            title={sectionId.replace(/([A-Z])/g, ' $1').trim()}
            score={section.percentage}
          />
        ))}
      </div>

      <Card className="bg-space-light mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gold">Take Action Now</h3>
              <p className="text-sm text-gray-300">
                Don't let potential savings slip away. Book your free consultation to start optimizing today.
              </p>
            </div>
            <Button
              onClick={handleBookConsultation}
              className="bg-gold hover:bg-gold-light text-space px-8"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;