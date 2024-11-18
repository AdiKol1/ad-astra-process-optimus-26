import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { AuditFormData } from "@/lib/schemas/auditFormSchema";

export const PersonalInfoFields = ({ form }: { form: UseFormReturn<AuditFormData> }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} className="h-9" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} className="h-9" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Phone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="+1 (555) 000-0000" {...field} className="h-9" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};