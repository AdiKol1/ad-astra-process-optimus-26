import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssessmentStore } from '@/contexts/assessment/store';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when route changes or assessment step changes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { currentStep } = useAssessmentStore();

  // Scroll to top when either the URL path or assessment step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, currentStep]);

  return null;
};

export default ScrollToTop; 