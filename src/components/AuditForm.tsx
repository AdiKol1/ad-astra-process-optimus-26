import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { transformAuditFormData } from '@/utils/assessmentFlow';
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

const AuditForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSubmit, register } = useForm<AuditFormData>();

  const onSubmit = async (data: AuditFormData) => {
    try {
      const assessmentData = transformAuditFormData(data);
      
      toast({
        title: "Assessment Started",
        description: "Your data has been processed successfully.",
      });

      navigate('/assessment/calculator', {
        state: { assessmentData },
        replace: true
      });
    } catch (error) {
      console.error('Error processing form:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your assessment.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employees">Number of Employees</Label>
          <Input
            type="number"
            id="employees"
            className="bg-white/10 text-white"
            placeholder="Enter number of employees"
            {...register('employees', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="processVolume">Monthly Transaction Volume</Label>
          <Select {...register('processVolume', { required: true })}>
            <SelectTrigger className="bg-white/10 text-white">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            type="text"
            id="industry"
            className="bg-white/10 text-white"
            placeholder="Enter your industry"
            {...register('industry', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timelineExpectation">Timeline Expectation</Label>
          <Input
            type="text"
            id="timelineExpectation"
            className="bg-white/10 text-white"
            placeholder="Enter expected timeline"
            {...register('timelineExpectation', { required: true })}
          />
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gold hover:bg-gold-light text-space font-semibold"
      >
        Submit Assessment
      </Button>
    </form>
  );
};

export default AuditForm;