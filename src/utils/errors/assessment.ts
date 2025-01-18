export class AssessmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssessmentError';
  }
}

export class NetworkError extends AssessmentError {
  constructor(message = 'Network connection error') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AssessmentError {
  public fields: Record<string, string>;
  
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class StateError extends AssessmentError {
  public state: any;
  
  constructor(message: string, state: any = null) {
    super(message);
    this.name = 'StateError';
    this.state = state;
  }
}

export class AIProcessingError extends AssessmentError {
  constructor(message = 'Error processing AI response') {
    super(message);
    this.name = 'AIProcessingError';
  }
}

// Error handler factory
export const createErrorHandler = (context: string) => {
  return (error: Error): AssessmentError => {
    // Network errors
    if (error instanceof NetworkError) {
      return error;
    }
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return new NetworkError();
    }

    // Validation errors
    if (error instanceof ValidationError) {
      return error;
    }
    if (error.name === 'ValidationError') {
      return new ValidationError(error.message);
    }

    // State errors
    if (error instanceof StateError) {
      return error;
    }
    if (error.name === 'StateError') {
      return new StateError(error.message);
    }

    // AI Processing errors
    if (error instanceof AIProcessingError) {
      return error;
    }
    if (error.message.includes('AI') || error.message.includes('processing')) {
      return new AIProcessingError();
    }

    // Unknown errors
    return new AssessmentError(`[${context}] ${error.message}`);
  };
};

// Error recovery helpers
export const attemptStateRecovery = async (currentState: any): Promise<any> => {
  try {
    // Attempt to load from local storage
    const savedState = localStorage.getItem('assessment_state');
    if (!savedState) {
      throw new StateError('No saved state found');
    }

    // Parse and validate saved state
    const parsedState = JSON.parse(savedState);
    if (!parsedState || typeof parsedState !== 'object') {
      throw new StateError('Invalid saved state format');
    }

    // Merge with current state, preferring current values
    return {
      ...parsedState,
      ...currentState,
      recovered: true,
    };
  } catch (error) {
    throw new StateError('Failed to recover state', currentState);
  }
};

// Validation helpers
export const validateAssessmentState = (state: any): void => {
  const requiredFields = ['currentStep', 'totalSteps', 'responses'];
  const missingFields = requiredFields.filter(field => !(field in state));
  
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
      missingFields.reduce((acc, field) => ({ ...acc, [field]: 'Required' }), {})
    );
  }

  if (typeof state.currentStep !== 'number' || state.currentStep < 0) {
    throw new ValidationError('Invalid currentStep value', { currentStep: 'Must be a non-negative number' });
  }

  if (typeof state.totalSteps !== 'number' || state.totalSteps < 1) {
    throw new ValidationError('Invalid totalSteps value', { totalSteps: 'Must be a positive number' });
  }

  if (typeof state.responses !== 'object') {
    throw new ValidationError('Invalid responses format', { responses: 'Must be an object' });
  }
};
