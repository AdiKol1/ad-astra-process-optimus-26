import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateAssessmentScore, type AssessmentScore } from '@/utils/scoring';
import { calculateAutomationPotential, type CalculationResults } from '@/utils/calculations';
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
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

interface AssessmentData {
  answers: Record<string, any>;
  assessmentScore: AssessmentScore;
  results: CalculationResults;
  recommendations: {
    recommendations: Array<{
      title: string;
      description: string;
      impact: string;
      timeframe: string;
      benefits: string[];
    }>;
  };
  industryAnalysis: IndustryAnalysis | null;
}

const Calculator = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    if (!location.state?.answers) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      navigate('/assessment', { replace: true });
      return;
    }

    try {
      const { answers } = location.state;
      const assessmentScore = calculateAssessmentScore(answers);
      const results = calculateAutomationPotential(answers);
      const recommendations = generateRecommendations(answers);

      setAssessmentData({
        answers,
        assessmentScore,
        results,
        recommendations,
        industryAnalysis: null
      });

      const fetchIndustryAnalysis = async () => {
        if (answers.industry) {
          const analysis = await getIndustryAnalysis(answers.industry);
          setIndustryAnalysis(analysis);
          setAssessmentData(prev => ({
            ...prev!,
            industryAnalysis: analysis
          }));
          setTimeout(() => setShowBookingPrompt(true), 2000);
        }
      };

      fetchIndustryAnalysis();
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was an error processing your assessment data.",
        variant: "destructive",
      });
      navigate('/assessment', { replace: true });
    }
  }, [location.state, toast, navigate]);

  const handleBookConsultation = () => {
    window.open('https://calendly.com/your-booking-link', '_blank');
    toast({
      title: "Booking Started",
      description: "Opening our consultation booking calendar...",
    });
  };

  const handleGenerateReport = () => {
    if (!assessmentData) return;
    
    navigate('/assessment/report', { 
      state: { ...assessmentData },
      replace: true
    });
  };

  if (!assessmentData) {
    return <Navigate to="/assessment" replace />;
  }

  const { assessmentScore, results, recommendations } = assessmentData;

  return (
    <div className="space-y-6 p-6">
      {showBookingPrompt && (
        <BookingPrompt onBookConsultation={handleBookConsultation} />
      )}

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
              <h3 className="text-xl font-semibold text-gold">Generate Your Report</h3>
              <p className="text-sm text-gray-300">
                Get a detailed PDF report with all insights and recommendations.
              </p>
            </div>
            <Button
              onClick={handleGenerateReport}
              className="bg-gold hover:bg-gold-light text-space px-8"
            >
              Generate Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;