import React, { createContext, useContext, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { telemetry } from '@/utils/monitoring/telemetry';

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
  const [isLoading, setIsLoading] = useState(initialState.isLoading || false);
  const { toast } = useToast();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    telemetry.track('ui_loading_state_changed', { isLoading: loading });
  };

  const showError = (message: string) => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });
    telemetry.track('ui_error_shown', { message });
  };

  const showSuccess = (message: string) => {
    toast({
      variant: 'default',
      title: 'Success',
      description: message,
    });
    telemetry.track('ui_success_shown', { message });
  };

  const showInfo = (message: string) => {
    toast({
      variant: 'default',
      title: 'Info',
      description: message,
    });
    telemetry.track('ui_info_shown', { message });
  };

  return (
    <UIContext.Provider
      value={{
        isLoading,
        setLoading,
        showError,
        showSuccess,
        showInfo,
      }}
    >
      {children}
      <Toaster />
    </UIContext.Provider>
  );
};

export default UIProvider;
