import React from 'react';
import { Card } from '../../../ui/card';
import { LoadingSpinner } from '../../../ui/loading-spinner';

export const LoadingDisplay: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4">Calculating your optimization score...</p>
      </div>
    </Card>
  );
};