import { 
  Industry,
  ProcessVolume,
  ErrorRate,
  AssessmentStep,
  AssessmentResponses
} from '../types/assessment';
import { AssessmentService } from '../services/AssessmentService';
import { ValidationService } from '../services/ValidationService';
import { useAssessmentStore } from '@/contexts/assessment/store';

const assessmentService = new AssessmentService();
const validationService = ValidationService.getInstance();

export function AssessmentTest() {
  const {
    setStep,
    updateResponses,
    results,
    setResults
  } = useAssessmentStore();
  const state = useAssessmentStore();

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
      validationService.validateStep(AssessmentStep.Initial, sampleResponses);
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
                    <p>Efficiency: {(results.metrics.efficiency * 100).toFixed(1)}%</p>
                    <p>Automation Level: {(results.metrics.automationLevel * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-muted-foreground mb-2">Cost Analysis</h3>
                  <div className="space-y-2">
                    <p>Current: ${results.costs.current.toLocaleString()}</p>
                    <p>Projected: ${results.costs.projected.toLocaleString()}</p>
                    <p>Annual Savings: ${results.savings.annual.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-muted-foreground mb-2">ROI Analysis</h3>
                  <div className="space-y-2">
                    <p>ROI: {results.metrics.roi}%</p>
                    <p>Payback Period: {results.metrics.paybackPeriodMonths} months</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Detailed Recommendations</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2">{rec.title}</h4>
                      <p className="text-sm mb-2">{rec.description}</p>
                      <div className="flex gap-2 text-sm">
                        <span className="bg-secondary px-2 py-1 rounded">Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 