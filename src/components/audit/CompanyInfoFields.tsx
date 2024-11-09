import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import SelectInput from "@/components/ui/select-input";
import type { UseFormReturn } from "react-hook-form";
import type { AuditFormData } from "@/lib/schemas/auditFormSchema";

export const CompanyInfoFields = ({ form }: { form: UseFormReturn<AuditFormData> }) => {
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
                options={[
                  "Small Business",
                  "Real Estate",
                  "Construction/Roofing",
                  "Legal",
                  "Healthcare",
                  "Other"
                ]}
                value={field.value}
                onChange={field.onChange}
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
                options={[
                  "1 Month",
                  "3 Months",
                  "6 Months",
                  "12 Months"
                ]}
                value={field.value}
                onChange={field.onChange}
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