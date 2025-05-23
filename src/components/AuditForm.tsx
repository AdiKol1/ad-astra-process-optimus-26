import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { useAuditForm } from '@/contexts/AuditFormContext';
import { FormFields } from './audit/FormFields';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { leadService } from '@/services/leads/leadService';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import type { AuditFormData } from '@/types/assessment';

const AuditForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAssessmentData } = useAssessment();
  const { closeAuditForm } = useAuditForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formProgress, setFormProgress] = React.useState(0);
  
  const { control, handleSubmit, watch } = useForm<AuditFormData>({
    defaultValues: {
      employees: '',
      processVolume: '',
      industry: '',
      timelineExpectation: ''
    }
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      const filledFields = Object.values(value).filter(Boolean).length;
      const totalFields = Object.keys(value).length;
      setFormProgress((filledFields / totalFields) * 100);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: AuditFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create a basic lead record for the CTA interaction
      // Note: This form doesn't collect name/email, so we create a minimal lead
      const leadData = {
        name: 'CTA User', // Placeholder - will be updated in assessment
        email: 'pending@assessment.com', // Placeholder - will be updated
        source: 'hero_cta',
        sourceDetails: {
          form_type: 'hero_cta_modal',
          submitted_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer
        },
        businessContext: {
          companySize: data.employees,
          processVolume: data.processVolume,
          timeline: data.timelineExpectation,
        },
        industry: data.industry,
        utmData: {
          source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
          medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
        }
      };

      // Track the interaction
      telemetry.track('hero_cta_submitted', {
        industry: data.industry,
        employees: data.employees,
        processVolume: data.processVolume,
        timeline: data.timelineExpectation,
        timestamp: new Date().toISOString()
      });

      // Create a lead record to track the CTA interaction
      try {
        logger.info('Creating CTA lead record', { source: 'hero_cta' });
        const createdLead = await leadService.createLead(leadData);
        logger.info('CTA lead created successfully', { leadId: createdLead.id });

        // Store the lead ID for later updates when we get real contact info
        if (setAssessmentData) {
          setAssessmentData({
            leadId: createdLead.id,
            responses: data
          });
        }
      } catch (leadError) {
        // If lead creation fails, log it but continue
        logger.warn('Failed to create CTA lead, continuing with assessment', { error: leadError });
        telemetry.track('cta_lead_creation_failed', {
          error: leadError instanceof Error ? leadError.message : 'Unknown error'
        });
      }

      // Start the assessment flow
      navigate('/assessment');
      closeAuditForm();
      
      toast({
        title: "Starting Assessment",
        description: "Let's begin optimizing your processes.",
      });
    } catch (error: any) {
      logger.error('Error in CTA form submission', { error });
      telemetry.track('cta_form_error', {
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Error",
        description: error.message || "There was a problem starting your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-space-light p-6 rounded-lg shadow-xl">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Form Progress</span>
          <span>{Math.round(formProgress)}%</span>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>

      <FormFields control={control} />

      <Button 
        type="submit"
        className="w-full bg-gold hover:bg-gold-light text-space font-semibold transition-colors duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4" />
            Processing...
          </div>
        ) : (
          'Start Free Assessment'
        )}
      </Button>
    </form>
  );
};

export default AuditForm;