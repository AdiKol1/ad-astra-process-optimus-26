import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '../FormField';
import { cn } from '@/lib/utils';

export interface FormCheckboxProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  description,
  required,
  className,
  id = name,
}) => {
  const { register } = useFormContext();
  
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      required={required}
      description={description}
      className={cn('flex items-start space-x-3 space-y-0', className)}
    >
      <div className="flex h-6 items-center">
        <Checkbox
          id={id}
          {...register(name)}
        />
      </div>
      <div className="space-y-1 leading-none">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </FormField>
  );
}; 