import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MobileSelectProps {
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
}

export const MobileSelect: React.FC<MobileSelectProps> = ({
  label,
  placeholder = "Select an option...",
  options,
  value,
  onChange,
  required = false,
  error,
  description,
  className
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium text-gray-900 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={cn(
            // Mobile-optimized sizing
            "h-12 text-base", // Larger height and font size
            "px-4 py-3", // Better padding
            "border-2 border-gray-200", // Thicker border
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200", // Better focus states
            "rounded-lg", // Rounded corners
            "transition-all duration-200", // Smooth transitions
            "bg-white", // Ensure white background
            "min-h-[44px]", // Minimum touch target
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
        >
          <div className="flex items-center justify-between w-full">
            <SelectValue 
              placeholder={placeholder}
              className="text-gray-900"
            />
            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>
        </SelectTrigger>
        
        <SelectContent 
          className={cn(
            "max-h-[60vh]", // Limit height on mobile
            "border-2 border-gray-200",
            "rounded-lg shadow-lg",
            "bg-white"
          )}
        >
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className={cn(
                "px-4 py-3", // Better padding for touch
                "text-base", // Larger text
                "min-h-[44px]", // Minimum touch target
                "cursor-pointer",
                "hover:bg-blue-50 focus:bg-blue-50",
                "transition-colors duration-150"
              )}
            >
              <div className="w-full">
                <div className="font-medium text-gray-900">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {option.description}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-500 mr-2 flex-shrink-0">⚠</span>
          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MobileSelect; 