import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: {
    title: string;
    description: string;
    impact: string;
    timeframe: string;
    benefits: string[];
  };
  onBookConsultation: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onBookConsultation }) => (
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
      <div className="mt-4 flex items-center justify-between">
        <Badge variant="outline">
          {recommendation.timeframe} implementation
        </Badge>
        <Button
          variant="link"
          onClick={onBookConsultation}
          className="text-gold hover:text-gold-light"
        >
          Discuss Implementation <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);