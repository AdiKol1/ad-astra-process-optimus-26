import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  recommendationBox: {
    border: '1px solid black',
    padding: 10,
    marginBottom: 10,
  }
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
        impact: string;
        timeframe: string;
      }>;
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
          <Text style={styles.text}>Overall Score: {data.assessmentScore.overall}%</Text>
          <Text style={styles.text}>Automation Potential: {data.assessmentScore.automationPotential}%</Text>
          
          {data.recommendations?.recommendations && (
            <>
              <Text style={styles.subtitle}>Recommendations</Text>
              {data.recommendations.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationBox}>
                  <Text style={styles.text}>{rec.title}</Text>
                  <Text style={styles.text}>Impact: {rec.impact}</Text>
                  <Text style={styles.text}>Timeframe: {rec.timeframe}</Text>
                </View>
              ))}
            </>
          )}

          {data.industryAnalysis?.benchmarks && (
            <>
              <Text style={styles.subtitle}>Industry Benchmarks</Text>
              {Object.entries(data.industryAnalysis.benchmarks).map(([key, value], index) => (
                <Text key={index} style={styles.text}>
                  {key}: {value}
                </Text>
              ))}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};