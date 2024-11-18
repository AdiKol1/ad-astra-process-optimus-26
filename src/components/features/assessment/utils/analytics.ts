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
const ANALYTICS_CONFIG = {
  debugMode: process.env.NODE_ENV === 'development',
  trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
};

// Helper function to log events in debug mode
const debugLog = (message: string, data?: any) => {
  if (ANALYTICS_CONFIG.debugMode) {
    console.log(`[Analytics Debug] ${message}`, data || '');
  }
};

// Main analytics tracking function
export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    if (typeof window === 'undefined') return;

    const { category, action, label, value, metadata } = event;

    // Log to Google Analytics
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...metadata,
    });

    debugLog('Event tracked', { category, action, label, value, metadata });
  } catch (error) {
    debugLog('Error tracking event', error);
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
let sessionStartTime: number;

export const startSession = (): void => {
  sessionStartTime = Date.now();
  trackEvent({
    category: 'Session',
    action: 'Start',
    metadata: {
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    },
  });
};

export const endSession = (): void => {
  const sessionDuration = Date.now() - sessionStartTime;
  trackEvent({
    category: 'Session',
    action: 'End',
    value: Math.floor(sessionDuration / 1000), // Convert to seconds
    metadata: {
      duration: sessionDuration,
      timestamp: new Date().toISOString(),
    },
  });
};

// Utility function to track form field interactions
export const trackFormFieldInteraction = (
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
};

// Export a convenience object with all tracking functions
export const Analytics = {
  trackEvent,
  trackLeadInteraction,
  trackAssessmentProgress,
  trackFormFieldInteraction,
  startSession,
  endSession,
};