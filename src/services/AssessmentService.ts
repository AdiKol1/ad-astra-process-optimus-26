import { 
  RawAssessmentData, 
  ComputedMetrics, 
  AssessmentReport 
} from '@/types/assessment/core';
import { calculateCACMetrics } from '@/utils/cac/cacMetricsCalculator';
import { calculateAutomationPotential } from '@/utils/calculations/automationCalculator';
import { calculateEfficiencyScore } from '@/utils/cac/calculators/efficiencyCalculator';

export class AssessmentService {
  private static instance: AssessmentService;

  private constructor() {}

  public static getInstance(): AssessmentService {
    if (!AssessmentService.instance) {
      AssessmentService.instance = new AssessmentService();
    }
    return AssessmentService.instance;
  }

  public calculateMetrics(rawData: RawAssessmentData): ComputedMetrics {
    console.log('Calculating metrics from raw data:', rawData);

    const cacMetrics = calculateCACMetrics(rawData.responses, rawData.responses.industry || 'Other');
    const automationResults = calculateAutomationPotential(rawData.responses);
    const efficiencyScore = calculateEfficiencyScore(rawData.responses, {});

    return {
      cac: {
        ...cacMetrics,
        potentialReduction: Math.round(cacMetrics.potentialReduction * 100),
        automationROI: Math.round(cacMetrics.automationROI * 100)
      },
      automation: {
        timeReduction: automationResults.efficiency.timeReduction,
        errorReduction: automationResults.efficiency.errorReduction,
        productivity: automationResults.efficiency.productivity
      },
      efficiency: {
        toolMaturity: efficiencyScore,
        processEfficiency: automationResults.efficiency.productivity,
        teamEfficiency: Math.round((cacMetrics.efficiency + automationResults.efficiency.productivity) / 2)
      }
    };
  }

  public generateReport(metrics: ComputedMetrics): AssessmentReport {
    console.log('Generating report from metrics:', metrics);

    const overallScore = Math.round(
      (metrics.automation.productivity + metrics.efficiency.teamEfficiency) / 2
    );

    return {
      scores: {
        overall: overallScore,
        sections: {
          cac: { percentage: 100 - metrics.cac.potentialReduction },
          automation: { percentage: metrics.automation.productivity },
          efficiency: { percentage: metrics.efficiency.teamEfficiency }
        }
      },
      recommendations: this.generateRecommendations(metrics),
      projections: {
        annual: {
          savings: metrics.cac.annualSavings,
          hours: metrics.automation.timeReduction * 52
        },
        roi: metrics.cac.automationROI
      }
    };
  }

  private generateRecommendations(metrics: ComputedMetrics) {
    const recommendations = [];

    if (metrics.cac.potentialReduction > 30) {
      recommendations.push({
        title: 'Optimize Customer Acquisition',
        description: 'Implement automated marketing workflows to reduce CAC',
        impact: 'high' as const,
        timeframe: '1-3 months'
      });
    }

    if (metrics.automation.productivity < 70) {
      recommendations.push({
        title: 'Increase Process Automation',
        description: 'Identify and automate manual processes to improve efficiency',
        impact: 'medium' as const,
        timeframe: '2-4 months'
      });
    }

    if (metrics.efficiency.toolMaturity < 60) {
      recommendations.push({
        title: 'Upgrade Technology Stack',
        description: 'Implement modern tools to improve team efficiency',
        impact: 'medium' as const,
        timeframe: '3-6 months'
      });
    }

    return recommendations;
  }
}

export const assessmentService = AssessmentService.getInstance();