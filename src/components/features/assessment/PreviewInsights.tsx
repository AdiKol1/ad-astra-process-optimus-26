import React from 'react';
import { useAssessment } from '../../../contexts/AssessmentContext';

const PreviewInsights: React.FC = () => {
  const { assessmentData } = useAssessment();

  const previewInsights = [
    {
      title: 'Process Efficiency',
      description: 'Learn how your current processes compare to industry standards.',
      icon: '⚡'
    },
    {
      title: 'Cost Savings',
      description: 'Discover potential cost savings through process optimization.',
      icon: '💰'
    },
    {
      title: 'Team Productivity',
      description: 'Understand how to boost your team\'s productivity.',
      icon: '👥'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Preview Your Business Insights
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {previewInsights.map((insight, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{insight.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {insight.title}
            </h3>
            <p className="text-gray-600">{insight.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Add your action here
            console.log('Continue assessment clicked');
          }}
        >
          Continue Assessment
        </button>
      </div>
    </div>
  );
};

export default PreviewInsights;