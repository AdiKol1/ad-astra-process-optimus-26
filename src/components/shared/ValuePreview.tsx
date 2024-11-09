import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ValuePreviewProps {
  answers: Record<string, any>;
  step: number;
}

export const ValuePreview: React.FC<ValuePreviewProps> = ({ answers, step }) => {
  const totalAnswered = Object.keys(answers).length;
  
  return (
    <Card className="mt-6 bg-white/5 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="font-medium mb-4 text-lg">Assessment Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Questions Answered</span>
            <span className="font-medium">{totalAnswered}</span>
          </div>
          <Progress value={totalAnswered * 10} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {totalAnswered > 0 
              ? "Keep going! You're making great progress."
              : "Start answering questions to track your progress."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};