type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, any>;
  environment: string;
  source?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private isEnabled = true;
  private minLevel: LogLevel = 'info';
  private readonly isDevelopment = import.meta.env.MODE === 'development';
  private readonly environment = import.meta.env.MODE || 'production';

  private constructor() {
    this.setupErrorHandler();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private setupErrorHandler() {
    if (typeof window !== 'undefined') {
      window.onerror = (message, source, lineno, colno, error) => {
        this.error('Uncaught error', {
          message,
          source,
          lineno,
          colno,
          error: error?.stack || error?.message
        });
        return false;
      };

      window.onunhandledrejection = (event) => {
        this.error('Unhandled promise rejection', {
          reason: event.reason
        });
      };
    }
  }

  private log(level: LogLevel, message: string, data?: Record<string, any>, source?: string) {
    if (!this.isEnabled || !this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      environment: this.environment,
      source
    };

    // Always add to internal buffer
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      const prefix = source ? `[${source}]` : '';
      console[consoleMethod](
        `[${entry.timestamp}] [${level.toUpperCase()}]${prefix} ${message}`,
        data || ''
      );
    }

    // Production logging - only send logs to service in production
    if (this.environment === 'production' && level !== 'debug') {
      this.sendToLogService(entry).catch(error => {
        // Only log the error once to avoid cascading errors
        if (!this.isDevelopment) {
          console.error('Failed to send log to service:', error);
        }
      });
    }
  }

  private async sendToLogService(entry: LogEntry) {
    try {
      // Check if we're in development and should skip remote logging
      if (this.isDevelopment) {
        return;
      }
      
      // Import Supabase client dynamically to avoid issues
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Prepare log data for Supabase
      const logData = {
        level: entry.level,
        message: entry.message,
        data: entry.data || null,
        environment: entry.environment,
        source: entry.source || null,
        user_session_id: this.getSessionId(),
        user_agent: this.getUserAgent(),
        url: this.getCurrentUrl(),
      };

      const { error } = await (supabase as any)
        .from('logs')
        .insert([logData]);

      if (error) {
        throw new Error(`Failed to send log to Supabase: ${error.message}`);
      }
    } catch (error: any) {
      // Only throw the error for real database or network issues
      // Avoid throwing errors for expected situations like missing config in dev
      if (error.message && 
          !error.message.includes('Failed to fetch') && 
          !error.message.includes('NetworkError') &&
          !error.message.includes('Invalid API key')) {
        throw error;
      }
      
      // Otherwise, silently fail in development
      if (!this.isDevelopment) {
        console.error('Logging service error:', error);
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private getSessionId(): string {
    // Generate or retrieve session ID for tracking user journey
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('log_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('log_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server-session';
  }

  private getUserAgent(): string {
    return typeof window !== 'undefined' ? window.navigator.userAgent : 'server';
  }

  private getCurrentUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  debug(message: string, data?: Record<string, any>, source?: string) {
    this.log('debug', message, data, source);
  }

  info(message: string, data?: Record<string, any>, source?: string) {
    this.log('info', message, data, source);
  }

  warn(message: string, data?: Record<string, any>, source?: string) {
    this.log('warn', message, data, source);
  }

  error(message: string, data?: Record<string, any>, source?: string) {
    this.log('error', message, data, source);
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getLogs(filter?: {
    level?: LogLevel;
    source?: string;
    startTime?: Date;
    endTime?: Date;
  }): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (filter) {
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      if (filter.source) {
        filteredLogs = filteredLogs.filter(log => log.source === filter.source);
      }
      if (filter.startTime) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= filter.startTime!
        );
      }
      if (filter.endTime) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= filter.endTime!
        );
      }
    }

    return filteredLogs;
  }

  clear() {
    this.logs = [];
  }

  // Assessment-specific logging methods
  assessmentStarted(data?: Record<string, any>) {
    this.info('Assessment started', data, 'assessment');
  }

  assessmentStepCompleted(step: string, data?: Record<string, any>) {
    this.info(`Assessment step completed: ${step}`, data, 'assessment');
  }

  assessmentStepAbandoned(step: string, data?: Record<string, any>) {
    this.warn(`Assessment step abandoned: ${step}`, data, 'assessment');
  }

  assessmentCompleted(data?: Record<string, any>) {
    this.info('Assessment completed', data, 'assessment');
  }

  assessmentError(step: string, error: any, data?: Record<string, any>) {
    this.error(`Assessment error in ${step}`, { error: error.message, ...data }, 'assessment');
  }

  formFieldError(field: string, error: string, data?: Record<string, any>) {
    this.warn(`Form validation error: ${field}`, { error, ...data }, 'form');
  }

  calculationPerformed(type: string, duration: number, data?: Record<string, any>) {
    this.info(`Calculation performed: ${type}`, { duration_ms: duration, ...data }, 'calculation');
  }

  pageView(page: string, data?: Record<string, any>) {
    this.info(`Page viewed: ${page}`, data, 'navigation');
  }

  buttonClick(button: string, context: string, data?: Record<string, any>) {
    this.info(`Button clicked: ${button}`, { context, ...data }, 'interaction');
  }
}

export const logger = Logger.getInstance();
