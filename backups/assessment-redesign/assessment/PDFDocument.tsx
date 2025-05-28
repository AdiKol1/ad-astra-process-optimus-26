import React, { useEffect, useCallback, useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image, Font } from '@react-pdf/renderer';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { telemetry } from '@/utils/monitoring/telemetry';
import { logger } from '@/utils/logger';
import { APP_URLS } from '@/constants/urls';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

// Register custom fonts for better branding
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 }
  ]
});

// Define more specific types
interface AssessmentScore {
  overall: number;
  automationPotential: number;
  sections: {
    process?: number;
    technology?: number;
    team?: number;
  };
}

interface Recommendation {
  title: string;
  description: string;
  impact: string;
  timeframe: string;
  benefits: string[];
  priority: 'high' | 'medium' | 'low';
  roi?: {
    estimate: string;
    timeline: string;
  };
}

interface AnnualResults {
  savings: number;
  hours: number;
  costs: {
    current: number;
    projected: number;
  };
}

interface IndustryAnalysis {
  benchmarks?: Record<string, string>;
  opportunities?: string[];
  trends?: {
    title: string;
    impact: string;
  }[];
}

interface PDFDocumentProps {
  data: {
    assessmentScore: AssessmentScore;
    recommendations?: {
      recommendations?: Recommendation[];
    };
    results: {
      annual: AnnualResults;
    };
    industryAnalysis?: IndustryAnalysis;
    companyName?: string;
    generatedDate?: string;
  };
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Inter'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 20
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain'
  },
  headerText: {
    fontSize: 10,
    color: '#6b7280'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1a1a1a',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#2a2a2a',
    fontWeight: 'medium'
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#4a4a4a',
  },
  highlight: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 8,
    fontWeight: 'medium'
  },
  metricsBox: {
    border: '1px solid #e5e7eb',
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#f9fafb'
  },
  recommendationBox: {
    border: '1px solid #e5e7eb',
    padding: 15,
    marginBottom: 15,
    borderRadius: 4,
  },
  benefitsList: {
    marginLeft: 15,
    marginTop: 5,
  },
  contactBox: {
    backgroundColor: '#1e40af',
    padding: 20,
    marginTop: 30,
    borderRadius: 4,
  },
  contactTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  contactText: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10
  },
  priorityBadge: {
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 10,
    marginBottom: 8
  },
  priorityHigh: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  priorityMedium: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  priorityLow: {
    backgroundColor: '#e0f2fe',
    color: '#075985'
  },
  chart: {
    width: '100%',
    height: 200,
    marginVertical: 15
  }
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const PDFDocument: React.FC<PDFDocumentProps> = React.memo(({ data }) => {
  const { recordMetric } = usePerformanceMonitor();

  useEffect(() => {
    try {
      recordMetric('pdf_generation_started');
      telemetry.track('pdf_generation_started', {
        hasRecommendations: !!data.recommendations?.recommendations?.length,
        hasBenchmarks: !!data.industryAnalysis?.benchmarks,
        timestamp: new Date().toISOString(),
        totalScore: data.assessmentScore.overall,
        automationPotential: data.assessmentScore.automationPotential
      });
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      };
      logger.error('Error tracking PDF generation:', errorDetails);
    }
  }, [data, recordMetric]);

  const validateData = useCallback(() => {
    if (!data.assessmentScore || !data.results) {
      throw new Error('Required assessment data is missing');
    }
  }, [data]);

  const sortedRecommendations = useMemo(() => {
    return data.recommendations?.recommendations?.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [data.recommendations?.recommendations]);

  const annualSavingsPercentage = useMemo(() => {
    if (!data.results.annual.costs.current) return 0;
    return ((data.results.annual.savings / data.results.annual.costs.current) * 100).toFixed(1);
  }, [data.results.annual]);

  try {
    validateData();

    return (
      <ErrorBoundary>
        <Document
          title="Process Optimization Report"
          author="Ad Astra AI"
          subject="Assessment Results"
          keywords="process optimization, automation, efficiency"
          language="en"
        >
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Image 
                src="/images/logo.png"
                style={styles.logo}
              />
              <Text style={styles.headerText}>
                Generated on: {data.generatedDate ? formatDate(data.generatedDate) : new Date().toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Process Optimization Report</Text>
              {data.companyName && (
                <Text style={styles.subtitle}>for {data.companyName}</Text>
              )}
              
              <Text style={styles.subtitle}>Executive Summary</Text>
              <View style={styles.metricsBox}>
                <Text style={styles.text}>Overall Score: {data.assessmentScore.overall}%</Text>
                <Text style={styles.text}>Automation Potential: {data.assessmentScore.automationPotential}%</Text>
                <Text style={styles.text}>Projected Annual Savings: {formatCurrency(data.results.annual.savings)}</Text>
                <Text style={styles.text}>Cost Reduction: {annualSavingsPercentage}%</Text>
                <Text style={styles.text}>Time Saved Annually: {data.results.annual.hours} hours</Text>
              </View>
              
              {sortedRecommendations && (
                <>
                  <Text style={styles.subtitle}>Strategic Recommendations</Text>
                  {sortedRecommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationBox}>
                      <View style={{
                        ...styles.priorityBadge,
                        ...(rec.priority === 'high' ? styles.priorityHigh :
                           rec.priority === 'medium' ? styles.priorityMedium :
                           styles.priorityLow)
                      }}>
                        <Text>{rec.priority.toUpperCase()} Priority</Text>
                      </View>
                      <Text style={styles.highlight}>{rec.title}</Text>
                      <Text style={styles.text}>{rec.description}</Text>
                      <Text style={styles.text}>Impact: {rec.impact}</Text>
                      <Text style={styles.text}>Implementation Timeline: {rec.timeframe}</Text>
                      {rec.roi && (
                        <>
                          <Text style={styles.text}>Estimated ROI: {rec.roi.estimate}</Text>
                          <Text style={styles.text}>ROI Timeline: {rec.roi.timeline}</Text>
                        </>
                      )}
                      <Text style={styles.text}>Key Benefits:</Text>
                      <View style={styles.benefitsList}>
                        {rec.benefits.map((benefit, idx) => (
                          <Text key={idx} style={styles.text}>• {benefit}</Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </>
              )}

              {data.industryAnalysis?.trends && (
                <>
                  <Text style={styles.subtitle}>Industry Trends & Impact</Text>
                  <View style={styles.metricsBox}>
                    {data.industryAnalysis.trends.map((trend, index) => (
                      <View key={index} style={{ marginBottom: 10 }}>
                        <Text style={styles.highlight}>{trend.title}</Text>
                        <Text style={styles.text}>{trend.impact}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.contactBox}>
                <Text style={styles.contactTitle}>Ready to Transform Your Operations?</Text>
                <Text style={styles.contactText}>Book your complimentary strategy session (valued at $1,500):</Text>
                <Text style={styles.contactText}>{APP_URLS.CALENDAR}</Text>
                <Text style={styles.contactText}>Let's discuss your custom implementation plan.</Text>
              </View>

              <View style={styles.footer}>
                <Text>Confidential Assessment Report • Generated by Ad Astra AI • {new Date().getFullYear()}</Text>
              </View>
            </View>
          </Page>
        </Document>
      </ErrorBoundary>
    );
  } catch (error) {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };
    logger.error('Error generating PDF:', errorDetails);
    telemetry.track('pdf_generation_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
});

PDFDocument.displayName = 'PDFDocument';