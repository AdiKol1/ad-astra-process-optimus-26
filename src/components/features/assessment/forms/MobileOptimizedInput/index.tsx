import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export const MobileOptimizedInput: React.FC<MobileOptimizedInputProps> = ({
  label,
  error,
  required,
  icon,
  description,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label className="mobile-subtitle block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="mobile-body">
          {description}
        </p>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            "mobile-input",
            icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <div className="mobile-error">
          <span className="text-red-500 mr-2 flex-shrink-0">⚠</span>
          <p className="mobile-error-text">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedInput; 