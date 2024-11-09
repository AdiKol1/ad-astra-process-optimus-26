import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateAssessmentScore } from '@/utils/scoring';
import { calculateAutomationPotential } from '@/utils/calculations';
import { generateRecommendations } from '@/utils/recommendations';

interface CalculatorProps {
  answers: Record<string, any>;
}

const Calculator: React.FC<CalculatorProps> = ({ answers }) => {
  const assessmentScore = calculateAssessmentScore(answers);
  const results = calculateAutomationPotential(answers);
  const recommendations = generateRecommendations(answers);

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
      
      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(assessmentScore.sections).map(([sectionId, score]) => (
          <SectionScoreCard
            key={sectionId}
            title={sectionId.replace(/([A-Z])/g, ' $1').trim()}
            score={score}
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
