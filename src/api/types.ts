export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface AssessmentResponse {
  industry: string;
  processComplexity: 'Low' | 'Medium' | 'High';
  manualProcesses: string[];
  // Add other assessment-specific fields
}

export interface UserProfile {
  id: string;
  email: string;
  companyName?: string;
  industry?: string;
  // Add other user-specific fields
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}
