import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { transformAuditFormData } from '@/utils/assessmentFlow';
import { saveFormDataToSheet } from '@/utils/googleSheets';
import type { AuditFormData } from '@/types/assessment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useAuditForm } from '@/contexts/AuditFormContext';

const AuditForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAssessmentData } = useAssessment();
  const { closeAuditForm } = useAuditForm();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuditFormData>({
    defaultValues: {
      employees: '',
      processVolume: '',
      industry: '',
      timelineExpectation: ''
    }
  });

  const onSubmit = async (data: AuditFormData) => {
    try {
      // Save to Google Sheet
      await saveFormDataToSheet(data);
      
      // Transform data for assessment
      const transformedData = transformAuditFormData(data);
      
      setAssessmentData(transformedData);
      closeAuditForm();
      
      toast({
        title: "Form Submitted Successfully",
        description: "Your information has been saved and we're ready to begin the assessment.",
      });

      navigate('/assessment', { 
        state: { 
          formData: data,
          assessmentData: transformedData 
        },
        replace: true
      });
      
    } catch (error) {
      console.error('Error processing form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-space-light p-6 rounded-lg shadow-xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employees" className="text-gold font-semibold">
            Number of Employees
          </Label>
          <Controller
            name="employees"
            control={control}
            rules={{ required: "Number of employees is required" }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                id="employees"
                className="bg-space border-gold/20 text-white focus:ring-gold/30 focus:border-gold"
                placeholder="Enter number of employees"
                disabled={isSubmitting}
              />
            )}
          />
          {errors.employees && (
            <p className="text-red-500 text-sm">{errors.employees.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="processVolume" className="text-gold font-semibold">
            Monthly Transaction Volume
          </Label>
          <Controller
            name="processVolume"
            control={control}
            rules={{ required: "Transaction volume is required" }}
            render={({ field: { onChange, value } }) => (
              <Select 
                onValueChange={onChange} 
                value={value} 
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-space border-gold/20 text-white">
                  <SelectValue placeholder="Select volume range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than 100">Less than 100</SelectItem>
                  <SelectItem value="100-500">100-500</SelectItem>
                  <SelectItem value="501-1000">501-1000</SelectItem>
                  <SelectItem value="1001-5000">1001-5000</SelectItem>
                  <SelectItem value="More than 5000">More than 5000</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.processVolume && (
            <p className="text-red-500 text-sm">{errors.processVolume.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-gold font-semibold">
            Industry
          </Label>
          <Controller
            name="industry"
            control={control}
            rules={{ required: "Industry is required" }}
            render={({ field: { onChange, value } }) => (
              <Select 
                onValueChange={onChange} 
                value={value}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-space border-gold/20 text-white">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small_business">Small Business</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="construction">Construction/Roofing</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.industry && (
            <p className="text-red-500 text-sm">{errors.industry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timelineExpectation" className="text-gold font-semibold">
            Implementation Timeline
          </Label>
          <Controller
            name="timelineExpectation"
            control={control}
            rules={{ required: "Timeline is required" }}
            render={({ field: { onChange, value } }) => (
              <Select 
                onValueChange={onChange} 
                value={value}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-space border-gold/20 text-white">
                  <SelectValue placeholder="Select your timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="3_months">3 Months</SelectItem>
                  <SelectItem value="6_months">6 Months</SelectItem>
                  <SelectItem value="12_months">12 Months</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.timelineExpectation && (
            <p className="text-red-500 text-sm">{errors.timelineExpectation.message}</p>
          )}
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gold hover:bg-gold-light text-space font-semibold transition-colors duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Start Free Assessment'}
      </Button>
    </form>
  );
};

export default AuditForm;