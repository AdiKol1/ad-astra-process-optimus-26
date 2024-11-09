import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

interface SelectInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label
}) => {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
        </label>
      )}
      
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger 
          className="w-full flex items-center justify-between rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 shadow-sm hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={placeholder}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content 
            className="z-50 overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-lg animate-in fade-in-80 slide-in-from-top-1"
            position="popper"
            sideOffset={5}
            style={{
              width: 'var(--radix-select-trigger-width)',
              maxHeight: 'var(--radix-select-content-available-height)',
            }}
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option}
                  value={option}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm text-gray-200 outline-none hover:bg-blue-600 focus:bg-blue-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>{option}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default SelectInput;