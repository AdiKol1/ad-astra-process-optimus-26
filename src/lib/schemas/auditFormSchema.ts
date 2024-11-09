import { z } from "zod";

export const auditFormSchema = z.object({
  // Business Info
  industry: z.enum(["small_business", "real_estate", "construction", "legal", "healthcare", "other"]),
  companySize: z.number().min(1).optional(),
  revenue: z.enum(["under_500k", "500k_1m", "1m_5m", "5m_10m", "over_10m"]).optional(),
  
  // Personal Info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  
  // Process Details
  currentProcesses: z.array(z.string()).optional(),
  manualHoursPerWeek: z.number().min(0).max(168).optional(),
  
  // Goals & Timeline
  primaryObjectives: z.array(z.string()).optional(),
  timelineExpectation: z.enum(["1_month", "3_months", "6_months", "12_months"]),
  
  // Additional Info
  message: z.string().optional(),
});

export type AuditFormData = z.infer<typeof auditFormSchema>;