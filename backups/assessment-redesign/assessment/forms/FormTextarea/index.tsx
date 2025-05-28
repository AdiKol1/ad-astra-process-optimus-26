import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '../FormField';
import { cn } from '@/lib/utils';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
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
      <Textarea
        id={id}
        className={cn(
          'min-h-[100px] resize-y',
          className
        )}
        {...register(name)}
        {...props}
      />
    </FormField>
  );
}; 