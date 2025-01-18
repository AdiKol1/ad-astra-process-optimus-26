import { AssessmentResponses } from './core';

/**
 * Base question interface shared across all assessment types
 */
export interface BaseQuestion {
  id: string;
  type: string;
  text?: string;
  label: string;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

/**
 * Extended question interface for specialized assessments
 * Includes validation and additional features
 */
export interface SpecializedQuestion extends BaseQuestion {
  validation?: (value: any) => boolean;
  dependsOn?: string;  // For questions that depend on other answers
  conditionalDisplay?: (answers: AssessmentResponses) => boolean;
}

/**
 * Base section interface for assessment questions
 */
export interface BaseQuestionSection {
  title: string;
  description?: string;
}

/**
 * Core assessment section used in the main flow
 */
export interface CoreQuestionSection extends BaseQuestionSection {
  questions: BaseQuestion[];
}

/**
 * Specialized section with additional features for specific assessments
 */
export interface SpecializedQuestionSection extends BaseQuestionSection {
  questions: SpecializedQuestion[];
  validateSection?: (answers: AssessmentResponses) => boolean;
}
