import { AssessmentResponses, AssessmentResults } from '../../types/assessment/state';
import { logger } from '../../utils/logger';
import { telemetry } from '../../utils/monitoring/telemetry';
import { createPerformanceMonitor } from '../../utils/monitoring/performance';

const performanceMonitor = createPerformanceMonitor('ResultsCalculator');

interface ScoreBreakdown {
  processScore: number;
  technologyScore: number;
  teamScore: number;
  totalScore: number;
}

interface Recommendation {
  area: 'process' | 'technology' | 'team';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: string;
}

export class ResultsCalculator {
  private calculateProcessScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_process_score');
    try {
      const {
        processVolume = 0,
        timeSpent = '',
        errorRate = '',
        complexity = '',
        processDocumentation = false
      } = responses;

      // Base score from process volume (0-100)
      let score = Math.min(processVolume / 100, 1) * 100;

      // Time spent impact (-20 to 0)
      switch (timeSpent) {
        case 'very-high': score -= 20; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }

      // Error rate impact (-30 to 0)
      switch (errorRate) {
        case 'very-high': score -= 30; break;
        case 'high': score -= 20; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }

      // Complexity impact (-30 to 0)
      switch (complexity) {
        case 'very-high': score -= 30; break;
        case 'high': score -= 20; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }

      // Documentation bonus (+20)
      if (processDocumentation) {
        score += 20;
      }

      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
  }

  private calculateTechnologyScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_technology_score');
    try {
      const {
        currentSystems = [],
        integrationNeeds = [],
        automationLevel = '',
        digitalTransformation = false,
        techChallenges = []
      } = responses;

      // Base score from current systems (0-40)
      let score = Math.min(currentSystems.length * 10, 40);

      // Integration needs impact (-30 to 0)
      score -= Math.min(integrationNeeds.length * 5, 30);

      // Automation level impact (0 to 30)
      switch (automationLevel) {
        case 'very-high': score += 30; break;
        case 'high': score += 20; break;
        case 'medium': score += 10; break;
      }

      // Digital transformation bonus (+20)
      if (digitalTransformation) {
        score += 20;
      }

      // Tech challenges impact (-10 per challenge)
      score -= Math.min(techChallenges.length * 10, 40);

      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
  }

  private calculateTeamScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_team_score');
    try {
      const {
        teamSize = '',
        departments = [],
        skillLevels = '',
        changeReadiness = '',
        trainingNeeds = []
      } = responses;

      // Base score from team size (20-40)
      let score = 30;
      switch (teamSize) {
        case 'large': score = 40; break;
        case 'medium': score = 30; break;
        case 'small': score = 20; break;
      }

      // Department coverage (0-20)
      score += Math.min(departments.length * 5, 20);

      // Skill levels impact (0-20)
      switch (skillLevels) {
        case 'expert': score += 20; break;
        case 'advanced': score += 15; break;
        case 'intermediate': score += 10; break;
        case 'beginner': score += 5; break;
      }

      // Change readiness impact (0-20)
      switch (changeReadiness) {
        case 'very-high': score += 20; break;
        case 'high': score += 15; break;
        case 'medium': score += 10; break;
        case 'low': score += 5; break;
      }

      // Training needs impact (-10 per need)
      score -= Math.min(trainingNeeds.length * 10, 40);

      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
  }

  private generateRecommendations(scores: ScoreBreakdown): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Process recommendations
    if (scores.processScore < 40) {
      recommendations.push({
        area: 'process',
        priority: 'high',
        title: 'Critical Process Improvement Needed',
        description: 'Your processes show significant inefficiencies that need immediate attention.',
        impact: 'High impact on operational efficiency and error reduction',
        effort: 'Medium to high effort, requires systematic approach'
      });
    } else if (scores.processScore < 70) {
      recommendations.push({
        area: 'process',
        priority: 'medium',
        title: 'Process Optimization Recommended',
        description: 'There are opportunities to streamline and improve your processes.',
        impact: 'Medium impact on operational efficiency',
        effort: 'Medium effort, can be implemented incrementally'
      });
    }

    // Technology recommendations
    if (scores.technologyScore < 40) {
      recommendations.push({
        area: 'technology',
        priority: 'high',
        title: 'Technology Stack Modernization Required',
        description: 'Your technology infrastructure needs significant updates to meet business needs.',
        impact: 'High impact on operational capabilities and efficiency',
        effort: 'High effort, requires careful planning and execution'
      });
    } else if (scores.technologyScore < 70) {
      recommendations.push({
        area: 'technology',
        priority: 'medium',
        title: 'Technology Enhancement Opportunities',
        description: 'Several areas of your technology stack could benefit from updates or improvements.',
        impact: 'Medium impact on operational capabilities',
        effort: 'Medium effort, can be implemented in phases'
      });
    }

    // Team recommendations
    if (scores.teamScore < 40) {
      recommendations.push({
        area: 'team',
        priority: 'high',
        title: 'Team Development Critical',
        description: 'Your team requires significant upskilling and organizational changes.',
        impact: 'High impact on execution capability and innovation',
        effort: 'High effort, requires long-term commitment'
      });
    } else if (scores.teamScore < 70) {
      recommendations.push({
        area: 'team',
        priority: 'medium',
        title: 'Team Enhancement Suggested',
        description: 'Opportunities exist to improve team capabilities and organization.',
        impact: 'Medium impact on team performance',
        effort: 'Medium effort, can be achieved through targeted programs'
      });
    }

    return recommendations;
  }

  public calculateResults(responses: AssessmentResponses): AssessmentResults {
    const mark = performanceMonitor.start('calculate_results');
    
    try {
      logger.info('Calculating assessment results', {
        component: 'ResultsCalculator'
      });

      // Calculate individual scores
      const processScore = this.calculateProcessScore(responses);
      const technologyScore = this.calculateTechnologyScore(responses);
      const teamScore = this.calculateTeamScore(responses);

      // Calculate total score (weighted average)
      const totalScore = Math.round(
        (processScore * 0.4) + 
        (technologyScore * 0.3) + 
        (teamScore * 0.3)
      );

      const scores: ScoreBreakdown = {
        processScore,
        technologyScore,
        teamScore,
        totalScore
      };

      // Generate recommendations
      const recommendations = this.generateRecommendations(scores);

      // Track results calculation
      telemetry.track('results_calculated', {
        scores,
        recommendationCount: recommendations.length
      });

      return {
        scores,
        recommendations,
        calculatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error calculating results', {
        component: 'ResultsCalculator',
        error
      });
      throw error;
    } finally {
      performanceMonitor.end(mark);
    }
  }
} 