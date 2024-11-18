import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../ui/card';
import { LoadingSpinner } from '../../ui/loading-spinner';
import { useAssessment } from './AssessmentContext';
import type { SectionScore, Recommendation, IndustryBenchmark, PotentialSavings } from './AssessmentContext';

interface SectionScore {
  score: number;
  confidence: number;
  areas: {
    name: string;
    score: number;
    insights: string[];
  }[];
}

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { auditState, setAssessmentData } = useAssessment();
  const [isCalculating, setIsCalculating] = React.useState(true);

  React.useEffect(() => {
    if (!auditState.assessmentData) {
      navigate('/assessment');
      return;
    }

    const timer = setTimeout(() => {
      const responses = auditState.assessmentData.responses;

      try {
        // Calculate section scores
        const teamScore = calculateTeamScore(responses);
        const processScore = calculateProcessScore(responses);
        const technologyScore = calculateTechnologyScore(responses);
        const challengesScore = calculateChallengesScore(responses);
        const goalsScore = calculateGoalsScore(responses);
        const budgetScore = calculateBudgetScore(responses);

        // Calculate weighted total score
        const totalScore = calculateWeightedScore({
          team: { score: teamScore.score, weight: 0.2 },
          process: { score: processScore.score, weight: 0.25 },
          technology: { score: technologyScore.score, weight: 0.2 },
          challenges: { score: challengesScore.score, weight: 0.15 },
          goals: { score: goalsScore.score, weight: 0.1 },
          budget: { score: budgetScore.score, weight: 0.1 }
        });

        // Generate recommendations
        const recommendations = generateRecommendations({
          team: teamScore,
          process: processScore,
          technology: technologyScore,
          challenges: challengesScore,
          goals: goalsScore,
          budget: budgetScore,
          responses
        });

        // Calculate potential savings
        const potentialSavings = calculatePotentialSavings({
          team: teamScore,
          process: processScore,
          technology: technologyScore,
          responses
        });

        // Calculate industry benchmarks
        const benchmarks = generateIndustryBenchmarks({
          team: teamScore,
          process: processScore,
          technology: technologyScore,
          responses
        });

        // Calculate ROI projection
        const roiProjection = calculateROIProjection(responses);

        setAssessmentData({
          ...auditState.assessmentData,
          score: totalScore,
          recommendations,
          sectionScores: {
            team: teamScore,
            process: processScore,
            technology: technologyScore,
            challenges: challengesScore,
            goals: goalsScore,
            budget: budgetScore
          },
          industryBenchmarks: benchmarks,
          potentialSavings,
          roiProjection,
          metadata: {
            completedAt: new Date().toISOString(),
            duration: 0,
            confidence: 0.85
          }
        });

      } catch (error) {
        console.error('Error calculating assessment:', error);
      }

      setIsCalculating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [auditState.assessmentData, navigate, setAssessmentData]);

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

  const calculateProcessEfficiencyScore = (responses: any): number => {
    let score = 0;
    const weights = {
      processTime: 0.3,
      errorRate: 0.2,
      qualityMetrics: 0.2,
      bottlenecks: 0.15,
      complexity: 0.15
    };

    // Process time analysis
    const avgProcessTime = Object.values(responses.processTime).reduce((a: number, b: number) => a + b, 0) / Object.keys(responses.processTime).length;
    const processTimeScore = Math.max(0, 1 - (avgProcessTime / 30)); // Normalize against 30-minute baseline

    // Error rate analysis
    const errorRateScore = 1 - (responses.qualityMetrics.errorRate / 10); // Normalize against 10% baseline

    // Quality metrics
    const qualityScore = (
      (1 - responses.qualityMetrics.errorRate / 10) +
      (1 - responses.qualityMetrics.reworkRate / 20) +
      (1 - responses.qualityMetrics.customerComplaints / 20)
    ) / 3;

    // Bottleneck impact
    const bottleneckScore = Math.max(0, 1 - (responses.bottlenecks.length / 10));

    // Process complexity
    const complexityScore = responses.processComplexity === 'High' ? 0.3 :
                           responses.processComplexity === 'Medium' ? 0.6 : 0.9;

    score = (
      processTimeScore * weights.processTime +
      errorRateScore * weights.errorRate +
      qualityScore * weights.qualityMetrics +
      bottleneckScore * weights.bottlenecks +
      complexityScore * weights.complexity
    );

    return Math.min(1, Math.max(0, score));
  };

  const calculateTechnologyScore = (responses: any): number => {
    let score = 0;
    const weights = {
      systemUtilization: 0.3,
      dataQuality: 0.3,
      integration: 0.2,
      dataAccess: 0.2
    };

    // System utilization score
    const avgUtilization = Object.values(responses.systemUtilization).reduce((a: number, b: number) => a + b, 0) / Object.keys(responses.systemUtilization).length;
    const utilizationScore = avgUtilization / 100;

    // Data quality score
    const dataQualityScore = (
      responses.dataQuality.accuracy / 100 +
      responses.dataQuality.completeness / 100 +
      responses.dataQuality.timeliness / 100
    ) / 3;

    // Integration capability score
    const integrationScore = responses.integrationNeeds.length > 0 ?
      responses.currentSystems.filter((sys: string) => responses.integrationNeeds.includes(sys)).length / responses.integrationNeeds.length : 0;

    // Data access maturity score
    const dataAccessScore = responses.dataAccess.includes('API integrations') ? 1 :
                           responses.dataAccess.includes('Automated sync') ? 0.8 :
                           responses.dataAccess.includes('File exports/imports') ? 0.5 : 0.2;

    score = (
      utilizationScore * weights.systemUtilization +
      dataQualityScore * weights.dataQuality +
      integrationScore * weights.integration +
      dataAccessScore * weights.dataAccess
    );

    return Math.min(1, Math.max(0, score));
  };

  const calculateROIProjection = (responses: any): { 
    annualSavings: number,
    paybackPeriod: number,
    productivityGain: number 
  } => {
    // Calculate current costs
    const managerCost = responses.roleBreakdown.managers * responses.hourlyRates.managerRate * responses.hoursPerWeek * 52;
    const specialistCost = responses.roleBreakdown.specialists * responses.hourlyRates.specialistRate * responses.hoursPerWeek * 52;
    const operatorCost = responses.roleBreakdown.operators * responses.hourlyRates.operatorRate * responses.hoursPerWeek * 52;
    const totalLaborCost = managerCost + specialistCost + operatorCost;

    // Calculate potential savings
    const errorCost = totalLaborCost * (responses.qualityMetrics.errorRate / 100) * 0.5;
    const reworkCost = totalLaborCost * (responses.qualityMetrics.reworkRate / 100) * 0.3;
    
    // Calculate time savings
    const totalProcessTime = Object.values(responses.processTime).reduce((a: number, b: number) => a + b, 0);
    const timeSavings = totalProcessTime * 0.6; // Based on 60% reduction goal
    
    const annualSavings = errorCost + reworkCost + (timeSavings * responses.teamSize * responses.hourlyRates.specialistRate * 252); // 252 working days
    
    // Calculate payback period (months)
    const monthlyBudget = responses.monthlyBudget === '$5,001+' ? 7500 : 5000; // Estimate
    const paybackPeriod = (monthlyBudget * 6) / (annualSavings / 12); // Based on 6-month implementation
    
    // Productivity gain percentage
    const productivityGain = (timeSavings / totalProcessTime) * 100;

    return {
      annualSavings,
      paybackPeriod,
      productivityGain
    };
  };

  // Helper functions
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

  // For testing purposes
  export const runTestCalculation = () => {
    const testData = {
      responses: {
        // Team Structure & Resource Analysis
        teamSize: 50,
        departments: [
          'Operations',
          'Finance',
          'HR',
          'Sales',
          'Customer Service',
          'IT',
          'Management'
        ],
        roleBreakdown: {
          managers: 8,
          specialists: 32,
          operators: 10
        },
        hoursPerWeek: 40,
        hourlyRates: {
          managerRate: 85,
          specialistRate: 55,
          operatorRate: 35
        },
        workloadDistribution: {
          administrative: 40,
          operational: 35,
          strategic: 25
        },

        // Process Efficiency
        manualProcesses: [
          'Data Entry',
          'Document Processing',
          'Customer Communication',
          'Reporting',
          'Invoice Processing',
          'Quality Control',
          'Scheduling',
          'Approval Workflows'
        ],
        processTime: {
          dataEntry: 15,
          documentation: 12,
          communication: 8,
          reporting: 10,
          qualityControl: 5
        },
        errorRate: '3-5%',
        bottlenecks: [
          'Manual data entry',
          'Communication delays',
          'Approval processes',
          'System limitations',
          'Data accuracy',
          'Process complexity'
        ],
        processComplexity: 'High',
        qualityMetrics: {
          errorRate: 4,
          reworkRate: 8,
          customerComplaints: 12
        },

        // Technology Assessment
        currentSystems: [
          'CRM',
          'ERP',
          'Document Management',
          'Project Management',
          'Accounting Software',
          'Custom Solutions',
          'Spreadsheets'
        ],
        integrationNeeds: [
          'CRM',
          'ERP',
          'Document Management',
          'Project Management',
          'Accounting Software'
        ],
        dataAccess: [
          'File exports/imports',
          'Manual data entry',
          'API integrations',
          'Automated sync',
          'No data sharing'
        ],
        systemUtilization: {
          crm: 75,
          erp: 60,
          documentManagement: 45,
          projectManagement: 80
        },
        dataQuality: {
          accuracy: 85,
          completeness: 70,
          timeliness: 65
        },

        // Current Challenges
        painPoints: [
          'Too much manual data entry',
          'High error rates',
          'Slow processing times',
          'Limited system integration',
          'Data inconsistencies',
          'Process bottlenecks',
          'Resource constraints',
          'Training gaps'
        ],
        priority: 'Speed up processing time',
        impactAreas: [
          'Customer satisfaction',
          'Employee productivity',
          'Data accuracy',
          'Cost efficiency'
        ],
        challengesSeverity: {
          operational: 'High',
          technical: 'Medium',
          resource: 'Medium'
        },

        // Goals and Objectives
        objectives: [
          'Reduce manual data entry by 80%',
          'Improve data accuracy to 99%',
          'Speed up processing by 60%',
          'Achieve real-time system integration',
          'Optimize resource allocation',
          'Enhance reporting capabilities'
        ],
        expectedOutcomes: [
          'Reduce processing time by 60%',
          'Eliminate manual data entry',
          'Real-time data synchronization',
          'Improved customer satisfaction',
          'Enhanced employee productivity'
        ],
        successMetrics: {
          processingTime: '60% reduction',
          errorRate: '90% reduction',
          employeeSatisfaction: '40% improvement',
          costSavings: '30% reduction'
        },

        // Budget and Timeline
        monthlyBudget: '$5,001+',
        timeline: '3-6 months',
        investmentPriorities: {
          automation: 40,
          integration: 30,
          training: 20,
          consulting: 10
        },
        resourceAllocation: {
          internal: 60,
          external: 40
        },
        budgetConstraints: 'Medium',
        implementationPreference: 'Phased'
      },
      currentStep: 6,
      totalSteps: 6
    };

    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
      if (!isCalculating) {
        setIsCalculating(true);
        const timer = setTimeout(() => {
          try {
            // Calculate section scores
            const teamScore = calculateTeamScore(testData.responses);
            const processScore = calculateProcessScore(testData.responses);
            const technologyScore = calculateTechnologyScore(testData.responses);
            const challengesScore = calculateChallengesScore(testData.responses);
            const goalsScore = calculateGoalsScore(testData.responses);
            const budgetScore = calculateBudgetScore(testData.responses);

            // Calculate total weighted score
            const totalScore = calculateWeightedScore({
              team: { score: teamScore.score, weight: 0.2 },
              process: { score: processScore.score, weight: 0.25 },
              technology: { score: technologyScore.score, weight: 0.2 },
              challenges: { score: challengesScore.score, weight: 0.15 },
              goals: { score: goalsScore.score, weight: 0.1 },
              budget: { score: budgetScore.score, weight: 0.1 }
            });

            // Generate recommendations
            const recommendations = generateRecommendations({
              team: teamScore,
              process: processScore,
              technology: technologyScore,
              challenges: challengesScore,
              goals: goalsScore,
              budget: budgetScore,
              responses: testData.responses
            });

            // Calculate potential savings
            const potentialSavings = calculatePotentialSavings({
              team: teamScore,
              process: processScore,
              technology: technologyScore,
              responses: testData.responses
            });

            // Calculate industry benchmarks
            const benchmarks = generateIndustryBenchmarks({
              team: teamScore,
              process: processScore,
              technology: technologyScore,
              responses: testData.responses
            });

            // Calculate ROI projection
            const roiProjection = calculateROIProjection(testData.responses);

            setAssessmentData({
              ...testData,
              score: totalScore,
              sectionScores: {
                team: teamScore,
                process: processScore,
                technology: technologyScore,
                challenges: challengesScore,
                goals: goalsScore,
                budget: budgetScore
              },
              recommendations,
              industryBenchmarks: benchmarks,
              potentialSavings,
              roiProjection,
              metadata: {
                completedAt: new Date().toISOString(),
                duration: 0,
                confidence: 0.85
              }
            });

          } catch (error) {
            console.error('Error calculating assessment:', error);
          }

          setIsCalculating(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, []);

    return isCalculating;
  };

  export const TestCalculator: React.FC = () => {
    const [isCalculating, setIsCalculating] = useState(false);
    const { setAssessmentData } = useAssessment();

    const handleRunTest = () => {
      if (!isCalculating) {
        setIsCalculating(true);
        const testData = {
          responses: {
            // Team Structure & Resource Analysis
            teamSize: 50,
            departments: [
              'Operations',
              'Finance',
              'HR',
              'Sales',
              'Customer Service',
              'IT',
              'Management'
            ],
            roleBreakdown: {
              managers: 8,
              specialists: 32,
              operators: 10
            },
            hoursPerWeek: 40,
            hourlyRates: {
              managerRate: 85,
              specialistRate: 55,
              operatorRate: 35
            },
            workloadDistribution: {
              administrative: 40,
              operational: 35,
              strategic: 25
            },

            // Process Efficiency
            manualProcesses: [
              'Data Entry',
              'Document Processing',
              'Customer Communication',
              'Reporting',
              'Invoice Processing',
              'Quality Control',
              'Scheduling',
              'Approval Workflows'
            ],
            processTime: {
              dataEntry: 15,
              documentation: 12,
              communication: 8,
              reporting: 10,
              qualityControl: 5
            },
            errorRate: '3-5%',
            bottlenecks: [
              'Manual data entry',
              'Communication delays',
              'Approval processes',
              'System limitations',
              'Data accuracy',
              'Process complexity'
            ],
            processComplexity: 'High',
            qualityMetrics: {
              errorRate: 4,
              reworkRate: 8,
              customerComplaints: 12
            },

            // Technology Assessment
            currentSystems: [
              'CRM',
              'ERP',
              'Document Management',
              'Project Management',
              'Accounting Software',
              'Custom Solutions',
              'Spreadsheets'
            ],
            integrationNeeds: [
              'CRM',
              'ERP',
              'Document Management',
              'Project Management',
              'Accounting Software'
            ],
            dataAccess: [
              'File exports/imports',
              'Manual data entry',
              'API integrations',
              'Automated sync',
              'No data sharing'
            ],
            systemUtilization: {
              crm: 75,
              erp: 60,
              documentManagement: 45,
              projectManagement: 80
            },
            dataQuality: {
              accuracy: 85,
              completeness: 70,
              timeliness: 65
            },

            // Current Challenges
            painPoints: [
              'Too much manual data entry',
              'High error rates',
              'Slow processing times',
              'Limited system integration',
              'Data inconsistencies',
              'Process bottlenecks',
              'Resource constraints',
              'Training gaps'
            ],
            priority: 'Speed up processing time',
            impactAreas: [
              'Customer satisfaction',
              'Employee productivity',
              'Data accuracy',
              'Cost efficiency'
            ],
            challengesSeverity: {
              operational: 'High',
              technical: 'Medium',
              resource: 'Medium'
            },

            // Goals and Objectives
            objectives: [
              'Reduce manual data entry by 80%',
              'Improve data accuracy to 99%',
              'Speed up processing by 60%',
              'Achieve real-time system integration',
              'Optimize resource allocation',
              'Enhance reporting capabilities'
            ],
            expectedOutcomes: [
              'Reduce processing time by 60%',
              'Eliminate manual data entry',
              'Real-time data synchronization',
              'Improved customer satisfaction',
              'Enhanced employee productivity'
            ],
            successMetrics: {
              processingTime: '60% reduction',
              errorRate: '90% reduction',
              employeeSatisfaction: '40% improvement',
              costSavings: '30% reduction'
            },

            // Budget and Timeline
            monthlyBudget: '$5,001+',
            timeline: '3-6 months',
            investmentPriorities: {
              automation: 40,
              integration: 30,
              training: 20,
              consulting: 10
            },
            resourceAllocation: {
              internal: 60,
              external: 40
            },
            budgetConstraints: 'Medium',
            implementationPreference: 'Phased'
          },
          currentStep: 6,
          totalSteps: 6
        };

        try {
          // Calculate section scores
          const teamScore = calculateTeamScore(testData.responses);
          const processScore = calculateProcessScore(testData.responses);
          const technologyScore = calculateTechnologyScore(testData.responses);
          const challengesScore = calculateChallengesScore(testData.responses);
          const goalsScore = calculateGoalsScore(testData.responses);
          const budgetScore = calculateBudgetScore(testData.responses);

          // Calculate total weighted score
          const totalScore = calculateWeightedScore({
            team: { score: teamScore.score, weight: 0.2 },
            process: { score: processScore.score, weight: 0.25 },
            technology: { score: technologyScore.score, weight: 0.2 },
            challenges: { score: challengesScore.score, weight: 0.15 },
            goals: { score: goalsScore.score, weight: 0.1 },
            budget: { score: budgetScore.score, weight: 0.1 }
          });

          // Generate recommendations
          const recommendations = generateRecommendations({
            team: teamScore,
            process: processScore,
            technology: technologyScore,
            challenges: challengesScore,
            goals: goalsScore,
            budget: budgetScore,
            responses: testData.responses
          });

          // Calculate potential savings
          const potentialSavings = calculatePotentialSavings({
            team: teamScore,
            process: processScore,
            technology: technologyScore,
            responses: testData.responses
          });

          // Calculate industry benchmarks
          const benchmarks = generateIndustryBenchmarks({
            team: teamScore,
            process: processScore,
            technology: technologyScore,
            responses: testData.responses
          });

          // Calculate ROI projection
          const roiProjection = calculateROIProjection(testData.responses);

          setAssessmentData({
            ...testData,
            score: totalScore,
            sectionScores: {
              team: teamScore,
              process: processScore,
              technology: technologyScore,
              challenges: challengesScore,
              goals: goalsScore,
              budget: budgetScore
            },
            recommendations,
            industryBenchmarks: benchmarks,
            potentialSavings,
            roiProjection,
            metadata: {
              completedAt: new Date().toISOString(),
              duration: 0,
              confidence: 0.85
            }
          });

          console.log('Test calculation completed successfully');
        } catch (error) {
          console.error('Error in test calculation:', error);
        }

        setIsCalculating(false);
      }
    };

    return (
      <div className="p-4">
        <button
          onClick={handleRunTest}
          disabled={isCalculating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isCalculating ? 'Calculating...' : 'Run Test Calculation'}
        </button>
        {isCalculating && <div className="mt-2">Processing test data...</div>}
      </div>
    );
  };

  if (isCalculating) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner />
          <p className="text-lg font-medium">Analyzing your responses...</p>
          <p className="text-sm text-gray-500">This will just take a moment</p>
        </div>
      </Card>
    );
  }

  return null; // Results will be shown by ReportGenerator
};

export default Calculator;