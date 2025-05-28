import React from 'react';
import { useAssessment } from '@/contexts/assessment/AssessmentContext'; // Using path alias
import { ProcessData } from '@/domain/assessment/types';
import { useToast } from '@/components/ui/use-toast';
import { Select } from '@chakra-ui/react'; // Using Chakra UI Select
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ProcessSection: React.FC = () => {
  const { service, status, data } = useAssessment();
  const { toast } = useToast();

  const handleChange = async (field: keyof ProcessData, event: any) => { // Expect event object
    const value = event.target.value; // Extract value from event
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
            onChange={(event) => handleChange('industry', event)}
            placeholder="Select your industry"
          >
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Number of Employees</label>
          <Select
            value={data.answers.employees}
            onChange={(event) => handleChange('employees', event)}
            placeholder="Select employee range"
          >
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1000+">1000+</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Process Complexity</label>
          <Select
            value={data.answers.processComplexity}
            onChange={(event) => handleChange('processComplexity', event)}
            placeholder="Select process complexity"
          >
            <option value="Simple">Simple - Linear flow with few decision points</option>
            <option value="Medium">Medium - Some complexity with decision points</option>
            <option value="Complex">Complex - Many decision points and variations</option>
            <option value="Very Complex">Very Complex - Multiple integrations and custom logic</option>
          </Select>
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
