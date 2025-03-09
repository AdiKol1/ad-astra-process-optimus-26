import React, { createContext, useContext } from 'react';
import { vi } from 'vitest';

interface UIContextValue {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: React.ReactNode;
  initialState?: {
    isLoading?: boolean;
  };
}

export const UIProvider: React.FC<UIProviderProps> = ({ 
  children,
  initialState = {}
}) => {
  const mockContextValue: UIContextValue = {
    isLoading: initialState.isLoading || false,
    setLoading: vi.fn(),
    showError: vi.fn(),
    showSuccess: vi.fn(),
    showInfo: vi.fn()
  };

  return (
    <UIContext.Provider value={mockContextValue}>
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider; 