import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { useAssessment } from '../../../hooks/useAssessment';
import { saveFormDataToSheet } from '../../../utils/googleSheets';
import { useToast } from '../../ui/use-toast';
import type { AssessmentFormData } from '../../../types/assessment/core';

interface LeadCaptureProps {
  onSubmit?: (data: LeadData) => void;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
}

export interface LeadData {
  email: string;
  name: string;
  company?: string;
  phone?: string;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  onSubmit,
  onSkip,
  title = "Get your custom report",
  subtitle = "Leave your details to receive a detailed analysis"
}) => {
  const { state } = useAssessment();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LeadData>({
    email: '',
    name: '',
    company: '',
    phone: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: AssessmentFormData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
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

      onSubmit?.(formData);
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
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{subtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
        <button
          type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Get Report
          </button>
          
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full sm:w-auto bg-transparent text-gray-600 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
              Skip
        </button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default LeadCapture;
