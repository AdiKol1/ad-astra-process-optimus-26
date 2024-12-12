import React, { createContext, useContext, useReducer } from 'react';
import { ProcessState, ProcessMetrics, ProcessResults } from '@/types/assessment/process';

interface ProcessContextType {
  state: ProcessState;
  calculateMetrics: (data: Record<string, any>) => void;
  resetState: () => void;
}

const initialState: ProcessState = {
  metrics: null,
  results: null,
  loading: false,
  error: null
};

type ProcessAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_METRICS'; payload: ProcessMetrics }
  | { type: 'SET_RESULTS'; payload: ProcessResults }
  | { type: 'RESET' };

const processReducer = (state: ProcessState, action: ProcessAction): ProcessState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_METRICS':
      return { ...state, loading: false, metrics: action.payload };
    case 'SET_RESULTS':
      return { ...state, loading: false, results: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

export const ProcessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(processReducer, initialState);

  const calculateMetrics = async (data: Record<string, any>) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Import calculation functions dynamically to avoid circular dependencies
      const { transformProcessData } = await import('@/utils/processAssessment/adapters');
      const { calculateProcessMetrics } = await import('@/utils/processAssessment/calculations');
      
      const metrics = transformProcessData(data);
      dispatch({ type: 'SET_METRICS', payload: metrics });
      
      const results = calculateProcessMetrics(metrics);
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to calculate process metrics' });
    }
  };

  const resetState = () => dispatch({ type: 'RESET' });

  return (
    <ProcessContext.Provider value={{ state, calculateMetrics, resetState }}>
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcess = () => {
  const context = useContext(ProcessContext);
  if (!context) {
    throw new Error('useProcess must be used within a ProcessProvider');
  }
  return context;
};
