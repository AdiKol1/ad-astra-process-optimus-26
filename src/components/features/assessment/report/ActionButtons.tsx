import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onBookConsultation: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onBookConsultation }) => {
  const navigate = useNavigate();

  const handleGenerateReport = () => {
    navigate('/assessment/report', {
      state: { generatePdf: true }
    });
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={onBookConsultation}
        className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
      >
        Book Free Consultation
      </Button>
      <Button
        onClick={handleGenerateReport}
        variant="outline"
        className="border-gold text-gold hover:bg-gold/10"
      >
        Generate PDF Report
      </Button>
    </div>
  );
};