import { Card } from '../../ui/card';
import { useAssessment } from '../../../hooks/useAssessment';
import { saveFormDataToSheet } from '../../../utils/googleSheets';
import { useToast } from '../../ui/use-toast';
import type { AssessmentFormData } from '../../../types/assessment/core';

export const LeadCapture = () => {
  const { state } = useAssessment();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const formData = new window.FormData(formEl);
    
    try {
      const data: AssessmentFormData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        employees: state.responses.employees || '',
        processVolume: state.responses.processVolume || '',
        industry: state.responses.industry || '',
        timelineExpectation: state.responses.timelineExpectation || '',
        responses: state.responses
      };

      await saveFormDataToSheet(data);

      toast({
        title: 'Success',
        description: 'Your information has been saved. We will contact you shortly.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your information. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Get Your Results
        </button>
      </form>
    </Card>
  );
};
