import { logger } from '../logger';

interface TelemetryEvent {
  name: string;
  type: 'track' | 'page' | 'identify';
  properties: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

class TelemetryService {
  private events: TelemetryEvent[] = [];
  private readonly maxBufferSize = 100;
  private readonly flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => this.flush(), this.flushInterval);
  }

  track(name: string, properties: Record<string, any> = {}): void {
    const event: TelemetryEvent = {
      name,
      type: 'track',
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.events.push(event);
    logger.debug('Telemetry event tracked:', { event });

    if (this.events.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.events.length === 0) {
      return;
    }

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      logger.info('Flushing telemetry events:', {
        count: eventsToSend.length,
        sessionId: this.sessionId
      });

      // In a real implementation, we would send the events to a telemetry service
      // For now, we just log them
      logger.debug('Telemetry events:', { events: eventsToSend });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to flush telemetry events:', {
        error: errorMessage,
        count: eventsToSend.length
      });

      // Put the events back in the buffer
      this.events = [...eventsToSend, ...this.events].slice(0, this.maxBufferSize);
    }
  }

  dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush().catch(error => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to flush telemetry events during disposal:', {
        error: errorMessage
      });
    });
  }
}

export const telemetry = new TelemetryService();
