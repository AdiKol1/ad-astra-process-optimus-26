import React, { useEffect, useMemo } from 'react';
import { FiArrowRight, FiDownload, FiPhoneCall, FiMail, FiCalendar } from 'react-icons/fi';
import { trackEvent } from './utils/analytics';

interface PersonalizedCTAProps {
  responses: Record<string, any>;
  currentSection: string;
  progress: number;
  onAction: (action: string) => void;
}

interface CTAVariant {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  action: string;
  priority: number;
  color: string;
  conditions: (responses: Record<string, any>) => boolean;
}

const PersonalizedCTA: React.FC<PersonalizedCTAProps> = ({
  responses,
  currentSection,
  progress,
  onAction,
}) => {
  // Define CTA variants with conditions
  const ctaVariants: CTAVariant[] = [
    {
      id: 'urgent-consultation',
      title: 'Critical Process Gaps Identified',
      description: 'Your responses indicate significant optimization opportunities. Schedule a consultation to discuss immediate improvements.',
      buttonText: 'Schedule Emergency Consultation',
      icon: <FiPhoneCall className="w-5 h-5" />,
      action: 'schedule_urgent',
      priority: 1,
      color: 'red',
      conditions: (r) => {
        const inefficiencyScore = calculateInefficiencyScore(r);
        return inefficiencyScore > 0.7;
      }
    },
    {
      id: 'cost-savings',
      title: 'Potential Cost Savings Report',
      description: 'Based on your responses, we've identified substantial cost-saving opportunities. Get your detailed analysis now.',
      buttonText: 'Get Savings Analysis',
      icon: <FiDownload className="w-5 h-5" />,
      action: 'download_report',
      priority: 2,
      color: 'green',
      conditions: (r) => r.budget_concerns === 'high' || r.cost_reduction_priority === 'critical'
    },
    {
      id: 'process-optimization',
      title: 'Process Optimization Roadmap',
      description: 'See how your processes compare to industry leaders and get a customized improvement plan.',
      buttonText: 'View Custom Roadmap',
      icon: <FiArrowRight className="w-5 h-5" />,
      action: 'view_roadmap',
      priority: 3,
      color: 'blue',
      conditions: (r) => r.process_maturity === 'developing' || r.automation_level === 'low'
    },
    {
      id: 'expert-consultation',
      title: 'Expert Consultation',
      description: 'Connect with our process optimization experts for personalized guidance.',
      buttonText: 'Book Consultation',
      icon: <FiCalendar className="w-5 h-5" />,
      action: 'book_consultation',
      priority: 4,
      color: 'purple',
      conditions: () => true // Default fallback
    }
  ];

  // Calculate inefficiency score based on responses
  const calculateInefficiencyScore = (r: Record<string, any>): number => {
    let score = 0;
    const factors = {
      process_delays: r.process_delays === 'frequent' ? 0.3 : 0,
      manual_work: r.manual_work_percentage > 70 ? 0.2 : 0,
      error_rate: r.error_rate === 'high' ? 0.2 : 0,
      resource_utilization: r.resource_utilization === 'poor' ? 0.2 : 0,
      bottlenecks: r.bottlenecks === 'many' ? 0.1 : 0
    };
    
    return Object.values(factors).reduce((a, b) => a + b, 0);
  };

  // Select the most relevant CTA based on conditions and priority
  const selectedCTA = useMemo(() => {
    return ctaVariants.find(variant => variant.conditions(responses)) || ctaVariants[3];
  }, [responses]);

  // Track CTA view
  useEffect(() => {
    if (selectedCTA) {
      trackEvent({
        category: 'Personalized_CTA',
        action: 'View',
        metadata: {
          ctaId: selectedCTA.id,
          section: currentSection,
          progress,
          responseCount: Object.keys(responses).length
        }
      });
    }
  }, [selectedCTA, currentSection, progress, responses]);

  const handleClick = () => {
    trackEvent({
      category: 'Personalized_CTA',
      action: 'Click',
      metadata: {
        ctaId: selectedCTA.id,
        action: selectedCTA.action,
        section: currentSection,
        progress
      }
    });
    
    onAction(selectedCTA.action);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, hover: string, text: string }> = {
      red: { bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-red-600' },
      green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', text: 'text-green-600' },
      blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colorClasses = getColorClasses(selectedCTA.color);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 rounded-full p-3 ${colorClasses.bg.replace('bg-', 'bg-opacity-10')}`}>
            {selectedCTA.icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedCTA.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedCTA.description}
            </p>
            <button
              onClick={handleClick}
              className={`inline-flex items-center px-4 py-2 rounded-lg ${colorClasses.bg} ${colorClasses.hover} text-white transition-colors duration-150`}
            >
              {selectedCTA.buttonText}
              <FiArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {progress >= 75 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Complete your assessment to unlock full insights
            </div>
            <div className="text-sm font-medium text-gray-900">
              {progress}% Complete
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${colorClasses.bg}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedCTA;