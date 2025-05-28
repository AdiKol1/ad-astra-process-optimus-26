import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MobileQuestionCardProps {
  question: string;
  description?: string;
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export const MobileQuestionCard: React.FC<MobileQuestionCardProps> = ({
  question,
  description,
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = false,
  required = false,
  error,
  className
}) => {
  const handleOptionSelect = (value: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newValues);
    } else {
      onSelectionChange([value]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Question Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
          {question}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {description && (
          <p className="text-gray-600 text-base leading-relaxed">
            {description}
          </p>
        )}
        {multiSelect && (
          <p className="text-blue-600 text-sm mt-2 font-medium">
            Select all that apply
          </p>
        )}
      </div>

      {/* Professional touch-optimized options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          
          return (
            <button
              key={option.value}
              className={cn(
                // Base styles - Large touch targets
                "w-full min-h-[60px] p-4 rounded-xl border-2 transition-all duration-200",
                "flex items-center text-left touch-manipulation",
                "focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50",
                
                // Professional color scheme
                isSelected 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                  : "bg-white border-gray-200 text-gray-900 hover:border-blue-300 hover:bg-blue-50",
                
                // Active state for touch feedback
                "active:scale-[0.98] active:shadow-sm"
              )}
              onClick={() => handleOptionSelect(option.value)}
              type="button"
            >
              <div className="flex-1 pr-4">
                <div className="font-medium text-base leading-tight">
                  {option.label}
                </div>
                {option.description && (
                  <div className={cn(
                    "text-sm mt-1 leading-relaxed",
                    isSelected ? "text-blue-100" : "text-gray-600"
                  )}>
                    {option.description}
                  </div>
                )}
              </div>
              
              {/* Professional selection indicator */}
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                isSelected 
                  ? "border-white bg-white" 
                  : "border-gray-300"
              )}>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600" strokeWidth={3} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection summary for multi-select */}
      {multiSelect && selectedValues.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800 font-medium">
            {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Professional error display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-sm text-red-700 leading-relaxed ml-3">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileQuestionCard; 