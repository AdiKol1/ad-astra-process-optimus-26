import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfoFields } from "./audit/PersonalInfoFields";
import { CompanyInfoFields } from "./audit/CompanyInfoFields";
import { auditFormSchema, type AuditFormData } from "@/lib/schemas/auditFormSchema";

const AuditForm = () => {
  const { toast } = useToast();
  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      industry: "small_business",
      timelineExpectation: "3_months",
    },
  });

  function onSubmit(values: AuditFormData) {
    console.log(values);
    toast({
      title: "Audit Request Received!",
      description: "Our team will analyze your information and send you a comprehensive report within 24 hours.",
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-3 text-center">Business Process Audit</h2>
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