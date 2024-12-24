import React, { createContext, useContext, useReducer } from 'react';
import { MarketingState, MarketingMetrics, MarketingResults } from '../../types/assessment/marketing';
import { logger } from '../../utils/logger';
import { calculateMarketingMetrics } from '../../utils/assessment/marketing/calculations';
import { transformMarketingData } from '../../utils/marketingAssessment/adapters';

interface MarketingContextType {
  state: MarketingState;
  calculateMetrics: (data: Record<string, any>) => Promise<MarketingResults>;
  resetState: () => void;
}

const initialState: MarketingState = {
  metrics: null,
  results: null,
  loading: false,
  error: null
};

type MarketingAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_METRICS'; payload: MarketingMetrics }
  | { type: 'SET_RESULTS'; payload: MarketingResults }
  | { type: 'RESET' };

const marketingReducer = (state: MarketingState, action: MarketingAction): MarketingState => {
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

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(marketingReducer, initialState);

  const calculateMetrics = async (data: Record<string, any>): Promise<MarketingResults> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      logger.info('Starting marketing metrics calculation');

      // Transform the data
      const transformedData = await transformMarketingData(data);
      logger.info('Marketing data transformed:', transformedData);
      
      // Calculate metrics
      const results = await calculateMarketingMetrics(transformedData);
      logger.info('Marketing metrics calculated:', results);
      
      // Update state
      dispatch({ type: 'SET_RESULTS', payload: results });
      
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate marketing metrics';
      logger.error('Error calculating marketing metrics:', error);
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
