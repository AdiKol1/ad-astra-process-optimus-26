import { useState, useEffect } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  isTouchDevice: boolean;
  isClient: boolean;
}

export const useMobileDetection = (): MobileDetectionResult => {
  const [detection, setDetection] = useState<MobileDetectionResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    isTouchDevice: false,
    isClient: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Mobile: < 768px
      // Tablet: 768px - 1023px  
      // Desktop: >= 1024px
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        isTouchDevice,
        isClient: true,
      });
    };

    const timer = setTimeout(checkDevice, 100);

    window.addEventListener('resize', checkDevice);
    
    window.addEventListener('orientationchange', () => {
      setTimeout(checkDevice, 200);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return detection;
};

export default useMobileDetection; 