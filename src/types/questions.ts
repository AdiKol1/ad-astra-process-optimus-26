import { QuestionType } from './assessment/core';

export interface QuestionData {
  id: string;
  label?: string;
  text?: string;
  type: QuestionType;
  description?: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface QuestionSection {
  id?: string;
  title: string;
  description: string;
  data?: {
    title: string;
    description: string;
    questions: QuestionData[];
  };
  questions: QuestionData[];
}

export const isValidQuestionType = (type: string): type is QuestionType => {
  return ['select', 'text', 'email', 'tel', 'multiSelect'].includes(type);
};

export const validateQuestionData = (question: any): question is QuestionData => {
  return (
    typeof question === 'object' &&
    typeof question.id === 'string' &&
    typeof question.label === 'string' &&
    isValidQuestionType(question.type) &&
    (question.description === undefined || typeof question.description === 'string') &&
    (question.options === undefined || Array.isArray(question.options)) &&
    (question.required === undefined || typeof question.required === 'boolean') &&
    (question.placeholder === undefined || typeof question.placeholder === 'string')
  );
};
