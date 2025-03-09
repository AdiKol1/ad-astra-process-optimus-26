// Test scenarios
export const commonTestScenarios = {
  validation: [
    {
      name: 'required field empty',
      data: { value: '' },
      expectedError: 'This field is required',
    },
    {
      name: 'numeric field with text',
      data: { value: 'abc' },
      expectedError: 'Please enter a valid number',
    },
  ],
  navigation: [
    {
      name: 'incomplete step',
      responses: {},
      action: 'next',
      expectedError: 'Please complete all required fields',
    },
  ],
}; 