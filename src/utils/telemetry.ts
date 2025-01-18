interface TelemetryEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface ErrorEvent extends TelemetryEvent {
  error: Error | string;
  stackTrace?: string;
}

export class AssessmentTelemetry {
  private events: TelemetryEvent[] = [];
  private errors: ErrorEvent[] = [];

  constructor(private readonly debug: boolean = false) {}

  trackEvent(event: Omit<TelemetryEvent, 'timestamp'>) {
    const telemetryEvent: TelemetryEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    this.events.push(telemetryEvent);
    
    if (this.debug) {
      console.log('[Telemetry] Event:', telemetryEvent);
    }

    // In production, this would send to your analytics service
    // this.sendToAnalytics(telemetryEvent);
  }

  logError(category: string, error: Error | string, metadata?: Record<string, any>) {
    const errorEvent: ErrorEvent = {
      category,
      action: 'error',
      error,
      stackTrace: error instanceof Error ? error.stack : undefined,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.errors.push(errorEvent);
    
    if (this.debug) {
      console.error('[Telemetry] Error:', errorEvent);
    }

    // In production, this would send to your error tracking service
    // this.sendToErrorTracking(errorEvent);
  }

  trackStepCompletion(step: number, duration: number, success: boolean) {
    this.trackEvent({
      category: 'Assessment',
      action: 'StepComplete',
      label: `Step${step}`,
      value: duration,
      metadata: { success }
    });
  }

  trackValidation(step: number, success: boolean, errorCount: number) {
    this.trackEvent({
      category: 'Assessment',
      action: 'Validation',
      label: `Step${step}`,
      metadata: { success, errorCount }
    });
  }

  // For development/debugging
  getEvents() {
    return this.events;
  }

  getErrors() {
    return this.errors;
  }
}
