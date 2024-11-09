import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfoFields } from "./audit/PersonalInfoFields";
import { CompanyInfoFields } from "./audit/CompanyInfoFields";
import { auditFormSchema, type AuditFormData } from "@/lib/schemas/auditFormSchema";
import { useNavigate } from 'react-router-dom';
import { useAuditForm } from '@/contexts/AuditFormContext';

const AuditForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { closeAuditForm } = useAuditForm();
  
  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      industry: "small_business",
      timelineExpectation: "3_months",
    },
  });

  function onSubmit(values: AuditFormData) {
    console.log('Audit Form Values:', values);
    
    // Transform audit form data to match assessment structure
    const assessmentData = {
      processDetails: {
        employees: 1,
        processVolume: values.industry === 'small_business' ? 'Less than 100' : '100-500'
      },
      industry: values.industry,
      timeline: values.timelineExpectation,
    };
    
    console.log('Transformed Assessment Data:', assessmentData);
    
    toast({
      title: "Audit Request Received!",
      description: "Starting your process audit assessment...",
    });
    
    closeAuditForm();
    navigate('/assessment', { 
      state: { 
        answers: assessmentData,
        source: 'audit-form' 
      } 
    });
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-2 text-center">Business Process Audit</h2>
      <p className="text-gray-300 mb-4 text-sm text-center">
        Complete this 10-minute assessment to receive your free comprehensive process optimization report (Worth $1,500)
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PersonalInfoFields form={form} />
          <CompanyInfoFields form={form} />
          <Button type="submit" className="w-full bg-gold hover:bg-gold-light text-space text-base py-4">
            Get Your Free Process Audit Report
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuditForm;