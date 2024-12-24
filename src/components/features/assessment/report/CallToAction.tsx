import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActionButtons } from './ActionButtons';

interface CallToActionProps {
  onBookConsultation: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onBookConsultation }) => {
  return (
    <Card className="bg-space-light/50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gold">Ready to Transform Your Operations?</h3>
            <p className="text-sm text-gray-300">
              Book a free strategy session (worth $1,500) to discuss your custom optimization plan
            </p>
          </div>
          <ActionButtons onBookConsultation={onBookConsultation} />
        </div>
      </CardContent>
    </Card>
  );
};