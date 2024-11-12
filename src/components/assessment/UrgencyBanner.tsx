import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const UrgencyBanner = ({ score }: { score: number }) => {
  // Calculate industry comparison - showing a percentage between 65-95 based on the assessment score
  const industryComparison = Math.min(Math.max(65, Math.round(score * 1.2)), 95);
  
  return (
    <div className="bg-gold/10 border-l-4 border-gold p-4 mb-6 rounded-r-lg flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-5 w-5 text-gold" />
        <p className="text-sm md:text-base">
          Your business shows higher automation potential than {industryComparison}% of your industry
        </p>
      </div>
      <Button 
        className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
        onClick={() => window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank')}
      >
        Claim Free Strategy Session
      </Button>
    </div>
  );
};