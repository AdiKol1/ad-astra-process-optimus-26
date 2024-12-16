import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AssessmentErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Assessment Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
          <p className="text-gray-300 text-center max-w-md">
            We encountered an error while processing your assessment. Please try again or contact support if the issue persists.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/assessment'}
              className="bg-gold hover:bg-gold-light text-space"
            >
              Restart Assessment
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}