import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessSection } from '../ProcessSection';

// Mock telemetry and performance modules
vi.mock('../../../../utils/monitoring/telemetry', () => ({
  telemetry: {
    track: vi.fn(),
  }
}));

vi.mock('../../../../utils/monitoring/performance', () => ({
  createPerformanceMonitor: () => ({
    start: vi.fn(),
    end: vi.fn(),
    getDuration: vi.fn(() => 1000),
    clear: vi.fn()
  })
}));

import { telemetry } from '../../../../utils/monitoring/telemetry';
import { createPerformanceMonitor } from '../../../../utils/monitoring/performance';

const performanceMonitor = createPerformanceMonitor('ProcessSection');

describe('ProcessSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ProcessSection />);
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });

  it('renders content elements', () => {
    const { container } = render(<ProcessSection />);
    expect(container.firstChild).toBeTruthy();
  });
});
