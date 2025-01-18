import { monitor } from './monitor';
import { logger } from '@/utils/logger';
import { AssessmentState, AssessmentResponses } from '@/types/assessment';

/**
 * Specialized monitoring service for business-critical assessment metrics
 */
class AssessmentMonitoringService {
  private static instance: AssessmentMonitoringService;

  private constructor() {}

  static getInstance(): AssessmentMonitoringService {
    if (!AssessmentMonitoringService.instance) {
      AssessmentMonitoringService.instance = new AssessmentMonitoringService();
    }
    return AssessmentMonitoringService.instance;
  }

  /**
   * Track completion rates and identify drop-off points
   */
  trackStepCompletion(step: number, totalSteps: number, metadata?: Record<string, any>) {
    const completionRate = (step / totalSteps) * 100;
    
    monitor.trackMetric('assessment_step_completion', completionRate, 'percentage', {
      step: step.toString(),
      total_steps: totalSteps.toString(),
      ...metadata
    });

    // Alert if completion rate drops below threshold at critical steps
    if (step > 1 && completionRate < 70) {
      logger.warn('Low completion rate detected', {
        step,
        completionRate,
        metadata
      });
    }
  }

  /**
   * Monitor calculation accuracy and processing
   */
  trackCalculationMetrics(
    calculationType: 'roi' | 'cac' | 'savings',
    duration: number,
    metadata: {
      inputSize?: number;
      complexity?: string;
      resultRange?: string;
    }
  ) {
    monitor.trackMetric(`assessment_calculation_${calculationType}`, duration, 'ms', {
      ...metadata
    });

    // Alert on slow calculations
    if (duration > 2000) {
      logger.warn('Slow calculation detected', {
        calculationType,
        duration,
        metadata
      });
    }
  }

  /**
   * Track data quality and validation
   */
  trackDataQuality(
    section: string,
    validationResults: {
      passed: boolean;
      errors?: string[];
      warnings?: string[];
    }
  ) {
    monitor.trackMetric(`assessment_data_quality_${section}`, validationResults.passed ? 1 : 0, 'boolean', {
      error_count: validationResults.errors?.length.toString() || '0',
      warning_count: validationResults.warnings?.length.toString() || '0'
    });

    if (!validationResults.passed) {
      logger.warn('Data quality issues detected', {
        section,
        errors: validationResults.errors,
        warnings: validationResults.warnings
      });
    }
  }

  /**
   * Monitor user engagement and interaction patterns
   */
  trackUserEngagement(
    action: string,
    metadata: {
      timeSpent?: number;
      interactionCount?: number;
      section?: string;
    }
  ) {
    monitor.trackUserEvent(action, undefined, {
      ...metadata,
      timestamp: new Date().toISOString()
    });

    // Alert on potential user confusion
    if (metadata.timeSpent && metadata.timeSpent > 300000) { // 5 minutes
      logger.warn('Extended time spent on section', {
        action,
        timeSpent: metadata.timeSpent,
        section: metadata.section
      });
    }
  }

  /**
   * Track business impact metrics
   */
  trackBusinessMetrics(
    assessmentData: AssessmentState,
    metadata: {
      industry?: string;
      companySize?: string;
      processVolume?: string;
    }
  ) {
    // Track key business metrics
    if (assessmentData.responses) {
      this.trackIndustryMetrics(assessmentData.responses, metadata);
      this.trackROIMetrics(assessmentData.responses, metadata);
      this.trackProcessEfficiencyMetrics(assessmentData.responses, metadata);
    }
  }

  private trackIndustryMetrics(responses: AssessmentResponses, metadata: Record<string, any>) {
    const industry = responses.userInfo?.industry || 'unknown';
    monitor.trackMetric('assessment_industry_completion', 1, 'count', {
      industry,
      ...metadata
    });
  }

  private trackROIMetrics(responses: AssessmentResponses, metadata: Record<string, any>) {
    if (responses.marketingBudget) {
      monitor.trackMetric('assessment_potential_roi', parseFloat(responses.marketingBudget), 'currency', {
        ...metadata
      });
    }
  }

  private trackProcessEfficiencyMetrics(responses: AssessmentResponses, metadata: Record<string, any>) {
    if (responses.automationLevel) {
      monitor.trackMetric('assessment_automation_potential', 
        this.calculateAutomationScore(responses.automationLevel),
        'score',
        {
          current_level: responses.automationLevel,
          ...metadata
        }
      );
    }
  }

  private calculateAutomationScore(level: string): number {
    const scores: Record<string, number> = {
      'manual': 0,
      'partially_automated': 50,
      'mostly_automated': 75,
      'fully_automated': 100
    };
    return scores[level] || 0;
  }

  /**
   * Track assessment results and recommendations
   */
  trackAssessmentResults(
    results: {
      qualificationScore?: number;
      recommendations?: string[];
      potentialSavings?: number;
    },
    metadata: Record<string, any>
  ) {
    if (results.qualificationScore !== undefined) {
      monitor.trackMetric('assessment_qualification_score', results.qualificationScore, 'score', metadata);
    }

    if (results.potentialSavings !== undefined) {
      monitor.trackMetric('assessment_potential_savings', results.potentialSavings, 'currency', metadata);
    }

    if (results.recommendations?.length) {
      monitor.trackMetric('assessment_recommendations_count', results.recommendations.length, 'count', metadata);
    }
  }
}

export const assessmentMonitor = AssessmentMonitoringService.getInstance();
