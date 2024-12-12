import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationFeedbackProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  className?: string;
}

const iconMap = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: AlertCircle
};

const colorMap = {
  error: 'text-destructive',
  success: 'text-green-500',
  warning: 'text-yellow-500'
};

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  message,
  type,
  className
}) => {
  const Icon = iconMap[type];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-center gap-2 text-sm',
          colorMap[type],
          className
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

interface ValidationWrapperProps {
  children: React.ReactNode;
  error?: string;
  success?: string;
  warning?: string;
  className?: string;
}

export const ValidationWrapper: React.FC<ValidationWrapperProps> = ({
  children,
  error,
  success,
  warning,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <ValidationFeedback
            key="error"
            type="error"
            message={error}
          />
        )}
        {warning && !error && (
          <ValidationFeedback
            key="warning"
            type="warning"
            message={warning}
          />
        )}
        {success && !error && !warning && (
          <ValidationFeedback
            key="success"
            type="success"
            message={success}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
