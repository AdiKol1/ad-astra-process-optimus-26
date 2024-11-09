import { z } from "zod";

export const auditFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  industry: z.enum(["small_business", "real_estate", "construction", "legal", "healthcare", "other"]),
  timelineExpectation: z.enum(["1_month", "3_months", "6_months", "12_months"]),
  message: z.string().optional(),
});

export type AuditFormData = z.infer<typeof auditFormSchema>;