import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export const MobileQuestionCard: React.FC<MobileQuestionCardProps> = ({
  question,
  description,
  options,
  value,
  onChange,
  multiSelect = false,
  required = false,
  error,
  className
}) => {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  
  const handleOptionSelect = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <Card className={cn(
      "border-2 transition-all duration-200",
      error ? "border-red-300 bg-red-50/30" : "border-gray-200",
      "hover:border-blue-300 focus-within:border-blue-500",
      className
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Question Header */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {question}
              {required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Mobile-optimized options */}
          <div className="space-y-3">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full h-auto p-4 text-left justify-start",
                    "border-2 transition-all duration-200",
                    "min-h-[44px]", // Ensure minimum touch target
                    isSelected 
                      ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-md" 
                      : "bg-white border-gray-200 text-gray-900 hover:border-blue-300 hover:bg-blue-50"
                  )}
                  onClick={() => handleOptionSelect(option.value)}
                  type="button" // Prevent form submission
                >
                  <div className="flex items-start w-full">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-base leading-tight">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className={cn(
                          "text-sm mt-1 leading-relaxed",
                          isSelected ? "text-blue-100" : "text-gray-500"
                        )}>
                          {option.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 ml-3 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Multi-select helper text */}
          {multiSelect && selectedValues.length > 0 && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
              {selectedValues.length > 1 && ' (you can select multiple)'}
            </div>
          )}

          {error && (
            <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-500 mr-2 flex-shrink-0">⚠</span>
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileQuestionCard; 