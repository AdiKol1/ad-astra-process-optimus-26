export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const Analytics = {
  startSession: () => {
    const sessionStartTime = Date.now();
    console.log('Session started', { timestamp: sessionStartTime });
  },
  
  trackEvent: (event: AnalyticsEvent) => {
    console.log('Tracking event:', event);
  }
};

export const trackFormFieldInteraction = (
  fieldName: string, 
  action: 'focus' | 'blur' | 'change' | 'error',
  metadata?: Record<string, any>
) => {
  Analytics.trackEvent({
    category: 'Form_Field',
    action: `${fieldName}_${action}`,
    metadata: {
      fieldName,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  });
};

export const trackLeadInteraction = (event: {
  category: 'Lead';
  action: 'Form_Start' | 'Form_Complete' | 'Form_Abandon';
  metadata: {
    formStep?: string;
    industry?: string;
    companySize?: string;
    timeSpent?: number;
  };
}) => {
  Analytics.trackEvent({
    ...event,
    label: `${event.action}_${event.metadata.formStep || 'unknown'}`,
  });
};