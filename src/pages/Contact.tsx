import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/validation/assessment';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/LoadingState';
import { Helmet } from 'react-helmet-async';
import { leadService } from '@/services/leads/leadService';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Track the form submission
      telemetry.track('contact_form_submitted', {
        hasCompany: !!data.company,
        hasPhone: !!data.phone,
        messageLength: data.message?.length || 0,
        timestamp: new Date().toISOString()
      });

      // Create lead in database
      const leadData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        source: 'contact_page',
        sourceDetails: {
          form_type: 'contact_form',
          message: data.message,
          submitted_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer
        },
        utmData: {
          source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
          medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
        }
      };

      logger.info('Creating lead from contact form', { email: data.email });
      const createdLead = await leadService.createLead(leadData);
      logger.info('Contact lead created successfully', { leadId: createdLead.id, email: data.email });

      // Add activity for the message
      if (data.message) {
        await leadService.addActivity({
          lead_id: createdLead.id,
          activity_type: 'note_added',
          title: 'Contact form message',
          description: data.message,
          automated: false,
          metadata: {
            form_type: 'contact_form',
            submitted_via: 'website'
          }
        });
      }

      // Show success message
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      reset();

      // Track successful submission
      telemetry.track('contact_lead_created', {
        leadId: createdLead.id,
        source: 'contact_page',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error submitting contact form', { error, email: data.email });
      telemetry.track('contact_form_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: data.email,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitting) {
    return <LoadingState message="Sending message..." />;
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Ad Astra Process Optimus</title>
        <meta name="description" content="Get in touch with us for your process automation needs" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg mb-8">
          We're here to help with your process automation journey. Reach out to us today.
        </p>
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                id="company"
                {...register('company')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                rows={4}
                {...register('message')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;