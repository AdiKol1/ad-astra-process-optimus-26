import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';
import { cn } from '@/lib/utils';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  description,
  required,
  className,
  id = name,
  ...props
}) => {
  const { register } = useFormContext();
  
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      required={required}
      description={description}
    >
      <Input
        id={id}
        className={cn(
          'w-full',
          className
        )}
        {...register(name)}
        {...props}
      />
    </FormField>
  );
}; 