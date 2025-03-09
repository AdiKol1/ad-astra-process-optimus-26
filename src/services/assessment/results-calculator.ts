import { AssessmentResponses, AssessmentResults } from '../../types/assessment/state';
import { logger } from '../../utils/logger';
import { telemetry } from '../../utils/monitoring/telemetry';
import { createPerformanceMonitor } from '../../utils/monitoring/performance';

const performanceMonitor = createPerformanceMonitor('ResultsCalculator');

interface ScoreBreakdown {
  processScore: number;
  technologyScore: number;
  teamScore: number;
  socialMediaScore: number;
  totalScore: number;
}

interface Recommendation {
  title: string;
  description: string;
  area: 'process' | 'technology' | 'team' | 'social-media';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  effort: string;
}

export class ResultsCalculator {
  private calculateProcessScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_process_score');
    try {
      const processResponses = responses.responses || {};
      
      const processVolume = processResponses.processVolume || '0-50';
      const timeSpent = processResponses.timeSpent || '0-10';
      const errorRate = processResponses.errorRate || '0-1%';
      const processComplexity = processResponses.processComplexity || 'Simple - Linear flow with few decision points';
      
      // Process volume base score (0-30)
      let score = 0;
      switch (processVolume) {
        case '500+': score += 30; break;
        case '100-500': score += 20; break;
        case '51-100': score += 10; break;
        case '0-50': score += 5; break;
      }
      
      // Time spent impact (0-30)
      switch (timeSpent) {
        case '40+': score += 30; break;
        case '20-40': score += 20; break;
        case '11-20': score += 10; break;
        case '0-10': score += 5; break;
      }
      
      // Error rate impact (-30 to 0)
      switch (errorRate) {
        case '5%+': score -= 30; break;
        case '3-5%': score -= 20; break;
        case '1-3%': score -= 10; break;
        case '0-1%': score -= 0; break;
      }
      
      // Complexity impact (0-40)
      switch (processComplexity) {
        case 'Very Complex - Multiple integrations and custom logic': score += 40; break;
        case 'Complex - Many decision points and variations': score += 30; break;
        case 'Medium - Some complexity with decision points': score += 20; break;
        case 'Simple - Linear flow with few decision points': score += 10; break;
      }
      
      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
  }

  private calculateTechnologyScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_technology_score');
    try {
      const techResponses = responses.responses || {};
      
      const digitalTools = techResponses.digitalTools || [];
      const automationLevel = techResponses.automationLevel || 'None';
      const toolStack = techResponses.toolStack || [];
      
      // Base score from digital tools (0-40)
      let score = Math.min(digitalTools.length * 10, 40);
      
      // Automation level impact (0-40)
      switch (automationLevel) {
        case 'Advanced': score += 40; break;
        case 'Moderate': score += 30; break;
        case 'Basic': score += 20; break;
        case 'None': score += 0; break;
      }
      
      // Tool stack diversity (0-20)
      score += Math.min(toolStack.length * 5, 20);
      
      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
  }

  private calculateTeamScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_team_score');
    try {
      const teamData = responses.team || {};
      const responseData = responses.responses || {};
      
      // Get team size from team section or fallback to responses
      const teamSize = teamData.teamSize || '1-10';
      const departments = teamData.departments || [];
      const skillLevel = teamData.skillLevel || 'beginner';
      const changeReadiness = teamData.changeReadiness || 'neutral';
      const trainingNeeds = responseData.trainingNeeds || [];
      
      // Base score from team size (0-20)
      let score = 0;
      switch (teamSize) {
        case '501+': score += 20; break;
        case '201-500': score += 15; break;
        case '51-200': score += 10; break;
        case '11-50': score += 5; break;
        case '1-10': score += 2; break;
      }
      
      // Department diversity (0-20)
      score += Math.min(departments.length * 3, 20);
      
      // Skill level impact (0-30)
      switch (skillLevel) {
        case 'expert': score += 30; break;
        case 'advanced': score += 20; break;
        case 'intermediate': score += 10; break;
        case 'beginner': score += 5; break;
      }
      
      // Change readiness impact (0-30)
      switch (changeReadiness) {
        case 'eager': score += 30; break;
        case 'open': score += 20; break;
        case 'neutral': score += 10; break;
        case 'resistant': score += 0; break;
      }
      
      // Training needs impact (-5 per need, max -20)
      score -= Math.min(trainingNeeds.length * 5, 20);
      
      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
  }

  private calculateSocialMediaScore(responses: AssessmentResponses): number {
    const mark = performanceMonitor.start('calculate_social_media_score');
    try {
      const socialMedia = responses.socialMedia || {};
      
      const platforms = socialMedia.platforms || [];
      const postFrequency = socialMedia.postFrequency || '';
      const goals = socialMedia.goals || [];
      const contentType = socialMedia.contentType || [];
      const challenges = socialMedia.challenges || [];
      const analytics = socialMedia.analytics || false;
      const toolsUsed = socialMedia.toolsUsed || [];
      
      // Base score from platforms (0-35)
      let score = Math.min(platforms.length * 5, 35);
      
      // Posting frequency impact (0-25)
      switch (postFrequency) {
        case 'daily': score += 25; break;
        case 'several-times-week': score += 20; break;
        case 'weekly': score += 15; break;
        case 'monthly': score += 10; break;
        case 'rarely': score += 5; break;
        default: score += 0; break;
      }
      
      // Strategy clarity from goals (0-15)
      score += Math.min(goals.length * 2.5, 15);
      
      // Content diversity (0-10)
      score += Math.min(contentType.length * 1.5, 10);
      
      // Challenges impact (-5 per challenge, max -15)
      score -= Math.min(challenges.length * 5, 15);
      
      // Analytics tracking bonus (+10)
      if (analytics) {
        score += 10;
      }
      
      // Tools usage (0-20)
      score += Math.min(toolsUsed.length * 4, 20);
      
      return Math.max(0, Math.min(100, score));
    } finally {
      performanceMonitor.end(mark);
    }
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
      const socialMediaScore = this.calculateSocialMediaScore(responses);

      // Calculate total score (weighted average)
      const totalScore = Math.round(
        (processScore * 0.3) + 
        (technologyScore * 0.25) + 
        (teamScore * 0.25) +
        (socialMediaScore * 0.2)
      );

      const score = totalScore;
      
      // Generate insights based on scores
      const insights = [
        {
          category: 'process',
          score: processScore,
          recommendations: this.generateProcessRecommendations(processScore)
        },
        {
          category: 'technology',
          score: technologyScore,
          recommendations: this.generateTechnologyRecommendations(technologyScore)
        },
        {
          category: 'team',
          score: teamScore,
          recommendations: this.generateTeamRecommendations(teamScore)
        },
        {
          category: 'social-media',
          score: socialMediaScore,
          recommendations: this.generateSocialMediaRecommendations(socialMediaScore, responses)
        }
      ];

      // Track results calculation
      telemetry.track('results_calculated', {
        score,
        processScore,
        technologyScore,
        teamScore,
        socialMediaScore,
        recommendationCount: insights.reduce((total, insight) => total + insight.recommendations.length, 0)
      });

      return {
        score,
        insights,
        recommendations: insights.flatMap(insight => insight.recommendations)
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

  private generateProcessRecommendations(score: number): string[] {
    const recommendations = [];
    
    if (score < 40) {
      recommendations.push(
        "Document your current processes to create clarity and identify bottlenecks.",
        "Implement basic process tracking to measure time spent and error rates.",
        "Start with simple automation for the most repetitive tasks."
      );
    } else if (score < 70) {
      recommendations.push(
        "Standardize processes across departments to reduce variations.",
        "Implement workflow management tools to track process performance.",
        "Identify high-value automation opportunities based on volume and error rates."
      );
    } else {
      recommendations.push(
        "Implement continuous improvement practices for your processes.",
        "Consider advanced automation with AI for complex decision points.",
        "Create process governance to maintain quality as you scale."
      );
    }
    
    return recommendations;
  }

  private generateTechnologyRecommendations(score: number): string[] {
    const recommendations = [];
    
    if (score < 40) {
      recommendations.push(
        "Adopt basic digital tools to replace manual processes.",
        "Implement a centralized system for storing business data.",
        "Train team members on basic digital literacy skills."
      );
    } else if (score < 70) {
      recommendations.push(
        "Integrate your existing tools to reduce data silos.",
        "Implement automation for routine data entry and processing tasks.",
        "Develop a technology roadmap for gradual digital transformation."
      );
    } else {
      recommendations.push(
        "Leverage AI and advanced analytics to gain business insights.",
        "Implement comprehensive workflow automation across departments.",
        "Establish a continuous technology improvement process."
      );
    }
    
    return recommendations;
  }

  private generateTeamRecommendations(score: number): string[] {
    const recommendations = [];
    
    if (score < 40) {
      recommendations.push(
        "Provide basic process improvement training for team members.",
        "Create clear roles and responsibilities for core processes.",
        "Implement regular team meetings to discuss process challenges."
      );
    } else if (score < 70) {
      recommendations.push(
        "Develop process champions within each department.",
        "Implement change management practices for new initiatives.",
        "Create cross-functional teams to address complex processes."
      );
    } else {
      recommendations.push(
        "Establish a dedicated process improvement team.",
        "Implement advanced training for process optimization methodologies.",
        "Create incentive programs for process innovation."
      );
    }
    
    return recommendations;
  }

  private generateSocialMediaRecommendations(score: number, responses: AssessmentResponses): string[] {
    const socialMedia = responses.socialMedia || {};
    const recommendations = [];
    
    // Platforms recommendation
    if (!socialMedia.platforms || socialMedia.platforms.length < 3) {
      recommendations.push(
        "Expand your presence to additional social platforms that align with your audience demographics."
      );
    }
    
    // Posting frequency recommendation
    if (socialMedia.postFrequency === 'rarely' || socialMedia.postFrequency === 'monthly') {
      recommendations.push(
        "Increase posting frequency with a consistent content calendar to improve engagement."
      );
    }
    
    // Analytics recommendation
    if (socialMedia.analytics === false) {
      recommendations.push(
        "Implement regular analytics tracking to measure performance and ROI of social efforts."
      );
    }
    
    // Tools recommendation
    if (!socialMedia.toolsUsed || socialMedia.toolsUsed.length < 2) {
      recommendations.push(
        "Adopt scheduling and content management tools to improve efficiency and consistency."
      );
    }
    
    // Content diversity recommendation
    if (!socialMedia.contentType || socialMedia.contentType.length < 3) {
      recommendations.push(
        "Diversify your content types to include more visual and interactive formats."
      );
    }
    
    return recommendations;
  }

  private generateRecommendations(scores: ScoreBreakdown): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Process recommendations
    if (scores.processScore < 50) {
      recommendations.push({
        title: "Process Documentation Initiative",
        description: "Implement a systematic approach to document all business processes",
        area: "process",
        priority: "high",
        impact: "high",
        effort: "medium"
      });
    }
    
    if (scores.processScore < 70) {
      recommendations.push({
        title: "Workflow Optimization Program",
        description: "Identify and eliminate bottlenecks in current processes",
        area: "process",
        priority: "medium",
        impact: "high",
        effort: "medium"
      });
    }
    
    // Technology recommendations
    if (scores.technologyScore < 50) {
      recommendations.push({
        title: "Digital Transformation Roadmap",
        description: "Develop a phased plan to digitize manual processes",
        area: "technology",
        priority: "high",
        impact: "high",
        effort: "high"
      });
    }
    
    if (scores.technologyScore < 70) {
      recommendations.push({
        title: "System Integration Initiative",
        description: "Connect siloed systems to improve data flow and reduce double-entry",
        area: "technology",
        priority: "medium",
        impact: "medium",
        effort: "high"
      });
    }
    
    // Team recommendations
    if (scores.teamScore < 50) {
      recommendations.push({
        title: "Process Training Program",
        description: "Implement training for team members on process improvement",
        area: "team",
        priority: "high",
        impact: "medium",
        effort: "medium"
      });
    }
    
    if (scores.teamScore < 70) {
      recommendations.push({
        title: "Change Management Framework",
        description: "Develop protocols for implementing process changes with minimal disruption",
        area: "team",
        priority: "medium",
        impact: "medium",
        effort: "medium"
      });
    }
    
    // Social media recommendations
    if (scores.socialMediaScore < 50) {
      recommendations.push({
        title: "Social Media Strategy Development",
        description: "Create a comprehensive strategy with clear goals and metrics",
        area: "social-media",
        priority: "high",
        impact: "high",
        effort: "medium"
      });
    }
    
    if (scores.socialMediaScore < 70) {
      recommendations.push({
        title: "Content Calendar Implementation",
        description: "Develop a structured content plan to ensure consistency",
        area: "social-media",
        priority: "medium",
        impact: "medium",
        effort: "low"
      });
    }
    
    return recommendations;
  }
} 