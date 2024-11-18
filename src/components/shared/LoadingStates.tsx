import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<{ size: LoadingProps['size'] }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size || 'md']}`}>
      <svg className="text-gray-300" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

const LoadingSkeleton: React.FC<{ size: LoadingProps['size'] }> = ({ size }) => {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <div className={`animate-pulse bg-gray-200 rounded ${sizeClasses[size || 'md']} w-full`} />
  );
};

const LoadingDots: React.FC<{ size: LoadingProps['size'] }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={`${sizeClasses[size || 'md']} bg-gray-600 rounded-full animate-bounce`}
          style={{ animationDelay: `${dot * 0.15}s` }}
        />
      ))}
    </div>
  );
};

const LoadingStates: React.FC<LoadingProps> = ({ variant = 'spinner', size = 'md', text }) => {
  const LoadingComponent = {
    spinner: LoadingSpinner,
    skeleton: LoadingSkeleton,
    dots: LoadingDots,
  }[variant];

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <LoadingComponent size={size} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingStates;