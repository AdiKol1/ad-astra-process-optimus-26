// Mock data generators
export const createMockQuestion = (overrides = {}) => ({
  id: 'test-question-1',
  type: 'text',
  text: 'Test Question',
  required: true,
  ...overrides,
});

export const createMockSection = (overrides = {}) => ({
  id: 'test-section-1',
  title: 'Test Section',
  description: 'Test Description',
  questions: [createMockQuestion()],
  ...overrides,
});

export const createMockState = (overrides = {}) => ({
  currentStep: 0,
  totalSteps: 5,
  responses: {},
  completed: false,
  isLoading: false,
  error: null,
  metadata: {
    startTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    attempts: 0,
    analyticsId: 'test-id',
    version: '1.0.0'
  },
  ...overrides,
}); 