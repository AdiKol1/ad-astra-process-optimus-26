type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  component?: string;
  category?: string;
}

interface LogConfig {
  enabled: boolean;
  minLevel: LogLevel;
  showTimestamp: boolean;
  categories: Set<string>;
  components: Set<string>;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private config: LogConfig = {
    enabled: process.env.NODE_ENV === 'development',
    minLevel: 'info',
    showTimestamp: true,
    categories: new Set(['assessment', 'error']),
    components: new Set(['AssessmentFlow', 'QuestionSection'])
  };

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setConfig(config: Partial<LogConfig>) {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel, category?: string, component?: string): boolean {
    if (!this.config.enabled) return false;
    
    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levelPriority[level] < levelPriority[this.config.minLevel]) return false;
    
    if (category && !this.config.categories.has(category)) return false;
    if (component && !this.config.components.has(component)) return false;
    
    return true;
  }

  private log(level: LogLevel, message: string, data?: any, category?: string, component?: string) {
    if (!this.shouldLog(level, category, component)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      category,
      component
    };

    // Add to internal logs with limit
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Format the log message
    let logMessage = '';
    if (this.config.showTimestamp) {
      logMessage += `[${entry.timestamp}] `;
    }
    logMessage += `[${level.toUpperCase()}]`;
    if (category) {
      logMessage += ` [${category}]`;
    }
    if (component) {
      logMessage += ` [${component}]`;
    }
    logMessage += ` ${message}`;

    // Console output with appropriate styling
    const logFn = level === 'error' ? console.error :
                 level === 'warn' ? console.warn :
                 level === 'debug' ? console.debug :
                 console.log;

    logFn(logMessage, data || '');
  }

  info(message: string, data?: any, category?: string, component?: string) {
    this.log('info', message, data, category, component);
  }

  warn(message: string, data?: any, category?: string, component?: string) {
    this.log('warn', message, data, category, component);
  }

  error(message: string, data?: any, category?: string, component?: string) {
    this.log('error', message, data, category, component);
  }

  debug(message: string, data?: any, category?: string, component?: string) {
    this.log('debug', message, data, category, component);
  }

  getLogs(filter?: {
    level?: LogLevel,
    category?: string,
    component?: string,
    since?: Date
  }): LogEntry[] {
    return this.logs.filter(log => {
      if (filter?.level && log.level !== filter.level) return false;
      if (filter?.category && log.category !== filter.category) return false;
      if (filter?.component && log.component !== filter.component) return false;
      if (filter?.since && new Date(log.timestamp) < filter.since) return false;
      return true;
    });
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
