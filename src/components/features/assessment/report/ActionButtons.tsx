import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { telemetry } from '@/utils/monitoring/telemetry';
import { CALENDAR_URL } from '@/constants/urls';
import { useAssessmentStore } from '@/stores/assessment';

interface ActionButtonsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ActionButtons: React.FC<ActionButtonsProps> = React.memo(({ ...props }) => {
  const navigate = useNavigate();
  const { results } = useAssessmentStore();

  const handleBookConsultation = React.useCallback(() => {
    telemetry.track('consultation_booked', {
      hasResults: !!results,
      timestamp: new Date().toISOString()
    });
    // Open Google Calendar with UTM parameters for tracking
    const consultationUrl = `${CALENDAR_URL}?utm_source=app&utm_medium=action_buttons&utm_campaign=process_assessment`;
    window.open(consultationUrl, '_blank', 'noopener,noreferrer');
  }, [results]);

  const handleGenerateReport = React.useCallback(() => {
    telemetry.track('pdf_report_generated', {
      hasResults: !!results,
      timestamp: new Date().toISOString()
    });
    navigate('/assessment/report', {
      state: { generatePdf: true }
    });
  }, [navigate, results]);

  return (
    <div className="flex gap-4" {...props}>
      <Button
        onClick={handleBookConsultation}
        className="bg-gold hover:bg-gold-light text-space whitespace-nowrap"
        aria-label="Book a free consultation session"
      >
        Book Free Consultation
      </Button>
      <Button
        onClick={handleGenerateReport}
        variant="outline"
        className="border-gold text-gold hover:bg-gold/10"
        aria-label="Generate and download PDF report"
      >
        Generate PDF Report
      </Button>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';