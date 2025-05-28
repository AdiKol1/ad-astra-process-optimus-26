import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UnifiedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const UnifiedInput = React.forwardRef<HTMLInputElement, UnifiedInputProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <label className="block text-lg md:text-xl font-semibold text-gray-900 mb-4">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 md:px-5 md:py-4",
              "text-base md:text-lg",
              "border-2 rounded-xl",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500",
              "placeholder:text-gray-400",
              className
            )}
            {...props}
          />
          
          {helperText && !error && (
            <p className="mt-2 text-sm text-gray-500">{helperText}</p>
          )}
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }
);

UnifiedInput.displayName = 'UnifiedInput'; 