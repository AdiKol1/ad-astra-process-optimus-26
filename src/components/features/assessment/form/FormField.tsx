import React from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, required, error, children }) => {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;