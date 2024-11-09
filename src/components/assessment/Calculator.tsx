import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateAssessmentScore } from '@/utils/scoring';
import { calculateAutomationPotential } from '@/utils/calculations';

interface CalculatorProps {
  answers: Record<string, any>;
}

const Calculator: React.FC<CalculatorProps> = ({ answers }) => {
  const assessmentScore = calculateAssessmentScore(answers);
  const results = calculateAutomationPotential(answers);

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

interface CardProps {
  title: string;
  value: number;
  suffix?: string;
}

const ScoreCard: React.FC<CardProps> = ({ title, value, suffix = '%' }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-3xl font-bold text-primary">
        {value}{suffix}
      </div>
    </CardContent>
  </Card>
);

const SavingsCard: React.FC<CardProps> = ({ title, value }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-3xl font-bold text-gold">
        ${value.toLocaleString()}
      </div>
    </CardContent>
  </Card>
);

const EfficiencyCard: React.FC<CardProps> = ({ title, value }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-3xl font-bold text-gold">
        {value}%
      </div>
    </CardContent>
  </Card>
);

interface SectionScoreCardProps {
  title: string;
  score: {
    score: number;
    maxScore: number;
    percentage: number;
    recommendations: string[];
  };
}

const SectionScoreCard: React.FC<SectionScoreCardProps> = ({ title, score }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-2xl font-bold text-primary">
        {Math.round(score.percentage)}%
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        Score: {score.score}/{score.maxScore}
      </div>
      {score.recommendations.length > 0 && (
        <div className="mt-2 text-sm text-muted-foreground">
          <div className="font-medium">Key Recommendations:</div>
          <ul className="list-disc list-inside">
            {score.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
);

export default Calculator;