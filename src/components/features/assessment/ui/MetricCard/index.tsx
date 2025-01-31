import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  actionPrompt: string;
}

export const MetricCard = ({ title, value, description, actionPrompt }: MetricCardProps) => (
  <Card className="bg-space-light/50 hover:bg-space-light/70 transition-all">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gold mb-2">{value}</p>
      <p className="text-sm text-gray-300 mb-4">{description}</p>
      <div className="border-t border-gray-700 pt-4">
        <p className="text-sm mb-3">{actionPrompt}</p>
        <Button 
          variant="link" 
          className="text-gold hover:text-gold-light p-0 h-auto font-normal"
          onClick={() => window.open('https://calendly.com/your-booking-link', '_blank')}
        >
          Book Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);