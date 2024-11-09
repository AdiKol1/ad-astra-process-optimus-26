import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ValuePreviewProps {
  answers: Record<string, any>;
  step: number;
}

export const ValuePreview: React.FC<ValuePreviewProps> = ({ answers, step }) => {
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Current Progress</h3>
        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} questions answered
        </div>
      </CardContent>
    </Card>
  );
};