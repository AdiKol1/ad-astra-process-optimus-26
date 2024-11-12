import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download } from 'lucide-react';

export const TimedOffer = () => {
  return (
    <Card className="bg-gold/10 border-gold">
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gold">
              <Clock className="h-5 w-5" />
              <h3 className="font-semibold">Limited Time Offer</h3>
            </div>
            <p className="text-sm text-gray-300">
              Book now to receive a free process mapping session worth $1,500
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
              onClick={() => window.open('https://calendar.app.google/1ZWN8cgfZTRXr7yb6', '_blank')}
            >
              15-Min Discovery Call
            </Button>
            <Button
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10"
              onClick={() => {/* Handle PDF download */}}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};