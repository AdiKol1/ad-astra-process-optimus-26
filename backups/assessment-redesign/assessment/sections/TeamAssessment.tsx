import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAssessmentStore } from '@/stores/assessment';
import { logger } from '@/utils/logger';
import type { AssessmentResponses } from '@/types/assessment/state';

export const TeamAssessment: React.FC = () => {
  const { 
    responses, 
    updateResponses,
    isLoading,
    validateStep,
    clearValidationErrors 
  } = useAssessmentStore();

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleAnswer = React.useCallback((field: keyof AssessmentResponses, value: string) => {
    logger.info('Team answer received:', { field, value });
    
    if (field === 'userInfo') {
      updateResponses({
        [field]: {
          ...responses?.userInfo,
          industry: value
        }
      });
    } else {
      updateResponses({
        [field]: value
      });
    }

    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [responses?.userInfo, updateResponses, errors]);

  const validateResponses = React.useCallback(() => {
    const validation = validateStep('team');
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        newErrors[error.field] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  }, [validateStep]);

  const industries = React.useMemo(() => [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Services',
    'Other'
  ], []);

  const teamSizes = React.useMemo(() => [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '500+'
  ], []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Tell us about your team</h2>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base">
                What industry are you in?
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={responses?.userInfo?.industry}
                onValueChange={(value: string) => handleAnswer('userInfo', value)}
              >
                <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
              )}
            </div>

            <div>
              <Label className="text-base">
                What is your team size?
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <RadioGroup
                value={responses?.teamSize}
                onValueChange={(value: string) => handleAnswer('teamSize', value)}
                className="mt-2"
              >
                {teamSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={`size-${size}`} />
                    <Label htmlFor={`size-${size}`} className="text-sm">
                      {size} employees
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.teamSize && (
                <p className="text-sm text-red-500 mt-1">{errors.teamSize}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};