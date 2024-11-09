import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const volumeOptions = [
    "Less than 100",
    "100-500",
    "501-1000",
    "1001-5000",
    "More than 5000"
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white/10">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="employees"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Number of Employees</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                placeholder="Enter number of employees" 
                {...field} 
                className="h-9 bg-white/10 text-white placeholder:text-gray-400"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="processVolume"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Monthly Process Volume</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white/10">
                  <SelectValue placeholder="Select monthly volume" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {volumeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white/10">
                  <SelectValue placeholder="Select your timeline" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timelineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                className="min-h-[80px] text-sm bg-white/10 text-white placeholder:text-gray-400"
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