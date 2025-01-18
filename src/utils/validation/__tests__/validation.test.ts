import { describe, it, expect, vi } from 'vitest';
import { validateEmail, validateName, validateCompany } from '../formValidation';
import { validateProcessData } from '../processValidation';
import { validateIndustryData } from '../industryValidation';
import { telemetry } from '@/utils/monitoring/telemetry';

vi.mock('@/utils/monitoring/telemetry');

describe('Validation Utils', () => {
  describe('Form Validation', () => {
    describe('validateEmail', () => {
      it('validates correct email formats', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
      });

      it('rejects invalid email formats', () => {
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('test@example')).toBe(false);
        expect(validateEmail('test.example.com')).toBe(false);
      });

      it('handles edge cases', () => {
        expect(validateEmail('')).toBe(false);
        expect(validateEmail(' ')).toBe(false);
        expect(validateEmail('test@example.com ')).toBe(false);
      });
    });

    describe('validateName', () => {
      it('validates correct name formats', () => {
        expect(validateName('John Doe')).toBe(true);
        expect(validateName('Mary-Jane')).toBe(true);
      });

      it('rejects invalid name formats', () => {
        expect(validateName('')).toBe(false);
        expect(validateName('a')).toBe(false);
        expect(validateName('John@Doe')).toBe(false);
      });

      it('handles special characters correctly', () => {
        expect(validateName('O\'Connor')).toBe(true);
        expect(validateName('Jean-Pierre')).toBe(true);
      });
    });

    describe('validateCompany', () => {
      it('validates correct company names', () => {
        expect(validateCompany('Acme Inc')).toBe(true);
        expect(validateCompany('Company & Sons')).toBe(true);
      });

      it('rejects invalid company names', () => {
        expect(validateCompany('')).toBe(false);
        expect(validateCompany('a')).toBe(false);
        expect(validateCompany('Company@Name')).toBe(false);
      });

      it('handles special characters correctly', () => {
        expect(validateCompany('Company & Co.')).toBe(true);
        expect(validateCompany('Company-Name')).toBe(true);
      });
    });
  });

  describe('Process Validation', () => {
    it('validates complete process data', () => {
      const validData = {
        complexity: 'high',
        frequency: 'daily',
        duration: 120,
        manualSteps: 10
      };

      expect(validateProcessData(validData)).toBe(true);
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'process_validation_success',
        expect.any(Object)
      );
    });

    it('rejects incomplete process data', () => {
      const invalidData = {
        complexity: 'high',
        frequency: 'daily'
      };

      expect(validateProcessData(invalidData)).toBe(false);
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'process_validation_failure',
        expect.any(Object)
      );
    });

    it('validates numerical constraints', () => {
      const data = {
        complexity: 'high',
        frequency: 'daily',
        duration: -1,
        manualSteps: 0
      };

      expect(validateProcessData(data)).toBe(false);
    });
  });

  describe('Industry Validation', () => {
    it('validates supported industries', () => {
      expect(validateIndustryData('technology')).toBe(true);
      expect(validateIndustryData('healthcare')).toBe(true);
    });

    it('rejects unsupported industries', () => {
      expect(validateIndustryData('invalid-industry')).toBe(false);
      expect(validateIndustryData('')).toBe(false);
    });

    it('tracks validation attempts', () => {
      validateIndustryData('technology');
      expect(telemetry.trackEvent).toHaveBeenCalledWith(
        'industry_validation',
        expect.any(Object)
      );
    });
  });
});
