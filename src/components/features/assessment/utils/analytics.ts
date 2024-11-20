// Types for analytics events
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// Types for lead interaction events
export interface LeadInteractionEvent extends AnalyticsEvent {
  category: 'Lead';
  action: 'Form_Start' | 'Form_Complete' | 'Form_Abandon';
  metadata: {
    formStep?: string;
    industry?: string;
    companySize?: string;
    timeSpent?: number;
  };
}

// Types for assessment interaction events
export interface AssessmentEvent extends AnalyticsEvent {
  category: 'Assessment';
  action: 'Start' | 'Complete' | 'Skip' | 'Section_Complete';
  metadata: {
    sectionName?: string;
    completionTime?: number;
    score?: number;
    recommendations?: string[];
  };
}

// Initialize Google Analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Analytics configuration
const analyticsConfig = {
  debugMode: import.meta.env.DEV,
  trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
};

// Helper function to log events in debug mode
const debugLog = (message: string, data?: any) => {
  if (analyticsConfig.debugMode) {
    console.log(`[Analytics Debug] ${message}`, data || '');
  }
};

// Main analytics tracking function
export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  debugLog('Tracking event:', event);
  
  // In development, just log the event
  if (analyticsConfig.debugMode) {
    return;
  }

  try {
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Specific tracking functions for different event types
export const trackLeadInteraction = (event: LeadInteractionEvent): Promise<void> => {
  return trackEvent({
    ...event,
    label: `${event.action}_${event.metadata.formStep || 'unknown'}`,
  });
};

export const trackAssessmentProgress = (event: AssessmentEvent): Promise<void> => {
  return trackEvent({
    ...event,
    label: event.metadata.sectionName,
    value: event.metadata.score,
  });
};

// User session tracking
let sessionStartTime: number = Date.now();

export const Analytics = {
  startSession: () => {
    sessionStartTime = Date.now();
    debugLog('Session started');
  },
  
  endSession: () => {
    const sessionDuration = Date.now() - sessionStartTime;
    debugLog('Session ended', { duration: sessionDuration });
    
    if (!analyticsConfig.debugMode && window.gtag) {
      window.gtag('event', 'session_end', {
        event_category: 'Session',
        value: sessionDuration,
      });
    }
  },
  
  trackEvent,
  trackLeadInteraction,
  trackAssessmentProgress,
  trackFormFieldInteraction: (
    fieldName: string,
    action: 'focus' | 'blur' | 'change' | 'error',
    metadata?: Record<string, any>
  ): Promise<void> => {
    return trackEvent({
      category: 'Form_Field',
      action: `${fieldName}_${action}`,
      metadata: {
        fieldName,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  },
};