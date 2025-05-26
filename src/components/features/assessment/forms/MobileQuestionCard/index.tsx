import React from 'react';
import { cn } from '@/lib/utils';

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
        <h3 className="mobile-title mb-2">
          {question}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {description && (
          <p className="mobile-body">
            {description}
          </p>
        )}
        {multiSelect && (
          <p className="text-sm text-blue-600 mt-2">
            Select all that apply
          </p>
        )}
      </div>

      {/* Mobile-optimized options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          
          return (
            <button
              key={option.value}
              className={cn(
                "mobile-question-option",
                isSelected && "selected"
              )}
              onClick={() => handleOptionSelect(option.value)}
              type="button"
            >
              <div className="flex-1">
                <div className="font-medium">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm opacity-75 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
              
              {/* Selection indicator */}
              <div className={cn(
                "w-5 h-5 rounded-full border-2 ml-3 flex-shrink-0 flex items-center justify-center",
                isSelected 
                  ? "border-white bg-white" 
                  : "border-gray-300"
              )}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection summary for multi-select */}
      {multiSelect && selectedValues.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-500 mr-2 flex-shrink-0">⚠</span>
          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MobileQuestionCard; 