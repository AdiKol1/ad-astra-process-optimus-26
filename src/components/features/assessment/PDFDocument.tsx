import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#2a2a2a',
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
  },
  metricsBox: {
    border: '1px solid #e5e7eb',
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
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
    backgroundColor: '#f8fafc',
    padding: 15,
    marginTop: 30,
    borderRadius: 4,
  },
  contactTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 10,
  },
});

interface PDFDocumentProps {
  data: {
    assessmentScore: {
      overall: number;
      automationPotential: number;
      sections: Record<string, any>;
    };
    recommendations?: {
      recommendations?: Array<{
        title: string;
        description: string;
        impact: string;
        timeframe: string;
        benefits: string[];
      }>;
    };
    results: {
      annual: {
        savings: number;
        hours: number;
      };
    };
    industryAnalysis?: {
      benchmarks?: Record<string, string>;
      opportunities?: string[];
    };
  };
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Process Optimization Report</Text>
          
          <Text style={styles.subtitle}>Assessment Overview</Text>
          <View style={styles.metricsBox}>
            <Text style={styles.text}>Overall Score: {data.assessmentScore.overall}%</Text>
            <Text style={styles.text}>Automation Potential: {data.assessmentScore.automationPotential}%</Text>
          </View>
          
          {data.recommendations?.recommendations && (
            <>
              <Text style={styles.subtitle}>Key Recommendations</Text>
              {data.recommendations.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationBox}>
                  <Text style={styles.highlight}>{rec.title}</Text>
                  <Text style={styles.text}>{rec.description}</Text>
                  <Text style={styles.text}>Impact: {rec.impact}</Text>
                  <Text style={styles.text}>Timeframe: {rec.timeframe}</Text>
                  <Text style={styles.text}>Benefits:</Text>
                  <View style={styles.benefitsList}>
                    {rec.benefits.map((benefit, idx) => (
                      <Text key={idx} style={styles.text}>• {benefit}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </>
          )}

          {data.industryAnalysis?.benchmarks && (
            <>
              <Text style={styles.subtitle}>Industry Benchmarks</Text>
              <View style={styles.metricsBox}>
                {Object.entries(data.industryAnalysis.benchmarks).map(([key, value], index) => (
                  <Text key={index} style={styles.text}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                  </Text>
                ))}
              </View>
            </>
          )}

          <View style={styles.contactBox}>
            <Text style={styles.contactTitle}>Ready to Transform Your Operations?</Text>
            <Text style={styles.text}>Contact us to discuss your custom optimization plan:</Text>
            <Text style={styles.text}>Phone: +1 (555) 123-4567</Text>
            <Text style={styles.text}>Email: contact@adastra.ai</Text>
            <Text style={styles.text}>Book a free strategy session worth $1,500</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};