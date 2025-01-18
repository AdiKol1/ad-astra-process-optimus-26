import React from 'react';
import { useAssessment } from '../AssessmentProvider';
import { ProcessData } from '@/domain/assessment/types';
import { useToast } from '@/components/ui/use-toast';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ProcessSection: React.FC = () => {
  const { service, status, data } = useAssessment();
  const { toast } = useToast();

  const handleChange = async (field: keyof ProcessData, value: string) => {
    try {
      service.updateData({
        answers: {
          ...data.answers,
          [field]: value
        }
      });

      const validation = await service.validateStep('process');
      if (validation.length === 0) {
        // Enable next step if validation passes
        service.updateData({
          steps: {
            ...data.steps,
            details: {
              ...data.steps.details,
              canNavigateTo: true
            }
          }
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update field',
        variant: 'destructive',
      });
    }
  };

  const handleNext = async () => {
    try {
      const validation = await service.validateStep('process');
      if (validation.length === 0) {
        service.updateData({
          currentStep: 'details',
          steps: {
            ...data.steps,
            details: {
              ...data.steps.details,
              canNavigateTo: true
            }
          }
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to proceed',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Process Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Industry</label>
          <Select
            value={data.answers.industry}
            onChange={(value) => handleChange('industry', value)}
            options={[
              { label: 'Technology', value: 'Technology' },
              { label: 'Healthcare', value: 'Healthcare' },
              { label: 'Financial Services', value: 'Financial Services' },
              { label: 'Real Estate', value: 'Real Estate' },
              { label: 'Other', value: 'Other' }
            ]}
            placeholder="Select your industry"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Number of Employees</label>
          <Select
            value={data.answers.employees}
            onChange={(value) => handleChange('employees', value)}
            options={[
              { label: '1-10', value: '1-10' },
              { label: '11-50', value: '11-50' },
              { label: '51-200', value: '51-200' },
              { label: '201-500', value: '201-500' },
              { label: '501-1000', value: '501-1000' },
              { label: '1000+', value: '1000+' }
            ]}
            placeholder="Select employee range"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Process Complexity</label>
          <Select
            value={data.answers.processComplexity}
            onChange={(value) => handleChange('processComplexity', value)}
            options={[
              { label: 'Simple - Linear flow with few decision points', value: 'Simple' },
              { label: 'Medium - Some complexity with decision points', value: 'Medium' },
              { label: 'Complex - Many decision points and variations', value: 'Complex' },
              { label: 'Very Complex - Multiple integrations and custom logic', value: 'Very Complex' }
            ]}
            placeholder="Select process complexity"
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleNext}
            disabled={status.status !== 'ready'}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {status.status === 'validating' ? 'Validating...' : 'Next Step'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProcessSection;
