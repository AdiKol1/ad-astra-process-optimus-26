import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const spinnerSize = {
    small: 24,
    medium: 40,
    large: 56
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      <CircularProgress
        size={spinnerSize[size]}
        aria-label="Loading"
      />
    </Box>
  );
};

export default LoadingSpinner;
