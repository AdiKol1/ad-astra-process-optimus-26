import { useCallback } from 'react';

export function useAccessibility() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const element = document.createElement('div');
    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-atomic', 'true');
    element.classList.add('sr-only'); // Screen reader only
    document.body.appendChild(element);
    
    // Delay the message slightly to ensure screen readers catch it
    setTimeout(() => {
      element.textContent = message;
      // Remove the element after announcement
      setTimeout(() => {
        document.body.removeChild(element);
      }, 1000);
    }, 100);
  }, []);

  const announceStatus = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  const announceError = useCallback((message: string) => {
    announce(message, 'assertive');
  }, [announce]);

  const announceNavigation = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  return {
    announce,
    announceStatus,
    announceError,
    announceNavigation
  };
}
