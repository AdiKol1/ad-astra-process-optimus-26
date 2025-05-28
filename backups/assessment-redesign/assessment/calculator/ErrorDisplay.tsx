import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="text-center text-red-600">
        <h3 className="text-lg font-semibold">Error</h3>
        <p>{error}</p>
        <Button 
          onClick={() => navigate('/assessment')}
          className="mt-4"
          variant="destructive"
        >
          Return to Assessment
        </Button>
      </div>
    </Card>
  );
};