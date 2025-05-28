import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AssessmentData, SectionScore } from '../types';

interface ActionPlanProps {
  assessmentData: AssessmentData;
  sectionScores: Record<string, SectionScore>;
  onScheduleCall?: () => void;
}

const ActionPlan: React.FC<ActionPlanProps> = ({
  assessmentData,
  sectionScores,
  onScheduleCall,
}) => {
  const generateActionItems = () => {
    const items = [];
    const overallScore = Object.values(sectionScores)
      .reduce((acc, curr) => acc + (curr.score || 0), 0) / Object.keys(sectionScores).length;

    // Immediate actions (0-30 days)
    items.push({
      timeframe: 'Immediate (0-30 days)',
      actions: [
        'Schedule a detailed process review session',
        'Identify quick-win automation opportunities',
        'Begin stakeholder alignment discussions',
      ],
    });

    // Short-term actions (1-3 months)
    items.push({
      timeframe: 'Short-term (1-3 months)',
      actions: [
        'Implement pilot automation projects',
        'Develop process documentation',
        'Train key team members',
      ],
    });

    // Long-term actions (3-6 months)
    items.push({
      timeframe: 'Long-term (3-6 months)',
      actions: [
        'Scale successful automation initiatives',
        'Measure and optimize ROI',
        'Establish continuous improvement framework',
      ],
    });

    return items;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended Action Plan</h2>
        {onScheduleCall && (
          <Button onClick={onScheduleCall} className="bg-blue-600 hover:bg-blue-700">
            Schedule Consultation
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {generateActionItems().map((phase, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-xl font-semibold">{phase.timeframe}</h3>
            <ul className="space-y-2">
              {phase.actions.map((action, actionIndex) => (
                <li key={actionIndex} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800">Next Steps</h3>
        <p className="text-yellow-700">
          To begin implementing these recommendations, we suggest scheduling a consultation 
          with our process optimization experts. They can help you prioritize these actions 
          based on your specific needs and resources.
        </p>
      </div>
    </Card>
  );
};

export default ActionPlan;
