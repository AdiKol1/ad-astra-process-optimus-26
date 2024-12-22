import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock console methods to avoid noise in tests
console.log = vi.fn();
console.error = vi.fn();
console.warn = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});