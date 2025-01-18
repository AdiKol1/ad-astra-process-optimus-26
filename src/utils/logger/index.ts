import { telemetry } from '../monitoring/telemetry';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private readonly maxLogSize = 1000;
  private logs: LogEntry[] = [];
  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private currentLogLevel: LogLevel = 'info';

  constructor() {
    // Set log level based on environment
    if (process.env.NODE_ENV === 'development') {
      this.currentLogLevel = 'debug';
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.currentLogLevel];
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  private addLogEntry(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }
  }

  public setLogLevel(level: LogLevel) {
    this.currentLogLevel = level;
  }

  public debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, data);
      this.addLogEntry(entry);
      console.debug(message, data);
    }
  }

  public info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, data);
      this.addLogEntry(entry);
      console.info(message, data);
      telemetry.trackEvent('log_info', { message, data });
    }
  }

  public warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, data);
      this.addLogEntry(entry);
      console.warn(message, data);
      telemetry.trackEvent('log_warning', { message, data });
    }
  }

  public error(message: string, error?: Error, data?: any) {
    if (this.shouldLog('error')) {
      const entry = this.createLogEntry('error', message, { error, ...data });
      this.addLogEntry(entry);
      console.error(message, error, data);
      telemetry.trackError(error || new Error(message), { ...data });
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }

  public async exportLogs(): Promise<string> {
    const exportData = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      logs: this.logs
    };
    return JSON.stringify(exportData, null, 2);
  }
}

export const logger = new Logger();
