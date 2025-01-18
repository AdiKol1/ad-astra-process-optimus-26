import { describe, it, expect } from 'vitest';

describe('Basic Test Setup', () => {
  it('should work with basic assertions', () => {
    expect(true).toBe(true);
  });

  it('should work with DOM assertions', () => {
    const div = document.createElement('div');
    expect(div).toBeInTheDocument();
  });

  it('should work with async operations', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
