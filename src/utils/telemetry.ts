import { logger } from './logger';

interface TelemetryEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  sessionId: string;
  type: 'track' | 'page' | 'identify';
  severity: 'info' | 'warn' | 'error';
}

class Telemetry {
  private static instance: Telemetry;
  private events: TelemetryEvent[] = [];
  private readonly MAX_EVENTS = 1000;
  private sessionId: string;

  private constructor() {
    this.sessionId = crypto.randomUUID();
  }

  public static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  public track(
    name: string, 
    properties: Record<string, any> = {}, 
    severity: TelemetryEvent['severity'] = 'info'
  ): void {
    const event: TelemetryEvent = {
      name,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'track',
      severity
    };

    this.events.push(event);
    
    // Keep only the last MAX_EVENTS
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      logger.info('Telemetry event:', event);
    }

    // Send to analytics service
    this.sendToAnalytics(event).catch(error => {
      logger.error('Failed to send telemetry event', { error, event });
    });
  }

  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  private async sendToAnalytics(event: TelemetryEvent): Promise<void> {
    // TODO: Implement actual analytics service integration
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export const telemetry = Telemetry.getInstance();
