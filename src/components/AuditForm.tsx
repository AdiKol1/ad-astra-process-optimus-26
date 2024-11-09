import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { auditFormSchema } from "@/lib/schemas/auditFormSchema";
import type { AuditFormData } from "@/lib/schemas/auditFormSchema";
import { PersonalInfoFields } from "./audit/PersonalInfoFields";
import { CompanyInfoFields } from "./audit/CompanyInfoFields";

interface AuditFormProps {
  closeAuditForm: () => void;
}

export const AuditForm = ({ closeAuditForm }: AuditFormProps) => {
  const navigate = useNavigate();
  const form = useForm<AuditFormData>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      industry: "",
      timelineExpectation: "",
    },
  });

  function onSubmit(values: AuditFormData) {
    console.log('Audit Form Values:', values);
    
    // Transform audit form data to match assessment structure
    const assessmentData = {
      processDetails: {
        employees: values.companySize || 1,
        processVolume: values.industry === 'small_business' ? 'Less than 100' : '100-500'
      },
      technology: {
        currentSystems: ['Manual Process'], // Default assumption
        integrationNeeds: []
      },
      processes: {
        manualProcesses: ['Documentation'],
        timeSpent: 20 // Default assumption
      },
      team: {
        teamSize: values.companySize || 1,
        departments: ['Operations']
      },
      challenges: {
        painPoints: ['Manual Work']
      },
      industry: values.industry,
      timeline: values.timelineExpectation
    };
    
    console.log('Transformed Assessment Data:', assessmentData);
    
    toast({
      title: "Audit Request Received!",
      description: "Starting your process audit assessment...",
    });
    
    closeAuditForm();
    navigate('/assessment/calculator', { 
      state: { 
        answers: assessmentData,
        source: 'audit-form' 
      } 
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PersonalInfoFields form={form} />
        <CompanyInfoFields form={form} />
        
        <Button type="submit" className="w-full">
          Submit Audit Request
        </Button>
      </form>
    </Form>
  );
};