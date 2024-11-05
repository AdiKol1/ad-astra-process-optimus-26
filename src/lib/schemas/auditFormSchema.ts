import * as z from "zod";

export const auditFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  industry: z.enum(["real_estate", "small_business", "other"]),
  employeeCount: z.string(),
  currentProcesses: z.string().min(10, "Please provide more detail about your current processes"),
  biggestChallenge: z.string().min(10, "Please describe your challenge in more detail"),
  idealOutcome: z.string().min(10, "Please describe your ideal outcome"),
  timelineExpectation: z.enum(["1_month", "3_months", "6_months", "flexible"]),
});

export type AuditFormData = z.infer<typeof auditFormSchema>;