import { logger } from '../logger';

interface TelemetryEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
}

class Telemetry {
  private static instance: Telemetry;
  private eventBuffer: TelemetryEvent[] = [];
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds
  private readonly BUFFER_SIZE = 100;
  private isEnabled = true;

  private constructor() {
    this.setupPeriodicFlush();
  }

  static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  private setupPeriodicFlush() {
    setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }

  private async flush() {
    if (this.eventBuffer.length === 0) return;

    try {
      // In development, just log to console
      if (import.meta.env.DEV) {
        console.log('Telemetry events:', this.eventBuffer);
        this.eventBuffer = [];
        return;
      }

      // In production, would send to analytics service
      // await this.sendToAnalytics(this.eventBuffer);
      this.eventBuffer = [];
    } catch (error) {
      logger.error('Failed to flush telemetry events:', { error });
    }
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const event: TelemetryEvent = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString()
    };

    this.eventBuffer.push(event);
    
    if (this.eventBuffer.length >= this.BUFFER_SIZE) {
      this.flush();
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log('Telemetry event:', event);
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

export const telemetry = Telemetry.getInstance(); 