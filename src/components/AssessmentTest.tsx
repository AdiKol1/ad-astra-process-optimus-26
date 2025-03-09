import { useState } from 'react';
import { 
  Industry,
  ProcessVolume,
  ErrorRate,
  AssessmentStep,
  AssessmentResponses,
  AssessmentResults
} from '../types/assessment';
import { AssessmentService } from '../services/AssessmentService';
import { ValidationService } from '../services/ValidationService';
import { useAssessment, useAssessmentStep, useAssessmentResponses } from '../contexts/AssessmentContext';

const assessmentService = new AssessmentService();
const validationService = ValidationService.getInstance();

export function AssessmentTest() {
  const { state } = useAssessment();
  const [step, setStep] = useAssessmentStep();
  const [responses, updateResponses] = useAssessmentResponses();
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const sampleResponses: Partial<AssessmentResponses> = {
    industry: Industry.Technology,
    teamSize: 50,
    processVolume: ProcessVolume.High,
    errorRate: ErrorRate.Medium,
    automationLevel: 'medium',
    currentTools: ['jira', 'slack', 'github'],
    manualProcesses: [
      'Data Entry',
      'Report Generation',
      'Invoice Processing',
      'Customer Onboarding'
    ],
    challenges: [
      'Time-consuming manual processes',
      'High error rates',
      'Lack of standardization'
    ],
    objectives: [
      'Reduce manual work',
      'Improve accuracy',
      'Increase efficiency'
    ],
    timeline: '3-6 months',
    budget: '$50,000-$100,000'
  };

  const runTest = () => {
    try {
      const validationResult = validationService.validateStep(AssessmentStep.Initial, sampleResponses);
      const assessmentResults = assessmentService.generateResults(sampleResponses as AssessmentResponses);
      
      setResults(assessmentResults);
      updateResponses(sampleResponses);
      setStep(AssessmentStep.Process);
    } catch (error) {
      console.error('Assessment error:', error);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Process Assessment System</h1>
        <p className="text-muted-foreground mt-2">Analyze and optimize your business processes</p>
      </header>
      
      <div className="grid gap-8">
        {/* Current State */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Current Assessment State</h2>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>

        {/* Action Button */}
        <div className="flex justify-start">
          <button
            onClick={runTest}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
          >
            Run Assessment
          </button>
        </div>

        {/* Results Display */}
        {results && (
          <div className="grid gap-6">
            {/* Metrics Overview */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Assessment Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-muted-foreground mb-2">Efficiency</h3>
                  <div className="space-y-2">
                    <p>Current: {(results.metrics.efficiency.current * 100).toFixed(1)}%</p>
                    <p>Potential: {(results.metrics.efficiency.potential * 100).toFixed(1)}%</p>
                    <p>Improvement: {results.metrics.efficiency.improvement}%</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-muted-foreground mb-2">Cost Analysis</h3>
                  <div className="space-y-2">
                    <p>Current: ${results.metrics.cost.current.toLocaleString()}</p>
                    <p>Projected: ${results.metrics.cost.projected.toLocaleString()}</p>
                    <p>Annual Savings: ${results.metrics.cost.savings.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-muted-foreground mb-2">ROI Analysis</h3>
                  <div className="space-y-2">
                    <p>1 Year: {results.metrics.roi.oneYear}%</p>
                    <p>3 Year: {results.metrics.roi.threeYear}%</p>
                    <p>5 Year: {results.metrics.roi.fiveYear}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Summary</h2>
              <p className="text-card-foreground mb-6">{results.summary.overview}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Key Findings</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {results.summary.keyFindings.map((finding, index) => (
                      <li key={index} className="text-sm">{finding}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Next Steps</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {results.summary.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Detailed Recommendations</h2>
              
              <div className="space-y-6">
                {/* Automation Opportunities */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-4">Automation Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.recommendations.automationOpportunities.map((opp, index) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium mb-2">{opp.process}</h4>
                        <p className="text-sm mb-2">Potential Savings: ${opp.potentialSavings.toLocaleString()}</p>
                        <div className="flex gap-2 text-sm">
                          <span className="bg-secondary px-2 py-1 rounded">Complexity: {opp.complexity}</span>
                          <span className="bg-secondary px-2 py-1 rounded">Priority: {opp.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Improvements */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-4">Process Improvements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.recommendations.processImprovements.map((imp, index) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium mb-2">{imp.area}</h4>
                        <p className="text-sm mb-2">{imp.recommendation}</p>
                        <span className="bg-secondary px-2 py-1 rounded text-sm">Impact: {imp.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tool Recommendations */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-4">Recommended Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.recommendations.toolRecommendations.map((tool, index) => (
                      <div key={index} className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium mb-2">{tool.name}</h4>
                        <p className="text-sm mb-3">{tool.purpose}</p>
                        <ul className="text-sm space-y-1">
                          {tool.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 