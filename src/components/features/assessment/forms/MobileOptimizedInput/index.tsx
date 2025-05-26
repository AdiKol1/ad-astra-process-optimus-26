import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export const MobileOptimizedInput: React.FC<MobileOptimizedInputProps> = ({
  label,
  error,
  required,
  icon,
  description,
  className,
  ...props
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
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            // Mobile-optimized sizing
            "h-12 text-base", // Larger height and font size for mobile
            "px-4 py-3", // Better padding
            "border-2 border-gray-200", // Thicker border for easier targeting
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200", // Better focus states
            "rounded-lg", // Rounded corners for modern feel
            "transition-all duration-200", // Smooth transitions
            "bg-white", // Ensure white background
            icon && "pl-10", // Space for icon
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-500 mr-2 flex-shrink-0">⚠</span>
          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedInput; 