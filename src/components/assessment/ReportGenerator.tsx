import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, BlobProvider } from '@react-pdf/renderer';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  }
});

const PDFDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Process Optimization Report</Text>
        
        <View style={styles.section}>
          <Text style={styles.heading}>Assessment Overview</Text>
          <Text style={styles.text}>Overall Score: {data.assessmentScore.overall}%</Text>
          <Text style={styles.text}>Automation Potential: {data.assessmentScore.automationPotential}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Key Findings</Text>
          {data.recommendations.recommendations.map((rec: any, index: number) => (
            <Text key={index} style={styles.text}>• {rec.title}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Recommendations</Text>
          {data.recommendations.recommendations.map((rec: any, index: number) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>• {rec.title}</Text>
              <Text style={styles.text}>  Impact: {rec.impact}</Text>
              <Text style={styles.text}>  Timeframe: {rec.timeframe}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export const ReportGenerator = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && (!location.state || !location.state.assessmentScore)) {
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

  const reportData = location.state;

  return (
    <div className="max-w-4xl mx-auto">
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

              <div>
                <h4 className="font-medium mb-2">Key Findings</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {reportData.recommendations.recommendations.map((rec: any, index: number) => (
                    <li key={index}>{rec.title}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <div className="space-y-3">
                  {reportData.recommendations.recommendations.map((rec: any, index: number) => (
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};