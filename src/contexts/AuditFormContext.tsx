import React, { createContext, useContext, useState } from 'react';

/**
 * Temporary shim for the removed AuditFormContext.
 * Restores compile-time and runtime compatibility until the full form feature is rebuilt.
 */
export interface AuditFormData {
  [key: string]: unknown;
}

interface AuditFormContextValue {
  data: AuditFormData;
  update: (partial: Partial<AuditFormData>) => void;
  reset: () => void;
  isOpen: boolean;
  openAuditForm: () => void;
  closeAuditForm: () => void;
}

const AuditFormContext = createContext<AuditFormContextValue | undefined>(undefined);

export const AuditFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AuditFormData>({});
  const [isOpen, setIsOpen] = useState(false);

  const update = (partial: Partial<AuditFormData>) => setData((prev) => ({ ...prev, ...partial }));
  const reset = () => setData({});

  const openAuditForm = () => setIsOpen(true);
  const closeAuditForm = () => setIsOpen(false);

  return (
    <AuditFormContext.Provider value={{ data, update, reset, isOpen, openAuditForm, closeAuditForm }}>
      {children}
    </AuditFormContext.Provider>
  );
};

export const useAuditForm = () => {
  const ctx = useContext(AuditFormContext);
  if (!ctx) throw new Error('useAuditForm must be used within AuditFormProvider');
  return ctx;
}; 