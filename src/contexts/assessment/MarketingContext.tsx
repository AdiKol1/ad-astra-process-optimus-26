import React, { createContext, useContext, useReducer } from 'react';
import { MarketingState, MarketingMetrics, MarketingResults } from '@/types/assessment/marketing';

interface MarketingContextType {
  state: MarketingState;
  calculateMetrics: (data: Record<string, any>) => void;
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

  const calculateMetrics = async (data: Record<string, any>) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Import calculation functions dynamically to avoid circular dependencies
      const { calculateMarketingScore } = await import('@/utils/marketingScoring');
      const { generateCACResults } = await import('@/utils/cacCalculations');
      
      const metrics = calculateMarketingScore(data).metrics;
      dispatch({ type: 'SET_METRICS', payload: metrics });
      
      const cacResults = generateCACResults(data);
      const results: MarketingResults = {
        cac: {
          current: cacResults.currentCAC,
          projected: cacResults.currentCAC * (1 - cacResults.potentialReduction),
          reduction: cacResults.potentialReduction
        },
        automation: {
          level: metrics.automationLevel,
          potential: cacResults.potentialReduction,
          roi: cacResults.automationROI
        },
        conversion: {
          current: cacResults.currentConversion || 0,
          projected: (cacResults.currentConversion || 0) * (1 + cacResults.conversionImprovement),
          improvement: cacResults.conversionImprovement
        }
      };
      
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to calculate marketing metrics' });
    }
  };

  const resetState = () => dispatch({ type: 'RESET' });

  return (
    <MarketingContext.Provider value={{ state, calculateMetrics, resetState }}>
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
