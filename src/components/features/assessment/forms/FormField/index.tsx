import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { ValidationFeedback } from '@/components/shared/ValidationFeedback';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  required,
  description,
  className,
  children
}) => {
  const { formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <Label 
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            error ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      
      {children}
      
      {error && (
        <ValidationFeedback
          type="error"
          message={error}
          className="mt-1"
        />
      )}
    </div>
  );
}; 