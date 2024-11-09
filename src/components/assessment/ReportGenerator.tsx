import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, PDFDownloadLinkProps } from '@react-pdf/renderer';
import { useToast } from '@/components/ui/use-toast';

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

interface ReportData {
  score: number;
  automationPotential: number;
  findings: string[];
  recommendations: Array<{
    title: string;
    impact: string;
    timeframe: string;
  }>;
}

const PDFDocument = ({ data }: { data: ReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Process Optimization Report</Text>
        
        <View style={styles.section}>
          <Text style={styles.heading}>Assessment Overview</Text>
          <Text style={styles.text}>Overall Score: {data.score}%</Text>
          <Text style={styles.text}>Automation Potential: {data.automationPotential}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Key Findings</Text>
          {data.findings.map((finding, index) => (
            <Text key={index} style={styles.text}>• {finding}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Recommendations</Text>
          {data.recommendations.map((rec, index) => (
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
  
  const reportData: ReportData = {
    score: 85,
    automationPotential: 75,
    findings: [
      "High manual data entry workload",
      "Significant potential for process automation",
      "Current error rate above industry average"
    ],
    recommendations: [
      {
        title: "Implement Data Entry Automation",
        impact: "high",
        timeframe: "short-term"
      },
      {
        title: "Streamline Approval Workflows",
        impact: "medium",
        timeframe: "medium-term"
      }
    ]
  };

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
              
              <PDFDownloadLink
                document={<PDFDocument data={reportData} />}
                fileName="process-optimization-report.pdf"
              >
                {({ loading, error }) => (
                  <Button
                    onClick={() => {
                      toast({
                        title: "Report Generated",
                        description: "Your report has been generated and is ready for download.",
                      });
                    }}
                    disabled={loading || !!error}
                  >
                    {loading ? (
                      "Generating..."
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Assessment Overview</h4>
                <p className="text-sm text-muted-foreground">
                  Overall Score: {reportData.score}%<br />
                  Automation Potential: {reportData.automationPotential}%
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Findings</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {reportData.findings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <div className="space-y-3">
                  {reportData.recommendations.map((rec, index) => (
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