import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransitionWrapperProps {
  children: React.ReactNode;
  show?: boolean;
  type?: 'fade' | 'slide' | 'scale' | 'slideUp';
  className?: string;
  duration?: number;
  delay?: number;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  }
};

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  show = true,
  type = 'fade',
  className,
  duration = 0.2,
  delay = 0
}) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants[type]}
          transition={{ duration, delay }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  show?: boolean;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  show = true,
  staggerDelay = 0.1,
  className
}) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div className={cn('space-y-4', className)}>
          {children.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.2,
                delay: i * staggerDelay
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionWrapper;
