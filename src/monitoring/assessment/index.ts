import { ErrorInfo } from 'react';
import * as Sentry from '@sentry/react';
import { Analytics } from '@segment/analytics-next';
import { datadogRum } from '@datadog/browser-rum';

// Initialize monitoring services with fallbacks
const initializeSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (dsn) {
    Sentry.init({
      dsn,
      integrations: [
        new Sentry.BrowserTracing()
      ],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  }
};

const initializeAnalytics = () => {
  const writeKey = import.meta.env.VITE_SEGMENT_WRITE_KEY;
  if (writeKey) {
    return new Analytics({ writeKey });
  }
  return null;
};

const initializeDatadog = () => {
  const applicationId = import.meta.env.VITE_DD_APPLICATION_ID;
  const clientToken = import.meta.env.VITE_DD_CLIENT_TOKEN;
  
  if (applicationId && clientToken) {
    datadogRum.init({
      applicationId,
      clientToken,
      site: 'datadoghq.com',
      service: 'assessment-flow',
      env: import.meta.env.MODE,
      version: import.meta.env.VITE_APP_VERSION,
      trackInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
    });
  }
};

// Initialize services
initializeSentry();
const analytics = initializeAnalytics();
initializeDatadog();

// Performance monitoring
export interface PerformanceMetrics {
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
}

export interface UserJourneyMetrics {
  stepStartTime: number;
  stepCompletionTime: number;
  stepId: string;
  interactionCount: number;
  errorCount: number;
  hesitationTime: number;
}

export interface ErrorMetrics {
  errorType: string;
  message: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, any>;
}

class AssessmentMonitoring {
  private static instance: AssessmentMonitoring;
  private currentStep: string = '';
  private stepStartTime: number = 0;
  private interactionCount: number = 0;
  private errorCount: number = 0;

  private constructor() {
    this.initializePerformanceObserver();
  }

  static getInstance(): AssessmentMonitoring {
    if (!AssessmentMonitoring.instance) {
      AssessmentMonitoring.instance = new AssessmentMonitoring();
    }
    return AssessmentMonitoring.instance;
  }

  private initializePerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // LCP observer
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackLCP(lastEntry as any);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID observer
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => this.trackFID(entry as any));
      }).observe({ entryTypes: ['first-input'] });

      // CLS observer
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => this.trackCLS(entry as any));
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  trackError(error: Error, errorInfo?: ErrorInfo): void {
    this.errorCount++;
    const errorMetrics: ErrorMetrics = {
      errorType: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      metadata: this.getUserContext()
    };

    // Report to monitoring services
    Sentry.captureException(error, { extra: errorMetrics });
    analytics?.track('Assessment Error', errorMetrics);
    datadogRum.addError(error, { errorMetrics });
  }

  trackInteraction(interactionType: string, details: Record<string, any>): void {
    this.interactionCount++;
    const interactionData = {
      ...details,
      currentStep: this.currentStep,
      timestamp: Date.now(),
      ...this.getUserContext()
    };

    analytics?.track('Assessment Interaction', interactionData);
    datadogRum.addAction(interactionType, interactionData);
  }

  private getUserContext(): Record<string, any> {
    return {
      currentStep: this.currentStep,
      stepDuration: Date.now() - this.stepStartTime,
      interactionCount: this.interactionCount,
      errorCount: this.errorCount,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  private trackLCP(entry: any): void {
    datadogRum.addTiming('LCP', entry.startTime);
  }

  private trackFID(entry: any): void {
    datadogRum.addTiming('FID', entry.processingStart - entry.startTime);
  }

  private trackCLS(entry: any): void {
    datadogRum.addTiming('CLS', entry.value);
  }

  getMetricsSummary(): Record<string, any> {
    return {
      ...this.getUserContext(),
      performanceMetrics: {
        // Add performance metrics here
      }
    };
  }
}

export const monitoring = AssessmentMonitoring.getInstance();
export default monitoring;
