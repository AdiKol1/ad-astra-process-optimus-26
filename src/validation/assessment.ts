import { z } from 'zod';

export const assessmentSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  processComplexity: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Process complexity is required',
  }),
  manualProcesses: z.array(z.string()).min(1, 'At least one manual process is required'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  budget: z.enum(['0-10k', '10k-50k', '50k-200k', '200k+']),
  timeline: z.enum(['1-3 months', '3-6 months', '6-12 months', '12+ months']),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
