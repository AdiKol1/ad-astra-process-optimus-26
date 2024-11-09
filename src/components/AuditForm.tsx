import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfoFields } from "./audit/PersonalInfoFields";
import { CompanyInfoFields } from "./audit/CompanyInfoFields";
import { auditFormSchema, type AuditFormData } from "@/lib/schemas/auditFormSchema";
import { useNavigate } from 'react-router-dom';
import { useAuditForm } from '@/contexts/AuditFormContext';
import { useAssessment } from '@/contexts/AssessmentContext';
import { transformAuditFormData } from '@/utils/assessmentFlow';

export const AuditForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { closeAuditForm } = useAuditForm();
  const { setAssessmentData } = useAssessment();
  
  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      industry: "small_business",
      timelineExpectation: "3_months",
      employees: "1",
      processVolume: "Less than 100",
    }
  });

  function onSubmit(values: AuditFormData) {
    const assessmentData = transformAuditFormData(values);
    const userInfo = {
      name: values.name,
      email: values.email,
      phone: values.phone
    };
    
    setAssessmentData(assessmentData, userInfo);
    closeAuditForm();
    navigate('/assessment/calculator');
    
    toast({
      title: "Audit Request Received!",
      description: "Starting your process audit assessment...",
    });
  }

  return (
    <div className="p-6 bg-space rounded-lg">
      <h2 className="text-xl font-bold mb-2 text-center text-white">Business Process Audit</h2>
      <p className="text-gray-300 mb-6 text-sm text-center">
        Complete this 10-minute assessment to receive your free comprehensive process optimization report
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} />
          <CompanyInfoFields form={form} />
          <button type="submit" className="w-full bg-gold hover:bg-gold-light text-space text-base py-6">
            Get Your Free Process Audit Report
          </button>
        </form>
      </Form>
    </div>
  );
};

export default AuditForm;