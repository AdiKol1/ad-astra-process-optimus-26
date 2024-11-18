import React from 'react';
import { Card } from '@/components/ui/card';
import { ResultsVisualization } from './ResultsVisualization';
import { ScoreCards } from './ScoreCards';
import { ROICalculator } from './ROICalculator';
import { RecommendationCard } from './RecommendationCard';
import { 
  AssessmentData, 
  SectionScore, 
  IndustryBenchmark, 
  PotentialSavings 
} from './AssessmentContext';

interface ReportGeneratorProps {
  auditState: {
    assessmentData: AssessmentData | null;
  };
}

interface VisualizationData {
  assessmentScore: {
    overall: number;
    sections: {
      [key: string]: { percentage: number };
    };
    automationPotential: number;
  };
  results: {
    annual: {
      savings: number;
      hours: number;
    };
  };
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ auditState }) => {
  const { assessmentData } = auditState;
  
  // Early return with loading state if no data
  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading assessment data...</p>
      </div>
    );
  }

  // Ensure all required data has default values
  const score = Math.max(0, Math.min(1, assessmentData.score ?? 0));
  const sectionScores = assessmentData.sectionScores ?? {
    process: { score: 0, confidence: 0, areas: [] },
    communication: { score: 0, confidence: 0, areas: [] },
    automation: { score: 0, confidence: 0, areas: [] }
  };

  const potentialSavings = assessmentData.potentialSavings ?? {
    annual: 0,
    hoursSaved: { perEmployee: 0, total: 0 },
    roi: 0,
    revenueGrowth: { conservative: 0, optimistic: 0 }
  };

  // Transform data for visualization components
  const visualizationData: VisualizationData = {
    assessmentScore: {
      overall: score * 100,
      sections: {
        process: { percentage: Math.max(0, Math.min(100, sectionScores.process?.score ?? 0 * 100)) },
        communication: { percentage: Math.max(0, Math.min(100, sectionScores.communication?.score ?? 0 * 100)) },
        automation: { percentage: Math.max(0, Math.min(100, sectionScores.automation?.score ?? 0 * 100)) }
      },
      automationPotential: calculateAutomationPotential(sectionScores)
    },
    results: {
      annual: {
        savings: Math.max(0, potentialSavings.annual),
        hours: Math.max(0, estimateAnnualHoursSaved(sectionScores))
      }
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Math.max(0, value));
  };

  const formatNumber = (num: number): string => 
    new Intl.NumberFormat('en-US').format(Math.round(num));

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Process Optimization Assessment Report
        </h2>
        <p className="text-gray-600">
          Based on your responses, we've analyzed your current process maturity and identified optimization opportunities.
        </p>
      </div>

      {/* Visualization Section */}
      <ResultsVisualization 
        assessmentScore={visualizationData.assessmentScore}
        results={visualizationData.results}
      />

      {/* Score Cards */}
      <ScoreCards 
        overallScore={score}
        sectionScores={sectionScores}
        benchmarks={assessmentData.industryBenchmarks}
      />

      {/* ROI Analysis */}
      <ROICalculator
        costs={assessmentData.costs}
        potentialSavings={potentialSavings}
        automationPotential={visualizationData.assessmentScore.automationPotential}
      />

      {/* Efficiency Gains */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Efficiency Gains
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Time Savings</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Per Employee (Annual)</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatHours(potentialSavings.hoursSaved.perEmployee || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Team (Annual)</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatHours(potentialSavings.hoursSaved.total || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Financial Impact</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Cost Savings (Annual)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(potentialSavings.annual)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPercentage((potentialSavings.roi || 0) * 100)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Growth Potential */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Revenue Growth Potential
        </h3>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Conservative Estimate</h4>
              <p className="text-3xl font-bold text-purple-600">
                {formatCurrency(potentialSavings.revenueGrowth.conservative || 0)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Based on 10% revenue growth per optimized hour
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Optimistic Estimate</h4>
              <p className="text-3xl font-bold text-purple-600">
                {formatCurrency(potentialSavings.revenueGrowth.optimistic || 0)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Based on 20% revenue growth per optimized hour
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">How we calculate this:</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>We analyze your current revenue per employee</li>
              <li>Calculate the value of each working hour</li>
              <li>Project growth based on efficiency improvements</li>
              <li>Factor in industry-specific growth multipliers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Strategic Recommendations
        </h3>
        <div className="space-y-4">
          {assessmentData.recommendations?.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              recommendation={recommendation}
            />
          ))}
        </div>
      </section>

      {/* Action Plan */}
      <section className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Next Steps
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <ActionButton
            label="Book Strategy Session"
            description="Get a personalized implementation plan"
            onClick={() => window.open('https://calendly.com/your-link', '_blank')}
          />
          <ActionButton
            label="Download Full Report"
            description="Get detailed insights and recommendations"
            onClick={() => generatePDF(assessmentData)}
          />
        </div>
      </section>

      {/* Report Generator */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Report Generator
        </h3>
        <div className="space-y-6 p-4">
          {/* Recommendations */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessmentData.recommendations?.map((rec, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                      rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{rec.description}</p>
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium">Benefits:</div>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {rec.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium">Implementation:</div>
                      <div className="text-sm text-gray-600">
                        <div>Timeline: {rec.implementation.timeline} weeks</div>
                        <div>Estimated Cost: {formatCurrency(rec.implementation.estimatedCost)}</div>
                        <div>ROI: {rec.roi}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Potential Savings */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Potential Savings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Annual Impact</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Hours Saved</div>
                    <div className="text-2xl font-bold">{formatNumber(potentialSavings.hoursSaved.total || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(potentialSavings.annual)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">5-Year Impact</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Hours Saved</div>
                    <div className="text-2xl font-bold">{formatNumber(potentialSavings.hoursSaved.total * 5 || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Cost Savings</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(potentialSavings.annual * 5)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="text-2xl font-bold">{potentialSavings.roi.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                    <div className="text-2xl font-bold">{potentialSavings.paybackPeriod.toFixed(1)} months</div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Industry Benchmarks */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Industry Benchmarks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {assessmentData.industryBenchmarks?.map((benchmark, index) => (
                <Card key={index} className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{benchmark.metric}</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-600">Your Score</div>
                      <div className="text-2xl font-bold">{benchmark.value.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Industry Average</div>
                      <div className="text-lg">{benchmark.industry}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Percentile</div>
                      <div className="text-lg">{benchmark.percentile.toFixed(1)}%</div>
                    </div>
                    <div className={`text-sm ${
                      benchmark.trend === 'up' ? 'text-green-600' :
                      benchmark.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      Trend: {benchmark.trend.toUpperCase()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

const ActionButton: React.FC<{
  label: string;
  description: string;
  onClick: () => void;
}> = ({ label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-4 text-left bg-white rounded-lg shadow hover:shadow-md transition-shadow"
  >
    <h4 className="text-lg font-semibold text-gray-900">{label}</h4>
    <p className="text-gray-600">{description}</p>
  </button>
);

const calculateAutomationPotential = (sectionScores: Record<string, SectionScore>): number => {
  if (!sectionScores.automation || !sectionScores.process) {
    return 0;
  }

  const automationScore = Math.max(0, Math.min(1, sectionScores.automation.score));
  const processScore = Math.max(0, Math.min(1, sectionScores.process.score));

  return Math.max(0, Math.min(100, (automationScore * 0.6 + processScore * 0.4) * 100));
};

const estimateAnnualHoursSaved = (sectionScores: Record<string, SectionScore>): number => {
  if (!sectionScores.automation || !sectionScores.process) {
    return 0;
  }

  const baseHours = 2080; // 40 hours/week * 52 weeks
  const potentialSavings = calculateAutomationPotential(sectionScores) / 100;
  
  return Math.max(0, Math.round(baseHours * potentialSavings * 0.3));
};

const formatPercentage = (value: number): string => {
  return Math.max(0, Math.min(100, value)).toFixed(1) + '%';
};

const formatHours = (value: number): string => {
  return Math.max(0, Math.round(value)).toLocaleString() + ' hours';
};

const generatePDF = (assessmentData: AssessmentData): void => {
  // Implementation
};

export default ReportGenerator;