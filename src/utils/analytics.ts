type EventData = Record<string, any>;

export const trackEvent = (eventName: string, data: EventData = {}) => {
  // In development, just log the event
  if (import.meta.env.DEV) {
    console.log('[Analytics Event]:', eventName, data);
    return;
  }

  // In production, you would typically send this to your analytics service
  // Example: Google Analytics, Mixpanel, etc.
  try {
    // TODO: Replace with your actual analytics implementation
    console.log('[Analytics Event]:', eventName, data);
  } catch (error) {
    console.error('[Analytics Error]:', error);
  }
};

export const analytics = {
  trackEvent
};
