import { vi } from 'vitest';
import { act } from '@testing-library/react';

export interface AccessibilityTestOptions {
  keyboardOnly?: boolean;
  screenReader?: boolean;
  highContrast?: boolean;
}

export const simulateKeyboardNavigation = async (element: HTMLElement) => {
  await act(async () => {
    element.focus();
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

export const simulateScreenReader = () => {
  const announcements: string[] = [];
  
  return {
    announce: (text: string) => {
      announcements.push(text);
    },
    getAnnouncements: () => announcements,
    clear: () => {
      announcements.length = 0;
    },
    mock: vi.fn().mockImplementation((text: string) => {
      announcements.push(text);
    }),
  };
};

export const createA11yTestHelper = (options: AccessibilityTestOptions = {}) => {
  const screenReader = simulateScreenReader();
  
  return {
    async focusElement(element: HTMLElement) {
      await simulateKeyboardNavigation(element);
    },
    
    async tabToElement(element: HTMLElement) {
      await act(async () => {
        const tabEvent = new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(tabEvent);
        await new Promise(resolve => setTimeout(resolve, 0));
      });
    },
    
    getScreenReaderAnnouncements() {
      return screenReader.getAnnouncements();
    },
    
    clearAnnouncements() {
      screenReader.clear();
    },
    
    // Add ARIA attribute checks
    async validateAriaAttributes(element: HTMLElement) {
      const requiredAttributes = ['role', 'aria-label', 'aria-describedby'];
      const missingAttributes = requiredAttributes.filter(attr => !element.hasAttribute(attr));
      return {
        valid: missingAttributes.length === 0,
        missingAttributes,
      };
    },
    
    // Check color contrast
    validateColorContrast(foreground: string, background: string) {
      // Simplified contrast check - in real implementation, use a proper color contrast library
      return {
        valid: true, // Placeholder
        ratio: 4.5, // Placeholder
      };
    },
  };
};

export const mockA11yAnnouncement = vi.fn();

// Helper to validate common ARIA landmarks
export const validateAriaLandmarks = (container: HTMLElement) => {
  const landmarks = {
    main: container.querySelector('main'),
    navigation: container.querySelector('nav'),
    banner: container.querySelector('header[role="banner"]'),
    contentinfo: container.querySelector('footer[role="contentinfo"]'),
  };

  return {
    hasAllLandmarks: Object.values(landmarks).every(Boolean),
    landmarks,
  };
};
