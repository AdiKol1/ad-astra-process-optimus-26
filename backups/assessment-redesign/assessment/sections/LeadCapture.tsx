import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { StepComponentProps, StepMetadata } from '../core/AssessmentFlow/types';
import { cn } from '@/lib/utils';

interface LeadCaptureForm {
  name: string;
  email: string;
  company: string;
  industry?: string;
}

const LeadCaptureSection: React.FC<StepComponentProps> = ({
  onComplete,
  metadata,
  validationErrors,
  isValid,
  isLoading
}) => {
  const [form, setForm] = useState<LeadCaptureForm>({
    name: '',
    email: '',
    company: '',
    industry: ''
  });

  const getFieldError = (field: keyof LeadCaptureForm) => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{metadata.title}</h2>
          <p className="text-gray-600 mt-2">{metadata.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className={cn(getFieldError('name') && "border-red-500")}
              disabled={isLoading}
              required
            />
            {getFieldError('name') && (
              <p className="text-sm text-red-500">{getFieldError('name')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className={cn(getFieldError('email') && "border-red-500")}
              disabled={isLoading}
              required
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-500">{getFieldError('email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium">
              Company Name
            </label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
              className={cn(getFieldError('company') && "border-red-500")}
              disabled={isLoading}
              required
            />
            {getFieldError('company') && (
              <p className="text-sm text-red-500">{getFieldError('company')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="industry" className="block text-sm font-medium">
              Industry (Optional)
            </label>
            <Input
              id="industry"
              value={form.industry}
              onChange={(e) => setForm(prev => ({ ...prev, industry: e.target.value }))}
              className={cn(getFieldError('industry') && "border-red-500")}
              disabled={isLoading}
            />
            {getFieldError('industry') && (
              <p className="text-sm text-red-500">{getFieldError('industry')}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default LeadCaptureSection; 