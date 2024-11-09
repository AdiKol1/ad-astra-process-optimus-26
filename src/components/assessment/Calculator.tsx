import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateAssessmentScore } from '@/utils/scoring';
import { calculateAutomationPotential } from '@/utils/calculations';
import { generateRecommendations } from '@/utils/recommendations';
import { ScoreCard, SavingsCard, EfficiencyCard, SectionScoreCard } from './ScoreCards';
import { ResultsVisualization } from './ResultsVisualization';
import { getIndustryAnalysis, type IndustryAnalysis } from '@/utils/industryAnalysis';
import { useToast } from '@/components/ui/use-toast';

interface CalculatorProps {
  answers: Record<string, any>;
}

const Calculator: React.FC<CalculatorProps> = ({ answers }) => {
  const { toast } = useToast();
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null);
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
      }
    };

    fetchIndustryAnalysis();
  }, [answers.industry, toast]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <ScoreCard 
          title="Overall Assessment Score"
          value={assessmentScore.overall}
          suffix="%"
        />
        <SavingsCard 
          title="Potential Annual Savings"
          value={results.savings.annual}
        />
        <EfficiencyCard 
          title="Automation Potential"
          value={assessmentScore.automationPotential}
        />
      </div>

      <ResultsVisualization 
        assessmentScore={assessmentScore}
        results={results}
      />

      {industryAnalysis && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Industry Insights</h3>
            
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
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} />
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
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: {
    title: string;
    description: string;
    impact: string;
    timeframe: string;
    benefits: string[];
  };
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{recommendation.title}</h3>
        <Badge variant={recommendation.impact === 'high' ? 'destructive' : 'secondary'}>
          {recommendation.impact}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
      <div className="text-sm">
        <div className="font-medium mb-1">Benefits:</div>
        <ul className="list-disc list-inside space-y-1">
          {recommendation.benefits.map((benefit, index) => (
            <li key={index} className="text-muted-foreground">{benefit}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <Badge variant="outline">
          {recommendation.timeframe} implementation
        </Badge>
      </div>
    </CardContent>
  </Card>
);

export default Calculator;