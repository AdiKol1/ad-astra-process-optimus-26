import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

interface BookingPromptProps {
  onBookConsultation: () => void;
}

export const BookingPrompt: React.FC<BookingPromptProps> = ({ onBookConsultation }) => (
  <Card className="bg-gold/10 border-gold">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gold">Ready to Maximize Your Potential?</h3>
          <p className="text-sm text-gray-300">
            Book a free strategy session to discuss your custom optimization plan worth $1,500
          </p>
        </div>
        <Button
          onClick={onBookConsultation}
          className="bg-gold hover:bg-gold-light text-space px-6"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Book Free Consultation
        </Button>
      </div>
    </CardContent>
  </Card>
);