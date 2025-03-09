import {
  AssessmentResponses,
  AssessmentResults,
  AssessmentMetrics,
  Recommendations,
  AssessmentSummary,
  Industry,
  ProcessVolume,
  ErrorRate,
  AutomationOpportunity,
  ProcessImprovement,
  ToolRecommendation,
  ImpactLevel,
  isIndustry,
  isProcessVolume,
  isErrorRate,
  isImpactLevel
} from '../types/assessment';

type IndustryMultipliers = Record<Industry, number>;
type VolumeMultipliers = Record<ProcessVolume, number>;
type ErrorRateImpact = Record<ErrorRate, number>;

export class AssessmentService {
  private readonly INDUSTRY_MULTIPLIERS: IndustryMultipliers = {
    [Industry.Technology]: 0.85,
    [Industry.Healthcare]: 0.75,
    [Industry.Finance]: 0.80,
    [Industry.Manufacturing]: 0.70,
    [Industry.Retail]: 0.65,
    [Industry.Other]: 0.60
  };

  private readonly VOLUME_MULTIPLIERS: VolumeMultipliers = {
    [ProcessVolume.VeryLow]: 0.90,
    [ProcessVolume.Low]: 0.85,
    [ProcessVolume.Medium]: 0.80,
    [ProcessVolume.High]: 0.75,
    [ProcessVolume.VeryHigh]: 0.70
  };

  private readonly ERROR_RATE_IMPACT: ErrorRateImpact = {
    [ErrorRate.VeryLow]: 0.95,
    [ErrorRate.Low]: 0.85,
    [ErrorRate.Medium]: 0.75,
    [ErrorRate.High]: 0.65,
    [ErrorRate.VeryHigh]: 0.55
  };

  private getIndustryMultiplier(industry: Industry): number {
    if (isIndustry(industry)) {
      return this.INDUSTRY_MULTIPLIERS[industry];
    }
    return this.INDUSTRY_MULTIPLIERS[Industry.Other];
  }

  private getVolumeMultiplier(volume: ProcessVolume): number {
    if (isProcessVolume(volume)) {
      return this.VOLUME_MULTIPLIERS[volume];
    }
    return this.VOLUME_MULTIPLIERS[ProcessVolume.VeryLow];
  }

  private getErrorRateImpact(errorRate: ErrorRate): number {
    if (isErrorRate(errorRate)) {
      return this.ERROR_RATE_IMPACT[errorRate];
    }
    return this.ERROR_RATE_IMPACT[ErrorRate.Medium];
  }

  private calculateEfficiencyMetrics(responses: AssessmentResponses): AssessmentMetrics['efficiency'] {
    // Calculate base efficiency (lower is worse)
    const baseEfficiency = this.getErrorRateImpact(responses.errorRate);
    const volumeImpact = this.getVolumeMultiplier(responses.processVolume);
    const industryStandard = this.getIndustryMultiplier(responses.industry);

    // Current efficiency is impacted by error rate and volume
    const current = Math.min(0.95, baseEfficiency * volumeImpact);
    
    // Calculate automation potential
    const automationScore = this.calculateAutomationScore(responses);
    
    // Potential efficiency includes automation improvements
    const potential = Math.min(0.95, current + (automationScore * 0.2));
    
    // Calculate improvement percentage
    const improvement = ((potential - current) / current) * 100;

    return {
      current: Number(current.toFixed(2)),
      potential: Number(potential.toFixed(2)),
      improvement: Number(improvement.toFixed(1)),
      automationScore: Number(automationScore.toFixed(2))
    };
  }

  private calculateCostMetrics(
    responses: AssessmentResponses,
    efficiency: AssessmentMetrics['efficiency']
  ): AssessmentMetrics['cost'] {
    const baseHourlyCost = 50; // Average hourly cost per employee
    const hoursPerMonth = 160;
    const teamCost = responses.teamSize * baseHourlyCost * hoursPerMonth;
    
    // Calculate inefficiency costs
    const current = teamCost * (1 - efficiency.current);
    const projected = teamCost * (1 - efficiency.potential);
    
    // Savings is the reduction in inefficiency costs
    const savings = Math.max(0, current - projected);
    
    // Payback period based on implementation cost vs monthly savings
    const paybackPeriod = this.calculatePaybackPeriod(savings, responses);

    return {
      current: Math.round(current),
      projected: Math.round(projected),
      savings: Math.round(savings),
      paybackPeriod: Number(paybackPeriod.toFixed(1))
    };
  }

  private calculateROIMetrics(
    cost: AssessmentMetrics['cost']
  ): AssessmentMetrics['roi'] {
    const implementation = this.estimateImplementationCost(cost.savings);
    
    // Calculate ROI percentages
    const oneYear = implementation > 0 ? ((cost.savings * 12) - implementation) / implementation * 100 : 0;
    const threeYear = implementation > 0 ? ((cost.savings * 36) - implementation) / implementation * 100 : 0;
    const fiveYear = implementation > 0 ? ((cost.savings * 60) - implementation) / implementation * 100 : 0;

    return {
      oneYear: Math.max(0, Math.round(oneYear)),
      threeYear: Math.max(0, Math.round(threeYear)),
      fiveYear: Math.max(0, Math.round(fiveYear))
    };
  }

  private calculateAutomationScore(responses: AssessmentResponses): number {
    const toolScore = Math.min(0.3, (responses.currentTools?.length || 0) * 0.1);
    const processScore = Math.min(0.4, (responses.manualProcesses?.length || 0) * 0.1);
    const baseScore = 0.3;

    return Math.min(1, baseScore + toolScore + processScore);
  }

  private calculatePaybackPeriod(monthlySavings: number, responses: AssessmentResponses): number {
    if (monthlySavings <= 0) return 0;
    const implementationCost = this.estimateImplementationCost(monthlySavings);
    return implementationCost / monthlySavings;
  }

  private estimateImplementationCost(monthlySavings: number): number {
    // Implementation cost is estimated as 6 months of savings
    return Math.max(0, monthlySavings * 6);
  }

  private generateAutomationOpportunities(
    responses: AssessmentResponses,
    metrics: AssessmentMetrics
  ): AutomationOpportunity[] {
    return (responses.manualProcesses || []).map(process => {
      const potentialSavings = (metrics.cost.savings / (responses.manualProcesses?.length || 1));
      const complexity = this.determineComplexity(process);
      const priority = this.determinePriority(potentialSavings, complexity);

      return {
        process,
        potentialSavings: Math.round(potentialSavings),
        complexity,
        priority
      };
    });
  }

  private determineComplexity(process: string): ImpactLevel {
    // Simple heuristic based on process name length and common keywords
    const complexityIndicators = ['integration', 'workflow', 'approval', 'multi', 'complex'];
    const matches = complexityIndicators.filter(indicator => 
      process.toLowerCase().includes(indicator)
    ).length;

    const level: ImpactLevel = matches >= 2 ? 'High' : matches === 1 ? 'Medium' : 'Low';
    return level;
  }

  private determinePriority(
    savings: number,
    complexity: ImpactLevel
  ): ImpactLevel {
    if (!isImpactLevel(complexity)) {
      return 'Medium';
    }

    const complexityScore = { Low: 3, Medium: 2, High: 1 }[complexity];
    const savingsScore = savings > 10000 ? 3 : savings > 5000 ? 2 : 1;
    const priorityScore = (complexityScore + savingsScore) / 2;

    const level: ImpactLevel = priorityScore >= 2.5 ? 'High' : priorityScore >= 1.5 ? 'Medium' : 'Low';
    return level;
  }

  private generateProcessImprovements(
    responses: AssessmentResponses,
    metrics: AssessmentMetrics
  ): ProcessImprovement[] {
    const improvements: ProcessImprovement[] = [];

    if (metrics.efficiency.current < 0.7) {
      improvements.push({
        area: 'Error Reduction',
        recommendation: 'Implement quality control checkpoints and standardized procedures',
        impact: 'High'
      });
    }

    if (responses.currentTools?.length === 0) {
      improvements.push({
        area: 'Tool Adoption',
        recommendation: 'Evaluate and implement automation tools for core processes',
        impact: 'High'
      });
    }

    if (responses.manualProcesses?.length || 0 > 3) {
      improvements.push({
        area: 'Process Standardization',
        recommendation: 'Document and standardize manual processes for automation',
        impact: 'Medium'
      });
    }

    return improvements;
  }

  private generateToolRecommendations(
    responses: AssessmentResponses
  ): ToolRecommendation[] {
    const recommendations: ToolRecommendation[] = [];

    // Basic tool recommendations based on industry and current tools
    if (!responses.currentTools?.includes('workflow')) {
      recommendations.push({
        name: 'Workflow Automation Platform',
        purpose: 'Streamline and automate business processes',
        benefits: [
          'Reduce manual work',
          'Improve process consistency',
          'Enable process monitoring'
        ]
      });
    }

    if (!responses.currentTools?.includes('integration')) {
      recommendations.push({
        name: 'Integration Platform',
        purpose: 'Connect different systems and automate data flow',
        benefits: [
          'Eliminate manual data entry',
          'Reduce errors',
          'Improve data accuracy'
        ]
      });
    }

    if (!responses.currentTools?.includes('rpa')) {
      recommendations.push({
        name: 'Robotic Process Automation (RPA)',
        purpose: 'Automate repetitive tasks across applications',
        benefits: [
          'Reduce manual effort',
          'Improve accuracy',
          'Scale operations efficiently'
        ]
      });
    }

    return recommendations;
  }

  private generateSummary(
    responses: AssessmentResponses,
    metrics: AssessmentMetrics,
    recommendations: Recommendations
  ): AssessmentSummary {
    const overview = `Based on our assessment, your team of ${responses.teamSize} employees in the ${
      responses.industry
    } industry has an efficiency rate of ${
      (metrics.efficiency.current * 100).toFixed(1)
    }%. Through process automation and improvements, we estimate this can be increased to ${
      (metrics.efficiency.potential * 100).toFixed(1)
    }%, leading to annual savings of $${
      (metrics.cost.savings * 12).toLocaleString()
    }.`;

    const keyFindings = [
      `Current process efficiency is ${metrics.efficiency.current < 0.7 ? 'below' : 'above'} industry average`,
      `${recommendations.automationOpportunities.length} processes identified for automation`,
      `Estimated ROI of ${metrics.roi.threeYear}% over 3 years`,
      `Payback period of ${metrics.cost.paybackPeriod} months`
    ];

    const nextSteps = [
      'Review and prioritize automation opportunities',
      'Evaluate recommended tools and solutions',
      'Develop implementation timeline and budget',
      'Begin process documentation and standardization'
    ];

    return {
      overview,
      keyFindings,
      nextSteps
    };
  }

  public generateResults(responses: AssessmentResponses): AssessmentResults {
    // Calculate metrics
    const efficiency = this.calculateEfficiencyMetrics(responses);
    const cost = this.calculateCostMetrics(responses, efficiency);
    const roi = this.calculateROIMetrics(cost);

    const metrics = {
      efficiency,
      cost,
      roi
    };

    // Generate recommendations
    const automationOpportunities = this.generateAutomationOpportunities(responses, metrics);
    const processImprovements = this.generateProcessImprovements(responses, metrics);
    const toolRecommendations = this.generateToolRecommendations(responses);

    const recommendations: Recommendations = {
      automationOpportunities,
      processImprovements,
      toolRecommendations
    };

    // Generate summary
    const summary = this.generateSummary(responses, metrics, recommendations);

    return {
      metrics,
      recommendations,
      summary
    };
  }
}