import React, { createContext, useContext, useReducer } from 'react';
import { ProcessState, ProcessMetrics, ProcessResults } from '@/types/assessment/process';
import { logger } from '@/utils/logger';
import { calculateProcessMetrics } from '@/utils/assessment/process/calculations';
import { transformProcessData } from '@/utils/assessment/process/adapters';

interface ProcessContextType {
  state: ProcessState;
  calculateMetrics: (data: Record<string, any>) => Promise<ProcessResults>;
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

  const calculateMetrics = async (data: Record<string, any>): Promise<ProcessResults> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      logger.info('Starting process metrics calculation');

      // Transform the data
      const transformedData = await transformProcessData(data);
      logger.info('Process data transformed:', transformedData);
      
      // Calculate metrics
      const results = await calculateProcessMetrics(transformedData);
      logger.info('Process metrics calculated:', results);
      
      // Update state
      dispatch({ type: 'SET_RESULTS', payload: results });
      
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate process metrics';
      logger.error('Error calculating process metrics:', error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const resetState = () => {
    dispatch({ type: 'RESET' });
  };

  const value = {
    state,
    calculateMetrics,
    resetState
  };

  return (
    <ProcessContext.Provider value={value}>
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
