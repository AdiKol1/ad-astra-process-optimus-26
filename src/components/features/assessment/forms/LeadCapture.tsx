import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAssessmentStore } from '@/stores/assessment';
import type { ValidationError } from '@/types/assessment/state';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadCaptureFormProps {
  onSubmit: (data: any) => void;
  validationErrors: ValidationError[];
  isValid: boolean;
  isLoading: boolean;
  initialData?: {
    name?: string;
    email?: string;
    company?: string;
    industry?: string;
  };
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  onSubmit,
  validationErrors,
  isValid,
  isLoading,
  initialData = {}
}) => {
  const [formData, setFormData] = React.useState({
    name: initialData.name || '',
    email: initialData.email || '',
    company: initialData.company || '',
    industry: initialData.industry || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Industry options
  const industries = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Retail",
    "Professional Services",
    "Real Estate"
  ];

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Get Your Full Report</h2>
        <p className="text-muted-foreground mt-2">
          Enter your details to receive your complete assessment results
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              disabled={isLoading}
              className={cn(
                getFieldError('name') && "border-red-500"
              )}
            />
            {getFieldError('name') && (
              <p className="text-sm text-red-500">{getFieldError('name')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              required
              disabled={isLoading}
              className={cn(
                getFieldError('email') && "border-red-500"
              )}
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-500">{getFieldError('email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc."
              required
              disabled={isLoading}
              className={cn(
                getFieldError('company') && "border-red-500"
              )}
            />
            {getFieldError('company') && (
              <p className="text-sm text-red-500">{getFieldError('company')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              name="industry"
              value={formData.industry}
              onValueChange={(value) => handleSelectChange(value, 'industry')}
              disabled={isLoading}
            >
              <SelectTrigger 
                id="industry"
                className={cn(
                  getFieldError('industry') && "border-red-500"
                )}
              >
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('industry') && (
              <p className="text-sm text-red-500">{getFieldError('industry')}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Submitting...' : 'Get Full Report'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LeadCaptureForm; 