import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface UnifiedQuestionCardProps {
  question: string;
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export const UnifiedQuestionCard: React.FC<UnifiedQuestionCardProps> = ({
  question,
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = false,
  required = false,
  error,
  className
}) => {
  const handleOptionClick = (value: string) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
          {question}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>

        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-200",
                  "flex items-center justify-between",
                  "text-left focus:outline-none focus:ring-2 focus:ring-offset-2",
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900 focus:ring-blue-500"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
                )}
              >
                <span className="text-base md:text-lg font-medium">
                  {option.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5 text-blue-600" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        {multiSelect && (
          <p className="mt-3 text-sm text-gray-500">
            Select all that apply
          </p>
        )}
      </div>
    </motion.div>
  );
}; 