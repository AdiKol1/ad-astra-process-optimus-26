export const TEST_TIMEOUTS = {
  RENDER: 1000,
  ANIMATION: 300,
  API_CALL: 2000,
  USER_INTERACTION: 500,
  PERFORMANCE: 5000
} as const;

export const TEST_IDS = {
  ASSESSMENT_FLOW: 'assessment-flow',
  CORE_QUESTION: 'core-question',
  LEAD_CAPTURE: 'lead-capture-form',
  PROCESS_SECTION: 'process-section',
  LOADING_SPINNER: 'loading-spinner',
  ERROR_MESSAGE: 'error-message',
  SUCCESS_MESSAGE: 'success-message'
} as const;

export const MOCK_ASSESSMENT_DATA = {
  id: 'test-assessment-id',
  status: 'in_progress',
  responses: {
    industry: 'Manufacturing',
    company_size: '50-100',
    process_type: 'software_development',
    volume: '1000',
    complexity: 'medium'
  },
  created_at: '2025-01-18T13:40:43-05:00',
  updated_at: '2025-01-18T13:40:43-05:00'
} as const;

export const PERFORMANCE_THRESHOLDS = {
  RENDER_TIME: 200, // milliseconds
  INTERACTION_TIME: 100, // milliseconds
  MEMORY_USAGE: 50 * 1024 * 1024, // 50MB in bytes
  API_LATENCY: 300, // milliseconds
} as const;

export const ACCESSIBILITY_REQUIREMENTS = {
  MIN_COLOR_CONTRAST: 4.5,
  FOCUS_OUTLINE_WIDTH: '2px',
  FOCUS_OUTLINE_COLOR: '#4C9AFF',
  MIN_TOUCH_TARGET_SIZE: 44, // pixels
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_INPUT: 'Please enter a valid value',
  API_ERROR: 'An error occurred while processing your request',
  NETWORK_ERROR: 'Please check your internet connection',
  VALIDATION_ERROR: 'Please fix the validation errors before proceeding'
} as const;

export const MOCK_USER_DATA = {
  email: 'test@example.com',
  company: 'Test Company',
  role: 'Manager',
  industry: 'Technology',
} as const;

export const TEST_ROUTES = {
  HOME: '/',
  ASSESSMENT: '/assessment',
  RESULTS: '/results',
  ERROR: '/error',
} as const;

export const MOCK_STEP_METRICS = {
  timeSpent: 1000,
  interactionCount: 5,
  errorCount: 0,
  completionTime: new Date().toISOString()
} as const;

export const MOCK_STEP_HISTORY = [
  { step: 'welcome', timestamp: new Date().toISOString() },
  { step: 'lead-capture', timestamp: new Date().toISOString() }
] as const;
