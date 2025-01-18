import React, { Component, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, Bug, Wifi, Calculator, FileWarning } from 'lucide-react';
import { useMonitoring } from '@/hooks/useMonitoring';
import { assessmentMonitor } from '@/utils/monitoring/assessmentMonitor';
import { useToast } from '@/hooks/use-toast';
import { CalculationError, DataValidationError, BusinessLogicError } from '@/utils/errors/assessmentErrors';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorType: 'network' | 'validation' | 'calculation' | 'business' | 'state' | 'unknown';
}

const ERROR_MESSAGES = {
  network: {
    title: 'Connection Error',
    description: 'We\'re having trouble connecting to our servers. Your progress has been saved locally.',
    icon: Wifi,
    severity: 'high'
  },
  validation: {
    title: 'Data Validation Error',
    description: 'There was an issue with your responses. We\'ve saved your progress and you can try again.',
    icon: AlertTriangle,
    severity: 'medium'
  },
  calculation: {
    title: 'Calculation Error',
    description: 'There was an error processing your business metrics. Our team has been notified.',
    icon: Calculator,
    severity: 'high'
  },
  business: {
    title: 'Business Rule Violation',
    description: 'Your input violates important business rules. Please review and try again.',
    icon: FileWarning,
    severity: 'high'
  },
  state: {
    title: 'Application Error',
    description: 'Something went wrong with the application state. We\'ve logged this issue.',
    icon: Bug,
    severity: 'medium'
  },
  unknown: {
    title: 'Unexpected Error',
    description: 'An unexpected error occurred. Our team has been notified.',
    icon: AlertTriangle,
    severity: 'high'
  },
};

export class AssessmentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Determine error type based on error class
    let errorType = 'unknown';
    
    if (error instanceof CalculationError) {
      errorType = 'calculation';
    } else if (error instanceof DataValidationError) {
      errorType = 'validation';
    } else if (error instanceof BusinessLogicError) {
      errorType = 'business';
    } else if (error.name === 'NetworkError') {
      errorType = 'network';
    } else if (error.name === 'StateError') {
      errorType = 'state';
    }
    
    return {
      hasError: true,
      error,
      errorType,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Save error details
    this.setState({
      error,
      errorInfo,
    });

    // Get error configuration
    const errorConfig = ERROR_MESSAGES[this.state.errorType];

    // Track in monitoring system with business context
    const { trackError } = useMonitoring({
      componentName: 'AssessmentErrorBoundary',
    });

    // Track general error
    trackError('assessment_error', {
      error,
      errorInfo,
      errorType: this.state.errorType,
      severity: errorConfig.severity,
      timestamp: new Date().toISOString(),
      componentStack: errorInfo.componentStack,
    });

    // Track business impact
    if (error instanceof CalculationError) {
      assessmentMonitor.trackDataQuality('calculations', {
        passed: false,
        errors: [error.message],
        metadata: error.metadata
      });
    } 
    else if (error instanceof BusinessLogicError) {
      assessmentMonitor.trackBusinessMetrics({
        currentStep: -1,
        totalSteps: -1,
        responses: {},
        completed: false
      }, {
        error_type: 'business_logic',
        rule: error.metadata.rule,
        impact: error.metadata.impact,
        affected_metrics: error.metadata.affectedMetrics
      });
    }
  }

  handleRetry = () => {
    try {
      // Track retry attempt
      assessmentMonitor.trackUserEngagement('error_retry', {
        errorType: this.state.errorType,
        errorMessage: this.state.error?.message
      });

      // Clear error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });

      const { toast } = useToast();
      toast({
        title: 'Recovering...',
        description: 'Attempting to restore your progress.',
      });

      this.forceUpdate();
    } catch (retryError) {
      this.setState({
        error: retryError as Error,
        errorType: 'unknown',
      });

      // Track retry failure
      assessmentMonitor.trackUserEngagement('error_retry_failed', {
        originalErrorType: this.state.errorType,
        newError: retryError?.message
      });
    }
  };

  render() {
    const { hasError, errorType } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    const errorConfig = ERROR_MESSAGES[errorType];
    const ErrorIcon = errorConfig.icon;

    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Alert variant="destructive" className="mb-6 max-w-md">
          <ErrorIcon className="h-5 w-5" />
          <AlertTitle>{errorConfig.title}</AlertTitle>
          <AlertDescription>
            {errorConfig.description}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button
            onClick={this.handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            If the problem persists, please contact support with error code:{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {this.state.error?.name || 'UNKNOWN'}-{Date.now().toString(36)}
            </code>
          </p>
        </div>
      </div>
    );
  }
}
