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
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (!location.state || !location.state.assessmentScore) {
      toast({
        title: "Error",
        description: "No assessment data found. Please complete the assessment first.",
        variant: "destructive",
      });
      setShouldRedirect(true);
      return;
    }

    setReportData(location.state);
    setIsLoading(false);
  }, [location.state, toast]);

  if (shouldRedirect) {
    return <Navigate to="/assessment" replace />;
  }

  if (isLoading || !reportData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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

  return (
    <div className="max-w-4xl mx-auto p-6">
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
              
              <BlobProvider document={<PDFDocument data={reportData} />}>
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
                  Overall Score: {reportData.assessmentScore.overall}%<br />
                  Automation Potential: {reportData.assessmentScore.automationPotential}%
                </p>
              </div>

              {reportData.recommendations?.recommendations && (
                <div>
                  <h4 className="font-medium mb-2">Key Findings</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {reportData.recommendations.recommendations.map((rec: any, index: number) => (
                      <li key={index}>{rec.title}</li>
                    ))}
                  </ul>
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