import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi';
import { trackEvent } from './utils/analytics';

interface Benchmark {
  metric: string;
  industry: string;
  average: string;
  topPerformers: string;
  description: string;
}

interface ValueProposition {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  relevantSections: string[];
}

interface IndustryInsightsProps {
  currentSection: string;
  industry: string;
  responses: Record<string, any>;
}

const IndustryInsights: React.FC<IndustryInsightsProps> = ({
  currentSection,
  industry,
  responses,
}) => {
  const [activeBenchmark, setActiveBenchmark] = useState<Benchmark | null>(null);
  const [activeProposition, setActiveProposition] = useState<ValueProposition | null>(null);

  // Industry benchmarks database
  const industryBenchmarks: Record<string, Benchmark[]> = {
    'Technology': [
      {
        metric: 'Process Automation Rate',
        industry: 'Technology',
        average: '45%',
        topPerformers: '75%',
        description: 'Percentage of business processes that are automated'
      },
      {
        metric: 'Employee Productivity',
        industry: 'Technology',
        average: '82%',
        topPerformers: '95%',
        description: 'Ratio of productive time to total work hours'
      }
    ],
    'Manufacturing': [
      {
        metric: 'Operational Efficiency',
        industry: 'Manufacturing',
        average: '68%',
        topPerformers: '89%',
        description: 'Overall equipment effectiveness (OEE)'
      },
      {
        metric: 'Process Cycle Time',
        industry: 'Manufacturing',
        average: '4.2 days',
        topPerformers: '1.8 days',
        description: 'Average time from process start to completion'
      }
    ],
    // Add more industries...
  };

  // Value propositions database
  const valuePropositions: ValueProposition[] = [
    {
      id: 'process-optimization',
      title: 'Process Optimization',
      description: 'Streamline your operations and eliminate bottlenecks',
      impact: 'Reduce operational costs by 25-40%',
      icon: <FiTrendingUp className="w-6 h-6 text-blue-500" />,
      relevantSections: ['process-mapping', 'workflow-analysis']
    },
    {
      id: 'resource-efficiency',
      title: 'Resource Efficiency',
      description: 'Optimize resource allocation and improve utilization',
      impact: 'Improve resource utilization by 30-45%',
      icon: <FiTarget className="w-6 h-6 text-green-500" />,
      relevantSections: ['resource-allocation', 'capacity-planning']
    },
    // Add more propositions...
  ];

  useEffect(() => {
    // Select relevant benchmark based on industry and section
    const industryData = industryBenchmarks[industry] || industryBenchmarks['Technology'];
    const relevantBenchmark = industryData[0]; // Select most relevant benchmark
    setActiveBenchmark(relevantBenchmark);

    // Select relevant value proposition based on current section
    const relevantProposition = valuePropositions.find(
      prop => prop.relevantSections.includes(currentSection)
    ) || valuePropositions[0];
    setActiveProposition(relevantProposition);

    // Track insight view
    trackEvent({
      category: 'Industry_Insights',
      action: 'View',
      metadata: {
        section: currentSection,
        industry,
        benchmarkMetric: relevantBenchmark?.metric,
        propositionId: relevantProposition?.id
      }
    });
  }, [currentSection, industry]);

  if (!activeBenchmark || !activeProposition) return null;

  return (
    <div className="space-y-6 my-8">
      {/* Industry Benchmark Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FiBarChart2 className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Industry Benchmark: {activeBenchmark.metric}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeBenchmark.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Industry Average</div>
                <div className="text-2xl font-bold text-gray-900">
                  {activeBenchmark.average}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Top Performers</div>
                <div className="text-2xl font-bold text-blue-600">
                  {activeBenchmark.topPerformers}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {activeProposition.icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeProposition.title}
            </h3>
            <p className="text-gray-600 mb-3">
              {activeProposition.description}
            </p>
            <div className="flex items-center space-x-2">
              <FiAward className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">
                Potential Impact: {activeProposition.impact}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          trackEvent({
            category: 'Industry_Insights',
            action: 'Request_Custom_Analysis',
            metadata: {
              section: currentSection,
              industry,
              benchmark: activeBenchmark.metric
            }
          });
        }}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
      >
        Request Custom Analysis for Your Organization
      </button>
    </div>
  );
};

export default IndustryInsights;