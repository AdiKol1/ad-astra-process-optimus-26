import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { isErrorMonitoringEnabled } from '@/utils/env';

/**
 * Base error class for application-wide errors
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly severity: 'low' | 'medium' | 'high';
  public readonly metadata: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    options: {
      code?: string;
      severity?: 'low' | 'medium' | 'high';
      metadata?: Record<string, any>;
    } = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code || 'UNKNOWN_ERROR';
    this.severity = options.severity || 'medium';
    this.metadata = options.metadata || {};
    this.timestamp = new Date().toISOString();

    // Ensure proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get error details for logging and monitoring
   */
  public getErrorDetails() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      metadata: this.metadata,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(
    message = 'Network error occurred',
    options: {
      code?: string;
      severity?: 'low' | 'medium' | 'high';
      metadata?: Record<string, any>;
    } = {}
  ) {
    super(message, {
      code: options.code || 'NETWORK_ERROR',
      severity: options.severity || 'high',
      metadata: options.metadata,
    });
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    fields: Record<string, string>,
    options: {
      code?: string;
      severity?: 'low' | 'medium' | 'high';
      metadata?: Record<string, any>;
    } = {}
  ) {
    super(message, {
      code: options.code || 'VALIDATION_ERROR',
      severity: options.severity || 'medium',
      metadata: {
        ...options.metadata,
        fields,
      },
    });
  }
}

/**
 * Business logic errors
 */
export class BusinessError extends AppError {
  constructor(
    message: string,
    options: {
      code?: string;
      severity?: 'low' | 'medium' | 'high';
      metadata?: Record<string, any>;
      rule?: string;
      impact?: string;
    } = {}
  ) {
    super(message, {
      code: options.code || 'BUSINESS_ERROR',
      severity: options.severity || 'high',
      metadata: {
        ...options.metadata,
        rule: options.rule,
        impact: options.impact,
      },
    });
  }
}

/**
 * Central error handler
 */
export function handleError(
  error: Error | AppError,
  context?: string
): ReturnType<AppError['getErrorDetails']> {
  // Convert to AppError if needed
  const appError = error instanceof AppError
    ? error
    : new AppError(error.message, {
        code: 'UNKNOWN_ERROR',
        severity: 'high',
        metadata: { originalError: error },
      });

  // Add context if provided
  if (context) {
    appError.metadata.context = context;
  }

  // Get error details
  const errorDetails = appError.getErrorDetails();

  // Log error
  logger.error('Error occurred:', errorDetails);

  // Track error if monitoring is enabled
  if (isErrorMonitoringEnabled()) {
    telemetry.track('error_occurred', errorDetails);
  }

  // Return error details for potential UI display
  return errorDetails;
}

/**
 * Error boundary handler
 */
export function handleBoundaryError(
  error: Error,
  errorInfo: { componentStack: string }
): void {
  const appError = new AppError(error.message, {
    code: 'BOUNDARY_ERROR',
    severity: 'high',
    metadata: {
      componentStack: errorInfo.componentStack,
      originalError: error,
    },
  });

  handleError(appError, 'ErrorBoundary');
}

/**
 * Async error wrapper
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(String(error)), context);
    throw error;
  }
} 