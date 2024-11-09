import React, { useEffect, useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { PDFDocument } from './PDFDocument';

const ReportGenerator = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && (!location.state?.assessmentScore || !location.state?.results)) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      setShouldRedirect(true);
    }
  }, [isLoading, location.state, toast]);

  if (shouldRedirect) {
    return <Navigate to="/assessment" replace />;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { assessmentScore, results, recommendations } = location.state;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Process Optimization Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Report Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Review your customized process optimization report
                </p>
              </div>
              
              <BlobProvider document={<PDFDocument data={location.state} />}>
                {({ blob, url, loading }) => (
                  <Button 
                    disabled={loading || !url}
                    className="flex items-center gap-2"
                    asChild
                  >
                    <a href={url} download="process-optimization-report.pdf">
                      <Download className="h-4 w-4" />
                      {loading ? "Generating..." : "Download Report"}
                    </a>
                  </Button>
                )}
              </BlobProvider>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Assessment Overview</h4>
                <p className="text-sm text-muted-foreground">
                  Overall Score: {assessmentScore.overall}%<br />
                  Automation Potential: {assessmentScore.automationPotential}%
                </p>
              </div>

              {recommendations && (
                <div>
                  <h4 className="font-medium mb-2">Key Findings</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {recommendations.recommendations?.map((rec, index) => (
                      <li key={index}>{rec.title}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendations && (
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="space-y-3">
                    {recommendations.recommendations?.map((rec, index) => (
                      <div key={index} className="border rounded p-3">
                        <h5 className="font-medium">{rec.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          Impact: {rec.impact}<br />
                          Timeframe: {rec.timeframe}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
