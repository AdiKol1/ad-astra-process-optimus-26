import { logger } from '../logger';

type EventType = 'user_interaction' | 'system' | 'error' | 'performance';

interface TelemetryEvent {
  name: string;
  type: EventType;
  properties?: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

class TelemetryService {
  private sessionId: string;
  private userId?: string;
  private buffer: TelemetryEvent[] = [];
  private readonly maxBufferSize = 100;
  private readonly flushInterval = 30000; // 30 seconds

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.startAutoFlush();
  }

  private startAutoFlush(): void {
    setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  trackEvent(
    name: string,
    type: EventType,
    properties: Record<string, unknown> = {}
  ): void {
    const event: TelemetryEvent = {
      name,
      type,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.buffer.push(event);
    logger.debug('Telemetry event tracked', { event });

    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  trackError(error: Error, properties: Record<string, unknown> = {}): void {
    this.trackEvent('error', 'error', {
      ...properties,
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      // In a real implementation, you would send these events to your telemetry service
      logger.info('Flushing telemetry events', {
        eventCount: events.length,
        sessionId: this.sessionId
      });

      // Example of how to send to a telemetry service:
      // await fetch('/api/telemetry', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events })
      // });
    } catch (error) {
      logger.error('Failed to flush telemetry events', {
        error,
        eventCount: events.length
      });
      
      // Put the events back in the buffer
      this.buffer = [...events, ...this.buffer].slice(0, this.maxBufferSize);
    }
  }

  async dispose(): Promise<void> {
    await this.flush();
  }
}

export const telemetry = new TelemetryService();
