import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { useAssessment } from '../../../contexts/AssessmentContext';
import type { SectionScore, Recommendation, IndustryBenchmark, PotentialSavings } from '../../../types/assessment';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!assessmentData) {
      navigate('/assessment');
      return;
    }

    const calculateScores = async () => {
      try {
        setIsCalculating(true);
        const responses = assessmentData.responses;

        // Calculate section scores
        const teamScore = await calculateTeamScore(responses);
        const processScore = await calculateProcessScore(responses);
        const technologyScore = await calculateTechnologyScore(responses);
        const challengesScore = await calculateChallengesScore(responses);
        const goalsScore = await calculateGoalsScore(responses);
        const budgetScore = await calculateBudgetScore(responses);

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: 0.2 },
          process: { score: processScore.score, weight: 0.25 },
          technology: { score: technologyScore.score, weight: 0.2 },
          challenges: { score: challengesScore.score, weight: 0.15 },
          goals: { score: goalsScore.score, weight: 0.1 },
          budget: { score: budgetScore.score, weight: 0.1 }
        });

        setAssessmentData({
          ...assessmentData,
          scores: {
            team: teamScore,
            process: processScore,
            technology: technologyScore,
            challenges: challengesScore,
            goals: goalsScore,
            budget: budgetScore,
            total: totalScore
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while calculating scores');
        console.error('Error calculating scores:', err);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateScores();
  }, [assessmentData?.responses, navigate, setAssessmentData]);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/assessment')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Return to Assessment
          </button>
        </div>
      </Card>
    );
  }

  if (isCalculating) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4">Calculating your optimization score...</p>
        </div>
      </Card>
    );
  }

  const calculateTeamScore = (responses: Record<string, any>): SectionScore => {
    const teamSize = Number(responses.teamSize) || 0;
    const departments = responses.departments || [];
    const roleBreakdown = responses.roleBreakdown || {};
    const hoursPerWeek = Number(responses.hoursPerWeek) || 0;
    const hourlyRates = responses.hourlyRates || {};

    // Calculate sub-scores
    const teamSizeScore = Math.min(1, teamSize / 50); // Normalize based on team size
    const departmentScore = departments.length / 7; // Normalize based on department coverage
    const roleScore = Object.keys(roleBreakdown).length / 3; // Normalize based on role distribution
    const utilizationScore = Math.min(1, hoursPerWeek / 40); // Normalize based on weekly hours

    return {
      score: (teamSizeScore * 0.2 + departmentScore * 0.3 + roleScore * 0.3 + utilizationScore * 0.2),
      confidence: 0.9,
      areas: [
        {
          name: 'Team Size & Structure',
          score: teamSizeScore,
          insights: [`Team size: ${teamSize} members across ${departments.length} departments`]
        },
        {
          name: 'Role Distribution',
          score: roleScore,
          insights: [`${Object.keys(roleBreakdown).length} distinct roles identified`]
        },
        {
          name: 'Resource Utilization',
          score: utilizationScore,
          insights: [`Average ${hoursPerWeek} working hours per week`]
        }
      ]
    };
  };

  const calculateProcessScore = (responses: Record<string, any>): SectionScore => {
    const manualProcesses = responses.manualProcesses || [];
    const processTime = Number(responses.processTime) || 0;
    const errorRate = responses.errorRate || '';
    const bottlenecks = responses.bottlenecks || [];

    const processCountScore = 1 - (manualProcesses.length / 8);
    const timeScore = Math.max(0, 1 - (processTime / 40));
    const errorScore = calculateErrorScore(errorRate);
    const bottleneckScore = 1 - (bottlenecks.length / 7);

    return {
      score: (processCountScore * 0.3 + timeScore * 0.3 + errorScore * 0.2 + bottleneckScore * 0.2),
      confidence: 0.85,
      areas: [
        {
          name: 'Manual Process Load',
          score: processCountScore,
          insights: [`${manualProcesses.length} manual processes identified`]
        },
        {
          name: 'Time Efficiency',
          score: timeScore,
          insights: [`${processTime} hours spent on manual tasks weekly`]
        },
        {
          name: 'Error Management',
          score: errorScore,
          insights: [`Current error rate: ${errorRate}`]
        }
      ]
    };
  };

  const calculateTechnologyScore = (responses: Record<string, any>): SectionScore => {
    const currentSystems = responses.currentSystems || [];
    const integrationNeeds = responses.integrationNeeds || [];
    const dataAccess = responses.dataAccess || [];

    const systemScore = calculateSystemScore(currentSystems);
    const integrationScore = 1 - (integrationNeeds.length / currentSystems.length || 0);
    const dataAccessScore = calculateDataAccessScore(dataAccess);

    return {
      score: (systemScore * 0.4 + integrationScore * 0.3 + dataAccessScore * 0.3),
      confidence: 0.8,
      areas: [
        {
          name: 'System Coverage',
          score: systemScore,
          insights: [`${currentSystems.length} systems currently in use`]
        },
        {
          name: 'Integration Status',
          score: integrationScore,
          insights: [`${integrationNeeds.length} systems require integration`]
        },
        {
          name: 'Data Accessibility',
          score: dataAccessScore,
          insights: [`Current data access methods: ${dataAccess.join(', ')}`]
        }
      ]
    };
  };

  const calculateChallengesScore = (responses: Record<string, any>): SectionScore => {
    const painPoints = responses.painPoints || [];
    const priority = responses.priority || '';

    const painPointsScore = 1 - (painPoints.length / 8);
    const priorityScore = calculatePriorityScore(priority);

    return {
      score: (painPointsScore * 0.6 + priorityScore * 0.4),
      confidence: 0.75,
      areas: [
        {
          name: 'Pain Points',
          score: painPointsScore,
          insights: [`${painPoints.length} operational challenges identified`]
        },
        {
          name: 'Priority Areas',
          score: priorityScore,
          insights: [`Primary focus area: ${priority}`]
        }
      ]
    };
  };

  const calculateGoalsScore = (responses: Record<string, any>): SectionScore => {
    const objectives = responses.objectives || [];
    const expectedOutcomes = responses.expectedOutcomes || [];

    const objectivesScore = objectives.length / 6;
    const outcomesScore = expectedOutcomes.length / 6;

    return {
      score: (objectivesScore * 0.5 + outcomesScore * 0.5),
      confidence: 0.8,
      areas: [
        {
          name: 'Objectives Clarity',
          score: objectivesScore,
          insights: [`${objectives.length} clear objectives defined`]
        },
        {
          name: 'Expected Outcomes',
          score: outcomesScore,
          insights: [`${expectedOutcomes.length} specific outcomes identified`]
        }
      ]
    };
  };

  const calculateBudgetScore = (responses: Record<string, any>): SectionScore => {
    const budget = responses.monthlyBudget || '';
    const timeline = responses.timeline || '';

    const budgetScore = calculateBudgetRangeScore(budget);
    const timelineScore = calculateTimelineScore(timeline);

    return {
      score: (budgetScore * 0.6 + timelineScore * 0.4),
      confidence: 0.85,
      areas: [
        {
          name: 'Budget Range',
          score: budgetScore,
          insights: [`Monthly budget: ${budget}`]
        },
        {
          name: 'Implementation Timeline',
          score: timelineScore,
          insights: [`Desired timeline: ${timeline}`]
        }
      ]
    };
  };

  const calculateErrorScore = (errorRate: string): number => {
    const scores: Record<string, number> = {
      'Less than 1%': 0.95,
      '1-2%': 0.85,
      '3-5%': 0.7,
      '6-10%': 0.5,
      'More than 10%': 0.3,
      'Not tracked': 0.4
    };
    return scores[errorRate] || 0.4;
  };

  const calculateSystemScore = (systems: string[]): number => {
    const modernSystems = systems.filter(s => 
      ['CRM', 'ERP', 'Document Management', 'Project Management', 'Accounting Software'].includes(s)
    ).length;
    return Math.min(1, modernSystems / 5);
  };

  const calculateDataAccessScore = (methods: string[]): number => {
    const scores: Record<string, number> = {
      'API integrations': 1,
      'Automated sync': 0.9,
      'File exports/imports': 0.6,
      'Manual data entry': 0.3,
      'No data sharing': 0.1
    };
    return methods.reduce((acc, method) => acc + (scores[method] || 0), 0) / Math.max(1, methods.length);
  };

  const calculatePriorityScore = (priority: string): number => {
    const scores: Record<string, number> = {
      'Speed up processing time': 0.9,
      'Reduce errors': 0.85,
      'Free up staff time': 0.8,
      'Improve tracking/visibility': 0.75,
      'Reduce operational costs': 0.7
    };
    return scores[priority] || 0.5;
  };

  const calculateBudgetRangeScore = (budget: string): number => {
    const scores: Record<string, number> = {
      'Up to $500': 0.3,
      '$501-$1,000': 0.5,
      '$1,001-$5,000': 0.8,
      '$5,001+': 1
    };
    return scores[budget] || 0.5;
  };

  const calculateTimelineScore = (timeline: string): number => {
    const scores: Record<string, number> = {
      'Within 1 month': 1,
      '1-3 months': 0.8,
      '3-6 months': 0.6,
      '6+ months': 0.4
    };
    return scores[timeline] || 0.5;
  };

  const calculateWeightedScore = (sections: Record<string, { score: number; weight: number }>): number => {
    return Object.values(sections).reduce((total, { score, weight }) => 
      total + (score * weight), 0
    );
  };

  return null; // Results will be shown by ReportGenerator
};

export default Calculator;