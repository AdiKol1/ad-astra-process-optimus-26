import React, { useState, useContext, useEffect } from 'react';
import { AssessmentContext, LeadData } from './AssessmentContext';
import { Analytics, trackFormFieldInteraction, trackLeadInteraction } from './utils/analytics';
import { Button } from '@/components/ui/button';
import FormField from './form/FormField';
import FormSection from './form/FormSection';

interface LeadCaptureFormProps {
  onSubmit: (data: LeadData) => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit }) => {
  const { currentStep } = useContext(AssessmentContext);
  const [formData, setFormData] = useState<LeadData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    captureStep: currentStep
  });

  const [errors, setErrors] = useState<Partial<LeadData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountTime = Date.now();

  useEffect(() => {
    Analytics.startSession();
    return () => {
      if (!isSubmitting) {
        trackLeadInteraction({
          category: 'Lead',
          action: 'Form_Abandon',
          metadata: {
            formStep: currentStep.toString(),
            timeSpent: Date.now() - mountTime,
          },
        });
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors: Partial<LeadData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    trackFormFieldInteraction(name, 'change', { value_length: value.length });
    
    if (errors[name as keyof LeadData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await trackLeadInteraction({
        category: 'Lead',
        action: 'Form_Complete',
        metadata: {
          formStep: currentStep.toString(),
          industry: formData.industry,
          companySize: formData.companySize,
          timeSpent: Date.now() - mountTime,
        },
      });

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection>
        <FormField id="firstName" label="First Name" required error={errors.firstName}>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField id="lastName" label="Last Name" required error={errors.lastName}>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField id="email" label="Business Email" required error={errors.email}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField id="company" label="Company" required error={errors.company}>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField id="role" label="Role" required error={errors.role}>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField id="phoneNumber" label="Phone Number">
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Optional"
          />
        </FormField>
      </FormSection>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Processing...' : 'Get Full Report'}
      </Button>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        By submitting this form, you agree to receive communications about process optimization
        insights and solutions. Your information will be handled in accordance with our privacy policy.
        You can unsubscribe at any time.
      </p>
    </form>
  );
};

export default LeadCaptureForm;