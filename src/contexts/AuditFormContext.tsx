import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface AuditFormContextType {
  isOpen: boolean;
  openAuditForm: () => void;
  closeAuditForm: () => void;
  formData: Record<string, any>;
  updateFormData: (data: Record<string, any>) => void;
}

// Create context with default values
const AuditFormContext = createContext<AuditFormContextType>({
  isOpen: false,
  openAuditForm: () => {},
  closeAuditForm: () => {},
  formData: {},
  updateFormData: () => {},
});

export const useAuditForm = () => useContext(AuditFormContext);

interface AuditFormProviderProps {
  children: React.ReactNode;
}

export const AuditFormProvider: React.FC<AuditFormProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const openAuditForm = () => setIsOpen(true);
  const closeAuditForm = () => setIsOpen(false);
  
  const updateFormData = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <AuditFormContext.Provider
      value={{
        isOpen,
        openAuditForm,
        closeAuditForm,
        formData,
        updateFormData,
      }}
    >
      {children}
    </AuditFormContext.Provider>
  );
};

export default AuditFormContext; 