import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { transformAuditFormData } from '@/utils/assessmentFlow';
import type { AuditFormData } from '@/types/assessment';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="employees">Number of Employees</label>
        <input type="number" id="employees" {...register('employees', { required: true })} />
      </div>
      <div>
        <label htmlFor="processVolume">Monthly Transaction Volume</label>
        <select id="processVolume" {...register('processVolume', { required: true })}>
          <option value="Less than 100">Less than 100</option>
          <option value="100-500">100-500</option>
          <option value="501-1000">501-1000</option>
          <option value="1001-5000">1001-5000</option>
          <option value="More than 5000">More than 5000</option>
        </select>
      </div>
      <div>
        <label htmlFor="industry">Industry</label>
        <input type="text" id="industry" {...register('industry', { required: true })} />
      </div>
      <div>
        <label htmlFor="timelineExpectation">Timeline Expectation</label>
        <input type="text" id="timelineExpectation" {...register('timelineExpectation', { required: true })} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AuditForm;
