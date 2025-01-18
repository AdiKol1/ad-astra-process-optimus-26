import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { AssessmentService } from '@/domain/assessment/AssessmentMachine';
import { AssessmentStatus, AssessmentData } from '@/domain/assessment/types';
import { LocalStorageStrategy } from '@/infrastructure/assessment/LocalStorageStrategy';
import { ApiNetworkStrategy } from '@/infrastructure/assessment/NetworkStrategy';
import { fetchWithRetry } from '@/utils/network';
import { useToast } from '@/components/ui/use-toast';
import { analytics } from '@/utils/analytics';

interface AssessmentContextType {
  service: AssessmentService;
  status: AssessmentStatus;
  data: AssessmentData;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

interface AssessmentProviderProps {
  children: React.ReactNode;
  apiUrl: string;
  encryptionKey: string;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
  apiUrl,
  encryptionKey
}) => {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<AssessmentStatus>({ status: 'idle' });

  const service = useMemo(() => {
    const storage = new LocalStorageStrategy(encryptionKey);
    const network = new ApiNetworkStrategy(apiUrl, fetchWithRetry);
    
    return new AssessmentService(
      storage,
      network,
      analytics
    );
  }, [apiUrl, encryptionKey]);

  useEffect(() => {
    const unsubscribe = service.subscribe((newStatus) => {
      setStatus(newStatus);

      if (newStatus.status === 'error') {
        toast({
          title: 'Error',
          description: newStatus.error.message,
          variant: 'destructive',
        });
      }
    });

    return () => {
      unsubscribe();
      service.destroy();
    };
  }, [service, toast]);

  const value = useMemo(() => ({
    service,
    status,
    data: service.getState()
  }), [service, status]);

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};
