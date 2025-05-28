import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '../FormField';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  description?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  description,
  required,
  placeholder = 'Select an option',
  className,
  id = name,
}) => {
  const { control } = useFormContext();
  
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      required={required}
      description={description}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger
              id={id}
              className={cn('w-full')}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}; 