import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/assessment/AssessmentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { calculateResults } from '@/utils/assessment/calculations';
import { logger } from '@/utils/logger';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / 100);
};

const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    state: { completed, responses },
    isLoading,
    error: contextError
  } = useAssessment();
  const [results, setResults] = React.useState<any>(null);
  const [calculating, setCalculating] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const [error, setError] = React.useState(null);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const processResults = async () => {
      try {
        // Clear any existing errors
        setError(null);

        // If we don't have responses or the assessment isn't complete, redirect
        if (!completed || !responses) {
          logger.warn('Attempted to view results without completing assessment', {
            completed,
            hasResponses: !!responses,
            responseKeys: responses ? Object.keys(responses) : []
          });
          navigate('/assessment', { replace: true });
          return;
        }

        // Only calculate if we haven't already
        if (!results) {
          setCalculating(true);

          // Validate responses before calculation
          const requiredFields = ['timeSpent', 'processVolume', 'errorRate', 'complexity'];
          const missingFields = requiredFields.filter(field => !responses[field]);

          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }

          // Add a small delay to ensure state is properly updated
          await new Promise(resolve => setTimeout(resolve, 100));

          const calculatedResults = await calculateResults(responses);
          
          if (mounted) {
            setResults(calculatedResults);
            logger.info('Results calculated successfully', {
              hasResults: !!calculatedResults,
              metrics: calculatedResults?.metrics
            });
          }
        }
      } catch (err) {
        logger.error('Failed to calculate results:', err);
        
        if (mounted) {
          // Retry calculation if we haven't exceeded max retries
          if (retryCount < MAX_RETRIES) {
            logger.info('Retrying calculation', { attempt: retryCount + 1 });
            setRetryCount(prev => prev + 1);
            
            // Clear the previous timeout if it exists
            if (retryTimeout) {
              clearTimeout(retryTimeout);
            }
            
            // Use exponential backoff for retries
            retryTimeout = setTimeout(() => {
              if (mounted) {
                setResults(null); // Reset results to trigger recalculation
              }
            }, 1000 * Math.pow(2, retryCount));
          } else {
            const errorMessage = err instanceof Error ? err.message : 'Failed to calculate assessment results';
            setError(errorMessage);
            toast({
              title: 'Error',
              description: errorMessage,
              variant: 'destructive',
            });
            
            // Redirect back to assessment after delay
            setTimeout(() => {
              if (mounted) {
                navigate('/assessment', { replace: true });
              }
            }, 3000);
          }
        }
      } finally {
        if (mounted) {
          setCalculating(false);
        }
      }
    };

    processResults();

    // Cleanup function
    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [completed, responses, navigate, toast, results, retryCount]);

  if (isLoading || calculating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        {retryCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Retrying calculation... (Attempt {retryCount + 1}/{MAX_RETRIES})
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          This may take a few moments...
        </p>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground mt-2">{contextError}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/assessment', { replace: true })}
        >
          Return to Assessment
        </Button>
      </div>
    );
  }

  if (!completed || !results) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-bold">Assessment Not Complete</h2>
        <p className="text-muted-foreground mt-2">
          Please complete the assessment to view your results.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/assessment', { replace: true })}
        >
          Start Assessment
        </Button>
      </div>
    );
  }

  const { savings, metrics, recommendations } = results;

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Assessment Results</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Based on your responses, here's how automation can transform your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(savings.annual)}</div>
            <p className="text-sm text-muted-foreground mt-2">Projected over 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatPercentage(metrics.efficiency)}</div>
            <p className="text-sm text-muted-foreground mt-2">Process improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatPercentage(metrics.roi)}</div>
            <p className="text-sm text-muted-foreground mt-2">Return on investment</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Recommendations</h2>
        <div className="grid gap-4">
          {recommendations.map((rec: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{rec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{rec.description}</p>
                {rec.impact && (
                  <div className="mt-4">
                    <strong className="text-sm text-foreground">Impact: </strong>
                    <span className="text-sm text-muted-foreground">{rec.impact}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          Go to Dashboard
        </Button>
        <Button onClick={() => window.print()}>Download Report</Button>
      </div>
    </div>
  );
};

export default AssessmentResults;
