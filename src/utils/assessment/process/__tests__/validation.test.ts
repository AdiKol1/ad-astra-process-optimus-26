import { validateProcessAssessment } from '../validation';
import type { ProcessAssessmentResponse } from '@/types/assessment/process/processAssessment';

describe('Process Assessment Validation', () => {
  const validResponse: ProcessAssessmentResponse = {
    manualProcesses: ['DATA_ENTRY', 'DOCUMENT_PROCESSING'],
    timeSpent: ['10_TO_20'],
    errorRate: ['1_TO_5'],
    processVolume: 'LESS_THAN_100'
  };

  describe('validateProcessAssessment', () => {
    test('accepts valid process assessment response', () => {
      const result = validateProcessAssessment(validResponse);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('requires at least one manual process', () => {
      const invalid = {
        ...validResponse,
        manualProcesses: []
      };
      const result = validateProcessAssessment(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('manualProcesses');
    });

    test('requires valid time spent range', () => {
      const invalid = {
        ...validResponse,
        timeSpent: ['INVALID_RANGE']
      };
      const result = validateProcessAssessment(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('timeSpent');
    });

    test('requires valid error rate range', () => {
      const invalid = {
        ...validResponse,
        errorRate: ['INVALID_RATE']
      };
      const result = validateProcessAssessment(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('errorRate');
    });

    test('requires valid process volume range', () => {
      const invalid = {
        ...validResponse,
        processVolume: 'INVALID_VOLUME'
      };
      const result = validateProcessAssessment(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('processVolume');
    });

    test('accepts multiple time spent selections', () => {
      const multipleTimeSpent = {
        ...validResponse,
        timeSpent: ['10_TO_20', '20_TO_40']
      };
      const result = validateProcessAssessment(multipleTimeSpent);
      expect(result.isValid).toBe(true);
    });

    test('accepts multiple error rate selections', () => {
      const multipleErrorRates = {
        ...validResponse,
        errorRate: ['1_TO_5', '5_TO_10']
      };
      const result = validateProcessAssessment(multipleErrorRates);
      expect(result.isValid).toBe(true);
    });

    test('handles undefined or null values', () => {
      const nullValues = {
        manualProcesses: null,
        timeSpent: undefined,
        errorRate: null,
        processVolume: undefined
      } as unknown as ProcessAssessmentResponse;
      
      const result = validateProcessAssessment(nullValues);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    test('validates manual process types', () => {
      const invalidProcessTypes = {
        ...validResponse,
        manualProcesses: ['INVALID_TYPE', 'DATA_ENTRY']
      };
      const result = validateProcessAssessment(invalidProcessTypes);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('manualProcesses');
    });
  });
});
