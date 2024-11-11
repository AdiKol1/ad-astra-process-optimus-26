import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const UrgencyBanner = ({ score }: { score: number }) => (
  <div className="bg-gold/10 border-l-4 border-gold p-4 mb-6 rounded-r-lg flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <AlertTriangle className="h-5 w-5 text-gold" />
      <p className="text-sm md:text-base">
        Your business shows higher automation potential than {score}% of your industry
      </p>
    </div>
    <Button 
      className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
      onClick={() => window.open('https://calendly.com/your-booking-link', '_blank')}
    >
      Claim Free Strategy Session
    </Button>
  </div>
);