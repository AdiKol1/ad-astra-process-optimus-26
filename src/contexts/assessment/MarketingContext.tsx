import React, { createContext, useContext, useReducer } from 'react';
import { MarketingMetrics, MarketingResults } from '@/types/assessment/marketing';
import { logger } from '@/utils/logger';
import { calculateMarketingMetrics } from '@/utils/assessment/marketing/calculations';
import { transformMarketingData } from '@/utils/marketingAssessment/adapters';

interface MarketingState {
  metrics: MarketingMetrics | null;
  results: MarketingResults | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface MarketingContextType {
  state: MarketingState;
  calculateMetrics: (data: Record<string, any>) => Promise<MarketingResults>;
  resetState: () => void;
}

type MarketingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_METRICS'; payload: MarketingMetrics }
  | { type: 'SET_RESULTS'; payload: MarketingResults }
  | { type: 'SET_INITIALIZED' }
  | { type: 'RESET' };

const initialState: MarketingState = {
  metrics: null,
  results: null,
  loading: false,
  error: null,
  initialized: false
};

const marketingReducer = (state: MarketingState, action: MarketingAction): MarketingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_METRICS':
      return { ...state, loading: false, metrics: action.payload };
    case 'SET_RESULTS':
      return { ...state, loading: false, results: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: true };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(marketingReducer, initialState);

  const calculateMetrics = async (data: Record<string, any>): Promise<MarketingResults> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      logger.info('Starting marketing metrics calculation');

      // Validate and transform data - no defaults
      if (!data) {
        throw new Error('Marketing data is required');
      }

      // Check required fields before transformation
      const requiredFields = ['marketingBudget', 'toolStack', 'automationLevel', 'industry'];
      const missingFields = requiredFields.filter(field => !data[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required marketing fields: ${missingFields.join(', ')}`);
      }

      // Transform data without defaults
      const transformedData = await transformMarketingData(data);
      logger.info('Marketing data transformed:', transformedData);
      
      // Validate transformed data
      if (!transformedData.marketingBudget || !transformedData.toolStack.length || !transformedData.automationLevel || !transformedData.industry) {
        throw new Error('Invalid marketing data after transformation');
      }
      
      // Set metrics state
      dispatch({ type: 'SET_METRICS', payload: transformedData });
      
      // Calculate results
      const results = await calculateMarketingMetrics(transformedData);
      logger.info('Marketing metrics calculated:', results);
      
      if (!results) {
        throw new Error('Failed to calculate marketing results');
      }
      
      // Update state with results
      dispatch({ type: 'SET_RESULTS', payload: results });
      dispatch({ type: 'SET_INITIALIZED' });
      
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate marketing metrics';
      logger.error('Error calculating marketing metrics:', error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
    <MarketingContext.Provider value={value}>
      {children}
    </MarketingContext.Provider>
  );
};

export const useMarketing = () => {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error('useMarketing must be used within a MarketingProvider');
  }
  return context;
};
