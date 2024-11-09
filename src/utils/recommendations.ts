import { calculateAssessmentScore } from './scoring';

interface ProcessRecommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  benefits: string[];
}

const getProcessRecommendations = (answers: Record<string, any>): ProcessRecommendation[] => {
  const recommendations: ProcessRecommendation[] = [];

  // Check manual processes
  if (answers.painPoints?.includes('Too much manual data entry')) {
    recommendations.push({
      title: "Implement Data Entry Automation",
      description: "Replace manual data entry with automated data capture and validation systems.",
      impact: 'high',
      timeframe: 'short-term',
      benefits: [
        "Reduce manual effort by up to 80%",
        "Minimize data entry errors",
        "Speed up processing time"
      ]
    });
  }

  // Check error rates
  if (answers.painPoints?.includes('High error rates')) {
    recommendations.push({
      title: "Automated Quality Control",
      description: "Implement automated validation rules and quality checks.",
      impact: 'high',
      timeframe: 'immediate',
      benefits: [
        "Reduce error rates by up to 90%",
        "Improve data accuracy",
        "Enhance compliance"
      ]
    });
  }

  // Check processing times
  if (answers.painPoints?.includes('Slow processing times')) {
    recommendations.push({
      title: "Process Optimization",
      description: "Streamline workflows and implement parallel processing where possible.",
      impact: 'medium',
      timeframe: 'short-term',
      benefits: [
        "Reduce processing time by 50%",
        "Improve customer satisfaction",
        "Increase throughput"
      ]
    });
  }

  // Check staff time usage
  if (answers.painPoints?.includes('Staff spending time on repetitive tasks')) {
    recommendations.push({
      title: "Task Automation",
      description: "Automate repetitive tasks using RPA (Robotic Process Automation).",
      impact: 'high',
      timeframe: 'short-term',
      benefits: [
        "Free up staff time for value-added tasks",
        "Improve employee satisfaction",
        "Increase productivity"
      ]
    });
  }

  // Check tracking capabilities
  if (answers.painPoints?.includes('Difficulty tracking process status')) {
    recommendations.push({
      title: "Process Monitoring System",
      description: "Implement real-time process monitoring and tracking dashboard.",
      impact: 'medium',
      timeframe: 'immediate',
      benefits: [
        "Real-time visibility into process status",
        "Better decision making",
        "Improved resource allocation"
      ]
    });
  }

  return recommendations;
};

export const generateRecommendations = (answers: Record<string, any>) => {
  const score = calculateAssessmentScore(answers);
  const processRecs = getProcessRecommendations(answers);
  
  return {
    score,
    recommendations: processRecs,
    summary: {
      automationPotential: score.automationPotential,
      priorityAreas: processRecs
        .filter(rec => rec.impact === 'high')
        .map(rec => rec.title),
      timeframe: processRecs.length > 3 ? 'phased' : 'immediate',
    }
  };
};