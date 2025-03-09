import { z } from 'zod';
import type { AssessmentData } from '@/types/assessment';
import { 
  AssessmentResponses,
  ValidationError,
  ValidationResult,
  AssessmentStep,
  Industry,
  ProcessVolume,
  ErrorRate
} from '../types/assessment';

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

  private isValidIndustry(value: unknown): value is Industry {
    return typeof value === 'string' && Object.values(Industry).includes(value as Industry);
  }

  private isValidProcessVolume(value: unknown): value is ProcessVolume {
    return typeof value === 'string' && Object.values(ProcessVolume).includes(value as ProcessVolume);
  }

  private isValidErrorRate(value: unknown): value is ErrorRate {
    return typeof value === 'string' && Object.values(ErrorRate).includes(value as ErrorRate);
  }

  private validateIndustry(industry: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!industry) {
      errors.push({
        field: 'industry',
        message: 'Industry is required'
      });
    } else if (!this.isValidIndustry(industry)) {
      errors.push({
        field: 'industry',
        message: 'Invalid industry selected'
      });
    }
    return errors;
  }

  private validateTeamSize(teamSize: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!teamSize) {
      errors.push({
        field: 'teamSize',
        message: 'Team size is required'
      });
    } else if (typeof teamSize !== 'number' || teamSize < 1) {
      errors.push({
        field: 'teamSize',
        message: 'Team size must be a positive number'
      });
    }
    return errors;
  }

  private validateProcessVolume(processVolume: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!processVolume) {
      errors.push({
        field: 'processVolume',
        message: 'Process volume is required'
      });
    } else if (!this.isValidProcessVolume(processVolume)) {
      errors.push({
        field: 'processVolume',
        message: 'Invalid process volume selected'
      });
    }
    return errors;
  }

  private validateErrorRate(errorRate: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!errorRate) {
      errors.push({
        field: 'errorRate',
        message: 'Error rate is required'
      });
    } else if (!this.isValidErrorRate(errorRate)) {
      errors.push({
        field: 'errorRate',
        message: 'Invalid error rate selected'
      });
    }
    return errors;
  }

  private validateAutomationLevel(automationLevel: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!automationLevel) {
      errors.push({
        field: 'automationLevel',
        message: 'Automation level is required'
      });
    } else if (typeof automationLevel !== 'string') {
      errors.push({
        field: 'automationLevel',
        message: 'Invalid automation level'
      });
    }
    return errors;
  }

  private validateArrayField(
    field: string,
    value: unknown,
    required: boolean = true
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!value && required) {
      errors.push({
        field,
        message: `${field} is required`
      });
    } else if (!Array.isArray(value)) {
      errors.push({
        field,
        message: `${field} must be a list`
      });
    } else if (required && value.length === 0) {
      errors.push({
        field,
        message: `At least one ${field} must be selected`
      });
    }
    return errors;
  }

  private validateStringField(
    field: string,
    value: unknown,
    required: boolean = true
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!value && required) {
      errors.push({
        field,
        message: `${field} is required`
      });
    } else if (value && typeof value !== 'string') {
      errors.push({
        field,
        message: `${field} must be text`
      });
    }
    return errors;
  }

  public validateStep(step: AssessmentStep, responses: Partial<AssessmentResponses>): ValidationResult {
    let errors: ValidationError[] = [];

    switch (step) {
      case AssessmentStep.Initial:
        errors = [
          ...this.validateIndustry(responses.industry),
          ...this.validateTeamSize(responses.teamSize)
        ];
        break;

      case AssessmentStep.Process:
        errors = [
          ...this.validateProcessVolume(responses.processVolume),
          ...this.validateErrorRate(responses.errorRate),
          ...this.validateArrayField('manualProcesses', responses.manualProcesses)
        ];
        break;

      case AssessmentStep.Technology:
        errors = [
          ...this.validateAutomationLevel(responses.automationLevel),
          ...this.validateArrayField('currentTools', responses.currentTools, false)
        ];
        break;

      case AssessmentStep.Team:
        errors = [
          ...this.validateArrayField('challenges', responses.challenges),
          ...this.validateArrayField('objectives', responses.objectives)
        ];
        break;

      case AssessmentStep.Results:
        errors = [
          ...this.validateStringField('timeline', responses.timeline),
          ...this.validateStringField('budget', responses.budget)
        ];
        break;

      // No validation needed for complete step
      case AssessmentStep.Complete:
        break;

      default:
        console.warn(`No validation rules defined for step: ${step}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  public validateComplete(responses: Partial<AssessmentResponses>): ValidationResult {
    const errors: ValidationError[] = [
      ...this.validateIndustry(responses.industry),
      ...this.validateTeamSize(responses.teamSize),
      ...this.validateProcessVolume(responses.processVolume),
      ...this.validateErrorRate(responses.errorRate),
      ...this.validateAutomationLevel(responses.automationLevel),
      ...this.validateArrayField('manualProcesses', responses.manualProcesses),
      ...this.validateArrayField('currentTools', responses.currentTools, false),
      ...this.validateArrayField('challenges', responses.challenges),
      ...this.validateArrayField('objectives', responses.objectives),
      ...this.validateStringField('timeline', responses.timeline),
      ...this.validateStringField('budget', responses.budget)
    ];

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

export const validationService = ValidationService.getInstance();