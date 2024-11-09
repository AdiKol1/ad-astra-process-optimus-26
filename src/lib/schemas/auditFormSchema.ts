import { z } from "zod";

export const auditFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  industry: z.enum(["small_business", "real_estate", "construction", "legal", "healthcare", "other"], {
    errorMap: () => ({ message: "Please select an industry" })
  }),
  timelineExpectation: z.enum(["1_month", "3_months", "6_months", "12_months"], {
    errorMap: () => ({ message: "Please select a timeline" })
  }),
  employees: z.string().min(1, "Number of employees is required"),
  processVolume: z.string().min(1, "Process volume is required"),
  message: z.string().optional(),
});

export type AuditFormData = z.infer<typeof auditFormSchema>;