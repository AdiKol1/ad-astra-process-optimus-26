import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import SelectInput from "@/components/ui/select-input";
import type { UseFormReturn } from "react-hook-form";
import type { AuditFormData } from "@/lib/schemas/auditFormSchema";

export const CompanyInfoFields = ({ form }: { form: UseFormReturn<AuditFormData> }) => {
  const industryOptions = [
    { label: "Small Business", value: "small_business" },
    { label: "Real Estate", value: "real_estate" },
    { label: "Construction/Roofing", value: "construction" },
    { label: "Legal", value: "legal" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Other", value: "other" }
  ];

  const timelineOptions = [
    { label: "1 Month", value: "1_month" },
    { label: "3 Months", value: "3_months" },
    { label: "6 Months", value: "6_months" },
    { label: "12 Months", value: "12_months" }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-2">Company Information</h3>
      
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Industry</FormLabel>
            <FormControl>
              <SelectInput
                options={industryOptions}
                value={industryOptions.find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                placeholder="Select your industry"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timelineExpectation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Implementation Timeline</FormLabel>
            <FormControl>
              <SelectInput
                options={timelineOptions}
                value={timelineOptions.find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
                placeholder="Select your timeline"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Additional Information (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your current processes and challenges..."
                className="min-h-[80px] text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};