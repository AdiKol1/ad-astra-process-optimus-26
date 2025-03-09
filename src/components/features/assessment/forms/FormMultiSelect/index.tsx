import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormField } from '../FormField';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

export interface FormMultiSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  description?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

export const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  options,
  description,
  required,
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
        render={({ field }) => {
          // Ensure field.value is always an array
          const values = Array.isArray(field.value) ? field.value : [];
          
          const handleCheckedChange = (checked: boolean, value: string) => {
            if (checked) {
              field.onChange([...values, value]);
            } else {
              field.onChange(values.filter((v) => v !== value));
            }
          };
          
          return (
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${id}-${option.value}`}
                    checked={values.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleCheckedChange(checked as boolean, option.value)
                    }
                    className={cn("h-4 w-4")}
                  />
                  <Label
                    htmlFor={`${id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          );
        }}
      />
    </FormField>
  );
}; 