import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { handleBoundaryError } from '@/utils/errors/base';
import { isErrorMonitoringEnabled } from '@/utils/env';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle error with our error system
    if (errorInfo.componentStack) {
      handleBoundaryError(error, { componentStack: errorInfo.componentStack });
    } else {
      handleBoundaryError(error, { componentStack: 'No component stack available' });
    }

    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Call custom reset handler if provided
    this.props.onReset?.();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Alert variant="destructive" className="mb-6 max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              {error?.message || 'An unexpected error occurred.'}
            </p>
            {isErrorMonitoringEnabled() && (
              <p className="text-sm text-muted-foreground">
                This error has been logged and our team will investigate.
              </p>
            )}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button
            onClick={this.handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={this.handleReload}
            className="flex items-center gap-2"
          >
            Reload Page
          </Button>

          {errorInfo?.componentStack && (
            <pre className="mt-4 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-[200px]">
              {errorInfo.componentStack}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
