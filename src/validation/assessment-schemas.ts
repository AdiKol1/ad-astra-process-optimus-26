import { z } from 'zod';

// Base schemas for different question types
const numberQuestionSchema = z.number()
  .min(0, 'Value must be 0 or greater')
  .max(10000, 'Value must be 10000 or less');

const selectQuestionSchema = z.string()
  .min(1, 'Please select an option');

const multiselectQuestionSchema = z.array(z.string())
  .min(1, 'Please select at least one option');

const checkboxQuestionSchema = z.boolean();

// Process section schema
export const processSectionSchema = z.object({
  processVolume: numberQuestionSchema
    .min(1, 'Please enter at least 1 process'),
  timeSpent: selectQuestionSchema,
  errorRate: selectQuestionSchema,
  complexity: selectQuestionSchema,
  processDocumentation: checkboxQuestionSchema.optional()
});

// Technology section schema
export const technologySectionSchema = z.object({
  currentSystems: multiselectQuestionSchema,
  integrationNeeds: multiselectQuestionSchema,
  automationLevel: selectQuestionSchema,
  digitalTransformation: checkboxQuestionSchema.optional(),
  techChallenges: multiselectQuestionSchema
});

// Team section schema
export const teamSectionSchema = z.object({
  teamSize: selectQuestionSchema,
  departments: multiselectQuestionSchema,
  skillLevels: selectQuestionSchema,
  changeReadiness: selectQuestionSchema,
  trainingNeeds: multiselectQuestionSchema
});

// Social Media section schema
export const socialMediaSectionSchema = z.object({
  platforms: multiselectQuestionSchema,
  postFrequency: selectQuestionSchema,
  goals: multiselectQuestionSchema,
  contentType: multiselectQuestionSchema,
  challenges: multiselectQuestionSchema,
  analytics: checkboxQuestionSchema.optional(),
  toolsUsed: multiselectQuestionSchema.optional()
});

// Types
export type ProcessSectionSchema = z.infer<typeof processSectionSchema>;
export type TechnologySectionSchema = z.infer<typeof technologySectionSchema>;
export type TeamSectionSchema = z.infer<typeof teamSectionSchema>;

// Helper function to get schema by section
export const getSchemaBySection = (section: string) => {
  switch (section) {
    case 'process':
      return processSectionSchema;
    case 'technology':
      return technologySectionSchema;
    case 'team':
      return teamSectionSchema;
    case 'social-media':
      return socialMediaSectionSchema;
    default:
      throw new Error(`No schema found for section: ${section}`);
  }
}; 