import React, { createContext, useContext, useState } from 'react';

interface AuditFormContextType {
  isOpen: boolean;
  openAuditForm: () => void;
  closeAuditForm: () => void;
}

const AuditFormContext = createContext<AuditFormContextType | undefined>(undefined);

export function AuditFormProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAuditForm = () => setIsOpen(true);
  const closeAuditForm = () => setIsOpen(false);

  return (
    <AuditFormContext.Provider value={{ isOpen, openAuditForm, closeAuditForm }}>
      {children}
    </AuditFormContext.Provider>
  );
}

export function useAuditForm() {
  const context = useContext(AuditFormContext);
  if (context === undefined) {
    throw new Error('useAuditForm must be used within an AuditFormProvider');
  }
  return context;
}