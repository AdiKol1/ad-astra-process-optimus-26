import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessment';
import { ResultsVisualization } from '@/components/features/assessment/visualization/ResultsVisualization';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AssessmentResults as AssessmentResultsType, AssessmentState } from '@/types/assessment';

interface ExportError {
  message: string;
  retryCount: number;
}

const MAX_EXPORT_RETRIES = 3;

export const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  const { results, isLoading: loading, responses } = useAssessmentStore();
  const [exportError, setExportError] = React.useState<ExportError | null>(null);

  const validateResults = (data: AssessmentResultsType) => {
    if (!data.scores || !data.recommendations) {
      throw new Error('Invalid results data structure');
    }
    return true;
  };

  React.useEffect(() => {
    if (!loading && !results) {
      logger.warn('No results found, redirecting to assessment');
      navigate('/assessment');
      return;
    }

    if (results) {
      try {
        validateResults(results);
        const eventData = {
          totalScore: results.scores.totalScore,
          processScore: results.scores.processScore,
          technologyScore: results.scores.technologyScore,
          teamScore: results.scores.teamScore,
          recommendationsCount: results.recommendations.length,
          timestamp: new Date().toISOString()
        };
        telemetry.track('assessment_results_viewed', eventData);
      } catch (error) {
        const err = error as Error;
        logger.error('Invalid results data:', { message: err.message, stack: err.stack });
        navigate('/assessment');
      }
    }
  }, [results, loading, navigate]);

  const handleExport = async () => {
    if (!results || !responses) {
      setExportError({ message: 'No results available to export', retryCount: 0 });
      return;
    }

    try {
      const exportData = {
        results,
        responses,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment-results-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      telemetry.track('results_exported', {
        success: true,
        totalScore: results.scores.totalScore
      });
      
      setExportError(null);
    } catch (error) {
      const err = error as Error;
      const currentRetries = exportError?.retryCount || 0;
      
      logger.error('Error exporting results:', { message: err.message, stack: err.stack, retryCount: currentRetries });
      
      setExportError({ 
        message: 'Failed to export results. Please try again.',
        retryCount: currentRetries + 1
      });
      
      telemetry.track('results_export_error', { 
        message: err.message,
        retryCount: currentRetries
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading your assessment results...</p>
        </div>
      </Card>
    );
  }

  if (!results) {
    return null; // Will redirect in useEffect
  }

  const { scores, recommendations } = results;

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Assessment Results</h2>
            <p className="text-gray-600 mt-2">
              Here's a detailed breakdown of your assessment
            </p>
          </div>

          {exportError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Export Failed</AlertTitle>
              <AlertDescription>
                {exportError.message}
                {exportError.retryCount < MAX_EXPORT_RETRIES && (
                  <Button
                    variant="link"
                    className="pl-0"
                    onClick={handleExport}
                  >
                    Retry Export
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Overall Score</h3>
              <p className="text-4xl font-bold text-primary mt-2">
                {scores.totalScore}%
              </p>
            </div>

            <ResultsVisualization
              scores={{
                process: scores.processScore,
                technology: scores.technologyScore,
                team: scores.teamScore
              }}
            />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Recommendations</h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-gray-600 mt-1">{rec.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="mr-4">Impact: {rec.impact}</span>
                          <span>Effort: {rec.effort}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            rec.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rec.area.charAt(0).toUpperCase() + rec.area.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/assessment')}
            >
              Start New Assessment
            </Button>
            <Button onClick={handleExport}>
              Export Results
            </Button>
          </div>
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default AssessmentResults;
