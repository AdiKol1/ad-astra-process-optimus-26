import { z } from 'zod';
import type { AssessmentData } from '@/types/assessment';

// Validation schemas
const responseSchema = z.record(z.any());

const assessmentDataSchema = z.object({
  responses: responseSchema,
  currentStep: z.number(),
  totalSteps: z.number(),
  qualificationScore: z.number().optional(),
  automationPotential: z.number().optional(),
  sectionScores: z.record(z.object({
    percentage: z.number()
  })).optional(),
  results: z.object({
    annual: z.object({
      savings: z.number(),
      hours: z.number()
    }),
    cac: z.object({
      currentCAC: z.number(),
      potentialReduction: z.number(),
      annualSavings: z.number(),
      automationROI: z.number()
    }).optional()
  }).optional(),
  userInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string()
  }).optional()
});

export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  public validateAssessmentData(data: AssessmentData): { success: boolean; errors?: string[] } {
    try {
      assessmentDataSchema.parse(data);
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return {
        success: false,
        errors: ['Unknown validation error occurred']
      };
    }
  }

  public validateResponses(responses: Record<string, any>): { success: boolean; errors?: string[] } {
    try {
      responseSchema.parse(responses);
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return {
        success: false,
        errors: ['Invalid response data']
      };
    }
  }
}

export const validationService = ValidationService.getInstance();