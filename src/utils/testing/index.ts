// Core test utilities
export * from './performance';
export * from './assessment';
export * from './mocks';
export * from './scenarios';

// Re-export commonly used testing libraries
export { render, screen, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi } from 'vitest'; 