import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { SpotsCounter } from '@/components/ui/spots-counter';

export const UrgencyBanner = ({ score }: { score: number }) => {
  // Ensure score is a valid number and calculate industry comparison
  const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  const industryComparison = Math.min(Math.max(65, Math.round(validScore * 1.2)), 95);
  
  console.log('UrgencyBanner rendering with score:', score, 'calculated comparison:', industryComparison);
  
  return (
    <div className="bg-gold/10 border-l-4 border-gold p-4 mb-6 rounded-r-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-gold" />
          <p className="text-sm md:text-base">
            Your business shows higher automation potential than {industryComparison}% of your industry
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <SpotsCounter totalSpots={50} remainingSpots={7} />
          <Button 
            className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
            onClick={() => window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank')}
          >
            Claim Free Strategy Session
          </Button>
        </div>
      </div>
    </div>
  );
};