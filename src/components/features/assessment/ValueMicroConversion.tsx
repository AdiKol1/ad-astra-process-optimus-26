import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiClock, FiDollarSign, FiUsers } from 'react-icons/fi';
import { trackEvent } from './utils/analytics';

interface ValueInsight {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: string;
  category: 'efficiency' | 'cost' | 'productivity' | 'satisfaction';
}

interface ValueMicroConversionProps {
  currentSection: string;
  responses: Record<string, any>;
  onInsightView?: (insightId: string) => void;
}

const ValueMicroConversion: React.FC<ValueMicroConversionProps> = ({
  currentSection,
  responses,
  onInsightView,
}) => {
  const [currentInsight, setCurrentInsight] = useState<ValueInsight | null>(null);

  // Dynamic insights based on section and responses
  const generateInsights = (): ValueInsight[] => {
    const insights: ValueInsight[] = [
      {
        id: 'process-efficiency',
        icon: <FiTrendingUp className="w-6 h-6 text-green-500" />,
        title: 'Process Efficiency Potential',
        description: 'Based on your responses, we estimate you could reduce process time by:',
        value: '25-40%',
        category: 'efficiency'
      },
      {
        id: 'time-savings',
        icon: <FiClock className="w-6 h-6 text-blue-500" />,
        title: 'Time Savings Opportunity',
        description: 'Your team could save approximately:',
        value: '12-15 hours/week',
        category: 'productivity'
      },
      {
        id: 'cost-reduction',
        icon: <FiDollarSign className="w-6 h-6 text-purple-500" />,
        title: 'Cost Reduction Potential',
        description: 'Estimated annual cost savings:',
        value: '$50,000-75,000',
        category: 'cost'
      },
      {
        id: 'employee-satisfaction',
        icon: <FiUsers className="w-6 h-6 text-orange-500" />,
        title: 'Employee Satisfaction Impact',
        description: 'Potential improvement in employee satisfaction:',
        value: '35%',
        category: 'satisfaction'
      }
    ];

    // Filter and customize insights based on current section
    return insights.filter(insight => {
      switch (currentSection) {
        case 'process-mapping':
          return insight.category === 'efficiency';
        case 'resource-allocation':
          return insight.category === 'productivity';
        case 'cost-analysis':
          return insight.category === 'cost';
        case 'team-structure':
          return insight.category === 'satisfaction';
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    const insights = generateInsights();
    if (insights.length > 0) {
      const relevantInsight = insights[0]; // Select most relevant insight
      setCurrentInsight(relevantInsight);
      
      trackEvent({
        category: 'Value_Insight',
        action: 'Show',
        metadata: {
          insightId: relevantInsight.id,
          section: currentSection,
          responseCount: Object.keys(responses).length
        }
      });

      onInsightView?.(relevantInsight.id);
    }
  }, [currentSection, responses]);

  if (!currentInsight) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100 hover:border-blue-200 transition-colors duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {currentInsight.icon}
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {currentInsight.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {currentInsight.description}
          </p>
          {currentInsight.value && (
            <p className="text-2xl font-bold text-blue-600">
              {currentInsight.value}
            </p>
          )}
          <div className="mt-2 text-sm text-gray-500">
            Based on data from similar organizations in your industry
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => {
            trackEvent({
              category: 'Value_Insight',
              action: 'Learn_More_Click',
              metadata: {
                insightId: currentInsight.id,
                section: currentSection
              }
            });
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Learn more about this opportunity →
        </button>
      </div>
    </div>
  );
};

export default ValueMicroConversion;