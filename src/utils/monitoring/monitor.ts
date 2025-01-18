import { logger } from '@/utils/logger';
import { performanceMonitor } from '@/utils/performance/monitor';

interface ErrorEvent {
  type: string;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface MetricEvent {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  timestamp: string;
}

interface UserEvent {
  type: string;
  userId?: string;
  action: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class MonitoringService {
  private static instance: MonitoringService;
  private errorBuffer: ErrorEvent[] = [];
  private metricBuffer: MetricEvent[] = [];
  private userEventBuffer: UserEvent[] = [];
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds
  private readonly BUFFER_SIZE = 100;

  private constructor() {
    this.setupPeriodicFlush();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private setupPeriodicFlush() {
    setInterval(() => {
      this.flushBuffers();
    }, this.FLUSH_INTERVAL);
  }

  private async flushBuffers() {
    if (
      this.errorBuffer.length === 0 &&
      this.metricBuffer.length === 0 &&
      this.userEventBuffer.length === 0
    ) {
      return;
    }

    try {
      await this.sendToAnalytics({
        errors: [...this.errorBuffer],
        metrics: [...this.metricBuffer],
        userEvents: [...this.userEventBuffer],
      });

      // Clear buffers after successful send
      this.errorBuffer = [];
      this.metricBuffer = [];
      this.userEventBuffer = [];
    } catch (error) {
      logger.error('Failed to flush monitoring buffers:', error);
    }
  }

  private async sendToAnalytics(data: {
    errors: ErrorEvent[];
    metrics: MetricEvent[];
    userEvents: UserEvent[];
  }) {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send analytics data');
      }
    } catch (error) {
      logger.error('Analytics API error:', error);
      throw error;
    }
  }

  // Error monitoring
  trackError(error: Error, metadata?: Record<string, any>) {
    const errorEvent: ErrorEvent = {
      type: error.name,
      message: error.message,
      stack: error.stack,
      metadata,
      timestamp: new Date().toISOString(),
    };

    this.errorBuffer.push(errorEvent);
    logger.error('Error tracked:', errorEvent);

    if (this.errorBuffer.length >= this.BUFFER_SIZE) {
      this.flushBuffers();
    }
  }

  // Metric monitoring
  trackMetric(name: string, value: number, unit: string, tags?: Record<string, string>) {
    const metricEvent: MetricEvent = {
      name,
      value,
      unit,
      tags,
      timestamp: new Date().toISOString(),
    };

    this.metricBuffer.push(metricEvent);

    if (this.metricBuffer.length >= this.BUFFER_SIZE) {
      this.flushBuffers();
    }
  }

  // User event monitoring
  trackUserEvent(action: string, userId?: string, metadata?: Record<string, any>) {
    const userEvent: UserEvent = {
      type: 'user_action',
      userId,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    };

    this.userEventBuffer.push(userEvent);

    if (this.userEventBuffer.length >= this.BUFFER_SIZE) {
      this.flushBuffers();
    }
  }

  // Performance monitoring integration
  trackPerformance(name: string, duration: number) {
    this.trackMetric(name, duration, 'ms', { type: 'performance' });
  }
}

export const monitor = MonitoringService.getInstance();
